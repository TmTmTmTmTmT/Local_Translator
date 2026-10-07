// 테스트 헬퍼: extension/engines/*.js 클래식 스크립트를 vm 컨텍스트에 순서대로 로드 (package.json이 type:module이라 require 불가).
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'extension', 'engines');

export function loadEngines() {
  const sandbox = { URL, TextEncoder, AbortController, setTimeout, clearTimeout, console, Promise };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const f of ['common', 'prompt', 'native', 'localhost', 'registry']) {
    vm.runInContext(fs.readFileSync(path.join(dir, `${f}.js`), 'utf8'), sandbox, { filename: `${f}.js` });
  }
  return sandbox.KT.engines;
}

// 가짜 fetch: handler(url, init) -> {status, body}|object. 호출 기록 반환.
export function mockFetch(handler) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init, body: init && init.body ? JSON.parse(init.body) : undefined });
    const r = await handler(url, init, calls.length);
    const status = r.status || 200;
    const text = typeof r.body === 'string' ? r.body : JSON.stringify(r.body);
    return { ok: status >= 200 && status < 300, status, text: async () => text };
  };
  fn.calls = calls;
  return fn;
}

export const chatReply = (content) => ({ body: { choices: [{ message: { content } }] } });
export const B = (id, ...items) => ({ id, lang: 'en', items });
export const t = (i, text) => ({ k: 't', i, text });
export const x = (text) => ({ k: 'x', text });
