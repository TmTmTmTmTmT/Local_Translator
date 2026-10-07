// Corpus loading/validation and small block helpers (SPEC section 1).
import { readFileSync } from 'node:fs';

export function validateCorpus(c) {
  if (!c || typeof c !== 'object' || !Array.isArray(c.blocks)) throw new Error('corpus: blocks[] missing');
  for (const b of c.blocks) {
    if (!b.id || !Array.isArray(b.items)) throw new Error(`corpus: bad block ${b && b.id}`);
    let n = 0;
    for (const it of b.items) {
      if (it.k === 't') {
        if (it.i !== n) throw new Error(`corpus: ${b.id} slot index ${it.i} != ${n}`);
        n++;
      } else if (it.k !== 'x') throw new Error(`corpus: ${b.id} bad item kind ${it.k}`);
    }
  }
  return c;
}

export function loadCorpus(path) {
  const c = JSON.parse(readFileSync(path, 'utf8'));
  return validateCorpus(c);
}

export const slotItems = (block) => block.items.filter((it) => it.k === 't');
export const blockChars = (block) => block.items.reduce((s, it) => s + (it.text ? it.text.length : 0), 0);

// Source text for display: x items in [brackets].
export function displaySource(block) {
  return block.items.map((it) => (it.k === 'x' ? `[${it.text}]` : it.text)).join('');
}

// Keep only `count` blocks starting at `start`, wrapping around (used by usage-sim scenario).
export function sliceCorpus(corpus, start, count) {
  const n = corpus.blocks.length;
  const blocks = [];
  for (let k = 0; k < Math.min(count, n); k++) blocks.push(corpus.blocks[(start + k) % n]);
  return { ...corpus, blocks };
}
