import test from 'node:test';
import assert from 'node:assert'; // loose: vm 컨텍스트 객체는 프로토타입이 달라 strict deepEqual 불가
import { loadEngines } from './engines-load.mjs';

const E = loadEngines();
const send = async () => ({});

test('listEngines covers all IDs with en/ja/zh', () => {
  const l = E.listEngines();
  assert.deepEqual(l.map((e) => e.id).sort(), ['local:ct2', 'local:mlx', 'local:ollama', 'native:apple-fm', 'native:apple-mt']);
  for (const e of l) assert.deepEqual([...e.langs], ['en', 'ja', 'zh']);
});

test('pickEngine: byLang overrides default, null falls back', () => {
  const s = { engine: { default: 'native:apple-mt', byLang: { ja: 'native:apple-fm', zh: null } } };
  assert.equal(E.pickEngine(s, 'ja', { send }).id, 'native:apple-fm');
  assert.equal(E.pickEngine(s, 'zh', { send }).id, 'native:apple-mt');
  assert.equal(E.pickEngine(s, 'zh-Hans', { send }).id, 'native:apple-mt');
  assert.equal(E.pickEngine(s, 'en', { send }).id, 'native:apple-mt');
  assert.equal(E.pickEngine({ engine: { default: 'local:ct2', byLang: { zh: 'local:ollama' } } }, 'zh-Hant').id, 'local:ollama');
});

test('pickEngine: defaults, unknown IDs, unsupported lang', () => {
  assert.equal(E.pickEngine({}, 'en').id, 'native:apple-mt');
  assert.equal(E.pickEngine({ engine: { default: 'local:mlx', byLang: { ja: 'bogus' } } }, 'ja').id, 'local:mlx');
  assert.throws(() => E.pickEngine({}, 'fr'), { code: 'unsupported_lang' });
  assert.throws(() => E.getEngine('nope'), { code: 'engine_unavailable' });
  assert.equal(E.getEngine('local:ct2').id, 'local:ct2');
  assert.equal(E.getEngine('local:ct2'), E.getEngine('local:ct2'));
});
