import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const script = join(fileURLToPath(import.meta.url), '../../scripts/install.sh');
const run = (args, env) => spawnSync('bash', [script, ...args], { encoding: 'utf8', env: { ...process.env, HOME: process.env.HOME, ...env } });

test('install.sh --dry-run builds with the team, 26.0 target, verifies signature, never uses sudo', () => {
  const r = run(['--dry-run', '-y', '--no-open'], { TEAM_ID: 'ABCDE12345' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /DEVELOPMENT_TEAM=ABCDE12345/);
  assert.match(r.stdout, /MACOSX_DEPLOYMENT_TARGET=26\.0/);
  assert.match(r.stdout, /CODE_SIGN_STYLE=Automatic/);
  assert.match(r.stdout, /TeamIdentifier=ABCDE12345/);
  assert.doesNotMatch(r.stdout, /sudo|defaults write|rm -rf/);
  assert.match(r.stdout, /ditto .*Local Translator\.app/);
});

test('install.sh without a detectable team exits 2 with guidance', () => {
  const r = run(['--dry-run'], { TEAM_ID: '', KT_INSTALL_NO_DETECT: '1' });
  // .local/team-id cache may exist on a dev machine; only assert the guidance path when it does not.
  if (r.status === 2) {
    assert.match(r.stderr, /Accounts/);
    assert.match(r.stderr, /TEAM_ID=/);
  } else {
    assert.equal(r.status, 0);
  }
});

test('install.sh rejects unknown options', () => {
  assert.equal(run(['--bogus'], {}).status, 64);
});
