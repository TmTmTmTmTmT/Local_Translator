// Matrix runner: engines x langs x runs, plus --scenario resource scenarios. Sequential, continues on failure.
//   node bench/run.mjs --engines a,b --langs en,ja --runs 3 [--model-map f.json] [--force] [--dry-run]
//   node bench/run.mjs --scenario resident,unload,usage-sim --engines a [--langs en] [--interval 30 --duration 300 --idle-wait 300]
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, appendFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs, writeJson } from './lib/cli.mjs';
import { loadCorpus, sliceCorpus } from './lib/corpus.mjs';
import { sleep } from './lib/timing.mjs';
import {
  expandLangs, adapterCommand, resultPath, scenarioPath, monitorPath, modelFor, adapterArgs, SCENARIOS,
} from './lib/plan.mjs';

const BENCH = dirname(fileURLToPath(import.meta.url));

function makeLogger(file) {
  mkdirSync(dirname(file), { recursive: true });
  return (msg) => {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    appendFileSync(file, line + '\n');
  };
}

// Spawn with timeout; never throws. Returns {ok, code, ms, tail}.
export function runProc(cmd, args, { timeoutMs = 900000 } = {}) {
  return new Promise((resolveP) => {
    const t0 = Date.now();
    let tail = '';
    let child;
    try { child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch (e) { return resolveP({ ok: false, code: -1, ms: 0, tail: String(e.message) }); }
    const add = (d) => { tail = (tail + d).slice(-1500); };
    child.stdout.on('data', add);
    child.stderr.on('data', add);
    const timer = setTimeout(() => { tail += '\n[timeout]'; child.kill('SIGKILL'); }, timeoutMs);
    child.on('error', (e) => { clearTimeout(timer); resolveP({ ok: false, code: -1, ms: Date.now() - t0, tail: String(e.message) }); });
    child.on('close', (code) => { clearTimeout(timer); resolveP({ ok: code === 0, code, ms: Date.now() - t0, tail: tail.trim() }); });
  });
}

function loadModelMap(path) {
  if (!path) return {};
  return JSON.parse(readFileSync(path, 'utf8'));
}

export async function runMatrix(o) {
  const { engines, langs, runs, force, dryRun, resultsDir, corpusDir, modelMap, timeoutMs, log } = o;
  const summary = { ran: 0, skipped: 0, failed: 0 };
  for (const engineId of engines) {
    let ac;
    try { ac = adapterCommand(engineId, o.benchDir); } catch (e) { log(`FAIL ${engineId}: ${e.message}`); summary.failed++; continue; }
    const { model, args: extra } = modelFor(engineId, modelMap);
    for (const lang of langs) {
      for (let run = 1; run <= runs; run++) {
        const out = resultPath(resultsDir, engineId, lang, run);
        if (existsSync(out) && !force) { log(`skip ${engineId} ${lang} r${run} (exists)`); summary.skipped++; continue; }
        const args = [...ac.args, ...adapterArgs({ engineId, corpus: join(corpusDir, `${lang}.json`), out, model, run, extra })];
        if (dryRun) { log(`dry-run: ${ac.cmd} ${args.join(' ')}`); continue; }
        log(`run ${engineId} ${lang} r${run}`);
        const r = await runProc(ac.cmd, args, { timeoutMs });
        if (r.ok && existsSync(out)) { log(`ok ${engineId} ${lang} r${run} ${r.ms}ms`); summary.ran++; }
        else { log(`FAIL ${engineId} ${lang} r${run} code=${r.code} ${r.tail.replace(/\s+/g, ' ').slice(-300)}`); summary.failed++; }
      }
    }
  }
  return summary;
}

async function monitor(action, arg, log) {
  const r = await runProc('bash', [join(BENCH, 'monitor.sh'), action, ...(arg ? [arg] : [])], { timeoutMs: 20000 });
  if (!r.ok) log(`monitor ${action} failed: ${r.tail.slice(-200)}`);
  return r.ok;
}

export async function runScenarios(o) {
  const { engines, names, resultsDir, corpusDir, modelMap, force, dryRun, timeoutMs, log } = o;
  const lang = o.langs[0] || 'en';
  const intervalSec = o.intervalSec, durationSec = o.durationSec;
  for (const engineId of engines) {
    let ac;
    try { ac = adapterCommand(engineId, o.benchDir); } catch (e) { log(`FAIL ${engineId}: ${e.message}`); continue; }
    const { model, args: extra } = modelFor(engineId, modelMap);
    for (const name of names) {
      const sc = SCENARIOS[name];
      if (!sc) { log(`unknown scenario ${name}`); continue; }
      const outFile = scenarioPath(resultsDir, engineId, name);
      if (existsSync(outFile) && !force) { log(`skip scenario ${engineId} ${name} (exists)`); continue; }
      const corpusPath = join(corpusDir, `${lang}.json`);
      const corpus = loadCorpus(corpusPath);
      const tmpDir = join(resultsDir, '.tmp');
      mkdirSync(tmpDir, { recursive: true });
      const csv = monitorPath(resultsDir, engineId, name);
      const rec = { engine: engineId, model: model ?? null, name, lang, keepAliveSec: sc.keepAlive, intervalSec: name === 'usage-sim' ? intervalSec : null, startedAt: null, endedAt: null, monitorCsv: csv, steps: [] };
      const doStep = async (k, corpusFile) => {
        const out = join(tmpDir, `${engineId}__${name}__${k}.json`);
        const args = [...ac.args, ...adapterArgs({ engineId, corpus: corpusFile, out, model, keepAlive: sc.keepAlive, run: k + 1, maxBlocks: sc.maxBlocks, extra })];
        const t = Date.now();
        const r = await runProc(ac.cmd, args, { timeoutMs });
        let result = null;
        if (r.ok && existsSync(out)) { result = JSON.parse(readFileSync(out, 'utf8')); rmSync(out); }
        else log(`FAIL scenario ${engineId} ${name} step ${k}: ${r.tail.replace(/\s+/g, ' ').slice(-300)}`);
        return { k, at: new Date(t).toISOString(), offsetSec: Math.round((t - Date.parse(rec.startedAt)) / 1000), wallMs: r.ms, ok: !!result, result };
      };
      if (dryRun) { log(`dry-run scenario ${engineId} ${name} lang=${lang} keepAlive=${sc.keepAlive}`); continue; }
      log(`scenario ${engineId} ${name} start`);
      await monitor('start', csv, log);
      await monitor('mark', `start:${name}`, log);
      rec.startedAt = new Date().toISOString();
      const t0 = Date.now();
      if (name === 'usage-sim') {
        const steps = Math.max(1, Math.ceil(durationSec / intervalSec));
        for (let k = 0; k < steps; k++) {
          const wait = t0 + k * intervalSec * 1000 - Date.now();
          if (wait > 0) await sleep(wait);
          const sliceFile = join(tmpDir, `${engineId}__${name}__slice${k}.json`);
          writeJson(sliceFile, sliceCorpus(corpus, k * 6, 6));
          rec.steps.push(await doStep(k, sliceFile));
          rmSync(sliceFile, { force: true });
        }
      } else {
        rec.steps.push(await doStep(0, corpusPath));
      }
      rec.endedAt = new Date().toISOString();
      await monitor('mark', 'end', log);
      const idle = name === 'unload' ? Math.min(o.idleWaitSec, 60) : o.idleWaitSec;
      rec.idleWaitSec = idle;
      writeJson(outFile, rec);
      if (idle > 0) { log(`scenario ${engineId} ${name}: idle wait ${idle}s`); await sleep(idle * 1000); }
      await monitor('stop', null, log);
      log(`scenario ${engineId} ${name} done -> ${outFile}`);
    }
  }
}

export async function main(argv) {
  const a = parseArgs(argv);
  if (!a.engines || a.engines === true) { console.error('usage: node bench/run.mjs --engines a,b [--langs en,ja] [--runs 3] [--model-map f.json] [--force] [--scenario resident,unload,usage-sim]'); process.exit(2); }
  const resultsDir = resolve(a.resultsDir || join(BENCH, 'results'));
  const o = {
    benchDir: BENCH,
    engines: String(a.engines).split(',').map((s) => s.trim()).filter(Boolean),
    langs: expandLangs(a.langs),
    runs: a.runs ? Number(a.runs) : 3,
    force: !!a.force,
    dryRun: !!a.dryRun,
    resultsDir,
    corpusDir: resolve(a.corpusDir || join(BENCH, 'corpus')),
    modelMap: loadModelMap(a.modelMap),
    timeoutMs: (a.timeout ? Number(a.timeout) : 900) * 1000,
    log: makeLogger(join(resultsDir, 'run.log')),
    intervalSec: a.interval ? Number(a.interval) : 30,
    durationSec: a.duration ? Number(a.duration) : 300,
    idleWaitSec: a.idleWait !== undefined ? Number(a.idleWait) : 300,
  };
  if (a.scenario) {
    const names = a.scenario === true || a.scenario === 'all' ? Object.keys(SCENARIOS) : String(a.scenario).split(',');
    if (a.langs === undefined) o.langs = ['en'];
    await runScenarios({ ...o, names });
  } else {
    const s = await runMatrix(o);
    o.log(`matrix done ran=${s.ran} skipped=${s.skipped} failed=${s.failed}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((e) => { console.error(e.stack || e); process.exit(1); });
}
