import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBackground, makeFakeBrowser } from './helpers/fake-browser.mjs';

// vm 컨텍스트 객체는 프로토타입이 달라 JSON 왕복 후 비교.
const eq = (a, b) => assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), b);
const KT = loadBackground();
const mk = (settings) => {
  const browser = makeFakeBrowser({ sync: settings ? { settings } : {} });
  const bg = KT.background.createBackground({ browser, KT, engines: {} });
  return { browser, bg };
};
const nav = (tabId, url, frameId = 0) => ({ tabId, url, frameId });

test('pdfAuto is off by default: no redirect', async () => {
  const { browser, bg } = mk({ sites: [{ host: 'example.com' }] });
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
