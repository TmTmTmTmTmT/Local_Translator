import test from 'node:test';
import assert from 'node:assert'; // loose: vm 컨텍스트 객체는 프로토타입이 달라 strict deepEqual 불가
import { loadEngines, B, t, x } from './engines-load.mjs';

const E = loadEngines();
const blocks = [B('a', t(0, 'Hello'))];

test('translate sends PROTOCOL §4 message and returns Map', async () => {
  const sent = [];
  const send = async (app, msg) => { sent.push([app, msg]); return { ok: true, results: [{ id: 'a', slots: { 0: '안녕', 1: 5 } }] }; };
  const eng = E.createNativeEngine('apple-mt', { send, applicationId: 'app.x' });
  const out = await eng.translate(blocks, { title: 'T', host: 'h' }, 'en');
  assert.deepEqual(out.get('a'), { 0: '안녕' });
  assert.equal(sent[0][0], 'app.x');
  assert.deepEqual(sent[0][1], { type: 'translate', engine: 'apple-mt', lang: 'en', context: { title: 'T', host: 'h' }, blocks });
});

test('limits and ids', () => {
  const mt = E.createNativeEngine('apple-mt', { send: async () => ({}) });
  const fm = E.createNativeEngine('apple-fm', { send: async () => ({}) });
  assert.equal(mt.id, 'native:apple-mt');
  assert.deepEqual(JSON.parse(JSON.stringify(mt.batchLimit)), { chars: 6000, blocks: 40 });
  assert.deepEqual(JSON.parse(JSON.stringify(fm.batchLimit)), { chars: 1500, blocks: 8 });
  assert.equal(fm.concurrency, 1);
  assert.equal(fm.kind, 'native');
});

test('error code mapping', async () => {
  const mk = (resp) => E.createNativeEngine('apple-mt', { send: async () => resp });
  const code = async (resp, lang = 'ja') => { try { await mk(resp).translate(blocks, {}, lang); } catch (e) { return e; } };
  let e = await code({ ok: false, error: { code: 'needs_language_pack:ja', message: 'install' } });
  assert.equal(e.code, 'needs_language_pack'); assert.equal(e.lang, 'ja');
  e = await code({ ok: false, error: { code: 'needs_language_pack', message: 'm' } });
  assert.equal(e.code, 'needs_language_pack');
  e = await code({ ok: false, error: { code: 'rate_limited' } });
  assert.equal(e.code, 'rate_limited');
  e = await code({ ok: false, error: { code: 'weird' } });
  assert.equal(e.code, 'unknown');
  e = await code({ ok: true });
  assert.equal(e.code, 'bad_response');
  e = await code(null);
  assert.equal(e.code, 'bad_response');
  e = await code({ ok: true, results: [] }, 'fr');
  assert.equal(e.code, 'unsupported_lang');
  const eng = E.createNativeEngine('apple-fm', { send: async () => { throw new Error('boom'); } });
  await assert.rejects(eng.translate(blocks, {}, 'en'), { code: 'engine_unavailable' });
});

test('status()', async () => {
  const resp = { ok: true, engines: { 'apple-mt': true, 'apple-fm': { available: false, reason: 'model_not_ready' } }, languagePacks: { en: 'installed', ja: 'supported', zh: 'unsupported' } };
  const send = async (_a, m) => { assert.deepEqual(m, { type: 'status' }); return resp; };
  const mt = E.createNativeEngine('apple-mt', { send });
  const fm = E.createNativeEngine('apple-fm', { send });
  assert.deepEqual(await mt.status(), { available: true });
  assert.deepEqual(await mt.status('en'), { available: true });
  assert.deepEqual(await mt.status('ja'), { available: false, reason: 'needs_language_pack' });
  assert.deepEqual(await mt.status('zh-Hans'), { available: false, reason: 'unsupported_lang' });
  assert.deepEqual(await fm.status(), { available: false, reason: 'model_not_ready' });
  const bad = E.createNativeEngine('apple-mt', { send: async () => { throw new Error('x'); } });
  assert.equal((await bad.status()).available, false);
});
