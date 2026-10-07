// 블라인드 평가 UI. 데이터는 #data(JSON)에서 읽고, 엔진명은 다운로드 파일에만 기록한다.
(function () {
  'use strict';
  var D = JSON.parse(document.getElementById('data').textContent);
  var app = document.getElementById('app');
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  if (!D || !D.blocks || !D.blocks.length) {
    document.getElementById('title').textContent = '번역 블라인드 평가';
    app.appendChild(el('div', 'msg', (D && D.message) || '평가할 데이터가 없습니다. node bench/rate/build.mjs --lang <언어> 로 생성하세요.'));
    document.getElementById('download').disabled = true;
    return;
  }
  document.getElementById('title').textContent = '번역 블라인드 평가 (' + D.lang + ')';
  if (D.message) app.appendChild(el('div', 'msg', D.message));

  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h; }
  function rng(seed) { // mulberry32
    return function () {
      seed = (seed + 0x6D2B79F5) >>> 0;
      var t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffled(n, seedStr) {
    var a = [], i, r = rng(hash(seedStr));
    for (i = 0; i < n; i++) a.push(i);
    for (i = n - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var KEY = 'kt-rate-' + D.lang + '-' + hash(JSON.stringify(D.blocks.map(function (b) { return b.id; })) + D.engines.join(','));
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { state = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 저장 불가 환경 무시 */ } }
  function st(id) { return state[id] || (state[id] = { c: {}, best: null, memo: '' }); }

  // 블록별 후보 순서(시드 고정) 및 letter->candidate 매핑
  var order = {};
  D.blocks.forEach(function (b) { order[b.id] = shuffled(b.candidates.length, D.lang + '|' + b.id); });

  function isDone(b) {
    var s = state[b.id];
    if (!s || s.best == null) return false;
    return b.candidates.every(function (c, ci) {
      var k = s.c[ci]; return k && k.n && k.a;
    });
  }
  function updateProgress() {
    var n = D.blocks.filter(isDone).length;
    document.getElementById('bar').style.width = (100 * n / D.blocks.length) + '%';
    document.getElementById('progressText').textContent = n + ' / ' + D.blocks.length + ' 블록 완료';
    D.blocks.forEach(function (b) {
      var e = document.getElementById('blk-' + b.id);
      if (e) e.classList.toggle('done', isDone(b));
    });
  }
  function parts(container, ps) {
    ps.forEach(function (p) {
      var s = el('span', p.k === 'x' ? 'fx' : p.k === 'miss' ? 'miss' : null, p.text);
      container.appendChild(s);
    });
  }
  function scale(name, label, cur, onPick) {
    var row = el('div', 'row');
    row.appendChild(el('span', 'n', label));
    for (var v = 1; v <= 5; v++) {
      (function (v) {
        var lb = el('label'), inp = document.createElement('input');
        inp.type = 'radio'; inp.name = name; inp.value = v; inp.checked = cur === v;
        inp.addEventListener('change', function () { onPick(v); });
        lb.appendChild(inp); lb.appendChild(document.createTextNode(String(v)));
        row.appendChild(lb);
      })(v);
    }
    return row;
  }

  D.blocks.forEach(function (b, bi) {
    var s = st(b.id);
    var box = el('section', 'block'); box.id = 'blk-' + b.id;
    box.appendChild(el('h2', null, (bi + 1) + '. ' + b.genre));
    var src = el('div', 'src'); parts(src, b.source); box.appendChild(src);
    box.appendChild(el('div', 'small', '노란 [대괄호] 항목은 번역하지 않는 고정 항목입니다.'));
    var bestRow = el('div', 'row best');
    bestRow.appendChild(el('span', 'n', '최선'));
    order[b.id].forEach(function (ci, pos) {
      var c = b.candidates[ci];
      var cand = el('div', 'cand');
      var head = el('div');
      head.appendChild(el('span', 'lab', '후보 ' + LET[pos]));
      if (c.error || c.missing) head.appendChild(el('span', 'badge', '⚠ ' + (c.error ? '오류: ' + c.error : '슬롯 누락')));
      cand.appendChild(head);
      var t = el('div', 'txt'); parts(t, c.parts); cand.appendChild(t);
      var cs = s.c[ci] || (s.c[ci] = {});
      cand.appendChild(scale('n-' + b.id + '-' + ci, '자연스러움', cs.n, function (v) { cs.n = v; save(); updateProgress(); }));
      cand.appendChild(scale('a-' + b.id + '-' + ci, '정확성', cs.a, function (v) { cs.a = v; save(); updateProgress(); }));
      box.appendChild(cand);
      var lb = el('label'), inp = document.createElement('input');
      inp.type = 'radio'; inp.name = 'best-' + b.id; inp.value = ci; inp.checked = s.best === ci;
      inp.addEventListener('change', function () { s.best = ci; save(); updateProgress(); });
      lb.appendChild(inp); lb.appendChild(document.createTextNode(LET[pos]));
      bestRow.appendChild(lb);
    });
    box.appendChild(bestRow);
    var memo = document.createElement('textarea');
    memo.placeholder = '메모 (선택)'; memo.value = s.memo || '';
    memo.addEventListener('input', function () { s.memo = memo.value; save(); });
    box.appendChild(memo);
    app.appendChild(box);
  });
  updateProgress();

  function build() {
    return {
      lang: D.lang,
      createdAt: new Date().toISOString(),
      ratings: D.blocks.map(function (b) {
        var s = st(b.id);
        return {
          blockId: b.id,
          candidates: order[b.id].map(function (ci, pos) {
            var c = b.candidates[ci], k = s.c[ci] || {};
            return {
              engine: c.engine, label: '후보 ' + LET[pos],
              naturalness: k.n || null, accuracy: k.a || null,
              best: s.best === ci, error: c.error || (c.missing ? 'missing-slots' : null)
            };
          }),
          memo: s.memo || ''
        };
      })
    };
  }
  function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
  function fmt(v) { return v == null ? '-' : v.toFixed(2); }
  function reveal(r) {
    var by = {};
    r.ratings.forEach(function (b) {
      b.candidates.forEach(function (c) {
        var e = by[c.engine] || (by[c.engine] = { n: [], a: [], best: 0 });
        if (c.naturalness) e.n.push(c.naturalness);
        if (c.accuracy) e.a.push(c.accuracy);
        if (c.best) e.best++;
      });
    });
    var box = document.getElementById('reveal');
    box.hidden = false; box.textContent = '';
    box.appendChild(el('h2', null, '엔진 공개'));
    var tb = document.createElement('table');
    var hr = tb.insertRow();
    ['엔진', '자연스러움 평균', '정확성 평균', '최선 횟수', '평가 수'].forEach(function (h) { var th = document.createElement('th'); th.textContent = h; hr.appendChild(th); });
    Object.keys(by).sort(function (x, y) { return (mean(by[y].n) || 0) - (mean(by[x].n) || 0); }).forEach(function (k) {
      var r2 = tb.insertRow(), e = by[k];
      [k, fmt(mean(e.n)), fmt(mean(e.a)), String(e.best), String(e.n.length)].forEach(function (v) { r2.insertCell().textContent = v; });
    });
    box.appendChild(tb);
    box.scrollIntoView && box.scrollIntoView({ behavior: 'smooth' });
  }
  document.getElementById('download').addEventListener('click', function () {
    var r = build();
    var blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ratings-' + D.lang + '.json';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    reveal(r);
  });
  document.getElementById('reset').addEventListener('click', function () {
    if (!confirm('이 언어의 평가를 모두 지울까요?')) return;
    try { localStorage.removeItem(KEY); } catch (e) { /* 무시 */ }
    location.reload();
  });
})();
