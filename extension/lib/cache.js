// Map 기반 LRU와 디바운스 영속 캐시(메모리 LRU + storage 미러).
(function () {
  'use strict';

  class LRU {
    constructor(capacity) {
      this.capacity = Math.max(1, capacity | 0);
      this.map = new Map();
    }
    get size() { return this.map.size; }
    has(k) { return this.map.has(k); }
    get(k) {
      if (!this.map.has(k)) return undefined;
      const v = this.map.get(k);
      this.map.delete(k);
      this.map.set(k, v);
      return v;
    }
    set(k, v) {
      if (this.map.has(k)) this.map.delete(k);
      this.map.set(k, v);
      while (this.map.size > this.capacity) this.map.delete(this.map.keys().next().value);
      return this;
    }
    delete(k) { return this.map.delete(k); }
    clear() { this.map.clear(); }
    keys() { return Array.from(this.map.keys()); } // 오래된 것 먼저
    entries() { return Array.from(this.map.entries()); }
  }

  // load(): Promise<{key: value}> (오래된 것 먼저), save(obj): Promise. 저장은 debounceMs 동안 모아 1회.
  function createPersistentCache(opts) {
    const o = opts || {};
    const mem = new LRU(o.capacity || 2000);
    const disk = new LRU(o.persistMax || 5000);
    const debounceMs = o.debounceMs == null ? 2000 : o.debounceMs;
    const now = o.now || Date.now;
    const setT = o.setTimeout || ((f, ms) => setTimeout(f, ms));
    const clearT = o.clearTimeout || ((t) => clearTimeout(t));
    let timer = null;
    let dirty = false;
    let loaded = null;
    let lastSavedAt = 0;

    function ready() {
      if (!loaded) {
        loaded = Promise.resolve(o.load ? o.load() : null).then((obj) => {
          if (obj && typeof obj === 'object') {
            for (const k of Object.keys(obj)) disk.set(k, obj[k]);
          }
        }).catch(() => {});
      }
      return loaded;
    }

    async function flush() {
      if (timer != null) { clearT(timer); timer = null; }
      if (!dirty || !o.save) return;
      dirty = false;
      const obj = {};
      for (const [k, v] of disk.entries()) obj[k] = v;
      lastSavedAt = now();
      try { await o.save(obj); } catch (e) { dirty = true; }
    }

    function schedule() {
      dirty = true;
      if (timer != null) return;
      timer = setT(() => { timer = null; flush(); }, debounceMs);
    }

    return {
      ready,
      get(k) {
        let v = mem.get(k);
        if (v !== undefined) { disk.get(k); return v; }
        v = disk.get(k);
        if (v !== undefined) mem.set(k, v);
        return v;
      },
      set(k, v) { mem.set(k, v); disk.set(k, v); schedule(); },
      clear() { mem.clear(); disk.clear(); schedule(); },
      flush,
      get size() { return mem.size; },
      get persistedSize() { return disk.size; },
      get lastSavedAt() { return lastSavedAt; },
    };
  }

  const api = { LRU, createPersistentCache };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.lib = globalThis.KT.lib || {};
  globalThis.KT.lib.cache = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
