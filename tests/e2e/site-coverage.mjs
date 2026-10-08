// Headless (jsdom) site coverage meter. Usage: node tests/e2e/site-coverage.mjs <html> [--link-mode standalone|never] [--json]
// Loads the content scripts into a jsdom copy of the page (site scripts are not run), mocks the translator
// (every t slot becomes "\u{D55C}(" + text.trim() + ")") and counts translated vs. remaining source-language text nodes.
import { readFileSync } from 'node:fs';
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
  const timeoutMs = opts.timeoutMs ?? 30000;
  const html = readFileSync(resolve(file), 'utf8');
  const base = /<base[^>]+href=["']([^"']+)["']/i.exec(html);
  let url = 'https://example.com/';
  try { if (base) url = new URL(base[1]).href; } catch (_) { /* default */ }
  const dom = new JSDOM(html, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const win = dom.window;
  const errors = [];
  const out = { file, linkMode, calls: 0, blocks: 0, translatedNodes: 0, remaining: 0, byCategory: { inLink: 0, inBlockLink: 0, inCode: 0, inButton: 0, translateNo: 0, formControl: 0, graphic: 0, other: 0 }, langs: {}, samples: { other: [], inLink: [] }, errors };
  let lastReq = Date.now();

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
    if (text.startsWith(MARK)) { out.translatedNodes++; continue; }
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
  try { win.KT.main.stop(); } catch (_) { /* ignore */ }
  win.close();
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const file = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--link-mode');
  const li = args.indexOf('--link-mode');
  if (!file) { console.error('usage: site-coverage.mjs <html> [--link-mode standalone|never] [--json]'); process.exit(2); }
  const r = await measure(file, { linkMode: li >= 0 ? args[li + 1] : 'standalone' });
  if (args.includes('--json')) console.log(JSON.stringify(r, null, 2));
  else {
    console.log(`${r.file} linkMode=${r.linkMode} calls=${r.calls} blocks=${r.blocks} translated=${r.translatedNodes} remaining=${r.remaining}`);
    console.log(JSON.stringify(r.byCategory));
    for (const s of r.samples.other) console.log('  other: ' + s);
    for (const s of r.samples.inLink) console.log('  link: ' + s);
    for (const e of r.errors) console.log('  error: ' + e);
  }
  process.exit(0);
}
