// 번역 적용: 텍스트 노드 nodeValue 교체 + 블록 lang/data-kt 속성만 변경(PLAN §4.4). 요소 생성·이동·삭제 없음.
// 속성 슬롯({attr})은 extra.js가 만든 경우에만 존재: 같은 요소의 title/alt 등을 setAttribute로 교체(원문 기록, 토글 복원).
(function () {
  'use strict';

  const KT = (globalThis.KT = globalThis.KT || {});
  const MAX_REAPPLY = 3;

  const rd = (r) => (r.attr ? r.node.getAttribute(r.attr) : r.node.nodeValue);
  function wr(r, v) { if (r.attr) r.node.setAttribute(r.attr, v); else r.node.nodeValue = v; }
  const setState = (el, s) => el.setAttribute('data-kt', s);

  function createApplier(aopts) {
    const fixP = !(aopts && aopts.fixParticles === false);
    const recs = new Map(); // node(텍스트) 또는 slot(속성) -> {node, attr, original, translated, el, reapply, gaveUp}
    const langBackup = new WeakMap(); // el -> 원래 lang 속성(null = 없음)
    let mode = 'translation';

    function setLang(el, on) {
      if (on) {
        if (!langBackup.has(el)) langBackup.set(el, el.getAttribute('lang'));
        el.setAttribute('lang', 'ko');
      } else if (langBackup.has(el)) {
        const v = langBackup.get(el);
        langBackup.delete(el);
        if (v === null) el.removeAttribute('lang'); else el.setAttribute('lang', v);
      }
    }

    function slotValue(slotMap, i) {
      const v = slotMap && (slotMap instanceof Map ? (slotMap.has(i) ? slotMap.get(i) : slotMap.get(String(i))) : slotMap[String(i)]);
      return typeof v === 'string' ? v : undefined;
    }

    // 슬롯 i 바로 앞 항목이 x(링크·코드)이고 번역문이 병기 조사로 시작하면 x 마지막 글자로 확정. 슬롯 내부 병기도 정리.
    // 반환: 변경 없으면 v(문자열), 아니면 {text, lead}. lead: 조사는 x에 붙여 쓰므로 원문 앞 공백을 이식하지 않음.
    function fixSlot(blockRec, i, v) {
      const J = KT.lib && KT.lib.josa;
      if (!fixP || !J || blockRec.attr) return v;
      const items = blockRec.block.items;
      const k = items.findIndex((x) => x.k === 't' && x.i === i);
      const prev = k > 0 ? items[k - 1] : null;
      const v0 = v.trimStart();
      let out = v0, lead = false;
      if (prev && prev.k === 'x') { out = J.fixLeadingParticle(prev.text, v0); lead = out !== v0; }
      out = J.fixPairedParticles(out);
      return out === v0 ? v : { text: out, lead };
    }

    // 반환 {status:'done'|'error'|'skipped', applied, skipped, missing}
    function apply(blockRec, slotMap) {
      const slots = blockRec.slots;
      const total = slots.length;
      let missing = 0, applied = 0, skipped = 0;
      for (let i = 0; i < total; i++) if (slotValue(slotMap, i) === undefined) missing++;
      if (total === 0 || missing * 2 >= total) { // 절반 이상 누락: 블록 전체 원문 유지
        markError(blockRec);
        return { status: 'error', applied, skipped, missing };
      }
      for (let i = 0; i < total; i++) {
        const v = slotValue(slotMap, i);
        if (v === undefined) continue;
        const slot = slots[i];
        const { node, original } = slot;
        const rec = { node, attr: slot.attr || null, original, translated: '', el: blockRec.el, reapply: 0, gaveUp: false };
        // 페이지가 그 사이 바꿨거나 제거한 노드는 건드리지 않음
        if (!node.isConnected || rd(rec) !== original) { skipped++; continue; }
        const fx = fixSlot(blockRec, i, v);
        const W = KT.text.withOuterWhitespace;
        rec.translated = typeof fx === 'string' ? W(original, fx) : W(fx.lead ? original.replace(/^\s+/, '') : original, fx.text);
        recs.set(rec.attr ? slot : node, rec);
        if (mode === 'translation') wr(rec, rec.translated);
        applied++;
      }
      if (!applied) return { status: 'skipped', applied, skipped, missing };
      if (!blockRec.attr) {
        if (mode === 'translation') setLang(blockRec.el, true);
        setState(blockRec.el, 'done');
      }
      return { status: 'done', applied, skipped, missing };
    }

    function markPending(blockRec) { if (!blockRec.attr) setState(blockRec.el, 'pending'); }
    function markError(blockRec) { if (!blockRec.attr) setState(blockRec.el, 'error'); }

    function setMode(m) {
      mode = m;
      const from = m === 'original' ? 'translated' : 'original', to = m === 'original' ? 'original' : 'translated';
      const els = new Set();
      for (const r of recs.values()) {
        if (r.node.isConnected && rd(r) === r[from]) wr(r, r[to]);
        if (!r.attr) els.add(r.el);
      }
      for (const el of els) setLang(el, m === 'translation');
    }

    // 페이지가 값을 원문으로 되돌렸을 때 재적용. 노드당 3회 제한.
    function reapply(node) {
      const r = recs.get(node);
      if (!r || mode !== 'translation' || r.gaveUp || node.nodeValue !== r.original) return 'ignored';
      if (r.reapply >= MAX_REAPPLY) {
        r.gaveUp = true;
        setState(r.el, 'error');
        return 'gaveup';
      }
      r.reapply++;
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
    function prune() {
      let n = 0;
      for (const [key, r] of recs) if (!r.node.isConnected) { recs.delete(key); n++; }
      return n;
    }

    return {
      apply, reapply, isOwnValue, isOwnWrite, prune, markPending, markError,
      showOriginal: () => setMode('original'),
      showTranslation: () => setMode('translation'),
      get: (node) => recs.get(node),
      forget: (node) => recs.delete(node),
      get mode() { return mode; },
      get records() { return Array.from(recs.values()); },
    };
  }

  KT.createApplier = createApplier;
})();
