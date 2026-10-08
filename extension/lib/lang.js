// 언어 표(스크립트 정규식·프롬프트 보충)와 스크립트 카운트 기반 원문 언어 판정(meeco 방식). 순수 함수.
(function () {
  'use strict';

  const LANGS = {
    en: { script: /\p{Script=Latin}/u, promptNotes: '' },
    ja: {
      script: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
      promptNotes: '\uc77c\ubcf8\uc5b4 \uc6d0\ubb38\uc758 \uacbd\uc5b4 \uc218\uc900(\ub2e4\uba54\uad6c\uce58/\u3067\u3059\u30fb\u307e\u3059/\uc874\uacbd\u00b7\uacb8\uc591)\uc744 \ud55c\uad6d\uc5b4 \uc874\ub313\ub9d0 \uc218\uc900(\ubc18\ub9d0/\ud574\uc694\uccb4/\ud569\uc1fc\uccb4)\uc5d0 \ub300\uc751\uc2dc\ud0a8\ub2e4.',
    },
    zh: {
      script: /\p{Script=Han}/u,
      promptNotes: '\uc911\uad6d\uc5b4 \uc6d0\ubb38\uc758 \ud55c\uc790\uc5b4\ub97c \uadf8\ub300\ub85c \uc9c1\uc5ed\ud558\uc9c0 \ub9d0\uace0 \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \ud55c\uad6d\uc5b4 \ud45c\ud604\uc73c\ub85c \uc62e\uae30\uba70, \uace0\uc720\uba85\uc0ac\ub294 \ud55c\uad6d\uc5d0\uc11c \ud1b5\uc6a9\ub418\ub294 \ud45c\uae30\ub97c \uc6b0\uc120\ud55c\ub2e4.',
    },
    ko: { script: /\p{Script=Hangul}/u, promptNotes: '' },
  };

  // 간체/번체 전용 문자(상대 체계에서 쓰이지 않는 것만).
  const SIMPLIFIED_ONLY = new Set(Array.from('\u8fd9\u4eec\u4e2a\u56fd\u8bf4\u4e3a\u65f6\u4f1a\u5bf9\u5b66\u53d1\u7ecf\u73b0\u6765\u8fc7\u8fd8\u8fdb\u52a8\u5e94\u65e0\u5173\u957f\u95e8\u95ee\u95f4\u5f00\u4e1c\u8f66\u9a6c\u4e66\u8bed\u8bfb\u89c1\u7535\u4e48\u6837\u5934\u4e1a\u4e70\u5356\u6c14\u513f\u70b9\u4f53\u672f\u53d8\u8ba4\u8ba9\u8bbe\u8be5\u5355\u5199\u542c\u5382\u533a\u533b\u534f\u538b\u5386\u5385\u53f7\u6b22\u4e50\u79cd\u7231\u8fb9\u8fd0\u8fdc\u8fbe\u79f0\u5458\u89c2\u5f55\u7ec7\u7ea6\u7ea7\u7eaa\u7ec8\u7ebf\u7ed9\u7edc\u7edf\u7ee7\u7eed\u5bfc\u70ed\u8f83\u8bc1\u8bc6\u6e7e\u574f\u62a4\u786e\u8bfe\u8c01\u8bf7\u8c03\u8bd5\u8bdd\u8be6\u8bba\u8bd1'));
  const TRADITIONAL_ONLY = new Set(Array.from('\u9019\u5011\u500b\u570b\u8aaa\u70ba\u6642\u6703\u5c0d\u5b78\u767c\u7d93\u73fe\u4f86\u904e\u9084\u9032\u52d5\u61c9\u7121\u95dc\u9577\u9580\u554f\u9593\u958b\u6771\u8eca\u99ac\u66f8\u8a9e\u8b80\u898b\u96fb\u9ebc\u6a23\u982d\u696d\u8cb7\u8ce3\u6c23\u5152\u9ede\u9ad4\u8853\u8b8a\u8a8d\u8b93\u8a2d\u8a72\u55ae\u5beb\u807d\u5ee0\u5340\u91ab\u5354\u58d3\u6b77\u5ef3\u865f\u6b61\u6a02\u7a2e\u611b\u908a\u904b\u9060\u9054\u7a31\u54e1\u89c0\u9304\u7e54\u7d04\u7d1a\u7d00\u7d42\u7dda\u7d66\u7d61\u7d71\u7e7c\u7e8c\u5c0e\u71b1\u8f03\u8b49\u8b58\u7063\u58de\u8b77\u78ba\u8ab2\u8ab0\u8acb\u8abf\u8a66\u8a71\u8a73\u8ad6\u8b6f'));
  // 위 두 집합에서 상대 쪽과 겹치는 글자(예: 時·會처럼 한쪽이 공유되는 것)는 제거해 전용 문자만 남긴다.
  for (const c of Array.from(SIMPLIFIED_ONLY)) if (TRADITIONAL_ONLY.has(c)) { SIMPLIFIED_ONLY.delete(c); TRADITIONAL_ONLY.delete(c); }

  const URL_RE = /(?:https?:\/\/|www\.)\S+/gi;
  const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/g;

  function stripNoise(text) {
    return String(text == null ? '' : text).replace(URL_RE, ' ').replace(EMAIL_RE, ' ');
  }

  function scriptCounts(text) {
    const c = { hangul: 0, hiragana: 0, katakana: 0, han: 0, latin: 0, letters: 0, simplified: 0, traditional: 0 };
    for (const ch of stripNoise(text)) {
      if (!/\p{L}/u.test(ch)) continue;
      c.letters++;
      if (/\p{Script=Hangul}/u.test(ch)) c.hangul++;
      else if (/\p{Script=Hiragana}/u.test(ch)) c.hiragana++;
      else if (/\p{Script=Katakana}/u.test(ch)) c.katakana++;
      else if (/\p{Script=Han}/u.test(ch)) {
        c.han++;
        if (SIMPLIFIED_ONLY.has(ch)) c.simplified++;
        else if (TRADITIONAL_ONLY.has(ch)) c.traditional++;
      } else if (/\p{Script=Latin}/u.test(ch)) c.latin++;
    }
    return c;
  }

  // -> {lang: "en"|"ja"|"zh"|"ko"|null, variant: "zh-Hans"|"zh-Hant"|"unknown"|null}
  function detectLangEx(text) {
    const c = scriptCounts(text);
    if (c.letters === 0) return { lang: null, variant: null };
    if (c.hangul / c.letters >= 0.5) return { lang: 'ko', variant: null };
    if (c.hiragana + c.katakana > 0) return { lang: 'ja', variant: null };
    if (c.han > 0 && c.han / c.letters >= 0.5 && c.han > c.latin) {
      let variant = 'unknown';
      if (c.simplified >= 2 && c.simplified > c.traditional) variant = 'zh-Hans';
      else if (c.traditional >= 2 && c.traditional > c.simplified) variant = 'zh-Hant';
      return { lang: 'zh', variant };
    }
    if (c.latin > 0 && c.latin / c.letters >= 0.5) return { lang: 'en', variant: null };
    return { lang: null, variant: null };
  }

  function detectLang(text) { return detectLangEx(text).lang; }

  const api = { LANGS, scriptCounts, detectLang, detectLangEx };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.lib = globalThis.KT.lib || {};
  globalThis.KT.lib.lang = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
