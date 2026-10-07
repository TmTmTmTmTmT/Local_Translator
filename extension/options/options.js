// Options page controller: loads/saves `settings` in storage.sync (PROTOCOL §1).
(function () {
  const api = typeof browser !== 'undefined' ? browser : chrome;
  const lib = globalThis.KTOptions;
  const $ = (id) => document.getElementById(id);

  function fillEngines(select, withInherit) {
    select.textContent = '';
    if (withInherit) {
      const o = document.createElement('option');
      o.value = '';
      o.textContent = '(기본 엔진 사용)';
      select.appendChild(o);
    }
    for (const e of lib.ENGINES) {
      const o = document.createElement('option');
      o.value = e.id;
      o.textContent = e.label;
      select.appendChild(o);
    }
  }

  function validSelector(sel) {
    try {
      document.createDocumentFragment().querySelector(sel);
      return true;
    } catch (e) {
      return false;
    }
  }

  function setFeedback(msg, ok) {
    const el = $('feedback');
    el.textContent = msg;
    el.className = ok ? 'ok' : 'err';
  }

  function showErrors(list) {
    const ul = $('errors');
    ul.textContent = '';
    for (const m of list) {
      const li = document.createElement('li');
      li.textContent = m;
      ul.appendChild(li);
    }
  }

  function populate(s) {
    $('engine-default').value = s.engine.default;
    $('engine-ja').value = s.engine.byLang.ja || '';
    $('engine-zh').value = s.engine.byLang.zh || '';
    $('lh-kind').value = s.localhost.kind;
    $('lh-base').value = s.localhost.baseUrl;
    $('lh-model').value = s.localhost.model;
    $('sites').value = lib.sitesToText(s.sites);
    $('excludes').value = lib.excludesToText(s.sites);
  }

  async function load() {
    const got = await api.storage.sync.get('settings');
    populate(lib.mergeSettings(got && got.settings));
  }

  async function save() {
    const current = lib.mergeSettings((await api.storage.sync.get('settings')).settings);
    const built = lib.buildSites($('sites').value, $('excludes').value, validSelector);
    const localhost = { baseUrl: $('lh-base').value.trim(), kind: $('lh-kind').value, model: $('lh-model').value.trim() };
    const errors = built.errors.map((e) => (e.line ? `${e.line}줄: ${e.message}` : e.message)).concat(lib.validateLocalhost(localhost));
    showErrors(errors);
    if (errors.length) {
      setFeedback('저장하지 않았습니다. 오류를 확인하세요', false);
      return;
    }
    const settings = {
      sites: built.sites,
      engine: {
        default: $('engine-default').value,
        byLang: { ja: $('engine-ja').value || null, zh: $('engine-zh').value || null },
      },
      localhost,
      enabled: current.enabled,
    };
    await api.storage.sync.set({ settings });
    setFeedback('저장했습니다', true);
  }

  async function clearCache() {
    try {
      const res = await api.runtime.sendMessage({ type: 'clearCache' });
      setFeedback(res && res.ok ? '캐시를 비웠습니다' : '캐시를 비우지 못했습니다', !!(res && res.ok));
    } catch (e) {
      setFeedback('캐시를 비우지 못했습니다', false);
    }
  }

  fillEngines($('engine-default'), false);
  fillEngines($('engine-ja'), true);
  fillEngines($('engine-zh'), true);
  $('save').addEventListener('click', save);
  $('clear-cache').addEventListener('click', clearCache);
  load();
})();
