import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { loadCjs, ROOT } from './ui-helpers.mjs';

const lib = loadCjs('extension/popup/popup-lib.js');

test('view model for normal state', () => {
  const vm = lib.buildViewModel({ siteEnabled: true, host: 'a.com', engine: 'native:apple-mt', status: 'ready', pending: 3 }, { url: 'https://a.com/x' });
  assert.equal(vm.host, 'a.com');
  assert.equal(vm.siteEnabled, true);
  assert.equal(vm.engineLine, 'native:apple-mt · ready');
  assert.equal(vm.hasError, false);
  assert.equal(vm.pendingVisible, false);
  assert.equal(vm.pendingText, '번역 대기 3블록');
  assert.equal(vm.pdfLooksLikePdf, false);
  assert.equal(vm.pdfEnabled, true);
});

test('needs_language_pack message, debug pending, pdf url, original mode', () => {
  const vm = lib.buildViewModel({ host: 'a.com', errorCode: 'needs_language_pack' }, { url: 'https://a.com/p.PDF?x=1', debug: true, mode: 'original' });
  assert.equal(vm.errorMessage, '컨테이너 앱에서 언어팩을 설치하세요');
  assert.equal(vm.pendingVisible, true);
  assert.equal(vm.pdfLooksLikePdf, true);
  assert.equal(vm.toggleLabel, '번역 보기');
});

test('no state and non-http tab', () => {
  const vm = lib.buildViewModel(null, { url: 'about:blank' });
  assert.equal(vm.hasHost, false);
  assert.equal(vm.hasError, true);
  assert.equal(lib.buildViewModel({ errorCode: 'weird' }, {}).errorMessage, lib.ERRORS.unknown);
});

test('render into popup.html', () => {
  const html = readFileSync(join(ROOT, 'extension/popup/popup.html'), 'utf8').replace(/<script[^>]*><\/script>/g, '');
  const { document } = new JSDOM(html).window;
  lib.render(document, lib.buildViewModel({ siteEnabled: true, host: 'a.com', engine: 'e', status: 'ready', pending: 2, errorCode: 'needs_language_pack' }, { url: 'https://a.com/', debug: false }));
  assert.equal(document.getElementById('host').textContent, 'a.com');
  assert.equal(document.getElementById('site-toggle').checked, true);
  assert.equal(document.getElementById('error').hidden, false);
  assert.equal(document.getElementById('pending').hidden, true);
  assert.equal(document.getElementById('toggle-original').textContent, '원문 보기');
});
