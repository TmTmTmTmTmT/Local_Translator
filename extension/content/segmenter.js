// DOM 서브트리 -> 블록 레코드(슬롯 + 고정 항목). 슬롯 모델은 PLAN §4.3.
(function () {
  'use strict';

  const KT = (globalThis.KT = globalThis.KT || {});
  const MAX_BLOCK_CHARS = 2000;
  const SUPPORTED = new Set(['en', 'ja', 'zh']);
  let counter = 0;

  function newRec(el) {
    const id = 'kt' + (++counter);
    return { id, el, lang: null, chars: 0, slots: [], block: { id, lang: null, items: [] } };
  }

  // opts: excludeSelector, isHandled(node), onShadowRoot(root), maxBlockChars, langs(Set)
  function collectBlocks(root, opts) {
    opts = opts || {};
    const T = KT.text, F = KT.filter;
    const maxChars = opts.maxBlockChars || MAX_BLOCK_CHARS;
    const langs = opts.langs || SUPPORTED;
    const out = [];
    if (!root) return out;
    let cur = null;

    function flush() {
      const rec = cur;
      cur = null;
      if (!rec || !rec.slots.length) return;
      const joined = rec.slots.map((s) => T.cleanText(s.original)).join(' ');
      const lang = T.detectLang(joined);
      if (!lang || !langs.has(lang)) return; // 한국어·미지원 언어·판정 불가는 번역하지 않음
      rec.lang = rec.block.lang = lang;
      out.push(rec);
    }

    function visitText(node) {
      const reason = F.exclusionReason(node, opts);
      if (reason === 'skip') return;
      const txt = T.cleanText(node.nodeValue);
      if (!txt) return;
      const blk = F.blockOf(node);
      if (cur && cur.el !== blk) flush();
      if (!cur) cur = newRec(blk);

      let fixed = reason === 'keep' || T.isNonlinguistic(txt) || T.hangulRatio(txt) >= 0.5 || txt.length > maxChars;
      if (!fixed && opts.isHandled && opts.isHandled(node)) fixed = true;
      if (fixed) { cur.block.items.push({ k: 'x', text: txt }); return; }

      if (cur.chars + txt.length > maxChars && cur.slots.length) {
        flush();
        cur = newRec(blk);
      }
      cur.block.items.push({ k: 't', i: cur.slots.length, text: txt });
      cur.slots.push({ node, original: node.nodeValue });
      cur.chars += txt.length;
    }

    if (root.nodeType === 3) { visitText(root); flush(); return out; }
    if (root.nodeType !== 1 && root.nodeType !== 11 && root.nodeType !== 9) return out;
    if (root.nodeType === 1) {
      if (F.exclusionReason(root, opts) === 'skip') return out;
      if (root.shadowRoot && opts.onShadowRoot) opts.onShadowRoot(root.shadowRoot);
    }

    const doc = root.ownerDocument || root;
    const walker = doc.createTreeWalker(root, 0x1 | 0x4, {
      acceptNode(n) {
        if (n.nodeType === 3) return 1; // ACCEPT
        if (F.exclusionReason(n, opts) === 'skip') return 2; // REJECT 서브트리
        if (n.shadowRoot && opts.onShadowRoot) opts.onShadowRoot(n.shadowRoot);
        return 3; // SKIP (자식은 계속)
      },
    });
    let n;
    while ((n = walker.nextNode())) visitText(n);
    flush();
    return out;
  }

  KT.segmenter = { collectBlocks, MAX_BLOCK_CHARS };
  KT.collectBlocks = collectBlocks;
})();
