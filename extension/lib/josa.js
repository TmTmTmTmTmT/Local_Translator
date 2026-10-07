// 한국어 조사 선택: 받침 유무로 은/는·이/가·을/를·와/과·(으)로·이다를 결정. 판정 로직은 자체 구현(유니코드 종성 인덱스).
(function () {
  'use strict';

  const BASE = 0xac00, LAST = 0xd7a3;
  const RIEUL = 8; // 종성 ㄹ 인덱스

  // 한글 음절의 종성 인덱스(0=받침 없음). 음절이 아니면 -1.
  function jongseong(ch) {
    const c = String(ch == null ? '' : ch).charCodeAt(0);
    return c >= BASE && c <= LAST ? (c - BASE) % 28 : -1;
  }
  function isHangulSyllable(ch) { return jongseong(ch) >= 0; }
  function hasBatchim(ch) { return jongseong(ch) > 0; }

  // [받침 있을 때, 없을 때]. (으)로는 ㄹ받침을 없는 것으로 취급.
  const FORMS = {
    '은': ['은', '는'], '는': ['은', '는'], '이': ['이', '가'], '가': ['이', '가'],
    '을': ['을', '를'], '를': ['을', '를'], '와': ['과', '와'], '과': ['과', '와'],
    '으로': ['으로', '로'], '로': ['으로', '로'], '이다': ['이다', '다'], '다': ['이다', '다'],
  };
  // 표기된 병기형 -> 기준 키
  const PAIRS = {
    '은(는)': '은', '는(은)': '은', '이(가)': '이', '가(이)': '이', '을(를)': '을', '를(을)': '을',
    '와(과)': '와', '과(와)': '와', '으로(로)': '으로', '(으)로': '으로',
  };

  // pair: '은(는)' 같은 병기형 또는 '은'/'는' 같은 한쪽 형태. prevChar가 한글 음절이 아니면 null(추측 안 함).
  function resolveParticle(prevChar, pair) {
    const key = PAIRS[pair] || pair;
    const forms = FORMS[key];
    const j = jongseong(prevChar);
    if (!forms || j < 0) return null;
    const withB = key === '으로' ? j > 0 && j !== RIEUL : j > 0;
    return withB ? forms[0] : forms[1];
  }

  const PAIR_RE = /은\(는\)|는\(은\)|이\(가\)|가\(이\)|을\(를\)|를\(을\)|와\(과\)|과\(와\)|으로\(로\)|\(으\)로/;
  const INNER_RE = new RegExp('([\\uAC00-\\uD7A3])(' + PAIR_RE.source + ')', 'g');
  const LEAD_RE = new RegExp('^(' + PAIR_RE.source + ')');

  // 한글 음절 바로 뒤에 붙은 병기형만 단일형으로 확정. 이미 단일형이면 변화 없음(멱등).
  function fixPairedParticles(str) {
    const s = String(str == null ? '' : str);
    if (s.indexOf('(') < 0) return s;
    return s.replace(INNER_RE, (_m, prev, pair) => prev + resolveParticle(prev, pair));
  }

  // 문자열이 병기형으로 시작하고 prevText 끝이 한글 음절이면 선두 병기형을 단일형으로. 아니면 그대로.
  function fixLeadingParticle(prevText, str) {
    const s = String(str == null ? '' : str);
    const p = String(prevText == null ? '' : prevText);
    const m = LEAD_RE.exec(s);
    if (!m || !p) return s;
    const r = resolveParticle(p[p.length - 1], m[1]);
    return r ? r + s.slice(m[1].length) : s;
  }

  const api = { hasBatchim, isHangulSyllable, resolveParticle, fixPairedParticles, fixLeadingParticle };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.lib = globalThis.KT.lib || {};
  globalThis.KT.lib.josa = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
