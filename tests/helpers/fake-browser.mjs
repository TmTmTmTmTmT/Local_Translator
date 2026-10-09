// 테스트 헬퍼: background.js와 lib를 vm으로 로드하고 가짜 browser를 만든다.
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ext = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'extension');

export function loadBackground() {
  const sandbox = { URL, TextEncoder, console, Promise, setTimeout, clearTimeout };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const f of ['lib/hash.js', 'lib/glossary.js', 'lib/sites.js', 'lib/cache.js', 'background.js']) {
    vm.runInContext(fs.readFileSync(path.join(ext, f), 'utf8'), sandbox, { filename: f });
  }
  return sandbox.KT;
}

const ev = () => {
  const ls = [];
  return { addListener: (f) => ls.push(f), listeners: ls, fire: (...a) => Promise.all(ls.map((f) => f(...a))) };
};

export function makeFakeBrowser(initial = {}) {
  const sync = Object.assign({}, initial.sync);
  const local = Object.assign({}, initial.local);
  const pick = (store, k) => (k == null ? { ...store } : { [k]: store[k] }.constructor === Object && k in store ? { [k]: store[k] } : {});
  const b = {
    calls: { register: [], unregister: [], badge: [], tabsCreate: [], tabsUpdate: [] },
    unregisterThrows: true,
    storage: {
      sync: { get: async (k) => pick(sync, k), set: async (o) => { Object.assign(sync, o); } },
      local: { get: async (k) => pick(local, k), set: async (o) => { Object.assign(local, o); } },
      onChanged: ev(),
      _sync: sync, _local: local,
    },
    scripting: {
      registerContentScripts: async (arr) => { b.calls.register.push(arr); },
      unregisterContentScripts: async (f) => {
        b.calls.unregister.push(f);
        if (b.unregisterThrows) throw new Error('Nonexistent script ID');
      },
    },
    action: { setBadgeText: async (o) => { b.calls.badge.push(o); } },
    tabs: {
      create: async (o) => { b.calls.tabsCreate.push(o); return { id: 99 }; },
      update: async (id, o) => { b.calls.tabsUpdate.push({ id, ...o }); },
      query: async () => [{ id: 1 }],
      onRemoved: ev(),
      onUpdated: ev(),
    },
    runtime: { getURL: (p) => 'safari-web-extension://abc/' + p, onMessage: ev(), onInstalled: ev(), onStartup: ev() },
    webNavigation: { onBeforeNavigate: ev(), onCommitted: ev() },
  };
  return b;
}
