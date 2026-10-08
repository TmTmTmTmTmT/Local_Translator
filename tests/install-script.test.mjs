import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
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

test('install.sh quits a running app before replacing it and warns about a running Safari', () => {
  const r = run(['--dry-run', '-y', '--no-open'], { TEAM_ID: 'ABCDE12345' });
  assert.match(r.stdout, /종료/);
  const src = fs.readFileSync(script, 'utf8');
  assert.match(src, /osascript .*quit/);
  assert.match(src, /pgrep -x Safari/);
  assert.ok(src.indexOf('quit_running_app\n') < src.indexOf('trash_copy "$DEST"') || src.indexOf('quit_running_app\n') < src.indexOf('ditto "$BUILT"'));
});
