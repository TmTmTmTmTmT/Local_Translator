// 엔진 공용 헬퍼: 에러 객체, 공백 보존, MT용 x-경계 구간 분할(PLAN §4.4), sleep.
(function () {
  'use strict';

  function makeError(code, message, extra) {
    return Object.assign({ code, message: message || code }, extra || {});
  }

  // 원문 앞뒤 공백을 번역문에 이식 (KT.text.withOuterWhitespace와 동일 동작; 엔진은 content 스크립트 비의존).
  function withOuterWhitespace(original, translated) {
    const lead = original.match(/^\s*/)[0];
    const trail = original.slice(lead.length).match(/\s*$/)[0];
    return lead + translated.trim() + trail;
  }

  const hasLetters = (s) => /\p{L}/u.test(s);

  // 블록을 x 항목 경계로 나눈 t-슬롯 연속 구간들.
  function planSegments(block) {
    const segs = [];
    let cur = null;
    for (const it of block.items) {
      if (it.k === 't') {
        if (!cur) { cur = { slotIdx: [], texts: [] }; segs.push(cur); }
        cur.slotIdx.push(it.i);
        cur.texts.push(it.text);
      } else cur = null;
    }
    return segs.map((s) => {
      const text = s.texts.join('');
      return { slotIdx: s.slotIdx, texts: s.texts, text, translatable: hasLetters(text) };
    });
  }

  // 구간 전체 번역을 첫 슬롯에, 나머지는 "". 번역 불가(문자 없음) 구간은 원문 유지, 번역 누락 구간은 키 생략.
  function assemblePlain(segments, translations) {
    const slots = {};
    segments.forEach((seg, k) => {
      if (!seg.translatable) {
        seg.slotIdx.forEach((i, j) => { slots[String(i)] = seg.texts[j]; });
        return;
      }
      const tr = translations[k];
      if (typeof tr !== 'string' || !tr.trim()) return;
      seg.slotIdx.forEach((i, j) => { slots[String(i)] = j === 0 ? withOuterWhitespace(seg.text, tr) : ''; });
    });
    return slots;
  }

  // 배치 전체를 보낼 텍스트 목록으로 평탄화. refs[k] = [blockIdx, segIdx].
  function planBatch(blocks) {
    const plans = blocks.map(planSegments);
    const texts = [];
    const refs = [];
    plans.forEach((segs, bi) => segs.forEach((s, si) => {
      if (s.translatable) { texts.push(s.text.trim()); refs.push([bi, si]); }
    }));
    return { plans, texts, refs };
  }

  // -> Map<blockId, slots>. 슬롯이 하나도 안 나온 블록은 Map에서 제외(원문 유지).
  function assembleBatch(blocks, plan, translations) {
    const per = plan.plans.map((segs) => new Array(segs.length).fill(null));
    plan.refs.forEach(([bi, si], k) => { per[bi][si] = translations[k]; });
    const out = new Map();
    blocks.forEach((b, bi) => {
      const slots = assemblePlain(plan.plans[bi], per[bi]);
      if (Object.keys(slots).length) out.set(b.id, slots);
    });
    return out;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const api = { makeError, withOuterWhitespace, hasLetters, planSegments, assemblePlain, planBatch, assembleBatch, sleep };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.engines = Object.assign(globalThis.KT.engines || {}, api);
  if (typeof module !== 'undefined') module.exports = api;
})();
