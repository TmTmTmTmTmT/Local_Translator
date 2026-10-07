// 텍스트 정제·비언어 판정·공백 보존·스크립트 비율 (순수 함수, DOM 무관).
(function () {
  'use strict';

  const ZERO_WIDTH_RE = /[​-‍⁠﻿]/g;
  const URL_ONLY_RE = /^(?:https?:\/\/|www\.)\S+$/i;
  const EMAIL_ONLY_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const URL_RE = /(?:https?:\/\/|www\.)\S+/gi;
  const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/g;

  function cleanText(text) {
    return String(text == null ? '' : text).replace(ZERO_WIDTH_RE, '').trim();
  }

  function isNonlinguistic(text) {
    const t = cleanText(text);
    if (!t) return true;
    if (!/[\p{L}\p{M}]/u.test(t)) return true;
    if (URL_ONLY_RE.test(t) || EMAIL_ONLY_RE.test(t)) return true;
    return false;
  }

  // 원문의 앞뒤 공백을 번역문에 이식. 페이지 레이아웃(인라인 간격)을 유지하기 위함.
  function withOuterWhitespace(original, translated) {
    const o = String(original == null ? '' : original);
    const lead = /^\s*/.exec(o)[0];
    const trail = o.length > lead.length ? /\s*$/.exec(o)[0] : '';
    return lead + String(translated == null ? '' : translated).trim() + trail;
  }

  function scriptCounts(text) {
    const c = { hangul: 0, hiragana: 0, katakana: 0, han: 0, latin: 0, letters: 0 };
    const s = String(text == null ? '' : text).replace(URL_RE, ' ').replace(EMAIL_RE, ' ');
    for (const ch of s) {
      if (!/\p{L}/u.test(ch)) continue;
      c.letters++;
      if (/\p{Script=Hangul}/u.test(ch)) c.hangul++;
      else if (/\p{Script=Hiragana}/u.test(ch)) c.hiragana++;
      else if (/\p{Script=Katakana}/u.test(ch)) c.katakana++;
      else if (/\p{Script=Han}/u.test(ch)) c.han++;
      else if (/\p{Script=Latin}/u.test(ch)) c.latin++;
    }
    return c;
  }

  function hangulRatio(text) {
    const c = scriptCounts(text);
    return c.letters ? c.hangul / c.letters : 0;
  }

  // lib/lang.js가 있으면 그것을 쓰고, 없을 때만 쓰는 최소 판정(로드 순서 비의존).
  function fallbackDetectLang(text) {
    const c = scriptCounts(text);
    if (!c.letters) return null;
    if (c.hangul / c.letters >= 0.5) return 'ko';
    if (c.hiragana + c.katakana > 0) return 'ja';
    if (c.han / c.letters >= 0.5) return 'zh';
    if (c.latin / c.letters >= 0.5) return 'en';
    return null;
  }

  function detectLang(text) {
    const KT = globalThis.KT;
    const fn = (KT && KT.lib && (KT.lib.detectLang || (KT.lib.lang && KT.lib.lang.detectLang))) || null;
    if (typeof fn === 'function') return fn(text);
    return fallbackDetectLang(text);
  }

  globalThis.KT = globalThis.KT || {};
  globalThis.KT.text = { cleanText, isNonlinguistic, withOuterWhitespace, scriptCounts, hangulRatio, detectLang };
  Object.assign(globalThis.KT, { cleanText, isNonlinguistic, withOuterWhitespace, scriptCounts, hangulRatio, detectLang });
})();
