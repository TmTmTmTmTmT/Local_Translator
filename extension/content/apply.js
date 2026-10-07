// 번역 적용: 텍스트 노드 nodeValue 교체 + 블록 lang/data-kt 속성만 변경(PLAN §4.4). 요소 생성·이동·삭제 없음.
(function () {
  'use strict';

  const KT = (globalThis.KT = globalThis.KT || {});
  const MAX_REAPPLY = 3;

  function createApplier() {
    const recs = new Map(); // node -> {node, original, translated, el, reapply, gaveUp}
    const langBackup = new WeakMap(); // el -> 원래 lang 속성(null = 없음)
    let mode = 'translation';
    const stats = { applied: 0, errors: 0, skipped: 0, reapplied: 0, gaveUp: 0 };

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

    function markPending(blockRec) { setState(blockRec.el, 'pending'); }
    function markError(blockRec) { stats.errors++; setState(blockRec.el, 'error'); }

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
        const { node, original } = slots[i];
        // 페이지가 그 사이 바꿨거나 제거한 노드는 건드리지 않음
        if (!node.isConnected || node.nodeValue !== original) { skipped++; stats.skipped++; continue; }
        const translated = KT.text.withOuterWhitespace(original, v);
        const rec = { node, original, translated, el: blockRec.el, reapply: 0, gaveUp: false };
        recs.set(node, rec);
        if (mode === 'translation') node.nodeValue = translated;
        applied++; stats.applied++;
      }
      if (applied > 0) {
        if (mode === 'translation') setLang(blockRec.el, true);
        setState(blockRec.el, 'done');
        return { status: 'done', applied, skipped, missing };
      }
      return { status: 'skipped', applied, skipped, missing };
    }

    function showOriginal() {
      mode = 'original';
      const els = new Set();
      for (const r of recs.values()) {
        if (r.node.isConnected && r.node.nodeValue === r.translated) r.node.nodeValue = r.original;
        els.add(r.el);
      }
      for (const el of els) setLang(el, false);
    }
    function showTranslation() {
      mode = 'translation';
      const els = new Set();
      for (const r of recs.values()) {
        if (r.node.isConnected && r.node.nodeValue === r.original) r.node.nodeValue = r.translated;
        els.add(r.el);
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
    function forget(node) { return recs.delete(node); }
    function prune() {
      let n = 0;
      for (const [node] of recs) if (!node.isConnected) { recs.delete(node); n++; }
      return n;
    }

    return {
      apply, showOriginal, showTranslation, reapply, isOwnValue, forget, prune, markPending, markError, get,
      has: (node) => recs.has(node),
      get mode() { return mode; },
      get records() { return Array.from(recs.values()); },
      stats,
    };
  }

  KT.apply = { createApplier, MAX_REAPPLY };
  KT.createApplier = createApplier;
})();
