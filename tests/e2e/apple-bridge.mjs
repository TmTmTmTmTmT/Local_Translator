// Manual tool: loopback HTTP bridge to the bench Swift engine (apple-mt-marker). Not part of npm test.
// Usage: node tests/e2e/apple-bridge.mjs   (127.0.0.1:8797)   POST /translate {blocks, lang, context?} -> {ok, results:[{id,slots}]}
import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BIN = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'bench', 'engines', 'apple', '.build', 'release', 'kt-bench');
const ENGINE = 'apple-mt-marker';
const TIMEOUT_MS = 120000;
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' };

function runBench(corpus) {
  const dir = mkdtempSync(join(tmpdir(), 'kt-bridge-'));
  const cpath = join(dir, 'corpus.json'), opath = join(dir, 'out.json');
  writeFileSync(cpath, JSON.stringify(corpus));
  return new Promise((resolve, reject) => {
    const p = spawn(BIN, ['--engine', ENGINE, '--corpus', cpath, '--out', opath], { stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    p.stdout.on('data', (d) => { err += d; });
    p.stderr.on('data', (d) => { err += d; });
    const timer = setTimeout(() => { p.kill('SIGKILL'); reject(new Error('timeout')); }, TIMEOUT_MS);
    p.on('error', (e) => { clearTimeout(timer); reject(e); });
    p.on('close', (code) => {
      clearTimeout(timer);
      try {
        if (code !== 0) throw new Error(`kt-bench exit ${code}: ${err.slice(0, 300)}`);
        resolve(JSON.parse(readFileSync(opath, 'utf8')));
      } catch (e) { reject(e); } finally { rmSync(dir, { recursive: true, force: true }); }
    });
  });
}

let chain = Promise.resolve();
const serial = (fn) => { const r = chain.then(fn, fn); chain = r.catch(() => {}); return r; };

const server = http.createServer(async (req, res) => {
  const send = (code, obj) => { res.writeHead(code, { ...CORS, 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
  if (req.method === 'OPTIONS') { res.writeHead(204, CORS); return res.end(); }
  if (req.method !== 'POST' || req.url !== '/translate') return send(404, { ok: false, error: 'not_found' });
  let body = '';
  for await (const c of req) body += c;
  try {
    const { blocks, lang, context } = JSON.parse(body);
    if (!Array.isArray(blocks)) return send(400, { ok: false, error: 'bad_request' });
    const corpus = { lang: lang || 'en', context: { title: (context && context.title) || '', host: (context && context.host) || '' },
      blocks: blocks.map((b) => ({ id: b.id, items: b.items })) };
    const r = await serial(() => runBench(corpus));
    if (r.error) return send(200, { ok: false, error: r.error });
    send(200, { ok: true, results: r.blocks.map((b) => (b.slots ? { id: b.id, slots: b.slots } : { id: b.id, error: b.error || 'failed' })) });
  } catch (e) { send(500, { ok: false, error: String(e.message || e) }); }
});
server.requestTimeout = TIMEOUT_MS;
server.listen(8797, '127.0.0.1', () => console.log('apple-bridge listening on 127.0.0.1:8797'));
