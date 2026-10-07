// Client for the Python MT server (bench/engines/mt_server.py): POST /translate {src,tgt:"ko",texts}.
// src is the corpus lang code verbatim (en|ja|zh-Hans|zh-Hant); the server maps it per model family.
import { pathToFileURL } from 'node:url';
import { runAdapter } from '../lib/adapter.mjs';
import { postJson } from '../lib/http.mjs';
import { planBatch, assembleBatch } from '../lib/plain.mjs';

const DEFAULT_BASE = 'http://127.0.0.1:8765';

export function makeCt2Translator(opts) {
  const base = (opts.baseUrl || DEFAULT_BASE).replace(/\/$/, '');
  return async ({ batch, lang }) => {
    const plan = planBatch(batch);
    let translations = [];
    if (plan.texts.length) {
      const r = await postJson(`${base}/translate`, { src: opts.raw.src || lang, tgt: 'ko', texts: plan.texts });
      translations = r.translations;
      if (!Array.isArray(translations) || translations.length !== plan.texts.length) {
        throw new Error(`translations length mismatch: got ${translations?.length}, want ${plan.texts.length}`);
      }
    }
    return { blocks: assembleBatch(batch, plan, translations) };
  };
}

export async function main(argv) {
  return runAdapter({
    argv,
    makeTranslator: (opts) => makeCt2Translator(opts),
    notes: () => 'plain MT, PLAN 4.4 run-splitting',
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((e) => { console.error(e.stack || e); process.exit(1); });
}
