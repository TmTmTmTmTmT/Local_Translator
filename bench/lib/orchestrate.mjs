// Pure helpers for bench/orchestrate.mjs: models.json validation, command builders, preflight, readiness, ps parsing.
// Side effects (exec, fetch, fs, clock) are injected so everything here is unit-testable.
import { join } from 'node:path';
import { ALL_LANGS, resultPath } from './plan.mjs';

export const RUNTIMES = ['mlx', 'ollama', 'ct2'];
export const TIERS = ['L', 'M', 'H'];
export const CT2_FAMILIES = ['m2m100', 'nllb', 'madlad', 'opus'];
export const PORTS = { mlx: 8080, ct2: 8765, ollama: 11434 };
export const ENGINE_TIMEOUT_MS = 20 * 60 * 1000;
// SPEC section 4: <family>-<name>[-variant], lowercase; family = runtime here.
export const ENGINE_ID_RE = /^(mlx|ollama|ct2)-[a-z0-9]+([.-][a-z0-9]+)*$/;
const REQUIRED = ['engineId', 'runtime', 'model', 'langs', 'tier', 'notes'];

export function validateModels(list) {
  const errors = [];
  if (!Array.isArray(list)) return ['models.json must be an array'];
  const seen = new Set();
  list.forEach((e, i) => {
    const at = `#${i}${e && e.engineId ? ` (${e.engineId})` : ''}`;
    if (!e || typeof e !== 'object') { errors.push(`${at}: not an object`); return; }
    for (const f of REQUIRED) if (e[f] === undefined || e[f] === null || e[f] === '') errors.push(`${at}: missing ${f}`);
    if (typeof e.engineId === 'string') {
      if (!ENGINE_ID_RE.test(e.engineId)) errors.push(`${at}: engineId violates SPEC rule`);
      if (seen.has(e.engineId)) errors.push(`${at}: duplicate engineId`);
      seen.add(e.engineId);
      if (RUNTIMES.includes(e.runtime) && e.engineId.split('-')[0] !== e.runtime) errors.push(`${at}: engineId prefix != runtime`);
    }
    if (e.runtime !== undefined && !RUNTIMES.includes(e.runtime)) errors.push(`${at}: bad runtime`);
    if (e.tier !== undefined && !TIERS.includes(e.tier)) errors.push(`${at}: bad tier`);
    if (e.langs !== undefined) {
      if (!Array.isArray(e.langs) || !e.langs.length || e.langs.some((l) => !ALL_LANGS.includes(l))) errors.push(`${at}: bad langs`);
    }
    if (e.runtime === 'ct2') {
      if (!CT2_FAMILIES.includes(e.family)) errors.push(`${at}: ct2 needs family in ${CT2_FAMILIES.join('|')}`);
      if (e.convertFrom && !e.convertTo) errors.push(`${at}: convertFrom needs convertTo`);
    }
  });
  return errors;
}

export function selectEntries(models, only) {
  if (!only || only === 'all') return { entries: models, unknown: [] };
  const ids = String(only).split(',').map((s) => s.trim()).filter(Boolean);
  const byId = new Map(models.map((m) => [m.engineId, m]));
  return { entries: ids.filter((i) => byId.has(i)).map((i) => byId.get(i)), unknown: ids.filter((i) => !byId.has(i)) };
}

export const applicableLangs = (entry, langs) => langs.filter((l) => entry.langs.includes(l));

// ct2 model file whose presence means "converted and usable". opus: server loads <dir>/en-ko per direction.
export function ct2ModelFile(entry, benchDir) {
  const base = join(benchDir, 'models', entry.model);
  return entry.family === 'opus' ? join(base, 'en-ko', 'model.bin') : join(base, 'model.bin');
}

// Server launch spec. env HF_HUB_OFFLINE keeps mlx_lm from touching the network.
export function serverCommand(entry, { venvPython, benchDir }) {
  const port = PORTS[entry.runtime];
  if (entry.runtime === 'mlx') {
    return { cmd: venvPython, args: ['-m', 'mlx_lm.server', '--model', entry.model, '--port', String(port), '--host', '127.0.0.1'],
      env: { HF_HUB_OFFLINE: '1' }, port, readyUrl: `http://127.0.0.1:${port}/v1/models`, readyTimeoutMs: 300000 };
  }
  if (entry.runtime === 'ct2') {
    return { cmd: venvPython, args: [join(benchDir, 'engines', 'mt_server.py'), '--model-dir', join(benchDir, 'models', entry.model),
      '--family', entry.family, '--port', String(port)], env: {}, port, readyUrl: `http://127.0.0.1:${port}/health`, readyTimeoutMs: 120000 };
  }
  return { cmd: 'ollama', args: ['serve'], env: {}, port, readyUrl: `http://127.0.0.1:${port}/api/tags`, readyTimeoutMs: 60000 };
}

export const ollamaStopCommand = (entry) => ({ cmd: 'ollama', args: ['stop', entry.model] });

export function modelMapFor(entry, { keepAliveSec = 600 } = {}) {
  const args = entry.runtime === 'ollama' ? ['--keep-alive', String(keepAliveSec)] : [];
  return { [entry.engineId]: { model: entry.model, args } };
}

// Args for `node bench/run.mjs`. Without skipExisting we pass --force so a rerun overwrites old results.
export function runMjsArgs(entry, { benchDir, langs, runs, modelMapFile, resultsDir, force }) {
  const a = [join(benchDir, 'run.mjs'), '--engines', entry.engineId, '--langs', langs.join(','), '--runs', String(runs),
    '--model-map', modelMapFile, '--results-dir', resultsDir];
  if (force) a.push('--force');
  return a;
}

export function missingResults(entry, langs, runs, resultsDir, exists) {
  const out = [];
  for (const l of langs) for (let r = 1; r <= runs; r++) if (!exists(resultPath(resultsDir, entry.engineId, l, r))) out.push(`${l}/r${r}`);
  return out;
}

export function parseOllamaList(text) {
  return text.split('\n').slice(1).map((l) => l.trim().split(/\s+/)[0]).filter(Boolean);
}

const SNAP = 'import sys; from huggingface_hub import snapshot_download; snapshot_download(sys.argv[1], local_files_only=True)';
const COPY_CANDIDATES = ['tokenizer.json', 'tokenizer_config.json', 'special_tokens_map.json', 'sentencepiece.bpe.model',
  'spiece.model', 'vocab.json', 'source.spm', 'target.spm'];

// convert_model.sh has a fixed --copy_files list that fails when a file is absent (opus source lacks several),
// so we call the converter directly with only the files that exist.
export function convertCommand(entry, { venvBin, benchDir, listDir }) {
  const src = join(benchDir, 'models', entry.convertFrom);
  const outDir = join(benchDir, 'models', entry.convertTo);
  const have = new Set(listDir(src));
  const copy = COPY_CANDIDATES.filter((f) => have.has(f));
  const args = ['--model', src, '--output_dir', outDir, '--quantization', 'int8'];
  if (copy.length) args.push('--copy_files', ...copy);
  return { cmd: join(venvBin, 'ct2-transformers-converter'), args, env: { HF_HUB_OFFLINE: '1', TRANSFORMERS_OFFLINE: '1' }, outDir };
}

// ctx: { exec(cmd,args,{env}) -> {ok,stdout}, exists(path), listDir(path), benchDir, venvPython }
// status: present | convertible | missing
export async function preflight(entry, ctx) {
  const { exec, exists, benchDir, venvPython } = ctx;
  if (entry.runtime === 'mlx') {
    if (!exists(venvPython)) return { status: 'missing', detail: 'venv python not found' };
    const r = await exec(venvPython, ['-c', SNAP, entry.model], { env: { HF_HUB_OFFLINE: '1' } });
    return r.ok ? { status: 'present', detail: 'HF cache' } : { status: 'missing', detail: 'not in HF cache' };
  }
  if (entry.runtime === 'ollama') {
    const r = await exec('ollama', ['list'], {});
    if (!r.ok) return { status: 'missing', detail: 'ollama list failed (binary or service down)' };
    return parseOllamaList(r.stdout).includes(entry.model)
      ? { status: 'present', detail: 'ollama list' } : { status: 'missing', detail: 'not pulled' };
  }
  if (exists(ct2ModelFile(entry, benchDir))) return { status: 'present', detail: 'model dir' };
  if (entry.convertFrom) {
    const src = join(benchDir, 'models', entry.convertFrom);
    const dst = join(benchDir, 'models', entry.convertTo);
    if (!exists(src)) return { status: 'missing', detail: `source dir ${entry.convertFrom} absent` };
    if (exists(dst)) return { status: 'missing', detail: `partial output ${entry.convertTo} (no model.bin); remove it` };
    if (!exists(join(ctx.venvBin || '', 'ct2-transformers-converter'))) return { status: 'missing', detail: 'source present but converter not in venv' };
    return { status: 'convertible', detail: `convert from ${entry.convertFrom}` };
  }
  return { status: 'missing', detail: 'model dir absent' };
}

// Poll check() until true. isAlive() false aborts early (server crashed). now/sleep injectable for tests.
export async function waitReady({ check, timeoutMs, intervalMs = 1000, now = Date.now, sleep, isAlive = () => true }) {
  const t0 = now();
  for (;;) {
    let ok = false;
    try { ok = await check(); } catch { ok = false; }
    if (ok) return { ok: true, waitedMs: now() - t0 };
    if (!isAlive()) return { ok: false, waitedMs: now() - t0, reason: 'server exited' };
    if (now() - t0 >= timeoutMs) return { ok: false, waitedMs: now() - t0, reason: 'timeout' };
    await sleep(intervalMs);
  }
}

export function httpCheck(url, fetchFn = globalThis.fetch) {
  const h = new URL(url).hostname;
  if (h !== '127.0.0.1') throw new Error(`refusing non-loopback host: ${h}`);
  return async () => {
    const res = await fetchFn(url, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  };
}

export function parsePs(text) {
  const rows = [];
  for (const line of text.split('\n')) {
    const m = line.trim().match(/^(\d+)\s+(\d+)\s+(.*)$/);
    if (m) rows.push({ pid: Number(m[1]), rssKb: Number(m[2]), comm: m[3].split('/').pop() });
  }
  return rows;
}

// mlx/ct2: RSS of the server pid. ollama: sum over all ollama processes (service + runner).
export function rssKbFor(rows, entry, pid) {
  if (entry.runtime === 'ollama') return rows.filter((r) => r.comm.toLowerCase().startsWith('ollama')).reduce((s, r) => s + r.rssKb, 0);
  const r = rows.find((x) => x.pid === pid);
  return r ? r.rssKb : 0;
}

const mb = (kb) => (kb == null ? '-' : Math.round(kb / 1024));

export function formatLogLine({ ts, status, entry, durationSec, baselineKb, peakKb, detail = '' }) {
  return `[${ts}] status=${status} engine=${entry.engineId} runtime=${entry.runtime} durationSec=${Math.round(durationSec)} `
    + `baselineRssMb=${mb(baselineKb)} peakRssMb=${mb(peakKb)} ${detail.replace(/\s+/g, ' ').trim()}`.trimEnd();
}
