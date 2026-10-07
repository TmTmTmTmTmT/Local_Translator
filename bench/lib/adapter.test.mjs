// End-to-end adapter tests against loopback fake servers (no external network).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { main as ollamaMain } from '../engines/ollama.mjs';
import { main as mlxMain } from '../engines/mlx.mjs';
import { main as ct2Main } from '../engines/ct2.mjs';
import { postJson } from './http.mjs';

const t = (i, text) => ({ k: 't', i, text });
const corpus = {
  lang: 'en', context: { title: 'T', host: 'h.example' },
  blocks: [
    { id: 'b1', genre: 'ui', items: [t(0, 'Click '), { k: 'x', text: 'here' }, t(1, ' to continue.')] },
    { id: 'b2', genre: 'ui', items: [t(0, 'Hello world')] },
  ],
};

function serve(handler) {
  return new Promise((resolve) => {
    const calls = [];
    const srv = http.createServer((req, res) => {
      let body = '';
      req.on('data', (d) => (body += d));
      req.on('end', () => {
        const parsed = body ? JSON.parse(body) : null;
        calls.push({ url: req.url, body: parsed });
        const out = handler(req.url, parsed, calls.length);
        res.writeHead(out.status || 200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(out.json ?? {}));
      });
    });
    srv.listen(0, '127.0.0.1', () => resolve({ srv, calls, base: `http://127.0.0.1:${srv.address().port}` }));
  });
}

const setup = () => {
  const dir = mkdtempSync(join(tmpdir(), 'ktbench-'));
  const cp = join(dir, 'c.json');
  writeFileSync(cp, JSON.stringify(corpus));
  return { dir, cp, out: join(dir, 'out.json') };
};
const chat = (content) => ({ json: { choices: [{ message: { content } }] } });

test('ollama: retry once on bad JSON, fences+think parsed, keep_alive and json mode sent', async () => {
  const { srv, calls, base } = await serve((url, body, n) =>
    n === 1 ? chat('죄송합니다 JSON이 아닙니다')
      : chat('<think>hmm</think>```json\n{"blocks":[{"id":"b1","t":{"0":"계속하려면 ","1":"을(를) 클릭하세요."}},{"id":"b2","t":{"0":"안녕 세상"}}]}\n```'));
  const { cp, out } = setup();
  await ollamaMain(['--engine', 'ollama-qwen3-1.7b', '--corpus', cp, '--out', out, '--model', 'qwen3:1.7b', '--keep-alive', '0', '--base-url', base]);
  srv.close();
  const r = JSON.parse(readFileSync(out, 'utf8'));
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, '/v1/chat/completions');
  assert.equal(calls[0].body.keep_alive, 0);
  assert.equal(calls[0].body.temperature, 0.2);
  assert.deepEqual(calls[0].body.response_format, { type: 'json_object' });
  assert.ok(calls[0].body.options.num_ctx >= 2048);
  assert.match(calls[0].body.messages[1].content, /\/no_think$/);
  assert.equal(r.engine, 'ollama-qwen3-1.7b');
  assert.deepEqual(r.blocks[0].slots, { 0: '계속하려면 ', 1: '을(를) 클릭하세요.' });
  assert.equal(r.blocks[0].error, null);
  assert.equal(r.batches.length, 1);
  assert.equal(r.batches[0].retried, true);
  assert.equal(r.batches[0].jsonValid, true);
  assert.equal(r.batchLimit.blocks, 40);
  assert.equal(r.env.keepAliveSec, 0);
  assert.ok(r.coldMs >= 0 && r.totalMs >= r.coldMs);
});

test('ollama: persistent parse failure -> per-block error, slots null', async () => {
  const { srv, calls, base } = await serve(() => chat('not json'));
  const { cp, out } = setup();
  await ollamaMain(['--engine', 'ollama-x', '--corpus', cp, '--out', out, '--model', 'x', '--base-url', base]);
  srv.close();
  const r = JSON.parse(readFileSync(out, 'utf8'));
  assert.equal(calls.length, 2);
  assert.ok(r.blocks.every((b) => b.slots === null && /JSON parse failure/.test(b.error)));
  assert.equal(r.batches[0].jsonValid, false);
});

test('ollama: 400 on response_format -> retried without it', async () => {
  const { srv, calls, base } = await serve((url, body) =>
    body.response_format ? { status: 400, json: { error: 'nope' } } : chat('{"blocks":[{"id":"b1","t":{"0":"a","1":"b"}},{"id":"b2","t":{"0":"c"}}]}'));
  const { cp, out } = setup();
  await ollamaMain(['--engine', 'ollama-x', '--corpus', cp, '--out', out, '--model', 'x', '--base-url', base]);
  srv.close();
  assert.equal(calls.length, 2);
  assert.deepEqual(JSON.parse(readFileSync(out, 'utf8')).blocks[1].slots, { 0: 'c' });
});

test('ollama: HTTP failure recorded as block errors (no throw)', async () => {
  const { srv, base } = await serve(() => ({ status: 500, json: { error: 'boom' } }));
  const { cp, out } = setup();
  await ollamaMain(['--engine', 'ollama-x', '--corpus', cp, '--out', out, '--model', 'x', '--base-url', base]);
  srv.close();
  const r = JSON.parse(readFileSync(out, 'utf8'));
  assert.ok(r.blocks.every((b) => /HTTP 500/.test(b.error)));
});

test('mlx: OpenAI-compatible request', async () => {
  const { srv, calls, base } = await serve(() => chat('{"blocks":[{"id":"b1","t":{"0":"a","1":"b"}},{"id":"b2","t":{"0":"c"}}]}'));
  const { cp, out } = setup();
  await mlxMain(['--engine', 'mlx-m', '--corpus', cp, '--out', out, '--model', 'org/m-4bit', '--base-url', base]);
  srv.close();
  assert.equal(calls[0].body.model, 'org/m-4bit');
  assert.ok(calls[0].body.max_tokens >= 1024);
  assert.equal(JSON.parse(readFileSync(out, 'utf8')).blocks[0].slots[1], 'b');
});

test('ct2: contract {src,tgt:"ko",texts} and run-splitting assembly', async () => {
  const { srv, calls, base } = await serve((url, body) => ({ json: { translations: body.texts.map((x) => `KO(${x})`) } }));
  const { cp, out } = setup();
  await ct2Main(['--engine', 'ct2-m', '--corpus', cp, '--out', out, '--base-url', base]);
  srv.close();
  assert.equal(calls[0].url, '/translate');
  assert.deepEqual(calls[0].body, { src: 'en', tgt: 'ko', texts: ['Click', 'to continue.', 'Hello world'] });
  const r = JSON.parse(readFileSync(out, 'utf8'));
  assert.deepEqual(r.blocks[0].slots, { 0: 'KO(Click) ', 1: ' KO(to continue.)' });
  assert.deepEqual(r.blocks[1].slots, { 0: 'KO(Hello world)' });
});

test('ct2: count mismatch -> block errors', async () => {
  const { srv, base } = await serve(() => ({ json: { translations: ['only one'] } }));
  const { cp, out } = setup();
  await ct2Main(['--engine', 'ct2-m', '--corpus', cp, '--out', out, '--base-url', base]);
  srv.close();
  assert.ok(JSON.parse(readFileSync(out, 'utf8')).blocks.every((b) => b.slots === null && b.error));
});

test('non-loopback URLs are refused', async () => {
  await assert.rejects(() => postJson('http://example.com/x', {}), /non-loopback/);
});
