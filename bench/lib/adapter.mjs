// Shared adapter driver: CLI parsing, batching, timing, result file (SPEC sections 2-3).
// A family supplies `makeTranslator(opts)` -> async ({batch, lang, context}) => {blocks, jsonValid?, retried?}.
import { parseArgs, writeJson } from './cli.mjs';
import { loadCorpus } from './corpus.mjs';
import { makeBatches, DEFAULT_LIMIT } from './batcher.mjs';
import { timed } from './timing.mjs';

export function parseAdapterArgs(argv) {
  const a = parseArgs(argv);
  const opts = {
    engine: a.engine,
    corpus: a.corpus,
    out: a.out,
    model: typeof a.model === 'string' ? a.model : undefined,
    keepAlive: a.keepAlive !== undefined ? Number(a.keepAlive) : undefined,
    run: a.run !== undefined ? Number(a.run) : 1,
    baseUrl: typeof a.baseUrl === 'string' ? a.baseUrl : undefined,
    maxChars: a.maxChars ? Number(a.maxChars) : DEFAULT_LIMIT.chars,
    maxBlocks: a.maxBlocks ? Number(a.maxBlocks) : DEFAULT_LIMIT.blocks,
    raw: a,
  };
  for (const k of ['engine', 'corpus', 'out']) if (!opts[k]) throw new Error(`missing --${k}`);
  return opts;
}

export async function translateCorpus({ corpus, opts, translateBatch, notes = '' }) {
  const limit = { chars: opts.maxChars, blocks: opts.maxBlocks };
  const batches = makeBatches(corpus.blocks, limit);
  const blocksOut = [];
  const batchesOut = [];
  let coldMs = null;
  const t0 = performance.now();
  for (const batch of batches) {
    const { value, ms, error } = await timed(() => translateBatch({ batch, lang: corpus.lang, context: corpus.context }));
    if (coldMs === null) coldMs = ms;
    const per = Math.round(ms / batch.length);
    const results = error
      ? batch.map((b) => ({ id: b.id, slots: null, error: String(error.message || error) }))
      : value.blocks;
    for (const r of results) blocksOut.push({ id: r.id, ms: per, slots: r.slots, error: r.error ?? null, ...(r.xPreserved !== undefined ? { xPreserved: r.xPreserved } : {}) });
    const rec = { blockIds: batch.map((b) => b.id), ms };
    if (error) rec.error = String(error.message || error);
    else {
      if (value.jsonValid !== undefined) rec.jsonValid = value.jsonValid;
      if (value.retried !== undefined) rec.retried = value.retried;
      if (value.repaired !== undefined) rec.repaired = value.repaired;
    }
    batchesOut.push(rec);
  }
  return {
    engine: opts.engine,
    model: opts.model ?? null,
    lang: corpus.lang,
    run: opts.run,
    batchLimit: limit,
    coldMs: coldMs ?? 0,
    totalMs: Math.round(performance.now() - t0),
    blocks: blocksOut,
    batches: batchesOut,
    env: { keepAliveSec: opts.keepAlive ?? null, notes },
  };
}

export async function runAdapter({ argv, makeTranslator, notes = () => '' }) {
  const opts = parseAdapterArgs(argv);
  const corpus = loadCorpus(opts.corpus);
  const translateBatch = await makeTranslator(opts, corpus);
  const result = await translateCorpus({ corpus, opts, translateBatch, notes: notes(opts) });
  writeJson(opts.out, result);
  const errs = result.blocks.filter((b) => b.error).length;
  console.error(`[${opts.engine}] ${corpus.lang} cold=${result.coldMs}ms total=${result.totalMs}ms blockErrors=${errs}`);
  return result;
}
