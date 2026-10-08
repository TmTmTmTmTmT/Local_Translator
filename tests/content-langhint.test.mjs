// F8: han-only blocks get a lang hint from html/ancestor lang or document majority.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setup } from './helpers/load-content.mjs';

const H = '北海道'; // han-only
const KANA = '東京の天気です';
const langs = (e) => Array.from(e.KT.collectBlocks(e.document.body, {}), (r) => r.lang);

test('html lang=ja: han-only block is ja', () => {
  const e = setup('<html lang="ja"><body><p>' + H + '</p></body></html>');
  assert.deepEqual(langs(e), ['ja']); e.close();
});

test('html lang=zh-CN: han-only block stays zh', () => {
  const e = setup('<html lang="zh-CN"><body><p>' + H + '</p></body></html>');
  assert.deepEqual(langs(e), ['zh']); e.close();
});

test('no lang: kana blocks majority makes han-only ja; otherwise zh', () => {
  let e = setup('<body><p>' + KANA + '</p><p>' + KANA + '</p><p>' + H + '</p></body>');
  assert.deepEqual(langs(e), ['ja', 'ja', 'ja']); e.close();
  e = setup('<body><p>' + H + '</p><p>' + H + '</p><p>' + KANA + '</p></body>');
  assert.deepEqual(langs(e), ['zh', 'zh', 'ja']); e.close();
});

test('ancestor lang wins over html lang', () => {
  let e = setup('<html lang="ja"><body><div lang="zh"><p>' + H + '</p></div></body></html>');
  assert.deepEqual(langs(e), ['zh']); e.close();
  e = setup('<html lang="zh"><body><div lang="ja-JP"><p>' + H + '</p></div></body></html>');
  assert.deepEqual(langs(e), ['ja']); e.close();
});
