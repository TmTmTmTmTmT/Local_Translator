// Builds the injection bundle for the in-app browser harness (docs/TEST_LOOP.md "H" procedure). Usage: node build-inject.mjs <out.js>
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'extension');
const out = process.argv[2];
if (!out) { console.error('usage: build-inject.mjs <out.js>'); process.exit(2); }
const FILES = ['lib/josa.js', 'content/text.js', 'content/filter.js', 'content/segmenter.js', 'content/apply.js', 'content/main.js'];

const head = `(function () {
  var all = function () { return window.__ktAll === true; };
  window.requestAnimationFrame = function (f) { return setTimeout(function () { f(0); }, 16); };
  window.IntersectionObserver = function (cb) {
    var els = new Set();
    var t = setInterval(function () {
      var o = [];
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (all() || (r.bottom > 0 && r.top < innerHeight * 2.5 && (r.width || r.height))) o.push({ target: el, isIntersecting: true, intersectionRatio: 1 });
      });
      if (o.length) cb(o);
    }, 150);
    this.observe = function (el) { els.add(el); };
    this.unobserve = function (el) { els.delete(el); };
    this.disconnect = function () { clearInterval(t); els.clear(); };
  };
  window.__kt = { calls: 0, blocks: 0 };
  window.browser = {
    storage: { sync: { get: function () { return Promise.resolve({ settings: { enabled: true } }); } } },
    runtime: { sendMessage: function (msg) {
      if (!msg || msg.type !== 'translate') return Promise.resolve({});
      window.__kt.calls++; window.__kt.blocks += msg.blocks.length;
      return Promise.resolve({ ok: true, engine: 'mock', results: msg.blocks.map(function (b) {
        var s = {};
        b.items.forEach(function (x) { if (x.k === 't') s[String(x.i)] = '\\uD55C(' + x.text.trim() + ')'; });
        return { id: b.id, slots: s };
      }) });
    } },
  };
})();
`;
let s = head;
for (const f of FILES) s += `(0, eval)(${JSON.stringify(readFileSync(join(ROOT, f), 'utf8'))});\n`;
writeFileSync(out, s);
