// 용어집(PLAN §11.3): 엔진 호출 직전 t 항목에 사전 치환을 적용하고, 적용된 용어 쌍으로 프롬프트 힌트·캐시 키 조각을 만든다.
(function () {
  'use strict';
  const MAX_TERMS = 500;
  const MAX_SRC = 80;
  const CJK_RE = /[\u1100-\u11ff\u3040-\u30ff\u3130-\u318f\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af\uf900-\ufaff]/;
  const WORD_RE = /[A-Za-z0-9_]/;

  const baseLang = (l) => String(l || '').split('-')[0];

  function normalize(list) {
    if (!Array.isArray(list)) return [];
    const out = [];
    const seen = new Set();
    for (const t of list) {
      if (out.length >= MAX_TERMS) break;
      if (!t || typeof t !== 'object' || typeof t.src !== 'string' || typeof t.dst !== 'string') continue;
      const src = t.src.trim();
      const dst = t.dst.trim();
      if (!src || src.length > MAX_SRC || !dst) continue;
      const lang = typeof t.lang === 'string' && t.lang.trim() ? baseLang(t.lang.trim()) : null;
      const key = src.toLowerCase() + '\u0000' + (lang || '');
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ src, dst, lang, case: t.case === true });
    }
    return out;
  }

  // 겹침 금지·재스캔 금지: 원문 위치를 한 번만 훑고, 위치마다 긴 용어부터 시도한다.
  function replaceText(text, index) {
    let out = '';
    let last = 0;
    let i = 0;
    let hit = false;
    while (i < text.length) {
      const cands = index.get(text[i].toLowerCase());
      let matched = null;
      if (cands) {
        for (const t of cands) {
          const end = i + t.src.length;
          if (end > text.length) continue;
          const seg = text.slice(i, end);
          if (t.case ? seg !== t.src : seg.toLowerCase() !== t.lower) continue;
          if (!t.cjk) {
            if (i > 0 && WORD_RE.test(text[i - 1])) continue;
            if (end < text.length && WORD_RE.test(text[end])) continue;
          }
          matched = t;
          break;
        }
      }
      if (matched) {
        out += text.slice(last, i) + matched.dst;
        i += matched.src.length;
        last = i;
        hit = true;
        matched.used = true;
      } else i++;
    }
    return hit ? out + text.slice(last) : text;
  }

  function applyToItems(items, lang, terms) {
    if (!Array.isArray(terms) || !terms.length || !Array.isArray(items)) return { items, applied: [] };
    const bl = baseLang(lang);
    const active = terms
      .filter((t) => !t.lang || t.lang === bl)
      .map((t) => ({ src: t.src, dst: t.dst, case: t.case === true, lower: t.src.toLowerCase(), cjk: CJK_RE.test(t.src), used: false }))
      .sort((a, b) => b.src.length - a.src.length);
    if (!active.length) return { items, applied: [] };
    const index = new Map();
    for (const t of active) {
      const k = t.src[0].toLowerCase();
      if (!index.has(k)) index.set(k, []);
      index.get(k).push(t);
    }
    let changed = false;
    const next = items.map((it) => {
      if (!it || it.k !== 't' || typeof it.text !== 'string') return it;
      const text = replaceText(it.text, index);
      if (text === it.text) return it;
      changed = true;
      return Object.assign({}, it, { text });
    });
    if (!changed) return { items, applied: [] };
    const seen = new Set();
    const applied = [];
    for (const t of active) {
      if (!t.used) continue;
      const k = t.src + '\u0000' + t.dst;
      if (seen.has(k)) continue;
      seen.add(k);
      applied.push([t.src, t.dst]);
    }
    applied.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
    return { items: next, applied };
  }

  function hintFor(applied) {
    if (!Array.isArray(applied) || !applied.length) return '';
    return '\uc6a9\uc5b4\uc9d1(\ubc18\ub4dc\uc2dc \uc9c0\ud0ac \uac83): ' + applied.map((p) => `${p[0]} \u2192 ${p[1]}`).join('; ');
  }

  function fnv(str) {
    const h = globalThis.KT && globalThis.KT.lib && globalThis.KT.lib.hash;
    if (h && h.fnv1a64Hex) return h.fnv1a64Hex(str);
    const bytes = new TextEncoder().encode(str);
    let x = 0xcbf29ce484222325n;
    for (const b of bytes) x = ((x ^ BigInt(b)) * 0x100000001b3n) & 0xffffffffffffffffn;
    return x.toString(16).padStart(16, '0');
  }

  function appliedKey(applied) {
    if (!Array.isArray(applied) || !applied.length) return '';
    return fnv(JSON.stringify(applied));
  }

  const api = { MAX_TERMS, MAX_SRC, normalize, applyToItems, hintFor, appliedKey };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.lib = globalThis.KT.lib || {};
  globalThis.KT.lib.glossary = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
