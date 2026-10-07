// jsdom 창에 content 스크립트(text, filter, segmenter, apply, main)를 순서대로 평가하는 테스트 헬퍼.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'extension');
const FILES = ['content/text.js', 'content/filter.js', 'content/segmenter.js', 'content/apply.js', 'content/main.js'];
const SRC = new Map();
function src(f) { if (!SRC.has(f)) SRC.set(f, readFileSync(join(ROOT, f), 'utf8')); return SRC.get(f); }

export function ko(text) { return 'KO:' + text; }

// 응답 기본값: 모든 t 슬롯을 'KO:'+text 로 번역.
export function fakeTranslateResponse(msg, fn = ko) {
  return {
    ok: true,
    engine: 'fake',
    results: msg.blocks.map((b) => ({
      id: b.id,
      slots: Object.fromEntries(b.items.filter((x) => x.k === 't').map((x) => [String(x.i), fn(x.text)])),
    })),
  };
}

// opts.respond(msg) 로 응답 교체 가능. calls = 모든 메시지, translates = translate 요청만.
export function createMessenger(opts = {}) {
  const m = {
    calls: [],
    get translates() { return m.calls.filter((c) => c.type === 'translate'); },
    respond: opts.respond || ((msg) => fakeTranslateResponse(msg)),
    async send(msg) {
      m.calls.push(JSON.parse(JSON.stringify(msg)));
      if (msg.type !== 'translate') return {};
      return m.respond(msg);
    },
  };
  return m;
}

export function setup(html = '<body></body>', opts = {}) {
  const dom = new JSDOM(`<!doctype html><html lang="${opts.htmlLang ?? 'en'}">${html}</html>`, {
    runScripts: 'outside-only', pretendToBeVisual: true, url: opts.url || 'https://example.com/a',
  });
  const win = dom.window;
  win.__KT_AUTOSTART = false;

  // IntersectionObserver 스텁: 기본은 즉시 교차. hidden에 넣은 요소는 show(el) 전까지 보고 안 함.
  const io = { instances: [], hidden: new Set(), observed: [] };
  win.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; this.targets = new Set(); io.instances.push(this); }
    observe(el) {
      this.targets.add(el);
      io.observed.push(el);
      if (!io.hidden.has(el)) win.queueMicrotask(() => { if (this.targets.has(el)) this.cb([{ target: el, isIntersecting: true }], this); });
    }
    unobserve(el) { this.targets.delete(el); }
    disconnect() { this.targets.clear(); }
  };
  io.show = (el) => {
    io.hidden.delete(el);
    for (const i of io.instances) if (i.targets.has(el)) i.cb([{ target: el, isIntersecting: true }], i);
  };
  win.requestAnimationFrame = (f) => { f(0); return 1; };

  if (opts.lang) win.eval(readFileSync(join(ROOT, 'lib/lang.js'), 'utf8'));
  for (const f of FILES) win.eval(src(f));

  const messenger = createMessenger(opts);
  const KT = win.KT;
  const startOpts = Object.assign({ send: messenger.send, debounceMs: 5, mutationDebounceMs: 10, reportDebounceMs: 5, listen: false }, opts.start || {});
  return {
    dom, win, document: win.document, KT, io, messenger,
    start(extra) { return KT.main.start(Object.assign({}, startOpts, extra)); },
    idle: (ms) => KT.main.idle(ms),
    q: (sel) => win.document.querySelector(sel),
    qa: (sel) => Array.from(win.document.querySelectorAll(sel)),
    close() { KT.main.stop(); win.close(); },
  };
}

export function textNodes(root) {
  const out = [];
  const w = root.ownerDocument.createTreeWalker(root, 0x4);
  let n;
  while ((n = w.nextNode())) out.push(n);
  return out;
}

// 구조 지문: 요소 태그 순서(텍스트 제외). 적용 전후 비교용.
export function structure(root) {
  return Array.from(root.querySelectorAll('*')).map((e) => e.localName).join(',');
}
