import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateModels, selectEntries, applicableLangs, serverCommand, modelMapFor, runMjsArgs, allErrorResults, missingResults, parseOllamaList,
  convertCommand, preflight, waitReady, httpCheck, parsePs, rssKbFor, formatLogLine, ENGINE_ID_RE, ct2ModelFile,
} from './orchestrate.mjs';

const BENCH = join(fileURLToPath(import.meta.url), '../..');
const models = JSON.parse(readFileSync(join(BENCH, 'models.json'), 'utf8'));
const byId = (id) => models.find((m) => m.engineId === id);
const ctx0 = { benchDir: '/b', venvPython: '/b/.venv/bin/python', venvBin: '/b/.venv/bin' };

test('models.json passes schema validation with 28 entries', () => {
  assert.deepEqual(validateModels(models), []);
  assert.equal(models.length, 28);
  assert.ok(byId('ollama-gemma4-e2b').tier === 'H' && byId('ollama-gemma4-e4b').tier === 'H');
  assert.deepEqual(byId('ct2-opus-tc-big-en-ko').langs, ['en']);
});

test('validateModels catches bad entries', () => {
  const ok = { engineId: 'mlx-a-4bit', runtime: 'mlx', model: 'x/y', langs: ['en'], tier: 'L', notes: 'n' };
  assert.deepEqual(validateModels([ok]), []);
  assert.ok(validateModels([ok, ok]).some((e) => /duplicate/.test(e)));
  assert.ok(validateModels([{ ...ok, engineId: 'MLX-A' }]).some((e) => /SPEC/.test(e)));
  assert.ok(validateModels([{ ...ok, engineId: 'ct2-a' }]).some((e) => /prefix/.test(e)));
  assert.ok(validateModels([{ ...ok, tier: 'X' }]).length);
  assert.ok(validateModels([{ ...ok, langs: ['fr'] }]).length);
  const { notes, ...noNotes } = ok;
  assert.ok(validateModels([noNotes]).some((e) => /notes/.test(e)));
  assert.ok(validateModels([{ ...ok, engineId: 'ct2-a', runtime: 'ct2' }]).some((e) => /family/.test(e)));
  assert.ok(ENGINE_ID_RE.test('ct2-madlad-3b'));
});

test('selectEntries / applicableLangs', () => {
  assert.equal(selectEntries(models, 'all').entries.length, 28);
  const r = selectEntries(models, 'ct2-opus-tc-big-en-ko,nope');
  assert.deepEqual(r.entries.map((e) => e.engineId), ['ct2-opus-tc-big-en-ko']);
  assert.deepEqual(r.unknown, ['nope']);
  assert.deepEqual(applicableLangs(byId('ct2-opus-tc-big-en-ko'), ['en', 'ja']), ['en']);
});

test('command builders per runtime', () => {
  const m = serverCommand(byId('mlx-qwen3-1.7b-4bit'), ctx0);
  assert.equal(m.cmd, '/b/.venv/bin/python');
  assert.deepEqual(m.args, ['-m', 'mlx_lm.server', '--model', 'mlx-community/Qwen3-1.7B-4bit', '--port', '8080', '--host', '127.0.0.1']);
  assert.equal(m.env.HF_HUB_OFFLINE, '1');
  const c = serverCommand(byId('ct2-madlad-3b'), ctx0);
  assert.deepEqual(c.args, ['/b/engines/mt_server.py', '--model-dir', '/b/models/madlad-3b', '--family', 'madlad', '--port', '8765']);
  assert.match(c.readyUrl, /^http:\/\/127\.0\.0\.1:8765\//);
  const o = serverCommand(byId('ollama-gemma4-e2b'), ctx0);
  assert.deepEqual([o.cmd, o.args, o.port], ['ollama', ['serve'], 11434]);
  assert.deepEqual(modelMapFor(byId('ollama-gemma4-e2b')), { 'ollama-gemma4-e2b': { model: 'gemma4:e2b', args: ['--keep-alive', '600'] } });
  assert.deepEqual(modelMapFor(byId('mlx-gemma-3-1b-4bit'))['mlx-gemma-3-1b-4bit'].args, []);
  const r = runMjsArgs(byId('ct2-madlad-3b'), { benchDir: '/b', langs: ['en', 'ja'], runs: 1, modelMapFile: '/m.json', resultsDir: '/r', force: true });
  assert.deepEqual(r, ['/b/run.mjs', '--engines', 'ct2-madlad-3b', '--langs', 'en,ja', '--runs', '1', '--model-map', '/m.json', '--results-dir', '/r', '--force']);
  const rc = runMjsArgs(byId('ct2-madlad-3b'), { benchDir: '/b', langs: ['en'], runs: 1, modelMapFile: '/m.json', resultsDir: '/r', force: false, corpusDir: '/c' });
  assert.deepEqual(rc, ['/b/run.mjs', '--engines', 'ct2-madlad-3b', '--langs', 'en', '--runs', '1', '--model-map', '/m.json', '--results-dir', '/r', '--corpus-dir', '/c']);
  for (const e of models) for (const x of serverCommand(e, ctx0).args) assert.ok(!/^https?:\/\/(?!127\.0\.0\.1)/.test(x));
});

test('missingResults', () => {
  const have = new Set(['/r/ct2-madlad-3b__en__r1.json']);
  assert.deepEqual(missingResults(byId('ct2-madlad-3b'), ['en', 'ja'], 1, '/r', (p) => have.has(p)), ['ja/r1']);
});

test('parseOllamaList', () => {
  assert.deepEqual(parseOllamaList('NAME ID SIZE MODIFIED\ngemma4:e2b  7fb  7.2 GB  4 weeks ago\n'), ['gemma4:e2b']);
});

test('preflight with injected exec', async () => {
  const exists = (s) => (p) => s.has(p);
  const okExec = async () => ({ ok: true, stdout: '' });
  const badExec = async () => ({ ok: false, stdout: '' });
  const mlx = byId('mlx-hy-mt2-1.8b-4bit');
  assert.equal((await preflight(mlx, { ...ctx0, exec: okExec, exists: exists(new Set([ctx0.venvPython])) })).status, 'present');
  assert.equal((await preflight(mlx, { ...ctx0, exec: badExec, exists: exists(new Set([ctx0.venvPython])) })).status, 'missing');
  assert.equal((await preflight(mlx, { ...ctx0, exec: okExec, exists: exists(new Set()) })).status, 'missing');
  let seen;
  const listExec = async (c, a) => { seen = [c, a]; return { ok: true, stdout: 'NAME ID\ngemma4:e2b x\n' }; };
  assert.equal((await preflight(byId('ollama-gemma4-e2b'), { ...ctx0, exec: listExec, exists: exists(new Set()) })).status, 'present');
  assert.deepEqual(seen, ['ollama', ['list']]);
  assert.equal((await preflight(byId('ollama-qwen3-1.7b'), { ...ctx0, exec: listExec, exists: exists(new Set()) })).status, 'missing');
  const nllb = byId('ct2-madlad-3b');
  assert.equal((await preflight(nllb, { ...ctx0, exec: okExec, exists: exists(new Set([ct2ModelFile(nllb, '/b')])) })).status, 'present');
  assert.equal((await preflight(nllb, { ...ctx0, exec: okExec, exists: exists(new Set()) })).status, 'missing');
  const opus = byId('ct2-opus-tc-big-en-ko');
  const src = new Set(['/b/models/opus-tc-big-en-ko-src', '/b/.venv/bin/ct2-transformers-converter']);
  assert.equal((await preflight(opus, { ...ctx0, exec: okExec, exists: exists(src) })).status, 'convertible');
  src.add('/b/models/opus-mt/en-ko');
  assert.equal((await preflight(opus, { ...ctx0, exec: okExec, exists: exists(src) })).status, 'missing');
  src.add('/b/models/opus-mt/en-ko/model.bin');
  assert.equal((await preflight(opus, { ...ctx0, exec: okExec, exists: exists(src) })).status, 'present');
});

test('convertCommand copies only existing tokenizer files', () => {
  const c = convertCommand(byId('ct2-opus-tc-big-en-ko'), { venvBin: '/b/.venv/bin', benchDir: '/b', listDir: () => ['source.spm', 'target.spm', 'vocab.json', 'model.safetensors'] });
  assert.equal(c.cmd, '/b/.venv/bin/ct2-transformers-converter');
  assert.deepEqual(c.args, ['--model', '/b/models/opus-tc-big-en-ko-src', '--output_dir', '/b/models/opus-mt/en-ko', '--quantization', 'int8', '--copy_files', 'vocab.json', 'source.spm', 'target.spm']);
});

test('waitReady polls until ok, times out, or aborts when server died', async () => {
  let t = 0, n = 0;
  const base = { now: () => t, sleep: async (ms) => { t += ms; }, intervalMs: 1000 };
  const r1 = await waitReady({ ...base, timeoutMs: 10000, check: async () => ++n >= 3 });
  assert.deepEqual([r1.ok, r1.waitedMs, n], [true, 2000, 3]);
  t = 0;
  const r2 = await waitReady({ ...base, timeoutMs: 5000, check: async () => { throw new Error('refused'); } });
  assert.deepEqual([r2.ok, r2.reason], [false, 'timeout']);
  t = 0;
  const r3 = await waitReady({ ...base, timeoutMs: 5000, check: async () => false, isAlive: () => false });
  assert.equal(r3.reason, 'server exited');
});

test('httpCheck uses fake fetch and refuses non-loopback', async () => {
  const urls = [];
  const f = async (u) => { urls.push(u); return { ok: urls.length > 1 }; };
  const chk = httpCheck('http://127.0.0.1:8080/v1/models', f);
  assert.equal(await chk(), false);
  assert.equal(await chk(), true);
  assert.throws(() => httpCheck('http://example.com/x', f));
});

test('ps parsing and RSS selection', () => {
  const rows = parsePs('  10  2048 /usr/bin/python3\n  11  4096 /opt/homebrew/bin/ollama\n  12  8192 ollama runner\n garbage\n');
  assert.equal(rows.length, 3);
  assert.equal(rssKbFor(rows, byId('mlx-gemma-3-1b-4bit'), 10), 2048);
  assert.equal(rssKbFor(rows, byId('ollama-gemma4-e2b'), undefined), 4096 + 8192);
  assert.equal(rssKbFor(rows, byId('ct2-madlad-3b'), 999), 0);
});

test('formatLogLine', () => {
  const l = formatLogLine({ ts: 'T', status: 'OK', entry: byId('ct2-madlad-3b'), durationSec: 12.4, baselineKb: 102400, peakKb: 204800, detail: 'results=4/4' });
  assert.equal(l, '[T] status=OK engine=ct2-madlad-3b runtime=ct2 durationSec=12 baselineRssMb=100 peakRssMb=200 results=4/4');
});

test('models.json: -mt chat entries mirror originals; mtFamily forwarded as --mt-family', () => {
  const list = JSON.parse(readFileSync(new URL('../models.json', import.meta.url), 'utf8'));
  assert.deepEqual(validateModels(list), []);
  const mt = list.filter((e) => e.mtFamily === 'chat');
  assert.equal(mt.length, 8);
  for (const e of mt) {
    const orig = list.find((o) => o.engineId === e.engineId.replace(/-mt$/, ''));
    assert.ok(orig, e.engineId);
    assert.equal(e.model, orig.model);
    assert.deepEqual(e.args, ['--mode', 'mt']);
  }
  assert.deepEqual(modelMapFor(mt[0])[mt[0].engineId].args, ['--mode', 'mt', '--mt-family', 'chat']);
  assert.ok(validateModels([{ ...mt[0], mtFamily: 'x' }]).some((m) => /mtFamily/.test(m)));
});

test('allErrorResults flags result files whose blocks all errored', () => {
  const files = { '/r/a__en__r1.json': { blocks: [{ error: 'x' }, { error: 'y' }] }, '/r/a__ja__r1.json': { blocks: [{ error: 'x' }, { slots: {} }] } };
  const read = (p) => { if (!files[p]) throw new Error('nf'); return files[p]; };
  assert.deepEqual(allErrorResults({ engineId: 'a' }, ['en', 'ja', 'zh-Hans'], 1, '/r', read), ['en/r1']);
});
