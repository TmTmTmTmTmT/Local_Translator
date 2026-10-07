// 번역 적용: 텍스트 노드 nodeValue 교체 + 블록 lang/data-kt 속성만 변경(PLAN §4.4). 요소 생성·이동·삭제 없음.
// 옵션 translateAttrs 사용 시에 한해 같은 요소의 title/alt 등 속성 값도 setAttribute로 교체(원문 기록, 토글 복원).
(function () {
  'use strict';

  const KT = (globalThis.KT = globalThis.KT || {});
  const MAX_REAPPLY = 3;

  // 슬롯 값 읽기/쓰기: 텍스트 노드(nodeValue) 또는 속성 슬롯({attr}).
  function rd(r) { return r.attr ? r.node.getAttribute(r.attr) : r.node.nodeValue; }
  function wr(r, v) { if (r.attr) r.node.setAttribute(r.attr, v); else r.node.nodeValue = v; }

  function createApplier(aopts) {
    const fixP = !(aopts && aopts.fixParticles === false);
    const recs = new Map(); // node(텍스트) 또는 slot(속성) -> {node, attr, original, translated, el, reapply, gaveUp}
    const langBackup = new WeakMap(); // el -> 원래 lang 속성(null = 없음)
    let mode = 'translation';
    const stats = { particlesFixed: 0, applied: 0, errors: 0, skipped: 0, reapplied: 0, gaveUp: 0 };

    function setLang(el, on) {
      if (!el || !el.setAttribute) return;
      if (on) {
        if (!langBackup.has(el)) langBackup.set(el, el.hasAttribute('lang') ? el.getAttribute('lang') : null);
        el.setAttribute('lang', 'ko');
      } else if (langBackup.has(el)) {
        const v = langBackup.get(el);
        langBackup.delete(el);
        if (v === null) el.removeAttribute('lang'); else el.setAttribute('lang', v);
      }
    }
    function setState(el, s) { if (el && el.setAttribute) el.setAttribute('data-kt', s); }

    function get(key) { return key.nodeType ? recs.get(key) : undefined; }
    function slotValue(slotMap, i) {
      if (!slotMap) return undefined;
      const v = slotMap instanceof Map ? (slotMap.has(i) ? slotMap.get(i) : slotMap.get(String(i))) : slotMap[String(i)];
      return typeof v === 'string' ? v : undefined;
    }

    function markPending(blockRec) { if (!blockRec.attr) setState(blockRec.el, 'pending'); }
    function markError(blockRec) { stats.errors++; if (!blockRec.attr) setState(blockRec.el, 'error'); }

    // 슬롯 i 바로 앞 항목이 x(링크·코드)이고 번역문이 병기 조사로 시작하면 x 마지막 글자로 확정. 슬롯 내부 병기도 정리.
    function fixSlot(blockRec, i, v) {
      const J = KT.lib && KT.lib.josa;
      if (!fixP || !J || blockRec.attr) return v; // 문자열이면 변경 없음
      const items = blockRec.block.items;
      let prev = null;
      for (let k = 0; k < items.length; k++) {
        if (items[k].k === 't' && items[k].i === i) { prev = k > 0 ? items[k - 1] : null; break; }
      }
      const v0 = v.trimStart();
      let out = v0, lead = false;
      if (prev && prev.k === 'x') { out = J.fixLeadingParticle(prev.text, v0); lead = out !== v0; }
      out = J.fixPairedParticles(out);
      if (out === v0) return v;
      stats.particlesFixed++;
      return { text: out, lead }; // lead: 조사는 x에 붙여 쓰므로 원문 앞 공백을 이식하지 않음
    }

    // 반환 {status:'done'|'error'|'skipped', applied, skipped, missing}
    function apply(blockRec, slotMap) {
      const slots = blockRec.slots;
      const total = slots.length;
      let missing = 0;
      for (let i = 0; i < total; i++) if (slotValue(slotMap, i) === undefined) missing++;
      if (total === 0 || missing * 2 >= total) { // 절반 이상 누락: 블록 전체 원문 유지
        markError(blockRec);
        return { status: 'error', applied: 0, skipped: 0, missing };
      }
      let applied = 0, skipped = 0;
      for (let i = 0; i < total; i++) {
        const v = slotValue(slotMap, i);
        if (v === undefined) continue;
        const slot = slots[i];
        const { node, original } = slot;
        const rec = { node, attr: slot.attr || null, original, translated: '', el: blockRec.el, reapply: 0, gaveUp: false };
        // 페이지가 그 사이 바꿨거나 제거한 노드는 건드리지 않음
        if (!node.isConnected || rd(rec) !== original) { skipped++; stats.skipped++; continue; }
        const fx = fixSlot(blockRec, i, v);
        rec.translated = typeof fx === 'string' ? KT.text.withOuterWhitespace(original, fx)
          : KT.text.withOuterWhitespace(fx.lead ? original.replace(/^\s+/, '') : original, fx.text);
        recs.set(rec.attr ? slot : node, rec);
        if (mode === 'translation') wr(rec, rec.translated);
        applied++; stats.applied++;
      }
      if (applied > 0) {
        if (!blockRec.attr) {
          if (mode === 'translation') setLang(blockRec.el, true);
          setState(blockRec.el, 'done');
        }
        return { status: 'done', applied, skipped, missing };
      }
      return { status: 'skipped', applied, skipped, missing };
    }

    function showOriginal() {
      mode = 'original';
      const els = new Set();
      for (const r of recs.values()) {
        if (r.node.isConnected && rd(r) === r.translated) wr(r, r.original);
        if (!r.attr) els.add(r.el);
      }
      for (const el of els) setLang(el, false);
    }
    function showTranslation() {
      mode = 'translation';
      const els = new Set();
      for (const r of recs.values()) {
        if (r.node.isConnected && rd(r) === r.original) wr(r, r.translated);
        if (!r.attr) els.add(r.el);
      }
      for (const el of els) setLang(el, true);
    }

    // 페이지가 값을 원문으로 되돌렸을 때 재적용. 노드당 3회 제한.
    function reapply(node) {
      const r = recs.get(node);
      if (!r || mode !== 'translation' || r.gaveUp) return 'ignored';
      if (node.nodeValue !== r.original) return 'ignored';
      if (r.reapply >= MAX_REAPPLY) {
        r.gaveUp = true;
        stats.gaveUp++;
        setState(r.el, 'error');
        return 'gaveup';
      }
      r.reapply++;
      stats.reapplied++;
      node.nodeValue = r.translated;
      return 'reapplied';
    }

    // 노드 값이 우리 쓰기(원문/번역문)인지 판정: MutationObserver 자기 변경 무시용
    function isOwnValue(node) {
      const r = recs.get(node);
      return !!r && (node.nodeValue === r.translated || node.nodeValue === r.original);
    }
    // 현재 모드에서 우리가 방금 쓴 값인가(MutationObserver 루프 가드).
    function isOwnWrite(node) {
      const r = recs.get(node);
      return !!r && node.nodeValue === (mode === 'translation' ? r.translated : r.original);
    }
    function forget(node) { return recs.delete(node); }
    function prune() {
      let n = 0;
      for (const [key, r] of recs) if (!r.node.isConnected) { recs.delete(key); n++; }
      return n;
    }

    return {
      apply, showOriginal, showTranslation, reapply, isOwnValue, isOwnWrite, forget, prune, markPending, markError, get,
      has: (node) => recs.has(node),
      get mode() { return mode; },
      get records() { return Array.from(recs.values()); },
      stats,
    };
  }

  KT.apply = { createApplier, MAX_REAPPLY };
  KT.createApplier = createApplier;
})();
