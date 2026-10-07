// PLAN 4.4 fallback for plain-text MT: split a block at x boundaries, translate each run of t-slots as one
// string, put the whole translation in the run's first slot and "" in the rest.

export const hasLetters = (s) => /\p{L}/u.test(s);

export function withOuterWhitespace(original, translated) {
  const lead = original.match(/^\s*/)[0];
  const trail = original.slice(lead.length).match(/\s*$/)[0];
  return lead + translated.trim() + trail;
}

export function planSegments(block) {
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

// translations[k] aligns with segments[k]; null/undefined/"" for a translatable segment => its slots omitted.
export function assemblePlain(segments, translations) {
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

// Flatten a batch into texts to send; `refs` maps each text back to (blockIndex, segmentIndex).
export function planBatch(batch) {
  const plans = batch.map((b) => planSegments(b));
  const texts = [], refs = [];
  plans.forEach((segs, bi) => segs.forEach((s, si) => { if (s.translatable) { texts.push(s.text.trim()); refs.push([bi, si]); } }));
  return { plans, texts, refs };
}

export function assembleBatch(batch, { plans, refs }, translations) {
  const perBlock = plans.map((segs) => new Array(segs.length).fill(null));
  refs.forEach(([bi, si], k) => { perBlock[bi][si] = translations[k]; });
  return batch.map((b, bi) => {
    const slots = assemblePlain(plans[bi], perBlock[bi]);
    const expected = b.items.filter((it) => it.k === 't').length;
    if (expected && !Object.keys(slots).length) return { id: b.id, slots: null, error: 'no translation returned' };
    return { id: b.id, slots, error: null };
  });
}
