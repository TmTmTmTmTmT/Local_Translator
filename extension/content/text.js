// 텍스트 정제·비언어 판정·공백 보존·스크립트 비율·원문 언어 판정(순수 함수). lang.js의 판정 규칙과 동일(콘텐츠에는 주입하지 않음).
(function () {
  'use strict';

  const URL_RE = /(?:https?:\/\/|www\.)\S+/gi;
  const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
  const str = (s) => String(s == null ? '' : s);

  function cleanText(text) { return str(text).replace(/[\u200b-\u200d\u2060\ufeff]/g, '').trim(); }

  function isNonlinguistic(text) {
    const t = cleanText(text);
    return !t || !/[\p{L}\p{M}]/u.test(t) || /^(?:https?:\/\/|www\.)\S+$/i.test(t) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
  }

  // 원문의 앞뒤 공백을 번역문에 이식해 인라인 간격을 유지.
  function withOuterWhitespace(original, translated) {
    const o = str(original);
    const lead = /^\s*/.exec(o)[0];
    return lead + str(translated).trim() + (o.length > lead.length ? /\s*$/.exec(o)[0] : '');
  }

  const SCRIPTS = [['hangul', /\p{Script=Hangul}/u], ['hiragana', /\p{Script=Hiragana}/u], ['katakana', /\p{Script=Katakana}/u],
    ['han', /\p{Script=Han}/u], ['latin', /\p{Script=Latin}/u]];
  function scriptCounts(text) {
    const c = { hangul: 0, hiragana: 0, katakana: 0, han: 0, latin: 0, letters: 0 };
    for (const ch of str(text).replace(URL_RE, ' ').replace(EMAIL_RE, ' ')) {
      if (!/\p{L}/u.test(ch)) continue;
      c.letters++;
      for (const [k, re] of SCRIPTS) if (re.test(ch)) { c[k]++; break; }
    }
    return c;
  }

  function hangulRatio(text) {
    const c = scriptCounts(text);
    return c.letters ? c.hangul / c.letters : 0;
  }

  // -> 'en'|'ja'|'zh'|'ko'|null
  function detectLang(text) {
    const c = scriptCounts(text), n = c.letters;
    if (!n) return null;
    if (c.hangul / n >= 0.5) return 'ko';
    if (c.hiragana + c.katakana > 0) return 'ja';
    if (c.han / n >= 0.5 && c.han > c.latin) return 'zh';
    return c.latin / n >= 0.5 && c.latin > 0 ? 'en' : null;
  }

  const KT = (globalThis.KT = globalThis.KT || {});
  KT.text = { cleanText, isNonlinguistic, withOuterWhitespace, scriptCounts, hangulRatio, detectLang };
})();
