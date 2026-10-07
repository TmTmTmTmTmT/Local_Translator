// 언어 표(스크립트 정규식·프롬프트 보충)와 스크립트 카운트 기반 원문 언어 판정(meeco 방식). 순수 함수.
(function () {
  'use strict';

  const LANGS = {
    en: { script: /\p{Script=Latin}/u, promptNotes: '' },
    ja: {
      script: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
      promptNotes: '일본어 원문의 경어 수준(다메구치/です・ます/존경·겸양)을 한국어 존댓말 수준(반말/해요체/합쇼체)에 대응시킨다.',
    },
    zh: {
      script: /\p{Script=Han}/u,
      promptNotes: '중국어 원문의 한자어를 그대로 직역하지 말고 자연스러운 한국어 표현으로 옮기며, 고유명사는 한국에서 통용되는 표기를 우선한다.',
    },
    ko: { script: /\p{Script=Hangul}/u, promptNotes: '' },
  };

  // 간체/번체 전용 문자(상대 체계에서 쓰이지 않는 것만).
  const SIMPLIFIED_ONLY = new Set(Array.from('这们个国说为时会对学发经现来过还进动应无关长门问间开东车马书语读见电么样头业买卖气儿点体术变认让设该单写听厂区医协压历厅号欢乐种爱边运远达称员观录织约级纪终线给络统继续导热较证识湾坏护确课谁请调试话详论译'));
  const TRADITIONAL_ONLY = new Set(Array.from('這們個國說為時會對學發經現來過還進動應無關長門問間開東車馬書語讀見電麼樣頭業買賣氣兒點體術變認讓設該單寫聽廠區醫協壓歷廳號歡樂種愛邊運遠達稱員觀錄織約級紀終線給絡統繼續導熱較證識灣壞護確課誰請調試話詳論譯'));
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
