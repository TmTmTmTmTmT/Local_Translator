import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './ui-helpers.mjs';

const EXT = join(ROOT, 'extension');
const m = JSON.parse(readFileSync(join(EXT, 'manifest.json'), 'utf8'));
// Owned by other workers (T2, T4, T6, T9); skipped while absent, still required once present elsewhere.
const OTHER = /^(lib\/|engines\/|background\.js$|viewer\/)/;

test('manifest basics', () => {
  assert.equal(m.manifest_version, 3);
  assert.equal(m.name, 'Local Translator');
  assert.equal(m.version, '0.1.0');
  assert.equal(m.content_scripts, undefined);
  assert.equal(m.background.persistent, false);
  assert.equal(m.background.type, undefined);
  assert.ok(!m.permissions.includes('declarativeNetRequest'));
  assert.deepEqual(m.host_permissions, ['<all_urls>']);
  assert.deepEqual(m.web_accessible_resources.map((r) => r.resources), [['viewer/viewer.html']]);
});

test('referenced files exist (except other workers pending)', () => {
  const refs = [...m.background.scripts, m.action.default_popup, m.options_ui.page, ...Object.values(m.icons), ...Object.values(m.action.default_icon), ...m.web_accessible_resources.flatMap((r) => r.resources)];
  const missing = refs.filter((f) => !existsSync(join(EXT, f)));
  const mine = missing.filter((f) => !OTHER.test(f));
  assert.deepEqual(mine, []);
  if (missing.length) console.log('pending (other workers):', missing.join(', '));
});
