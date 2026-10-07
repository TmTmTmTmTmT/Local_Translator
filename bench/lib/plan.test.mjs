import { test } from 'node:test';
import assert from 'node:assert/strict';
import { expandLangs, adapterCommand, modelFor, adapterArgs, resultPath, engineFamily } from './plan.mjs';

test('expandLangs', () => {
  assert.deepEqual(expandLangs('en,ja'), ['en', 'ja']);
  assert.deepEqual(expandLangs('zh,en'), ['zh-Hans', 'zh-Hant', 'en']);
  assert.equal(expandLangs(undefined).length, 4);
});

test('adapterCommand by family', () => {
  assert.match(adapterCommand('apple-fm', '/b').cmd, /kt-bench$/);
  assert.match(adapterCommand('ollama-x', '/b').args[0], /engines\/ollama\.mjs$/);
  assert.match(adapterCommand('ct2-m2m100', '/b').args[0], /ct2\.mjs$/);
  assert.throws(() => adapterCommand('weird-x', '/b'));
  assert.equal(engineFamily('mlx-qwen3-4b'), 'mlx');
});

test('modelFor and adapterArgs', () => {
  assert.deepEqual(modelFor('ollama-qwen3-1.7b', { 'ollama-qwen3-1.7b': 'qwen3:1.7b' }), { model: 'qwen3:1.7b', args: [] });
  assert.deepEqual(modelFor('ollama-x', { 'ollama-x': { model: 'm', args: ['--api', 'native'] } }), { model: 'm', args: ['--api', 'native'] });
  assert.equal(modelFor('apple-fm').model, undefined);
  assert.equal(modelFor('ollama-foo-bar').model, 'foo-bar');
  const a = adapterArgs({ engineId: 'apple-fm', corpus: 'c', out: 'o', keepAlive: 0, maxBlocks: 6, run: 2 });
  assert.ok(!a.includes('--max-blocks'));
  assert.deepEqual(a.slice(a.indexOf('--keep-alive'), a.indexOf('--keep-alive') + 2), ['--keep-alive', '0']);
  assert.ok(adapterArgs({ engineId: 'ollama-x', corpus: 'c', out: 'o', maxBlocks: 6 }).includes('--max-blocks'));
  assert.equal(resultPath('/r', 'e', 'en', 3), '/r/e__en__r3.json');
});
