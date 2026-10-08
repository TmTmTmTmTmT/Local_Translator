// Popup controller: queries background/content state and wires the buttons.
(function () {
  const api = typeof browser !== 'undefined' ? browser : chrome;
  const lib = globalThis.KTPopup;
  const debug = /[?&]debug\b/.test(location.search);
  let tab = null;
  let mode = 'translated';

  async function refresh() {
    let state = null;
    try {
      state = await api.runtime.sendMessage({ type: 'getState', url: tab && tab.url });
    } catch (e) {
      state = null;
    }
    lib.render(document, lib.buildViewModel(state, { url: tab && tab.url, debug, mode }));
  }

  async function init() {
    const tabs = await api.tabs.query({ active: true, currentWindow: true });
    tab = tabs[0] || null;
    if (tab) {
      try {
        mode = lib.modeOf(await api.tabs.sendMessage(tab.id, { type: 'getMode' }));
      } catch (e) {
        mode = 'translated'; // content script not injected on this tab
      }
    }
    await refresh();

    document.getElementById('site-toggle').addEventListener('change', async (e) => {
      const host = lib.hostOf(tab && tab.url);
      if (!host) return;
      await api.runtime.sendMessage({ type: 'setSiteEnabled', host, enabled: e.target.checked });
      await refresh();
    });

    document.getElementById('toggle-original').addEventListener('click', async () => {
      if (!tab) return;
      try {
        const res = await api.tabs.sendMessage(tab.id, { type: 'toggleOriginal' });
        if (res && res.mode) mode = res.mode;
      } catch (e) {
        // content script not injected on this tab
      }
      await refresh();
    });

    document.getElementById('pdf').addEventListener('click', async () => {
      if (!tab || !tab.url) return;
      await api.runtime.sendMessage({ type: 'openPdfViewer', url: tab.url });
      window.close();
    });

    document.getElementById('open-options').addEventListener('click', (e) => {
      e.preventDefault();
      api.runtime.openOptionsPage();
    });
  }

  init();
})();
