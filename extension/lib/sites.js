// 호스트 목록 파싱·매칭·match pattern 변환. background와 node 테스트 양쪽에서 사용.
(function () {
  'use strict';

  // www는 의도적으로 유지: example.com 항목이 www.example.com을 이미 포함하므로 변환 불필요.
  function normalizeHost(input) {
    let s = String(input == null ? '' : input).trim().toLowerCase();
    s = s.replace(/^[a-z][a-z0-9+.-]*:\/\//, '');
    s = s.replace(/[/?#].*$/, '');
    s = s.replace(/^[^@]*@/, '');
    s = s.replace(/^\*\./, '');
    if (!s.startsWith('[')) s = s.replace(/:\d*$/, '');
    s = s.replace(/\.+$/, '');
    return s;
  }

  function parseHostList(textOrArray) {
    let raw;
    if (Array.isArray(textOrArray)) {
      raw = textOrArray.map((e) => (e && typeof e === 'object' ? e.host : e));
    } else {
      raw = String(textOrArray == null ? '' : textOrArray)
        .split(/[\r\n,]+/)
        .map((l) => l.replace(/#.*$/, ''));
    }
    const out = [];
    const seen = new Set();
    for (const r of raw) {
      const h = normalizeHost(r);
      if (!h || /\s/.test(h) || seen.has(h)) continue;
      seen.add(h);
      out.push(h);
    }
    return out;
  }

  function hostMatches(host, entry) {
    const h = normalizeHost(host);
    const e = normalizeHost(entry);
    if (!h || !e) return false;
    return h === e || h.endsWith('.' + e);
  }

  function toMatchPatterns(entries) {
    const out = [];
    for (const h of parseHostList(entries)) {
      out.push('*://' + h + '/*', '*://*.' + h + '/*');
    }
    return out;
  }

  function isSiteEnabled(settings, host) {
    if (!settings || settings.enabled === false) return false;
    const sites = Array.isArray(settings.sites) ? settings.sites : [];
    return parseHostList(sites).some((e) => hostMatches(host, e));
  }

  const api = { normalizeHost, parseHostList, hostMatches, toMatchPatterns, isSiteEnabled };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.lib = globalThis.KT.lib || {};
  globalThis.KT.lib.sites = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
