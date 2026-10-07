// 캐시 키용 결정적 64비트 FNV-1a 해시 (UTF-8 바이트 기준).
(function () {
  'use strict';
  const OFFSET = 0xcbf29ce484222325n;
  const PRIME = 0x100000001b3n;
  const MASK = 0xffffffffffffffffn;

  function fnv1a64Hex(str) {
    const bytes = new TextEncoder().encode(String(str));
    let h = OFFSET;
    for (let i = 0; i < bytes.length; i++) {
      h ^= BigInt(bytes[i]);
      h = (h * PRIME) & MASK;
    }
    return h.toString(16).padStart(16, '0');
  }

  // PROTOCOL §6: hash(engineId|model|JSON(items))
  function cacheKey(engineId, model, items) {
    return fnv1a64Hex(engineId + '|' + (model || '') + '|' + JSON.stringify(items));
  }

  const api = { fnv1a64Hex, cacheKey };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.lib = globalThis.KT.lib || {};
  globalThis.KT.lib.hash = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
