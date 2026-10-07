import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { LANGS, scriptCounts, detectLang, detectLangEx } = require('../extension/lib/lang.js');

test('LANGS table', () => {
  assert.deepEqual(Object.keys(LANGS).sort(), ['en', 'ja', 'ko', 'zh']);
  assert.ok(LANGS.en.script.test('a'));
  assert.ok(LANGS.ko.script.test('가'));
  assert.ok(LANGS.ja.promptNotes.length > 0 && LANGS.zh.promptNotes.length > 0);
});

test('detectLang basic languages', () => {
  assert.equal(detectLang('This is a plain English sentence.'), 'en');
  assert.equal(detectLang('これは日本語の文章です。漢字も含みます。'), 'ja');
  assert.equal(detectLang('이것은 한국어 문장입니다.'), 'ko');
  assert.equal(detectLang('我们在这个国家学习经济。'), 'zh');
});

test('zh variants', () => {
  assert.deepEqual(detectLangEx('我们在这个国家学习经济。'), { lang: 'zh', variant: 'zh-Hans' });
  assert.deepEqual(detectLangEx('我們在這個國家學習經濟。'), { lang: 'zh', variant: 'zh-Hant' });
  const u = detectLangEx('天地人山水火');
  assert.equal(u.lang, 'zh');
  assert.equal(u.variant, 'unknown');
  // 단 1개 전용 문자는 불충분
  assert.equal(detectLangEx('山水国').variant, 'unknown');
});

test('mixed samples', () => {
  assert.equal(detectLang('이 문장은 대부분 한국어로 작성되었고 API 만 영어'), 'ko');
  assert.equal(detectLang('Use the 世界 library in production code today'), 'en');
  assert.equal(detectLang('Hello 日本語のテキスト、ここは日本語です'), 'ja');
  assert.equal(detectLang('Привет мир'), null);
});

test('URL/email/numbers only -> null; URLs stripped before counting', () => {
  assert.equal(detectLang('https://example.com/path?q=한국어'), null);
  assert.equal(detectLang('user@example.com'), null);
  assert.equal(detectLang('12345 !!! 67'), null);
  assert.equal(detectLang(''), null);
  assert.equal(detectLang('한글 https://example.com/some/long/english/path/here'), 'ko');
  assert.equal(scriptCounts('see https://a.com ok').latin, 5);
});
