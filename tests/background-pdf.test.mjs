import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBackground, makeFakeBrowser } from './helpers/fake-browser.mjs';

// vm 컨텍스트 객체는 프로토타입이 달라 JSON 왕복 후 비교.
const eq = (a, b) => assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), b);
const KT = loadBackground();
const mk = (settings, fetch) => {
  const browser = makeFakeBrowser({ sync: settings ? { settings } : {} });
  const bg = KT.background.createBackground({ browser, KT, engines: {}, fetch });
  return { browser, bg };
};
const nav = (tabId, url, frameId = 0) => ({ tabId, url, frameId });

test('pdfAuto is on by default (D7); explicit false disables redirect', async () => {
  const on = mk({ sites: [{ host: 'example.com' }] });
  assert.equal((await on.bg.getSettings()).pdfAuto, true);
  const { browser, bg } = mk({ pdfAuto: false, sites: [{ host: 'example.com' }] });
  assert.equal((await bg.getSettings()).pdfAuto, false);
  await bg.onBeforeNavigate(nav(1, 'https://example.com/a.pdf'));
  assert.equal(browser.calls.tabsUpdate.length, 0);
});

test('pdfAuto on: site host or previous-host triggers redirect', async () => {
  const { browser, bg } = mk({ pdfAuto: true, sites: [{ host: 'example.com' }] });
  await bg.onBeforeNavigate(nav(1, 'https://example.com/doc.PDF'));
  assert.equal(browser.calls.tabsUpdate.length, 1);
  assert.match(browser.calls.tabsUpdate[0].url, /viewer\/viewer\.html\?src=https%3A%2F%2Fexample\.com%2Fdoc\.PDF$/);
  // 직전 페이지가 지정 사이트, PDF는 다른 호스트
  await bg.onBeforeNavigate(nav(2, 'https://www.example.com/page'));
  await bg.onBeforeNavigate(nav(2, 'https://cdn.other.net/f.pdf'));
  assert.equal(browser.calls.tabsUpdate.length, 2);
  assert.equal(browser.calls.tabsUpdate[1].id, 2);
});

test('pdfAuto on: non-site, subframe, non-pdf, #kt-original are ignored', async () => {
  const { browser, bg } = mk({ pdfAuto: true, sites: [{ host: 'example.com' }] });
  await bg.onBeforeNavigate(nav(3, 'https://other.net/p'));
  await bg.onBeforeNavigate(nav(3, 'https://other.net/f.pdf'));
  await bg.onBeforeNavigate(nav(4, 'https://example.com/f.pdf', 2));
  await bg.onBeforeNavigate(nav(4, 'https://example.com/page.html'));
  await bg.onBeforeNavigate(nav(5, 'https://example.com/f.pdf#kt-original'));
  assert.equal(browser.calls.tabsUpdate.length, 0);
});

test('start() registers onBeforeNavigate listener', async () => {
  const { browser, bg } = mk();
  await bg.start();
  assert.equal(browser.webNavigation.onBeforeNavigate.listeners.length, 1);
});

// F17: extension-less PDF URLs are confirmed by a HEAD request (fetch is injected; no network).
const resp = (type, status = 200) => ({ ok: status >= 200 && status < 300, status, headers: { get: (k) => (/content-type/i.test(k) ? type : null) } });
const mkFetch = (handler) => {
  const f = async (url, init) => { f.calls.push({ url, init }); return handler(url, init, f.calls.length); };
  f.calls = [];
  return f;
};
const SITE = { pdfAuto: true, sites: [{ host: 'arxiv.org' }] };
const AX = 'https://arxiv.org/pdf/1706.03762';

test('F17: /pdf/ID with HEAD application/pdf redirects to viewer', async () => {
  const f = mkFetch(() => resp('application/pdf'));
  const { browser, bg } = mk(SITE, f);
  await bg.onBeforeNavigate(nav(1, AX));
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].init.method, 'HEAD');
  assert.equal(f.calls[0].init.credentials, 'include');
  assert.equal(f.calls[0].init.redirect, 'follow');
  assert.equal(browser.calls.tabsUpdate.length, 1);
  assert.match(browser.calls.tabsUpdate[0].url, /viewer\/viewer\.html\?src=/);
});

test('F17: HEAD text/html does not redirect; format=pdf query and trailing /pdf are candidates', async () => {
  const f = mkFetch(() => resp('text/html; charset=utf-8'));
  const { browser, bg } = mk(SITE, f);
  await bg.onBeforeNavigate(nav(1, AX));
  await bg.onBeforeNavigate(nav(2, 'https://arxiv.org/view?format=pdf&x=1'));
  await bg.onBeforeNavigate(nav(3, 'https://arxiv.org/paper/12/pdf'));
  assert.equal(f.calls.length, 3);
  assert.equal(browser.calls.tabsUpdate.length, 0);
  // non-candidates never probe
  await bg.onBeforeNavigate(nav(4, 'https://arxiv.org/abs/1706.03762'));
  await bg.onBeforeNavigate(nav(4, 'https://arxiv.org/pdfs-list'));
  assert.equal(f.calls.length, 3);
});

test('F17: .pdf path is immediate (no probe, query ignored); non-site and pdfAuto off never probe', async () => {
  const f = mkFetch(() => resp('application/pdf'));
  const { browser, bg } = mk(SITE, f);
  await bg.onBeforeNavigate(nav(1, 'https://arxiv.org/files/a.pdf?download=1'));
  assert.equal(f.calls.length, 0);
  assert.equal(browser.calls.tabsUpdate.length, 1);
  await bg.onBeforeNavigate(nav(2, 'https://other.net/pdf/123'));
  assert.equal(f.calls.length, 0);
  const off = mk({ pdfAuto: false, sites: [{ host: 'arxiv.org' }] }, f);
  await off.bg.onBeforeNavigate(nav(3, AX));
  assert.equal(f.calls.length, 0);
  assert.equal(off.browser.calls.tabsUpdate.length, 0);
});

test('F17: duplicate events (beforeNavigate, committed, tabs.onUpdated) redirect once; probe cached', async () => {
  const f = mkFetch(() => resp('application/pdf'));
  const { browser, bg } = mk(SITE, f);
  await Promise.all([
    bg.onBeforeNavigate(nav(1, AX)),
    bg.onCommitted(nav(1, AX)),
    bg.onTabUpdated(1, { url: AX }),
  ]);
  await bg.onCommitted(nav(1, AX));
  assert.equal(browser.calls.tabsUpdate.length, 1);
  assert.equal(f.calls.length, 1);
  // another tab, same URL: cached result, own redirect
  await bg.onTabUpdated(2, { url: AX });
  assert.equal(f.calls.length, 1);
  assert.equal(browser.calls.tabsUpdate.length, 2);
  // tabs.onUpdated without url change is ignored
  await bg.onTabUpdated(3, { status: 'loading' });
  assert.equal(browser.calls.tabsUpdate.length, 2);
});

test('F17: #kt-original escape hatch is ignored for candidates and .pdf', async () => {
  const f = mkFetch(() => resp('application/pdf'));
  const { browser, bg } = mk(SITE, f);
  await bg.onBeforeNavigate(nav(1, AX + '#kt-original'));
  await bg.onCommitted(nav(1, 'https://arxiv.org/a.pdf#kt-original'));
  assert.equal(f.calls.length, 0);
  assert.equal(browser.calls.tabsUpdate.length, 0);
});

test('F17: HEAD failure or 405 falls back to one Range GET', async () => {
  const f = mkFetch((url, init) => {
    if (init.method === 'HEAD') throw new Error('network');
    return resp('application/pdf', 206);
  });
  const a = mk(SITE, f);
  await a.bg.onBeforeNavigate(nav(1, AX));
  assert.deepEqual(f.calls.map((c) => c.init.method), ['HEAD', 'GET']);
  assert.equal(f.calls[1].init.headers.Range, 'bytes=0-0');
  assert.equal(a.browser.calls.tabsUpdate.length, 1);
  const g = mkFetch((url, init) => (init.method === 'HEAD' ? resp('text/html', 405) : resp('application/pdf', 206)));
  const b = mk(SITE, g);
  await b.bg.onBeforeNavigate(nav(1, AX));
  assert.deepEqual(g.calls.map((c) => c.init.method), ['HEAD', 'GET']);
  assert.equal(b.browser.calls.tabsUpdate.length, 1);
  // both fail: no redirect, not cached (retry on next event)
  const h = mkFetch(() => { throw new Error('down'); });
  const c = mk(SITE, h);
  await c.bg.onBeforeNavigate(nav(1, AX));
  await c.bg.onCommitted(nav(1, AX));
  assert.equal(c.browser.calls.tabsUpdate.length, 0);
  assert.equal(h.calls.length, 4);
});

test('F17: start() registers onCommitted and tabs.onUpdated listeners', async () => {
  const { browser, bg } = mk();
  await bg.start();
  assert.equal(browser.webNavigation.onCommitted.listeners.length, 1);
  assert.equal(browser.tabs.onUpdated.listeners.length, 1);
});
