// Robust extraction/repair of the LLM's JSON output and normalization into per-block slot maps.
import { slotItems } from './corpus.mjs';

export function stripThink(text) {
  let s = String(text ?? '').replace(/<think>[\s\S]*?<\/think>/gi, '');
  // Templates that prefill "<think>" yield only a closing tag.
  const close = s.search(/<\/think>/i);
  if (close >= 0) s = s.slice(close + '</think>'.length);
  return s.replace(/<\/?think>/gi, '');
}

// String-aware repair: escape raw control chars in strings, drop trailing commas, close truncated output.
export function repairJson(src) {
  const out = [];
  const stack = [];
  let inStr = false, esc = false;
  const lastSig = () => { for (let i = out.length - 1; i >= 0; i--) if (!/\s/.test(out[i])) return i; return -1; };
  for (const ch of src) {
    if (inStr) {
      if (esc) { out.push(ch); esc = false; continue; }
      if (ch === '\\') { out.push(ch); esc = true; continue; }
      if (ch === '"') { out.push(ch); inStr = false; continue; }
      if (ch === '\n') { out.push('\\n'); continue; }
      if (ch === '\r') { out.push('\\r'); continue; }
      if (ch === '\t') { out.push('\\t'); continue; }
      out.push(ch);
      continue;
    }
    if (ch === '"') { inStr = true; out.push(ch); continue; }
    if (ch === '{' || ch === '[') { stack.push(ch === '{' ? '}' : ']'); out.push(ch); continue; }
    if (ch === '}' || ch === ']') {
      const i = lastSig();
      if (i >= 0 && out[i] === ',') out.splice(i, 1);
      if (stack.length && stack[stack.length - 1] === ch) stack.pop();
      out.push(ch);
      continue;
    }
    out.push(ch);
  }
  if (inStr) { if (esc) out.pop(); out.push('"'); }
  let i = lastSig();
  while (i >= 0 && out[i] === ',') { out.splice(i, 1); i = lastSig(); }
  if (i >= 0 && out[i] === ':') out.push('null');
  while (stack.length) out.push(stack.pop());
  return out.join('');
}

// Balanced scan from `start` (an opening bracket). Returns the slice (possibly truncated at end of text).
function balancedFrom(s, start) {
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') { depth--; if (depth === 0) return s.slice(start, i + 1); }
  }
  return s.slice(start);
}

function tryParse(c) {
  try { return { value: JSON.parse(c), repaired: false }; } catch { /* fallthrough */ }
  try { return { value: JSON.parse(repairJson(c)), repaired: true }; } catch { return null; }
}

const isContainer = (v) => v !== null && typeof v === 'object';

export function extractJson(text) {
  const s = stripThink(text).replace(/^﻿/, '');
  const cands = [];
  for (const m of s.matchAll(/```(?:json|JSON)?[ \t]*\r?\n?([\s\S]*?)```/g)) cands.push(m[1]);
  const open = s.match(/```(?:json|JSON)?[ \t]*\r?\n?([\s\S]*)$/);
  if (open) cands.push(open[1]);
  cands.push(s);
  for (const c of cands) {
    const whole = tryParse(c.trim());
    if (whole && isContainer(whole.value)) return { ok: true, ...whole };
    for (const re of [/\{/g, /\[/g]) {
      let n = 0;
      for (const m of c.matchAll(re)) {
        if (n++ >= 20) break;
        const r = tryParse(balancedFrom(c, m.index));
        if (r && isContainer(r.value)) return { ok: true, value: r.value, repaired: r.repaired || m.index > 0 };
      }
    }
  }
  return { ok: false, error: 'no JSON found' };
}

// Slots of one block -> {"0": "...", ...} limited to expected indices; string-typed values only.
export function normalizeSlots(t, expected) {
  const exp = new Set(expected.map(String));
  const slots = {};
  const put = (k, v) => {
    k = String(k);
    if (!exp.has(k)) return;
    if (typeof v === 'number') v = String(v);
    if (typeof v === 'string') slots[k] = v;
  };
  if (typeof t === 'string') { if (exp.size === 1) put([...exp][0], t); }
  else if (Array.isArray(t)) {
    t.forEach((v, idx) => {
      if (isContainer(v)) put(v.i ?? v.id ?? v.index ?? idx, v.text ?? v.t ?? v.value ?? v.translation);
      else put(idx, v);
    });
  } else if (isContainer(t)) for (const [k, v] of Object.entries(t)) put(k.replace(/^t/i, ''), v);
  return slots;
}

function findEntries(value) {
  if (Array.isArray(value)) return value;
  if (!isContainer(value)) return null;
  const b = value.blocks ?? value.translations ?? value.result;
  if (Array.isArray(b)) return b;
  if (isContainer(b)) return Object.entries(b).map(([id, v]) => (isContainer(v) && !Array.isArray(v) ? { id, ...v } : { id, t: v }));
  // Top-level object keyed by block id.
  const vals = Object.entries(value);
  if (vals.length && vals.every(([, v]) => isContainer(v))) return vals.map(([id, v]) => ({ id, ...(Array.isArray(v) ? { t: v } : v) }));
  return null;
}

// -> [{id, slots|null, error|null}] aligned with `batch`, or null if structure is unusable.
export function normalizeBlocks(value, batch) {
  const entries = findEntries(value);
  if (!entries) return null;
  const byId = new Map();
  for (const e of entries) if (isContainer(e) && e.id !== undefined) byId.set(String(e.id), e);
  const noIdMatch = !batch.some((b) => byId.has(b.id));
  return batch.map((b, idx) => {
    let e = byId.get(b.id);
    if (!e && noIdMatch && entries.length === batch.length) e = entries[idx];
    const expected = slotItems(b).map((it) => it.i);
    if (!e) return { id: b.id, slots: null, error: 'block missing in output' };
    const slots = normalizeSlots(e.t ?? e.slots ?? e.translations ?? e.items, expected);
    if (expected.length && !Object.keys(slots).length) return { id: b.id, slots: null, error: 'no slots returned' };
    return { id: b.id, slots, error: null };
  });
}

export function parseBatchOutput(text, batch) {
  const ex = extractJson(text);
  if (!ex.ok) return { valid: false, error: ex.error };
  const blocks = normalizeBlocks(ex.value, batch);
  if (!blocks) return { valid: false, error: 'unexpected JSON structure' };
  return { valid: true, blocks, repaired: ex.repaired };
}
