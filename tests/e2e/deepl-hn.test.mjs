// F25 / B18 offline harness: real content scripts (jsdom) + real createBackground + real deepl.js against a fake DeepL.
// Page: tests/e2e/sites/hn2.html (Hacker News page 2, gitignored; the tests are skipped when the file is absent).
// Modes: ok | burst (requests 2..8 get HTTP 429) | 429all | 456
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { loadBackground, makeFakeBrowser } from '../helpers/fake-browser.mjs';
import { loadEngines } from '../engines-load.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, '..', '..', 'extension');
const PAGE = path.join(here, 'sites', 'hn2.html');
const SCRIPTS = ['lib/josa.js', 'content/text.js', 'content/filter.js', 'content/segmenter.js', 'content/apply.js', 'content/main.js'];
const MARK = '\u{D55C}(';
const have = fs.existsSync(PAGE);

async function run(mode) {
  const KT = loadBackground();
  const E = loadEngines();
  const stat = { requests: 0, status: {}, texts: 0, maxTexts: 0 };
  const fetch = async (url, init) => {
    const p = JSON.parse(init.body);
    const n = ++stat.requests;
    let status = 200;
    if (mode === '429all') status = 429;
    if (mode === '456') status = 456;
    if (mode === 'burst' && n > 1 && n <= 8) status = 429;
    stat.status[status] = (stat.status[status] || 0) + 1;
    if (status === 200) { stat.texts += p.text.length; stat.maxTexts = Math.max(stat.maxTexts, p.text.length); }
    await new Promise((r) => setTimeout(r, 10));
    const body = status === 200
      ? JSON.stringify({ translations: p.text.map((s) => ({ detected_source_language: 'EN', text: s.split(/(<x[^>]*>[\s\S]*?<\/x>)/).map((pc) => (pc.startsWith('<x') || !pc.trim() ? pc : MARK + pc.trim() + ')')).join('') })) })
      : '{"message":"err"}';
    return { ok: status < 300, status, headers: { get: () => null }, text: async () => body };
  };
  const eng = E.createDeeplEngine({ fetch, getKey: async () => 'abcd1234-ef56-7890:fx', sleep: async () => {}, minIntervalMs: 0 });
  const warns = [];
  const origWarn = console.warn;
  console.warn = (...a) => warns.push(a.join(' '));
  const browser = makeFakeBrowser({ sync: { settings: { engine: { default: 'cloud:deepl' } } } });
  const bg = KT.background.createBackground({ browser, KT, engines: { pickEngine: () => eng } });
  const dom = new JSDOM(fs.readFileSync(PAGE, 'utf8'), { url: 'https://news.ycombinator.com/news?p=2', runScripts: 'outside-only', pretendToBeVisual: true });
  const win = dom.window;
  win.__KT_AUTOSTART = false;
  win.requestAnimationFrame = (f) => win.setTimeout(() => f(0), 0);
  win.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; this.t = new Set(); }
    observe(el) { this.t.add(el); win.queueMicrotask(() => { if (this.t.has(el)) this.cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }], this); }); }
    unobserve(el) { this.t.delete(el); }
    disconnect() { this.t.clear(); }
  };
  let sent = 0;
  const send = async (msg) => {
    if (msg.type !== 'translate') return {};
    sent += msg.blocks.length;
    return JSON.parse(JSON.stringify(await bg.handleMessage(msg, { tab: { id: 1, url: 'https://news.ycombinator.com/news?p=2' } })));
  };
  for (const f of SCRIPTS) win.eval(fs.readFileSync(path.join(ROOT, f), 'utf8'));
  const st = win.KT.main.start({ send, retryDelayMs: 40, debounceMs: 5, mutationDebounceMs: 10, reportDebounceMs: 5, listen: false });
  // wait until nothing is pending for a while
  let quiet = 0;
  for (let i = 0; i < 600 && quiet < 15; i++) {
    await new Promise((r) => setTimeout(r, 20));
    const busy = st.inflight || st.queue.length || st.applyQueue.length || Array.from(st.sendTimers).length || st.flushTimer;
    quiet = busy ? 0 : quiet + 1;
  }
  const d = win.document;
  let translated = 0;
  const remaining = [];
  const w = d.createTreeWalker(d.documentElement, 4);
  for (let n; (n = w.nextNode());) {
    const t = n.nodeValue.trim();
    if (!t || ['SCRIPT', 'STYLE'].includes(n.parentElement.tagName)) continue;
    if (t.startsWith(MARK)) translated++; else if (/[A-Za-z]{3,}/.test(t)) remaining.push(t.slice(0, 40));
  }
  const badge = browser.calls.badge.at(-1);
  win.KT.main.stop();
  win.close();
  console.warn = origWarn;
  if (process.env.HARNESS_VERBOSE) console.log(JSON.stringify({ mode, translated, requests: stat.requests, status: stat.status, blocksSent: sent, maxTexts: stat.maxTexts }));
  return { stat, translated, remaining, sent, warns, badge };
}

test('B18 harness: ok mode translates every block of HN page 2', { skip: !have }, async () => {
  const r = await run('ok');
  assert.ok(r.translated > 100, 'translated nodes ' + r.translated);
  assert.equal(r.translated, r.stat.texts, 'every sent block came back translated'); // remaining English nodes are link (x) items, kept verbatim by design
  assert.ok(r.stat.requests < 12, 'merged batches reduce DeepL requests: ' + r.stat.requests);
  assert.ok(r.stat.maxTexts > 10, 'batches grew beyond the content batch size: ' + r.stat.maxTexts);
  assert.equal(r.badge && r.badge.text, '');
});

test('B18 harness: 429 burst is retried (engine backoff) and the whole page ends up translated', { skip: !have }, async () => {
  const base = await run('ok');
  const r = await run('burst');
  assert.equal(r.translated, base.translated, 'blocks translated / total');
  assert.ok(r.translated > 100);
  assert.ok((r.stat.status[429] || 0) >= 7, 'saw the burst of 429s');
  assert.ok(!r.warns.some((l) => /secret|api/i.test(l)));
});

test('B18 harness: 456 quota is not retried, nothing translated, badge shown, warn has only code/status', { skip: !have }, async () => {
  const r = await run('456');
  assert.ok(r.stat.requests <= 4, 'no retry storm: ' + r.stat.requests);
  assert.equal(r.stat.status[456], r.stat.requests);
  assert.equal(r.badge && r.badge.text, '!');
  const line = r.warns.find((l) => l.includes('cloud:deepl'));
  assert.ok(line && /rate_limited/.test(line) && /456/.test(line), String(line));
  assert.ok(!/Hacker|Ask HN|points/.test(r.warns.join(' ')));
});

test('B18 harness: 429 forever ends as error after bounded retries (no infinite loop)', { skip: !have }, async () => {
  const r = await run('429all');
  assert.ok(r.stat.requests < 400, 'bounded: ' + r.stat.requests);
  assert.equal(r.badge && r.badge.text, '!');
});
