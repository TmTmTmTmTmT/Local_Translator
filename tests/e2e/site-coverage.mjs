// Headless (jsdom) site coverage meter. Usage: node tests/e2e/site-coverage.mjs <html> [--link-mode standalone|never] [--json]
// Loads the content scripts into a jsdom copy of the page (site scripts are not run), mocks the translator
// (every t slot becomes "\u{D55C}(" + text.trim() + ")") and counts translated vs. remaining source-language text nodes.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'extension');
export const SCRIPTS = ['lib/josa.js', 'content/text.js', 'content/filter.js', 'content/segmenter.js', 'content/apply.js', 'content/main.js'];
export const MARK = '\u{D55C}(';

const BLOCK_TAGS = new Set(['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'SECTION', 'ARTICLE', 'FIGURE', 'HEADER', 'FOOTER', 'NAV', 'ASIDE', 'MAIN', 'TABLE', 'BLOCKQUOTE', 'FORM']);
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'HEAD', 'TITLE', 'META', 'LINK']);
const CODE_SEL = 'code,pre,kbd,samp,var,textarea';
const BUTTON_SEL = 'button,[role="button"],summary';
const FORM_SEL = 'select,optgroup,option,datalist,textarea,input';
const GRAPHIC_SEL = 'svg,math';
const NO_SEL = '[translate="no"],.notranslate';

// ---- --engine ollama-tg: extension engines (registry local:mt-ollama) run in Node against a real loopback Ollama ----
const OLLAMA_SETTINGS = { engine: { default: 'local:mt-ollama' }, localhost: { baseUrl: 'http://127.0.0.1:11434', kind: 'ollama', model: 'translategemma:4b', family: 'translategemma', keepAlive: 300 } };
// F23: --parallel N (1..4) -> localhost.parallel. The harness mirrors background.js: batches run through a semaphore sized engine.concurrencyFor(settings).
function makeSem(max) {
  let active = 0; const q = [];
  return async (fn) => {
    while (active >= max) await new Promise((r) => q.push(r));
    active++;
    try { return await fn(); } finally { active--; const w = q.shift(); if (w) w(); }
  };
}
let EXT = null;
function loadExt() {
  if (EXT) return EXT;
  const req = createRequire(import.meta.url);
  for (const f of ['lib/hash.js', 'lib/glossary.js', 'engines/common.js', 'engines/prompt.js', 'engines/mtmode.js', 'engines/native.js', 'engines/localhost.js', 'engines/registry.js']) req(join(ROOT, f));
  EXT = globalThis.KT;
  return EXT;
}
export function parseGlossary(str) {
  return String(str || '').split(';').map((p) => p.trim()).filter(Boolean).map((p) => { const i = p.indexOf('=>'); return { src: p.slice(0, i).trim(), dst: p.slice(i + 2).trim() }; }).filter((e) => e.src && e.dst);
}
// background.js splitBatches와 동일
function splitBatches(blocks, limit) {
  const maxChars = (limit && limit.chars) || Infinity, maxBlocks = (limit && limit.blocks) || Infinity;
  const out = []; let cur = [], chars = 0;
  for (const b of blocks) {
    const c = b.items.filter((i) => i.k === 't').reduce((n, i) => n + String(i.text || '').length, 0);
    if (cur.length && (cur.length >= maxBlocks || chars + c > maxChars)) { out.push(cur); cur = []; chars = 0; }
    cur.push(b); chars += c;
  }
  if (cur.length) out.push(cur);
  return out;
}
export function ollamaPs() { try { return execSync('ollama ps', { encoding: 'utf8', timeout: 10000 }).trim(); } catch (e) { return 'ollama ps failed: ' + e.message; } }

const RE = {
  en: /[A-Za-z]{3,}/,
  ja: /[぀-ヿ一-鿿]{2,}/,
  zh: /[一-鿿]{2,}/,
};

function isHidden(el) {
  for (let e = el; e; e = e.parentElement) {
    if (SKIP_TAGS.has(e.tagName)) return true;
    if (e.hasAttribute('hidden') || e.getAttribute('aria-hidden') === 'true') return true;
    const st = (e.getAttribute('style') || '').replace(/\s+/g, '').toLowerCase();
    if (st.includes('display:none') || st.includes('visibility:hidden')) return true;
  }
  return false;
}

function hasBlockChild(a) {
  for (const d of a.querySelectorAll('*')) if (BLOCK_TAGS.has(d.tagName)) return true;
  return false;
}

export async function measure(file, opts = {}) {
  const linkMode = opts.linkMode || 'standalone';
  const quietMs = opts.quietMs ?? 500;
  const timeoutMs = opts.timeoutMs ?? (opts.engine === 'apple' || opts.engine === 'ollama-tg' ? 900000 : 30000);
  const html = readFileSync(resolve(file), 'utf8');
  const base = /<base[^>]+href=["']([^"']+)["']/i.exec(html);
  let url = 'https://example.com/';
  try { if (base) url = new URL(base[1]).href; } catch (_) { /* default */ }
  const dom = new JSDOM(html, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const win = dom.window;
  const errors = [];
  const out = { file, linkMode, calls: 0, blocks: 0, translatedNodes: 0, remaining: 0, byCategory: { inLink: 0, inBlockLink: 0, inCode: 0, inButton: 0, translateNo: 0, formControl: 0, graphic: 0, other: 0 }, langs: {}, samples: { other: [], inLink: [] }, errors };
  let lastReq = Date.now();
  const responded = new Set();
  const slotTexts = new Set();
  const linkSamples = [];
  const navTexts = new Set();
  const generalSamples = [];
  const sems = new Map();
  const semFor = (engine, st) => {
    const n = typeof engine.concurrencyFor === 'function' ? engine.concurrencyFor(st) : (engine.concurrency || 1);
    const k = engine.id + ':' + n;
    if (!sems.has(k)) sems.set(k, makeSem(n));
    return sems.get(k);
  };
  if (opts.engine === 'ollama-tg') {
    loadExt();
    const base = OLLAMA_SETTINGS.localhost.baseUrl;
    const h = new URL(base).hostname;
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(h)) throw new Error('non-loopback base URL refused: ' + base);
    out.ollamaPsBefore = ollamaPs();
    out.parallel = opts.parallel != null ? opts.parallel : 'default';
  }
  if (opts.traceOrder) {
    out.requests = [];
    for (const el of dom.window.document.querySelectorAll('header, nav')) {
      const tw = dom.window.document.createTreeWalker(el, 0x4);
      for (let n; (n = tw.nextNode());) if (n.nodeValue.trim()) navTexts.add(n.nodeValue.trim());
    }
  }

  win.__KT_AUTOSTART = true;
  win.requestAnimationFrame = (f) => win.setTimeout(() => f(0), 0);
  win.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; this.t = new Set(); }
    observe(el) { this.t.add(el); win.queueMicrotask(() => { if (this.t.has(el)) this.cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }], this); }); }
    unobserve(el) { this.t.delete(el); }
    disconnect() { this.t.clear(); }
  };
  win.addEventListener('error', (e) => errors.push(String(e.message || e)));
  const settings = { enabled: true, linkMode };
  win.browser = {
    storage: { sync: { get: async () => ({ settings }) } },
    runtime: {
      sendMessage: async (msg) => {
        if (!msg || msg.type !== 'translate') return {};
        lastReq = Date.now();
        out.calls++;
        if (opts.traceOrder) {
          const txt = (b) => b.items.filter((i) => i.k === 't').map((i) => i.text.trim()).join(' ');
          out.requests.push({ n: msg.blocks.length, priority: msg.priority, navBlocks: msg.blocks.filter((b) => navTexts.has(b.items.find((i) => i.k === 't').text.trim())).length, first: msg.blocks.slice(0, 6).map((b) => txt(b).slice(0, 40)) });
        }
        if (opts.engine === 'apple') {
          const room = opts.maxBlocks == null ? Infinity : opts.maxBlocks - out.blocks;
          if (room <= 0) return { ok: true, engine: 'apple', results: [] };
          const sent = msg.blocks.slice(0, room);
          out.blocks += sent.length;
          for (const b of sent) { const l = b.lang || 'unknown'; out.langs[l] = (out.langs[l] || 0) + 1; }
          let resp;
          try {
            const r = await fetch('http://127.0.0.1:8797/translate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ blocks: sent, lang: msg.lang, context: msg.context }) });
            resp = await r.json();
          } catch (e) { errors.push('bridge: ' + e.message); return { ok: false, error: 'bridge' }; }
          if (!resp.ok) { errors.push('bridge: ' + resp.error); return { ok: false, error: resp.error }; }
          const results = resp.results.filter((x) => x.slots);
          for (const x of resp.results) if (!x.slots) errors.push('block ' + x.id + ': ' + x.error);
          for (const x of results) {
            const b = sent.find((y) => y.id === x.id);
            responded.add(x.id);
            for (const v of Object.values(x.slots)) slotTexts.add(String(v).trim());
            if (b && b.items.some((i) => i.k === 'x') && linkSamples.length < 10) {
              linkSamples.push({ id: x.id, source: b.items.map((i) => (i.k === 'x' ? '[' + i.text + ']' : i.text)).join(''),
                result: b.items.filter((i) => i.k === 't').map((i) => x.slots[String(i.i)] ?? '').join(' | ') });
            }
          }
          return { ok: true, engine: 'apple', results };
        }
        if (opts.engine === 'ollama-tg') {
          const KT = globalThis.KT;
          const room = opts.maxBlocks == null ? Infinity : opts.maxBlocks - out.blocks;
          if (room <= 0) return { ok: true, engine: 'local:mt-ollama', results: [] };
          const sent = msg.blocks.slice(0, room);
          out.blocks += sent.length;
          for (const b of sent) { const l = b.lang || 'unknown'; out.langs[l] = (out.langs[l] || 0) + 1; }
          const run = async () => {
            const loc = Object.assign({}, OLLAMA_SETTINGS.localhost, opts.parallel != null ? { parallel: opts.parallel } : {});
            const s = Object.assign({}, OLLAMA_SETTINGS, { localhost: loc, glossary: opts.glossary || [] });
            const terms = s.glossary.length ? KT.lib.glossary.normalize(s.glossary) : [];
            const groups = new Map();
            for (const b of sent) { const l = String(b.lang || msg.lang || 'en').split('-')[0]; if (!groups.has(l)) groups.set(l, []); groups.get(l).push(b); }
            const results = [];
            for (const [lang, group] of groups) {
              let engine;
              try { engine = KT.engines.pickEngine(s, lang); } catch (e) { errors.push('pick: ' + (e.code || '') + ' ' + e.message); continue; }
              const sub = new Map();
              for (const b of group) {
                if (!terms.length) break;
                const r = KT.lib.glossary.applyToItems(b.items, lang, terms);
                if (r.applied.length) sub.set(b.id, { block: Object.assign({}, b, { items: r.items }), applied: r.applied });
              }
              const sem = semFor(engine, s);
              await Promise.all(splitBatches(group, engine.batchLimit).map((batch) => sem(async () => {
                const pairs = new Map();
                const tosend = batch.map((b) => { const m = sub.get(b.id); if (!m) return b; for (const p of m.applied) pairs.set(p[0] + '\u0000' + p[1], p); return m.block; });
                const ctx = pairs.size ? Object.assign({}, msg.context, { glossary: Array.from(pairs.values()) }) : (msg.context || {});
                try {
                  const map = await engine.translate(tosend, ctx, lang, s);
                  for (const b of batch) {
                    const slots = map && map.get(b.id);
                    if (!slots || !Object.keys(slots).length) continue;
                    results.push({ id: b.id, slots });
                    responded.add(b.id);
                    for (const v of Object.values(slots)) slotTexts.add(String(v).trim());
                    const src = b.items.map((i) => (i.k === 'x' ? '[' + i.text + ']' : i.text)).join('');
                    const res = b.items.filter((i) => i.k === 't').map((i) => slots[String(i.i)] ?? '').join(' | ');
                    if (b.items.some((i) => i.k === 'x')) { if (linkSamples.length < 10) linkSamples.push({ id: b.id, source: src, result: res }); }
                    else generalSamples.push({ id: b.id, source: src, result: res });
                  }
                } catch (e) { errors.push('engine: ' + (e.code || '') + ' ' + e.message); }
              })));
            }
            return results;
          };
          return { ok: true, engine: 'local:mt-ollama', results: await run() };
        }
        out.blocks += msg.blocks.length;
        for (const b of msg.blocks) { const l = b.lang || 'unknown'; out.langs[l] = (out.langs[l] || 0) + 1; }
        return {
          ok: true, engine: 'mock',
          results: msg.blocks.map((b) => ({
            id: b.id,
            slots: Object.fromEntries(b.items.filter((x) => x.k === 't').map((x) => [String(x.i), MARK + x.text.trim() + ')'])),
          })),
        };
      },
    },
  };
  for (const f of SCRIPTS) {
    try { win.eval(readFileSync(join(ROOT, f), 'utf8')); } catch (e) { errors.push(f + ': ' + e.message); }
  }

  const t0 = Date.now();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (;;) {
    await sleep(50);
    const st = win.KT && win.KT.main && win.KT.main.state;
    const busy = st && (st.flushTimer || st.mutTimer || st.tickPending || st.inflight || st.applyQueue.length || st.rafPending);
    if (Date.now() - t0 > timeoutMs) { errors.push('timeout waiting for quiet'); break; }
    if (st && !busy && Date.now() - lastReq >= quietMs && Date.now() - t0 >= quietMs) break;
    if (!st && Date.now() - t0 > 2000) { errors.push('translator did not start'); break; }
  }

  const doc = win.document;
  const lang = (doc.documentElement.getAttribute('lang') || 'en').toLowerCase().slice(0, 2);
  const re = RE[lang] || RE.en;
  const w = doc.createTreeWalker(doc.documentElement, 0x4);
  let n;
  while ((n = w.nextNode())) {
    const el = n.parentElement;
    if (!el) continue;
    const text = n.nodeValue.trim();
    if (!text) continue;
    if (text.startsWith(MARK) || ((opts.engine === 'apple' || opts.engine === 'ollama-tg') && slotTexts.has(text))) { out.translatedNodes++; continue; }
    if (isHidden(el) || !re.test(text)) continue;
    const a = el.closest('a');
    let cat = 'other';
    if (el.closest(NO_SEL)) cat = 'translateNo';
    else if (el.closest(FORM_SEL)) cat = 'formControl';
    else if (el.closest(GRAPHIC_SEL)) cat = 'graphic';
    else if (el.closest(CODE_SEL)) cat = 'inCode';
    else if (el.closest(BUTTON_SEL)) cat = 'inButton';
    else if (a && hasBlockChild(a)) cat = 'inBlockLink';
    else if (a) cat = 'inLink';
    out.byCategory[cat]++;
    if (cat === 'formControl' || cat === 'graphic') continue;
    out.remaining++;
    if (cat === 'other' && out.samples.other.length < 20) out.samples.other.push(text.slice(0, 120));
    if ((cat === 'inLink' || cat === 'inBlockLink') && out.samples.inLink.length < 10) out.samples.inLink.push(text.slice(0, 120));
  }
  if (opts.engine === 'apple') { out.engine = 'apple'; out.respondedBlocks = responded.size; out.linkSamples = linkSamples; }
  if (opts.engine === 'ollama-tg') {
    out.engine = 'ollama-tg'; out.respondedBlocks = responded.size; out.linkSamples = linkSamples;
    const pool = generalSamples.slice(); out.generalSamples = [];
    while (pool.length && out.generalSamples.length < 5) out.generalSamples.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    out.msPerBlock = responded.size ? Math.round((Date.now() - t0) / responded.size) : null;
    out.ollamaPsAfter = ollamaPs();
  }
  try { win.KT.main.stop(); } catch (_) { /* ignore */ }
  win.close();
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const file = args.find((a, i) => !a.startsWith('--') && !['--link-mode', '--engine', '--max-blocks', '--glossary', '--parallel'].includes(args[i - 1]));
  const li = args.indexOf('--link-mode');
  if (!file) { console.error('usage: site-coverage.mjs <html> [--link-mode standalone|never] [--engine apple|ollama-tg] [--glossary "src=>dst;..."] [--max-blocks N] [--parallel 1..4] [--trace-order] [--json]'); process.exit(2); }
  const ei = args.indexOf('--engine'), mi = args.indexOf('--max-blocks');
  const gi = args.indexOf('--glossary');
  const t0 = Date.now();
  const r = await measure(file, { linkMode: li >= 0 ? args[li + 1] : 'standalone', engine: ei >= 0 ? args[ei + 1] : 'mock', glossary: gi >= 0 ? parseGlossary(args[gi + 1]) : [], parallel: args.includes('--parallel') ? Number(args[args.indexOf('--parallel') + 1]) : null, maxBlocks: mi >= 0 ? Number(args[mi + 1]) : null, traceOrder: args.includes('--trace-order') });
  r.wallSec = Math.round((Date.now() - t0) / 100) / 10;
  if (args.includes('--json')) console.log(JSON.stringify(r, null, 2));
  else {
    console.log(`${r.file} linkMode=${r.linkMode} calls=${r.calls} blocks=${r.blocks} translated=${r.translatedNodes} remaining=${r.remaining}`);
    console.log(JSON.stringify(r.byCategory));
    for (const s of r.samples.other) console.log('  other: ' + s);
    for (const s of r.samples.inLink) console.log('  link: ' + s);
    for (const l of r.linkSamples || []) console.log('  linkSample: ' + l.source + ' => ' + l.result);
    for (const l of r.generalSamples || []) console.log('  sample: ' + l.source + ' => ' + l.result);
    for (const e of r.errors) console.log('  error: ' + e);
  }
  process.exit(0);
}
