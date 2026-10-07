// One-command benchmark orchestrator: per model, preflight -> start server -> monitor -> run.mjs -> teardown.
//   node bench/orchestrate.mjs --only <id,...|all> [--langs en,ja,zh-Hans,zh-Hant] [--runs 1] [--skip-existing]
//        [--idle-wait 0] [--engine-timeout 1200] [--results-dir dir] [--dry-run]
// Sequential, never two servers at once, 127.0.0.1 only, no downloads/installs. Without --skip-existing, run.mjs gets --force.
import { spawn, execFile } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, appendFileSync, openSync, closeSync } from 'node:fs';
import net from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs, writeJson } from './lib/cli.mjs';
import { expandLangs } from './lib/plan.mjs';
import { sleep } from './lib/timing.mjs';
import { runProc } from './run.mjs';
import {
  validateModels, selectEntries, applicableLangs, serverCommand, ollamaStopCommand, modelMapFor, runMjsArgs,
  missingResults, preflight, convertCommand, waitReady, httpCheck, parsePs, rssKbFor, formatLogLine, ENGINE_TIMEOUT_MS,
} from './lib/orchestrate.mjs';

const BENCH = dirname(fileURLToPath(import.meta.url));
const VENV_BIN = join(BENCH, '.venv', 'bin');
const VENV_PY = join(VENV_BIN, 'python');

export function defaultExec(cmd, args, { env = {}, timeoutMs = 60000 } = {}) {
  return new Promise((res) => {
    execFile(cmd, args, { env: { ...process.env, ...env }, timeout: timeoutMs, maxBuffer: 8 * 1024 * 1024 }, (err, stdout, stderr) => {
      res({ ok: !err, code: err ? (err.code ?? -1) : 0, stdout: String(stdout || ''), stderr: String(stderr || '') });
    });
  });
}

const portOpen = (port) => new Promise((res) => {
  const s = net.connect({ host: '127.0.0.1', port });
  s.once('connect', () => { s.destroy(); res(true); });
  s.once('error', () => res(false));
});

async function waitPortFree(port, timeoutMs = 30000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) { if (!(await portOpen(port))) return true; await sleep(500); }
  return false;
}

function killTree(child) {
  const sig = (s) => { try { process.kill(-child.pid, s); } catch { try { child.kill(s); } catch { /* gone */ } } };
  return new Promise((res) => {
    if (child.exitCode !== null || child.signalCode) return res();
    child.once('exit', () => res());
    sig('SIGTERM');
    setTimeout(() => { if (child.exitCode === null && !child.signalCode) sig('SIGKILL'); }, 10000);
    setTimeout(res, 15000);
  });
}

export async function main(argv) {
  const a = parseArgs(argv);
  const resultsDir = resolve(a.resultsDir || join(BENCH, 'results'));
  mkdirSync(resultsDir, { recursive: true });
  const models = JSON.parse(readFileSync(join(BENCH, 'models.json'), 'utf8'));
  const errs = validateModels(models);
  if (errs.length) { console.error('models.json invalid:\n' + errs.join('\n')); process.exit(2); }
  if (!a.only || a.only === true) { console.error('usage: node bench/orchestrate.mjs --only <id,...|all> [--langs ..] [--runs 1] [--skip-existing] [--idle-wait 0] [--dry-run]'); process.exit(2); }
  const { entries, unknown } = selectEntries(models, a.only);
  if (unknown.length) { console.error(`unknown engine ids: ${unknown.join(', ')}`); process.exit(2); }

  const langs = expandLangs(a.langs);
  const runs = a.runs ? Number(a.runs) : 1;
  const idleWait = a.idleWait !== undefined ? Number(a.idleWait) : 0;
  const engineTimeout = a.engineTimeout ? Number(a.engineTimeout) * 1000 : ENGINE_TIMEOUT_MS;
  const dryRun = !!a.dryRun;
  const logFile = join(resultsDir, 'orchestrate.log');
  const say = (m) => console.log(m);
  const ctx = { exec: defaultExec, exists: existsSync, listDir: (p) => readdirSync(p), benchDir: BENCH, venvPython: VENV_PY, venvBin: VENV_BIN };
  const fileLog = (line) => { console.log(line); appendFileSync(logFile, line + '\n'); };

  const summary = [];
  let current = null; // {server, monitorOn} for signal cleanup
  const cleanup = async () => {
    if (current?.server) await killTree(current.server);
    if (current?.monitorOn) await runProc('bash', [join(BENCH, 'monitor.sh'), 'stop'], { timeoutMs: 20000 });
  };
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, async () => { await cleanup(); process.exit(130); });

  const ollamaUp = httpCheck('http://127.0.0.1:11434/api/tags');
  const isUp = async () => { try { return await ollamaUp(); } catch { return false; } };

  for (const entry of entries) {
    const t0 = Date.now();
    const useLangs = applicableLangs(entry, langs);
    const srv = serverCommand(entry, { venvPython: VENV_PY, benchDir: BENCH });
    const mapFile = join(resultsDir, '.tmp', `modelmap__${entry.engineId}.json`);

    if (dryRun) {
      const pf = await preflight(entry, ctx);
      say(`[${pf.status.toUpperCase()}] ${entry.engineId} (${entry.runtime}, tier ${entry.tier}) langs=${useLangs.join(',') || '-'}  ${pf.detail}`);
      say(`    server: ${entry.runtime === 'ollama' ? '(ollama service, keep_alive via adapter arg, then ollama stop)' : `${srv.cmd} ${srv.args.join(' ')}`} port=${srv.port}`);
      say(`    run: node ${runMjsArgs(entry, { benchDir: BENCH, langs: useLangs, runs, modelMapFile: mapFile, resultsDir, force: !a.skipExisting }).join(' ')}`);
      summary.push({ id: entry.engineId, status: pf.status });
      continue;
    }

    let status = 'FAIL', detail = '', baselineKb, peakKb = 0, server = null, ownOllama = null, monitorOn = false, sampler = null;
    try {
      if (entry.runtime === 'ollama' && !(await isUp())) {
        ownOllama = spawn('ollama', ['serve'], { stdio: 'ignore', detached: true });
        ownOllama.on('error', () => {});
        const r = await waitReady({ check: ollamaUp, timeoutMs: srv.readyTimeoutMs, sleep, isAlive: () => ownOllama.exitCode === null });
        if (!r.ok) { detail = `ollama service not ready: ${r.reason}`; throw new Error(detail); }
      }
      let pf = await preflight(entry, ctx);
      if (pf.status === 'convertible') {
        const cc = convertCommand(entry, { venvBin: VENV_BIN, benchDir: BENCH, listDir: ctx.listDir });
        fileLog(`[${new Date().toISOString()}] convert ${entry.engineId}: ${cc.cmd} ${cc.args.join(' ')}`);
        const r = await runProc(cc.cmd, cc.args, { timeoutMs: 600000 });
        pf = await preflight(entry, ctx);
        if (pf.status !== 'present') { status = 'SKIP'; detail = `conversion failed: ${r.tail.replace(/\s+/g, ' ').slice(-200)}`; throw new Error('skip'); }
      }
      if (pf.status !== 'present') { status = 'SKIP'; detail = `${pf.status}: ${pf.detail}`; throw new Error('skip'); }
      if (!useLangs.length) { status = 'SKIP'; detail = 'no supported langs in selection'; throw new Error('skip'); }
      if (a.skipExisting && !missingResults(entry, useLangs, runs, resultsDir, existsSync).length) { status = 'SKIP'; detail = 'results exist'; throw new Error('skip'); }

      if (entry.runtime !== 'ollama') {
        if (await portOpen(srv.port)) { detail = `port ${srv.port} already in use`; throw new Error(detail); }
        mkdirSync(join(resultsDir, '.tmp'), { recursive: true });
        const fd = openSync(join(resultsDir, `server__${entry.engineId}.log`), 'a');
        server = spawn(srv.cmd, srv.args, { stdio: ['ignore', fd, fd], detached: true, env: { ...process.env, ...srv.env } });
        closeSync(fd);
        server.on('error', () => {});
        current = { server };
        const r = await waitReady({ check: httpCheck(srv.readyUrl), timeoutMs: srv.readyTimeoutMs, sleep, isAlive: () => server.exitCode === null && !server.signalCode });
        if (!r.ok) { detail = `server not ready: ${r.reason} after ${Math.round(r.waitedMs / 1000)}s`; throw new Error(detail); }
      }
      writeJson(mapFile, modelMapFor(entry));

      const sample = async () => {
        const r = await defaultExec('ps', ['-axo', 'pid=,rss=,comm=']);
        if (r.ok) return rssKbFor(parsePs(r.stdout), entry, server?.pid);
        return 0;
      };
      baselineKb = await sample();
      peakKb = baselineKb;
      const csv = join(resultsDir, `monitor__${entry.engineId}.csv`);
      const mon = await runProc('bash', [join(BENCH, 'monitor.sh'), 'start', csv], { timeoutMs: 20000 });
      monitorOn = mon.ok;
      current = { ...current, monitorOn };
      if (!mon.ok) detail += ` monitor start failed: ${mon.tail.slice(-100)}`;
      let sampling = false;
      sampler = setInterval(async () => { if (sampling) return; sampling = true; peakKb = Math.max(peakKb, await sample()); sampling = false; }, 1000);

      const left = Math.max(60000, engineTimeout - (Date.now() - t0));
      const rr = await runProc(process.execPath, runMjsArgs(entry, { benchDir: BENCH, langs: useLangs, runs, modelMapFile: mapFile, resultsDir, force: !a.skipExisting }), { timeoutMs: left });
      if (/\[timeout\]/.test(rr.tail)) detail += ' run.mjs timeout';

      if (monitorOn) {
        await runProc('bash', [join(BENCH, 'monitor.sh'), 'mark', 'end'], { timeoutMs: 20000 });
        if (idleWait > 0) {
          await runProc('bash', [join(BENCH, 'monitor.sh'), 'idle', 'idle'], { timeoutMs: 20000 });
          await sleep(idleWait * 1000);
        }
      }
      peakKb = Math.max(peakKb, await sample());
      const miss = missingResults(entry, useLangs, runs, resultsDir, existsSync);
      status = /timeout/.test(detail) ? 'TIMEOUT' : miss.length ? 'FAIL' : 'OK';
      detail += ` results=${useLangs.length * runs - miss.length}/${useLangs.length * runs}${miss.length ? ` missing=${miss.join('|')}` : ''}`;
    } catch (e) {
      if (e.message !== 'skip' && !detail) detail = String(e.message);
    } finally {
      if (sampler) clearInterval(sampler);
      if (monitorOn) await runProc('bash', [join(BENCH, 'monitor.sh'), 'stop'], { timeoutMs: 20000 });
      if (server) { await killTree(server); await waitPortFree(srv.port); }
      if (entry.runtime === 'ollama' && status !== 'SKIP') await runProc(ollamaStopCommand(entry).cmd, ollamaStopCommand(entry).args, { timeoutMs: 30000 });
      if (ownOllama) { await killTree(ownOllama); await waitPortFree(srv.port); }
      current = null;
    }
    fileLog(formatLogLine({ ts: new Date().toISOString(), status, entry, durationSec: (Date.now() - t0) / 1000, baselineKb, peakKb: baselineKb === undefined ? undefined : peakKb, detail }));
    summary.push({ id: entry.engineId, status });
  }
  say('--- summary ---');
  for (const s of summary) say(`${s.status.padEnd(11)} ${s.id}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((e) => { console.error(e.stack || e); process.exit(1); });
}
