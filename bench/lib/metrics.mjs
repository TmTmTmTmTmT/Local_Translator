// Automatic quality/speed metrics over a result + its corpus (PLAN 5.4). Pure functions, no I/O.
import { slotItems } from './corpus.mjs';
import { percentile, median } from './timing.mjs';

const nfkc = (s) => String(s).normalize('NFKC');
const nonSpace = (s) => s.replace(/\s+/g, '').length;
const MONTH_DAY = new Set(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','January','February','March','April','May','June','July','August','September','October','November','December']);

export function srcSlotText(block) {
  return slotItems(block).map((it) => it.text).join('');
}

// Output text of a block in slot order (missing slots skipped).
export function outputText(block, slots) {
  if (!slots) return '';
  return slotItems(block).map((it) => slots[String(it.i)] ?? '').join('');
}

export function extractTokens(srcText, lang) {
  const s = nfkc(srcText);
  const urls = [...s.matchAll(/(?:https?:\/\/|www\.)[^\s)）」』,，。、]+/g)].map((m) => m[0].replace(/[.;:!?'"]+$/, ''));
  const rest = s.replace(/(?:https?:\/\/|www\.)[^\s)）」』,，。、]+/g, ' ');
  const numbers = [...rest.matchAll(/\d+(?:[.,]\d+)*/g)].map((m) => m[0].replace(/[.,]$/, ''));
  const names = [];
  if (lang === 'en') {
    for (const m of rest.matchAll(/[A-Za-z][A-Za-z0-9]*/g)) {
      const w = m[0];
      if (w.length < 2) continue;
      const innerCaps = /^[A-Za-z][a-z0-9]*[A-Z0-9]/.test(w) || /^[A-Z]{2,}$/.test(w);
      const before = rest.slice(0, m.index).trimEnd();
      const sentenceStart = before === '' || /[.!?:\n]$/.test(before);
      const capMid = /^[A-Z][a-z]+$/.test(w) && !sentenceStart && !MONTH_DAY.has(w);
      if (innerCaps || capMid) names.push(w);
    }
  } else {
    for (const m of rest.matchAll(/[A-Za-z][A-Za-z0-9.+#_-]*[A-Za-z0-9]/g)) names.push(m[0]);
  }
  return { numbers, urls, names };
}

const has = (out, tok) => out.includes(tok) || out.includes(tok.replace(/,/g, ''));

export function hangulRatio(text) {
  const letters = (text.match(/\p{L}/gu) || []).length;
  if (!letters) return null;
  return (text.match(/[가-힯ᄀ-ᇿ㄰-㆏]/g) || []).length / letters;
}

// Same 10-char (whitespace-stripped) gram occurring >=3 times and more often than in the source.
export function repetitionFlag(out, src) {
  const count = (t) => {
    const s = t.replace(/\s+/g, '');
    const m = new Map();
    for (let i = 0; i + 10 <= s.length; i += 1) { const g = s.slice(i, i + 10); m.set(g, (m.get(g) || 0) + 1); }
    return m;
  };
  const o = count(out), c = count(src);
  for (const [g, n] of o) if (n >= 3 && n > (c.get(g) || 0) && new Set(g).size > 2) return true;
  return false;
}

export const LEN_RATIO_BOUNDS = [0.25, 3.5];

export function blockMetrics(block, res, lang) {
  const expected = slotItems(block).length;
  const slots = res.slots;
  const returned = slots ? slotItems(block).filter((it) => typeof slots[String(it.i)] === 'string').length : 0;
  const m = { expected, returned, failed: !slots, tokens: { numbers: [0, 0], urls: [0, 0], names: [0, 0] }, hangul: null, untranslated: false, lenRatio: null, lenOutlier: false, repeat: false, longOut: false };
  if (!slots) return m;
  const src = srcSlotText(block);
  const out = nfkc(outputText(block, slots));
  const tk = extractTokens(src, lang);
  for (const k of ['numbers', 'urls', 'names']) {
    m.tokens[k] = [tk[k].filter((t) => has(out, t)).length, tk[k].length];
  }
  m.hangul = hangulRatio(out);
  const srcLetters = /\p{L}/u.test(src);
  const nameOnly = tk.names.length && nonSpace(src.replace(/[A-Za-z0-9\s.,'"()-]/g, '')) === 0 && lang !== 'en' ? false : false;
  m.untranslated = srcLetters && returned === expected && expected > 0 && (m.hangul === null || m.hangul < 0.3) && !nameOnly;
  if (returned === expected && nonSpace(src) >= 8) {
    m.lenRatio = nonSpace(out) / nonSpace(src);
    m.lenOutlier = m.lenRatio < LEN_RATIO_BOUNDS[0] || m.lenRatio > LEN_RATIO_BOUNDS[1];
  }
  m.repeat = repetitionFlag(out, src);
  m.longOut = nonSpace(out) > 3 * nonSpace(src) + 40;
  return m;
}

const rate = (a, b) => (b ? a / b : null);

// Pools many results (runs) of one engine+lang. xPreserved is optional per block (bool or 0..1).
export function aggregateResults(corpus, results) {
  const byId = new Map(corpus.blocks.map((b) => [b.id, b]));
  const A = { blocks: 0, expected: 0, returned: 0, failedBlocks: 0, errors: 0, tok: { numbers: [0, 0], urls: [0, 0], names: [0, 0] }, hangulSum: 0, hangulN: 0, untranslated: 0, lenOutliers: 0, lenN: 0, repeat: 0, longOut: 0, xSum: 0, xN: 0, batches: 0, jsonFirstTry: 0, jsonKnown: 0, jsonFailed: 0, repaired: 0 };
  for (const r of results) {
    for (const rb of r.blocks) {
      const cb = byId.get(rb.id);
      if (!cb) continue;
      const m = blockMetrics(cb, rb, corpus.lang || r.lang);
      A.blocks++; A.expected += m.expected; A.returned += m.returned;
      if (m.failed) A.failedBlocks++;
      if (rb.error) A.errors++;
      for (const k of ['numbers', 'urls', 'names']) { A.tok[k][0] += m.tokens[k][0]; A.tok[k][1] += m.tokens[k][1]; }
      if (m.hangul !== null) { A.hangulSum += m.hangul; A.hangulN++; }
      if (m.untranslated) A.untranslated++;
      if (m.lenRatio !== null) { A.lenN++; if (m.lenOutlier) A.lenOutliers++; }
      if (m.repeat) A.repeat++;
      if (m.longOut) A.longOut++;
      if (rb.xPreserved !== undefined && rb.xPreserved !== null) { A.xSum += typeof rb.xPreserved === 'boolean' ? (rb.xPreserved ? 1 : 0) : Number(rb.xPreserved); A.xN++; }
    }
    for (const b of r.batches || []) {
      if (b.jsonValid === undefined) continue;
      A.jsonKnown++;
      if (b.jsonValid && !b.retried) A.jsonFirstTry++;
      if (!b.jsonValid) A.jsonFailed++;
      if (b.repaired) A.repaired++;
    }
  }
  return {
    runs: results.length,
    blocks: A.blocks,
    slotReturnRate: rate(A.returned, A.expected),
    xPreservationRate: A.xN ? A.xSum / A.xN : null,
    jsonValidRate: A.jsonKnown ? A.jsonFirstTry / A.jsonKnown : null,
    jsonFailedBatches: A.jsonFailed,
    numberRate: rate(A.tok.numbers[0], A.tok.numbers[1]),
    urlRate: rate(A.tok.urls[0], A.tok.urls[1]),
    nameRate: rate(A.tok.names[0], A.tok.names[1]),
    hangulMean: A.hangulN ? A.hangulSum / A.hangulN : null,
    untranslatedBlocks: A.untranslated,
    lenOutliers: A.lenOutliers,
    repeatFlags: A.repeat + A.longOut,
    errorBlocks: A.errors,
  };
}

// Warm per-block ms samples: runs >= 2 entirely (server already warm), run 1 minus its first batch.
export function warmSamples(results) {
  const out = [];
  for (const r of results) {
    const firstIds = new Set(r.batches && r.batches[0] ? r.batches[0].blockIds : []);
    const ok = (b) => !b.error && Number.isFinite(b.ms);
    if ((r.run ?? 1) >= 2) out.push(...r.blocks.filter(ok).map((b) => b.ms));
    else out.push(...r.blocks.filter((b) => ok(b) && !firstIds.has(b.id)).map((b) => b.ms));
  }
  if (out.length) return { samples: out, fallback: false };
  const all = results.flatMap((r) => r.blocks.filter((b) => !b.error && Number.isFinite(b.ms)).map((b) => b.ms));
  return { samples: all, fallback: true };
}

export function speedMetrics(corpus, results) {
  const { samples, fallback } = warmSamples(results);
  const charsTotal = corpus.blocks.reduce((s, b) => s + b.items.reduce((x, it) => x + (it.text?.length || 0), 0), 0);
  const sorted = [...results].sort((a, b) => (a.run ?? 1) - (b.run ?? 1));
  const totals = results.map((r) => r.totalMs);
  const medTotal = median(totals);
  return {
    coldMs: sorted.length ? sorted[0].coldMs : null,
    coldMedianMs: median(results.map((r) => r.coldMs)),
    warmP50: percentile(samples, 50),
    warmP95: percentile(samples, 95),
    warmFallback: fallback,
    docMs: medTotal,
    docBlocks: corpus.blocks.length,
    charsPerSec: medTotal ? charsTotal / (medTotal / 1000) : null,
  };
}
