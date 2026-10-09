import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBackground, makeFakeBrowser } from './helpers/fake-browser.mjs';

// vm 컨텍스트 객체는 프로토타입이 달라 JSON 왕복 후 비교.
const eq = (a, b) => assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), b);
const KT = loadBackground();
const BG = KT.background;
const B = (id, lang, ...texts) => ({ id, lang, items: texts.map((text, i) => ({ k: 't', i, text })) });

function fakeEngine(over = {}) {
  const e = {
    id: 'native:apple-mt', kind: 'native', batchLimit: { chars: 1000, blocks: 2 }, concurrency: 2, calls: [], active: 0, maxActive: 0,
    async translate(blocks, ctx, lang) {
      e.calls.push({ ids: blocks.map((b) => b.id), lang });
      e.active++; e.maxActive = Math.max(e.maxActive, e.active);
      await new Promise((r) => setTimeout(r, 5));
      e.active--;
      if (e.fail && blocks.some((b) => e.fail.has(b.id))) throw e.err || { code: 'rate_limited', message: 'slow' };
      return new Map(blocks.map((b) => [b.id, { 0: 'KO:' + b.items[0].text }]));
    },
    ...over,
  };
  return e;
}

function setup({ sync, engine = fakeEngine() } = {}) {
  const browser = makeFakeBrowser({ sync });
  const bg = BG.createBackground({
    browser, KT,
    engines: { pickEngine: (s, lang) => { if (!['en', 'ja', 'zh'].includes(lang)) throw { code: 'unsupported_lang', message: lang }; return engine; } },
    cache: undefined,
  });
  return { browser, bg, engine };
}
const sender = { tab: { id: 7, url: 'https://example.com/a' } };

test('settings merge defaults', async () => {
  const { bg } = setup({ sync: { settings: { sites: [{ host: 'a.com', exclude: '' }], engine: { byLang: { ja: 'local:ollama' } } } } });
  const s = await bg.loadSettings();
  assert.equal(s.enabled, true);
  assert.equal(s.engine.default, 'native:apple-mt');
  assert.equal(s.engine.byLang.ja, 'local:ollama');
  assert.equal(s.localhost.baseUrl, 'http://127.0.0.1:11434');
  assert.equal(s.pdfAuto, true);
  assert.equal(s.sites.length, 1);
});

test('registration: ids, matches, idempotent, empty -> unregister only', async () => {
  const { browser, bg } = setup({ sync: { settings: { sites: [{ host: 'example.com' }, 'b.org'] } } });
  await bg.registerContentScripts();
  await bg.registerContentScripts();
  assert.equal(browser.calls.unregister.length, 2);
  assert.equal(browser.calls.register.length, 2);
  const r = browser.calls.register[0][0];
  assert.equal(r.id, 'kt-main');
  eq(r.matches, ['*://example.com/*', '*://*.example.com/*', '*://b.org/*', '*://*.b.org/*']);
  eq(r.js, ['lib/josa.js', 'content/text.js', 'content/filter.js', 'content/segmenter.js', 'content/apply.js', 'content/main.js']);
  assert.equal(r.runAt, 'document_idle');
  assert.equal(r.allFrames, true);

  const e = setup();
  await e.bg.registerContentScripts();
  assert.equal(e.browser.calls.unregister.length, 1);
  assert.equal(e.browser.calls.register.length, 0);
});

test('registration: extra.js injected before main.js only when translateAttrs is on', async () => {
  const { browser, bg } = setup({ sync: { settings: { sites: [{ host: 'example.com' }], translateAttrs: true } } });
  await bg.registerContentScripts();
  eq(browser.calls.register[0][0].js, ['lib/josa.js', 'content/text.js', 'content/filter.js', 'content/segmenter.js', 'content/apply.js', 'content/extra.js', 'content/main.js']);
});

test('storage change re-registers; own writes do not double register', async () => {
  const { browser, bg } = setup();
  bg.start();
  await bg.registerContentScripts();
  browser.storage._sync.settings = { sites: [{ host: 'x.com' }] };
  await browser.storage.onChanged.fire({ settings: {} }, 'sync');
  assert.equal(browser.calls.register.at(-1)[0].matches[0], '*://x.com/*');
  const n = browser.calls.register.length;
  await bg.handleMessage({ type: 'setSiteEnabled', host: 'y.com', enabled: true }, {});
  await browser.storage.onChanged.fire({ settings: {} }, 'sync');
  assert.equal(browser.calls.register.length, n + 1);
});

test('setSiteEnabled persists and getState reflects', async () => {
  const { browser, bg } = setup();
  eq(await bg.handleMessage({ type: 'setSiteEnabled', host: 'https://Example.com/x', enabled: true }, {}), { ok: true });
  eq(browser.storage._sync.settings.sites, [{ host: 'example.com', exclude: '' }]);
  let st = await bg.handleMessage({ type: 'getState', url: 'https://www.example.com/p' }, {});
  assert.equal(st.siteEnabled, true);
  assert.equal(st.host, 'www.example.com');
  await bg.handleMessage({ type: 'setSiteEnabled', host: 'www.example.com', enabled: false }, {});
  eq(browser.storage._sync.settings.sites, []);
  st = await bg.handleMessage({ type: 'getState', url: 'https://www.example.com/p' }, {});
  assert.equal(st.siteEnabled, false);
});

test('getSiteConfig returns exclude selectors', async () => {
  const { bg } = setup({ sync: { settings: { sites: [{ host: 'example.com', exclude: '.ad' }, { host: 'docs.example.com', exclude: '.nav' }] } } });
  eq(await bg.handleMessage({ type: 'getSiteConfig', host: 'docs.example.com' }, {}), { exclude: '.ad, .nav' });
  eq(await bg.handleMessage({ type: 'getSiteConfig', host: 'other.com' }, {}), { exclude: '' });
});

test('translate: cache hit skips engine, misses batched by limit', async () => {
  const { bg, engine } = setup();
  const r1 = await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('a', 'en', 'one')] }, sender);
  assert.equal(r1.ok, true);
  eq(r1.results, [{ id: 'a', slots: { 0: 'KO:one' } }]);
  assert.equal(r1.engine, 'native:apple-mt');
  const r2 = await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('a2', 'en', 'one'), B('b', 'en', 'two'), B('c', 'en', 'three'), B('d', 'en', 'four'), B('e', 'en', 'five')] }, sender);
  assert.equal(r2.results.length, 5);
  assert.equal(r2.results.find((x) => x.id === 'a2').slots[0], 'KO:one');
  // a2 is a cache hit; 4 misses with blocks:2 -> 2 engine calls, plus 1 earlier
  eq(engine.calls.slice(1).map((c) => c.ids), [['b', 'c'], ['d', 'e']]);
});

test('translate: partial failure keeps successes; total failure maps code', async () => {
  const engine = fakeEngine({ batchLimit: { chars: 1000, blocks: 1 }, fail: new Set(['bad']) });
  const { bg, browser } = setup({ engine });
  const r = await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('ok', 'en', 'x'), B('bad', 'en', 'y')] }, sender);
  assert.equal(r.ok, true);
  eq(r.results.map((x) => x.id), ['ok']);
  const r2 = await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('bad', 'en', 'y')] }, sender);
  eq([r2.ok, r2.code], [false, 'rate_limited']);
  engine.err = { code: 'weird', message: 'm' };
  const r3 = await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('bad', 'en', 'z')] }, sender);
  assert.equal(r3.code, 'unknown');
  assert.equal(browser.calls.badge.at(-1).text, ''); // rate_limited/unknown는 배지 없음
});

test('translate: concurrency capped by engine.concurrency', async () => {
  const engine = fakeEngine({ batchLimit: { chars: 1000, blocks: 1 }, concurrency: 2 });
  const { bg } = setup({ engine });
  const blocks = Array.from({ length: 6 }, (_, i) => B('b' + i, 'en', 't' + i));
  const r = await bg.handleMessage({ type: 'translate', lang: 'en', blocks }, sender);
  assert.equal(r.results.length, 6);
  assert.equal(engine.calls.length, 6);
  assert.equal(engine.maxActive, 2);
});

test('translate: lang mapping and unsupported', async () => {
  const { bg, engine } = setup();
  await bg.handleMessage({ type: 'translate', blocks: [B('h', 'zh-Hant', '字'), B('j', 'ja', 'の')] }, sender);
  eq(engine.calls.map((c) => c.lang).sort(), ['ja', 'zh']);
  const r = await bg.handleMessage({ type: 'translate', blocks: [B('f', 'fr', 'bonjour')] }, sender);
  eq([r.ok, r.code], [false, 'unsupported_lang']);
});

test('translate: engine unavailable error and badge', async () => {
  const engine = fakeEngine({ err: { code: 'engine_unavailable', message: 'down' }, fail: new Set(['a']) });
  const { bg, browser } = setup({ engine });
  const r = await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('a', 'en', 'x')] }, sender);
  eq([r.ok, r.code], [false, 'engine_unavailable']);
  eq(browser.calls.badge.at(-1), { text: '!', tabId: 7 });
  let st = await bg.handleMessage({ type: 'getState', url: 'https://example.com' }, sender);
  eq([st.status, st.errorCode], ['error', 'engine_unavailable']);
  engine.fail = null;
  await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('a', 'en', 'x')] }, sender);
  eq(browser.calls.badge.at(-1), { text: '', tabId: 7 });
});

test('no engine at all -> engine_unavailable', async () => {
  const browser = makeFakeBrowser();
  const bg = BG.createBackground({ browser, KT, engines: { pickEngine() { throw new Error('boom'); } } });
  const r = await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('a', 'en', 'x')] }, sender);
  eq([r.ok, r.code], [false, 'engine_unavailable']);
});

test('reportStatus counters feed getState pending', async () => {
  const { bg } = setup();
  await bg.handleMessage({ type: 'reportStatus', pending: 4, done: 2, error: 0 }, sender);
  const st = await bg.handleMessage({ type: 'getState', url: 'https://example.com' }, sender);
  assert.equal(st.pending, 4);
  assert.equal(st.status, 'translating');
});

test('openPdfViewer builds viewer URL', async () => {
  const { bg, browser } = setup();
  const url = 'https://x.org/a b.pdf?q=1&r=2';
  eq(await bg.handleMessage({ type: 'openPdfViewer', url }, {}), { ok: true });
  const created = browser.calls.tabsCreate[0].url;
  assert.equal(created, 'safari-web-extension://abc/viewer/viewer.html?src=' + encodeURIComponent(new URL(url).href));
  const bad = await bg.handleMessage({ type: 'openPdfViewer', url: 'javascript:alert(1)' }, {});
  assert.equal(bad.ok, false);
});

test('clearCache persists empty cache', async () => {
  const { bg, browser } = setup();
  await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('a', 'en', 'x')] }, sender);
  eq(await bg.handleMessage({ type: 'clearCache' }, {}), { ok: true });
  eq(browser.storage._local.cache, {});
});

test('onMessage ignores unknown types and replies async', async () => {
  const { bg } = setup();
  assert.equal(bg.onMessage({ type: 'toggleOriginal' }, {}, () => {}), false);
  const res = await new Promise((resolve) => { assert.equal(bg.onMessage({ type: 'clearCache' }, {}, resolve), true); });
  eq(res, { ok: true });
});

test('DEFAULT_SETTINGS: translateAttrs=false, fixParticles=true; merge keeps stored values and unknown keys', () => {
  eq(BG.DEFAULT_SETTINGS.translateAttrs, false);
  eq(BG.DEFAULT_SETTINGS.fixParticles, true);
  const m = BG.mergeSettings(BG.DEFAULT_SETTINGS, { translateAttrs: true, fixParticles: false, futureKey: { a: 1 } });
  eq([m.translateAttrs, m.fixParticles, m.futureKey], [true, false, { a: 1 }]);
  const d = BG.mergeSettings(BG.DEFAULT_SETTINGS, {});
  eq([d.translateAttrs, d.fixParticles], [false, true]);
});

test('DEFAULT_SETTINGS.linkMode is standalone', () => {
  eq(BG.DEFAULT_SETTINGS.linkMode, 'standalone');
});

test('translate: needs_safari_restart is kept and shows badge', async () => {
  const engine = fakeEngine({ err: { code: 'needs_safari_restart', message: 'No such plugin' }, fail: new Set(['a']) });
  const { bg, browser } = setup({ engine });
  const r = await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('a', 'en', 'x')] }, sender);
  eq([r.ok, r.code], [false, 'needs_safari_restart']);
  eq(browser.calls.badge.at(-1), { text: '!', tabId: 7 });
});

test('F16: semaphore admits waiting runs by priority, FIFO within equal priority', async () => {
  const sem = BG.createSemaphore(1);
  const order = [];
  const gate = {};
  const first = sem.run(() => new Promise((r) => { gate.open = r; }));
  const mk = (name, pr) => sem.run(async () => { order.push(name); }, pr);
  const rest = Promise.all([mk('low1', 0), mk('low2', 0), mk('high1', 1), mk('high2', 1), mk('none')]);
  gate.open();
  await first; await rest;
  eq(order, ['high1', 'high2', 'low1', 'low2', 'none']);
});

test('F16: translate priority orders queued engine batches', async () => {
  const engine = fakeEngine({ concurrency: 1, batchLimit: { chars: 1000, blocks: 1 } });
  const { bg } = setup({ sync: { settings: { sites: [{ host: 'example.com' }] } }, engine });
  const lo = bg.handleMessage({ type: 'translate', priority: 0, lang: 'en', blocks: [B('a', 'en', 'one'), B('b', 'en', 'two')] }, sender);
  await new Promise((r) => setTimeout(r, 1));
  const hi = bg.handleMessage({ type: 'translate', priority: 1, lang: 'en', blocks: [B('c', 'en', 'three')] }, sender);
  await Promise.all([lo, hi]);
  // a is already running when the high request arrives; c must run before b
  eq(engine.calls.map((c) => c.ids[0]), ['a', 'c', 'b']);
});

// F18: per-frame pending, reset on navigation, engine deadline releases the semaphore.
test('F18: pending is summed across frames; later report from one frame does not hide another', async () => {
  const { bg } = setup();
  const top = { tab: { id: 7 }, frameId: 0 };
  const frame = { tab: { id: 7 }, frameId: 5 };
  await bg.handleMessage({ type: 'reportStatus', pending: 3, done: 0, error: 0 }, top);
  await bg.handleMessage({ type: 'reportStatus', pending: 2, done: 0, error: 0 }, frame);
  assert.equal((await bg.handleMessage({ type: 'getState', tabId: 7, url: 'https://example.com' }, {})).pending, 5);
  await bg.handleMessage({ type: 'reportStatus', pending: 0, done: 3, error: 0 }, top);
  const st = await bg.handleMessage({ type: 'getState', tabId: 7, url: 'https://example.com' }, {});
  assert.equal(st.pending, 2);
  await bg.handleMessage({ type: 'reportStatus', pending: 0, done: 2, error: 0 }, frame);
  const st2 = await bg.handleMessage({ type: 'getState', tabId: 7, url: 'https://example.com' }, {});
  eq([st2.pending, st2.status], [0, 'ready']);
});

test('F18: top-frame commit resets tab state; subframe commit resets only that frame', async () => {
  const { bg, browser } = setup();
  await bg.handleMessage({ type: 'reportStatus', pending: 3 }, { tab: { id: 7 }, frameId: 0 });
  await bg.handleMessage({ type: 'reportStatus', pending: 2 }, { tab: { id: 7 }, frameId: 5 });
  await bg.onCommitted({ tabId: 7, frameId: 5, url: 'https://example.com/x' });
  assert.equal((await bg.handleMessage({ type: 'getState', tabId: 7, url: 'https://example.com' }, {})).pending, 3);
  // lastError is cleared on top-frame navigation
  await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('a', 'en', 'x')] }, sender); // ok, creates tab 7 state
  const bad = setup({ engine: fakeEngine({ async translate() { throw { code: 'engine_unavailable', message: 'x' }; } }) });
  await bad.bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('a', 'en', 'x')] }, sender);
  assert.equal((await bad.bg.handleMessage({ type: 'getState', tabId: 7, url: 'https://example.com' }, {})).errorCode, 'engine_unavailable');
  await bad.bg.onCommitted({ tabId: 7, frameId: 0, url: 'https://example.com/next' });
  const after = await bad.bg.handleMessage({ type: 'getState', tabId: 7, url: 'https://example.com' }, {});
  eq([after.pending, after.status, 'errorCode' in after], [0, 'ready', false]);
  eq(bad.browser.calls.badge.at(-1), { text: '', tabId: 7 });
  await bg.onCommitted({ tabId: 7, frameId: 0, url: 'https://example.com/next' });
  assert.equal((await bg.handleMessage({ type: 'getState', tabId: 7, url: 'https://example.com' }, {})).pending, 0);
  void browser;
});

test('F18: engine.translate that never settles times out and releases the semaphore', async () => {
  let n = 0;
  const engine = fakeEngine({
    concurrency: 1,
    async translate(blocks) {
      if (n++ === 0) return new Promise(() => {}); // lost response
      return new Map(blocks.map((b) => [b.id, { 0: 'KO:' + b.items[0].text }]));
    },
  });
  const browser = makeFakeBrowser();
  const bg = BG.createBackground({ browser, KT, engines: { pickEngine: () => engine }, deadlineMs: () => 20 });
  const t0 = Date.now();
  const first = await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('a', 'en', 'x')] }, sender);
  eq([first.ok, first.code], [false, 'timeout']);
  assert.ok(Date.now() - t0 < 2000);
  // the semaphore is free again: the next request runs
  const second = await bg.handleMessage({ type: 'translate', lang: 'en', blocks: [B('b', 'en', 'y')] }, sender);
  eq(second.ok, true);
  eq(second.results[0].slots, { 0: 'KO:y' });
});

test('F23: semaphore size follows engine.concurrencyFor(settings) and is rebuilt on change', async () => {
  const engine = fakeEngine({ batchLimit: { chars: 1000, blocks: 1 }, concurrency: 1, concurrencyFor: (s) => (s.localhost && s.localhost.parallel) || 2 });
  const { bg, browser } = setup({ engine, sync: { settings: { localhost: { parallel: 3 } } } });
  const blocks = (p) => Array.from({ length: 8 }, (_, i) => B(p + i, 'en', p + 't' + i));
  await bg.handleMessage({ type: 'translate', lang: 'en', blocks: blocks('a') }, sender);
  assert.equal(engine.maxActive, 3);
  bg.start();
  engine.maxActive = 0;
  browser.storage._sync.settings = { localhost: { parallel: 1 } };
  await browser.storage.onChanged.fire({ settings: {} }, 'sync');
  await bg.handleMessage({ type: 'translate', lang: 'en', blocks: blocks('b') }, sender);
  assert.equal(engine.maxActive, 1);
});
