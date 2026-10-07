// Pure helpers for run.mjs: engine -> adapter command, result paths, model map.
import { join } from 'node:path';

export const ALL_LANGS = ['en', 'ja', 'zh-Hans', 'zh-Hant'];

export function expandLangs(s) {
  if (!s || s === true) return ALL_LANGS;
  const out = [];
  for (const l of String(s).split(',').map((x) => x.trim()).filter(Boolean)) {
    if (l === 'zh') out.push('zh-Hans', 'zh-Hant');
    else out.push(l);
  }
  return [...new Set(out)];
}

export const engineFamily = (id) => id.split('-')[0];

export function adapterCommand(engineId, benchDir, nodePath = process.execPath) {
  const fam = engineFamily(engineId);
  if (fam === 'apple') return { cmd: join(benchDir, 'engines/apple/.build/release/kt-bench'), args: [] };
  if (['ollama', 'mlx', 'ct2'].includes(fam)) return { cmd: nodePath, args: [join(benchDir, 'engines', `${fam}.mjs`)] };
  throw new Error(`unknown engine family for ${engineId}`);
}

export const resultPath = (dir, engine, lang, run) => join(dir, `${engine}__${lang}__r${run}.json`);
export const scenarioPath = (dir, engine, name) => join(dir, `scenario__${engine}__${name}.json`);
export const monitorPath = (dir, engine, name) => join(dir, `monitor__${engine}__${name}.csv`);

// model-map entry: "name" or {model, args:[...]}. Fallback: engine id minus family prefix.
export function modelFor(engineId, map = {}) {
  const e = map[engineId];
  if (typeof e === 'string') return { model: e, args: [] };
  if (e && typeof e === 'object') return { model: e.model, args: e.args || [] };
  if (engineFamily(engineId) === 'apple') return { model: undefined, args: [] };
  return { model: engineId.split('-').slice(1).join('-'), args: [] };
}

export function adapterArgs({ engineId, corpus, out, model, keepAlive, run, maxBlocks, extra = [] }) {
  const a = ['--engine', engineId, '--corpus', corpus, '--out', out, '--run', String(run ?? 1)];
  if (model) a.push('--model', model);
  if (keepAlive !== undefined) a.push('--keep-alive', String(keepAlive));
  if (maxBlocks && engineFamily(engineId) !== 'apple') a.push('--max-blocks', String(maxBlocks));
  return [...a, ...extra];
}

export const SCENARIOS = {
  resident: { keepAlive: 300 },
  unload: { keepAlive: 0, maxBlocks: 6 },
  'usage-sim': { keepAlive: 300, maxBlocks: 6 },
};
