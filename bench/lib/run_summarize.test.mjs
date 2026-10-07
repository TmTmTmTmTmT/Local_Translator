// run.mjs matrix (spawning real adapter against a loopback fake server) + summarize report on its output.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runMatrix } from '../run.mjs';
import { loadResults, loadScenarios, loadMonitors, buildReport, hardConditions, loadRatings } from '../summarize.mjs';
import { loadCorpus } from './corpus.mjs';

const BENCH = join(dirname(fileURLToPath(import.meta.url)), '..');
const t = (i, text) => ({ k: 't', i, text });
const corpus = {
  lang: 'en', context: { title: 'T', host: 'h' },
  blocks: [
    { id: 'b1', genre: 'ui', items: [t(0, 'Click '), { k: 'x', text: 'here' }, t(1, ' to continue 3 times.')] },
    { id: 'b2', genre: 'ui', items: [t(0, 'Hello world from Safari')] },
  ],
};

test('runMatrix: runs, skips existing, --force reruns, continues past failures; summarize builds report', async () => {
  const srv = http.createServer((req, res) => {
    let b = ''; req.on('data', (d) => (b += d));
    req.on('end', () => { const j = JSON.parse(b); res.end(JSON.stringify({ translations: j.texts.map((x) => `번역 ${x}`) })); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const dir = mkdtempSync(join(tmpdir(), 'ktrun-'));
  const corpusDir = join(dir, 'corpus'); mkdirSync(corpusDir);
  writeFileSync(join(corpusDir, 'en.json'), JSON.stringify(corpus));
  const resultsDir = join(dir, 'results');
  const logs = [];
  const o = { benchDir: BENCH, engines: ['ct2-m', 'bogus-x'], langs: ['en'], runs: 2, force: false, dryRun: false, resultsDir, corpusDir, modelMap: { 'ct2-m': { args: ['--base-url', base] } }, timeoutMs: 30000, log: (m) => logs.push(m) };
  let s = await runMatrix(o);
  assert.deepEqual(s, { ran: 2, skipped: 0, failed: 1 });
  assert.ok(existsSync(join(resultsDir, 'ct2-m__en__r1.json')) && existsSync(join(resultsDir, 'ct2-m__en__r2.json')));
  s = await runMatrix(o);
  assert.equal(s.skipped, 2);
  s = await runMatrix({ ...o, force: true, engines: ['ct2-m'] });
  assert.equal(s.ran, 2);
  s = await runMatrix({ ...o, dryRun: true, force: true, engines: ['ct2-m'] });
  assert.ok(logs.some((l) => l.startsWith('dry-run')));

  const groups = loadResults(resultsDir);
  assert.equal(groups.get('ct2-m\ten').length, 2);
  const md = buildReport({ groups, corpora: { en: loadCorpus(join(corpusDir, 'en.json')) }, scenarios: loadScenarios(resultsDir), monitors: loadMonitors(resultsDir), power: [], ratings: loadRatings(resultsDir) });
  assert.match(md, /\| ct2-m \| en \| 2 \|/);
  assert.match(md, /하드 조건/);
  assert.match(md, /\*\*ct2-m\*\*: 번역 Click \[here\]번역 to continue 3 times\.|\*\*ct2-m\*\*: /);
  assert.match(md, /원문: Click \[here\] to continue 3 times\./);
  assert.match(md, /PENDING/);
  srv.close();
});

test('hardConditions: pass/fail/pending combos', () => {
  const sp = { warmP50: 300 };
  const ag = { slotReturnRate: 0.99, xPreservationRate: null };
  const mon = [{ engine: 'e', scenario: 'usage-sim', analysis: { peakTotalKb: 1000 * 1024, swapDeltaPages: 0, unloaded: true } }];
  assert.equal(hardConditions('e', sp, ag, mon).overall, 'PASS');
  assert.equal(hardConditions('e', sp, ag, []).overall, 'PENDING');
  assert.equal(hardConditions('e', { warmP50: 900 }, ag, mon).p50, 'FAIL');
  assert.equal(hardConditions('e', sp, { ...ag, xPreservationRate: 0.5 }, mon).slot, 'FAIL');
  const big = [{ engine: 'e', scenario: 'usage-sim', analysis: { peakTotalKb: 2000 * 1024, swapDeltaPages: 5, unloaded: false } }];
  const h = hardConditions('e', sp, ag, big);
  assert.deepEqual([h.mem, h.swap, h.unload, h.overall], ['FAIL', 'FAIL', 'FAIL', 'FAIL']);
});
