// 한국어 조사 선택: 받침 유무로 은/는·이/가·을/를·와/과·(으)로·이다를 결정(유니코드 종성 인덱스, 자체 구현).
(function () {
  'use strict';

  // 한글 음절의 종성 인덱스(0=받침 없음). 음절이 아니면 -1.
  function jongseong(ch) {
    const c = String(ch == null ? '' : ch).charCodeAt(0);
    return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : -1;
  }

  // [받침 있을 때, 없을 때]
  const FORMS = {};
  for (const [a, b] of [['은', '는'], ['이', '가'], ['을', '를'], ['과', '와'], ['으로', '로'], ['이다', '다']]) FORMS[a] = FORMS[b] = [a, b];
  // 표기된 병기형 -> 기준 키
  const PAIRS = {
    '은(는)': '은', '는(은)': '은', '이(가)': '이', '가(이)': '이', '을(를)': '을', '를(을)': '을',
    '와(과)': '와', '과(와)': '와', '으로(로)': '으로', '(으)로': '으로',
  };

  // pair: '은(는)' 같은 병기형 또는 한쪽 형태. prevChar가 한글 음절이 아니면 null(추측 안 함). (으)로는 ㄹ받침을 없는 것으로 취급.
  function resolveParticle(prevChar, pair) {
    const key = PAIRS[pair] || pair;
    const forms = FORMS[key];
    const j = jongseong(prevChar);
    if (!forms || j < 0) return null;
    return (key === '으로' ? j > 0 && j !== 8 : j > 0) ? forms[0] : forms[1];
  }

  const PAIR_RE = Object.keys(PAIRS).map((k) => k.replace(/[()]/g, '\\$&')).join('|');
  const INNER_RE = new RegExp('([\\uAC00-\\uD7A3])(' + PAIR_RE + ')', 'g');
  const LEAD_RE = new RegExp('^(' + PAIR_RE + ')');

  // 한글 음절 바로 뒤에 붙은 병기형만 단일형으로 확정. 이미 단일형이면 변화 없음(멱등).
  function fixPairedParticles(str) {
    const s = String(str == null ? '' : str);
    return s.indexOf('(') < 0 ? s : s.replace(INNER_RE, (_m, prev, pair) => prev + resolveParticle(prev, pair));
  }

  // 문자열이 병기형으로 시작하고 prevText 끝이 한글 음절이면 선두 병기형을 단일형으로. 아니면 그대로.
  function fixLeadingParticle(prevText, str) {
    const s = String(str == null ? '' : str), p = String(prevText == null ? '' : prevText);
    const m = LEAD_RE.exec(s);
    const r = m && p && resolveParticle(p[p.length - 1], m[1]);
    return r ? r + s.slice(m[1].length) : s;
  }

  const api = { hasBatchim: (ch) => jongseong(ch) > 0, isHangulSyllable: (ch) => jongseong(ch) >= 0, resolveParticle, fixPairedParticles, fixLeadingParticle };
  const KT = (globalThis.KT = globalThis.KT || {});
  (KT.lib = KT.lib || {}).josa = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
