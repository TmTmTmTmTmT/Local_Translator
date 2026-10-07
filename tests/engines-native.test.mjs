import test from 'node:test';
import assert from 'node:assert'; // loose: vm 컨텍스트 객체는 프로토타입이 달라 strict deepEqual 불가
import { readFileSync, readdirSync } from 'node:fs';
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
  assert.deepEqual(await mt.status('ja'), { available: false, reason: 'needs_language_pack', lang: 'ja' });
  assert.deepEqual(await mt.status('zh-Hans'), { available: false, reason: 'unsupported_lang' });
  assert.deepEqual(await fm.status(), { available: false, reason: 'model_not_ready' });
  const bad = E.createNativeEngine('apple-mt', { send: async () => { throw new Error('x'); } });
  assert.equal((await bad.status()).available, false);
});

test('structured error {code,lang,message} is parsed; lang field wins over suffix', async () => {
  const run = async (error) => { try { await E.createNativeEngine('apple-mt', { send: async () => ({ ok: false, error }) }).translate(blocks, {}, 'ja'); } catch (e) { return e; } };
  let e = await run({ code: 'needs_language_pack', lang: 'zh-Hans', message: 'install it' });
  assert.equal(e.code, 'needs_language_pack'); assert.equal(e.lang, 'zh-Hans'); assert.equal(e.message, 'install it');
  e = await run({ code: 'needs_language_pack:ja', lang: 'ko' });
  assert.equal(e.lang, 'ko');
  for (const code of ['unsupported_lang', 'timeout', 'engine_unavailable', 'bad_response', 'unknown']) {
    e = await run({ code, message: 'm' });
    assert.equal(e.code, code);
  }
  e = await run('plain string');
  assert.equal(e.code, 'unknown');
  e = await E.createNativeEngine('apple-mt', { send: async () => ({ ok: false }) }).translate(blocks, {}, 'en').catch((x) => x);
  assert.equal(e.code, 'unknown');
});

test('malformed results entries are skipped, non-array results is bad_response', async () => {
  const eng = (resp) => E.createNativeEngine('apple-mt', { send: async () => resp });
  const out = await eng({ ok: true, results: [null, 3, { id: 'a' }, { id: 'b', slots: { 0: 'x' } }] }).translate(blocks, {}, 'en');
  assert.deepEqual([...out.keys()], ['b']);
  await assert.rejects(eng({ ok: true, results: 'no' }).translate(blocks, {}, 'en'), { code: 'bad_response' });
  await assert.rejects(eng('garbage').translate(blocks, {}, 'en'), { code: 'bad_response' });
});

test('status(): error shape and engine_unavailable on bad status', async () => {
  const st = (resp) => E.createNativeEngine('apple-mt', { send: async () => resp }).status('en');
  assert.deepEqual(await st({ ok: false, error: { code: 'timeout' } }), { available: false, reason: 'timeout' });
  assert.deepEqual(await st(null), { available: false, reason: 'engine_unavailable' });
  assert.deepEqual(await st({ ok: true, engines: { 'apple-mt': { available: false, reason: 'unsupported_lang' } } }), { available: false, reason: 'unsupported_lang' });
});

test('Swift extension never downloads/prepares language packs or touches cloud models', () => {
  const dir = new URL('../xcode/Local Translator/Local Translator Extension/', import.meta.url);
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.swift'))) {
    const code = readFileSync(new URL(f, dir), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    assert.ok(!/prepareTranslation|translationTask|PrivateCloudComputeLanguageModel/.test(code), f);
  }
});
