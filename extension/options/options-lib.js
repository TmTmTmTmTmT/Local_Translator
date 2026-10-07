// Pure helpers for the options page: defaults, site/exclude parsing, loopback validation.
(function (root) {
  const ENGINES = [
    { id: 'native:apple-mt', label: 'Apple 번역 (시스템)' },
    { id: 'native:apple-fm', label: 'Apple Intelligence (온디바이스)' },
    { id: 'local:ollama', label: 'Ollama (localhost)' },
    { id: 'local:mlx', label: 'MLX 서버 (localhost)' },
    { id: 'local:mt-ollama', label: 'MT 모드 Ollama (번역 특화 모델, localhost)' },
    { id: 'local:mt-mlx', label: 'MT 모드 MLX (번역 특화 모델, localhost)' },
    { id: 'local:ct2', label: 'CTranslate2 MT 서버 (localhost)' },
  ];
  const KINDS = ['ollama', 'mlx', 'ct2'];
  const FAMILIES = ['hymt2', 'translategemma', 'chat'];
  const DEFAULT_KEEP_ALIVE = 300;
  const HOST_RE = /^(?=.{1,253}$)[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/;

  function defaults() {
    return {
      sites: [],
      engine: { default: 'native:apple-mt', byLang: { ja: null, zh: null } },
      localhost: { baseUrl: 'http://127.0.0.1:11434', kind: 'ollama', model: '', family: 'hymt2', keepAlive: DEFAULT_KEEP_ALIVE },
      enabled: true,
    };
  }

  function mergeSettings(stored) {
    const d = defaults();
    const s = stored && typeof stored === 'object' ? stored : {};
    const engineIds = ENGINES.map((e) => e.id);
    const eng = s.engine && typeof s.engine === 'object' ? s.engine : {};
    const by = eng.byLang && typeof eng.byLang === 'object' ? eng.byLang : {};
    const pick = (v) => (engineIds.includes(v) ? v : null);
    const lh = s.localhost && typeof s.localhost === 'object' ? s.localhost : {};
    return {
      sites: Array.isArray(s.sites)
        ? s.sites
            .filter((x) => x && typeof x.host === 'string' && x.host)
            .map((x) => ({ host: x.host, exclude: typeof x.exclude === 'string' ? x.exclude : '' }))
        : d.sites,
      engine: {
        default: pick(eng.default) || d.engine.default,
        byLang: { ja: pick(by.ja), zh: pick(by.zh) },
      },
      localhost: {
        baseUrl: typeof lh.baseUrl === 'string' && lh.baseUrl ? lh.baseUrl : d.localhost.baseUrl,
        kind: KINDS.includes(lh.kind) ? lh.kind : d.localhost.kind,
        model: typeof lh.model === 'string' ? lh.model : '',
        family: FAMILIES.includes(lh.family) ? lh.family : d.localhost.family,
        keepAlive: Number.isFinite(lh.keepAlive) && lh.keepAlive >= -1 ? Math.trunc(lh.keepAlive) : d.localhost.keepAlive,
      },
      enabled: typeof s.enabled === 'boolean' ? s.enabled : true,
    };
  }

  function normalizeHost(line) {
    return line.trim().toLowerCase().replace(/^\*\./, '').replace(/\.$/, '');
  }

  function isValidHost(h) {
    return HOST_RE.test(h);
  }

  // Returns {hosts, errors}; duplicates are dropped silently.
  function parseSitesText(text) {
    const hosts = [];
    const errors = [];
    String(text || '').split(/\r?\n/).forEach((raw, idx) => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;
      const h = normalizeHost(line);
      if (!isValidHost(h)) {
        errors.push({ line: idx + 1, message: `잘못된 호스트: ${line}` });
        return;
      }
      if (!hosts.includes(h)) hosts.push(h);
    });
    return { hosts, errors };
  }

  // 'host | css selector' lines -> {map: {host: "sel1, sel2"}, errors}. validate(selector) -> boolean is optional.
  function parseExcludeText(text, validate) {
    const map = {};
    const errors = [];
    String(text || '').split(/\r?\n/).forEach((raw, idx) => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;
      const p = line.indexOf('|');
      if (p < 0) {
        errors.push({ line: idx + 1, message: `형식: host | selector (${line})` });
        return;
      }
      const host = normalizeHost(line.slice(0, p));
      const sel = line.slice(p + 1).trim();
      if (!isValidHost(host)) {
        errors.push({ line: idx + 1, message: `잘못된 호스트: ${host}` });
        return;
      }
      if (!sel || (validate && !validate(sel))) {
        errors.push({ line: idx + 1, message: `잘못된 셀렉터: ${sel}` });
        return;
      }
      map[host] = map[host] ? `${map[host]}, ${sel}` : sel;
    });
    return { map, errors };
  }

  function buildSites(sitesText, excludeText, validate) {
    const a = parseSitesText(sitesText);
    const b = parseExcludeText(excludeText, validate);
    const errors = a.errors.concat(b.errors);
    for (const h of Object.keys(b.map)) {
      if (!a.hosts.includes(h)) errors.push({ line: 0, message: `제외 규칙의 호스트가 사이트 목록에 없음: ${h}` });
    }
    return { sites: a.hosts.map((host) => ({ host, exclude: b.map[host] || '' })), errors };
  }

  function sitesToText(sites) {
    return (sites || []).map((s) => s.host).join('\n');
  }

  // One line per host; multiple selectors stay joined in one line.
  function excludesToText(sites) {
    return (sites || []).filter((s) => s.exclude).map((s) => `${s.host} | ${s.exclude}`).join('\n');
  }

  function isLoopbackUrl(value) {
    let u;
    try {
      u = new URL(String(value).trim());
    } catch (e) {
      return false;
    }
    if (u.protocol !== 'http:') return false;
    if (u.username || u.password) return false;
    return u.hostname === '127.0.0.1' || u.hostname === 'localhost' || u.hostname === '[::1]';
  }

  function validateLocalhost(lh) {
    const errors = [];
    if (!isLoopbackUrl(lh.baseUrl)) errors.push('baseUrl은 http://127.0.0.1 또는 localhost 만 허용됩니다');
    if (!KINDS.includes(lh.kind)) errors.push('kind는 ollama, mlx, ct2 중 하나여야 합니다');
    if (lh.family !== undefined && !FAMILIES.includes(lh.family)) errors.push('family는 hymt2, translategemma, chat 중 하나여야 합니다');
    if (lh.keepAlive !== undefined && !(Number.isFinite(lh.keepAlive) && lh.keepAlive >= -1)) errors.push('keep-alive는 -1 이상의 초 단위 숫자여야 합니다');
    return errors;
  }

  const api = { ENGINES, KINDS, FAMILIES, defaults, mergeSettings, parseSitesText, parseExcludeText, buildSites, sitesToText, excludesToText, isLoopbackUrl, validateLocalhost, isValidHost };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.KTOptions = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
