// DOM 서브트리 -> 블록 레코드(슬롯 + 고정 항목). 슬롯 모델은 PLAN §4.3.
(function () {
  'use strict';

  const KT = (globalThis.KT = globalThis.KT || {});
  const MAX_BLOCK_CHARS = 6000;
  const SUPPORTED = new Set(['en', 'ja', 'zh']);
  const KANA = /[\u3040-\u30ff]/;
  let counter = 0;

  // detectLang은 가나 없는 한자 위주 블록을 zh로 판정하므로, 일본어 페이지 보정용 lang 힌트를 읽는다.
  function langHint(el) {
    const host = el && el.closest ? el.closest('[lang]') : null;
    const m = /^([a-z]{2,3})(?:[-_]|$)/i.exec(((host && host.getAttribute('lang')) || '').trim());
    const p = m ? m[1].toLowerCase() : '';
    return p === 'ja' || p === 'zh' ? p : '';
  }

  function newRec(el) {
    const id = 'kt' + (++counter);
    return { id, el, lang: null, chars: 0, slots: [], block: { id, lang: null, items: [] } };
  }

  // opts: linkMode('standalone'|'never'), excludeSelector, isHandled(node), onShadowRoot(root), maxBlockChars
  function collectBlocks(root, opts) {
    opts = opts || {};
    const T = KT.text, F = KT.filter;
    const maxChars = opts.maxBlockChars || MAX_BLOCK_CHARS;
    const out = [];
    const promote = opts.linkMode !== 'never'; // 빈 값·알 수 없는 값은 standalone
    let cur = null;
    let kanaBlocks = 0;
    const undecided = []; // 힌트 없는 한자-only 블록: 수집 끝에 문서 다수결로 확정

    function flush() {
      const rec = cur;
      cur = null;
      if (!rec) return;
      // 글자 있는 t 슬롯이 없고 링크 유래 x가 있으면(헤드라인·카드·메뉴) 링크 텍스트를 t로 승격.
      if (!rec.slots.length && rec.links && rec.links.length) {
        let chars = 0;
        for (const c of rec.links) {
          if (chars + c.text.length > maxChars && rec.slots.length) break;
          const idx = rec.block.items.indexOf(c.item);
          rec.block.items[idx] = { k: 't', i: rec.slots.length, text: c.text };
          rec.slots.push({ node: c.node, original: c.node.nodeValue });
          chars += c.text.length;
        }
        rec.chars = chars;
      }
      if (!rec.slots.length) return;
      const text = rec.slots.map((s) => T.cleanText(s.original)).join(' ');
      let lang = T.detectLang(text);
      const kana = KANA.test(text);
      if (lang === 'ja' && kana) kanaBlocks++;
      else if (lang === 'zh' && !kana) {
        const hint = langHint(rec.el);
        if (hint) lang = hint;
        else undecided.push(rec);
      }
      if (!SUPPORTED.has(lang)) return; // 한국어·미지원 언어·판정 불가는 번역하지 않음
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

      if (reason === 'link' && promote && !T.isNonlinguistic(txt) && T.hangulRatio(txt) < 0.5 && txt.length <= maxChars &&
        !(opts.isHandled && opts.isHandled(node))) {
        const item = { k: 'x', text: txt };
        cur.block.items.push(item);
        (cur.links = cur.links || []).push({ item, node, text: txt });
        return;
      }
      if (reason === 'keep' || reason === 'link' || T.isNonlinguistic(txt) || T.hangulRatio(txt) >= 0.5 || txt.length > maxChars ||
        (opts.isHandled && opts.isHandled(node))) {
        cur.block.items.push({ k: 'x', text: txt });
        return;
      }
      if (cur.chars + txt.length > maxChars && cur.slots.length) { flush(); cur = newRec(blk); }
      cur.block.items.push({ k: 't', i: cur.slots.length, text: txt });
      cur.slots.push({ node, original: node.nodeValue });
      cur.chars += txt.length;
    }

    if (!root || ![1, 3, 9, 11].includes(root.nodeType)) return out;
    if (root.nodeType === 3) { visitText(root); flush(); return out; }
    if (root.nodeType === 1) {
      if (F.exclusionReason(root, opts) === 'skip') return out;
      if (root.shadowRoot && opts.onShadowRoot) opts.onShadowRoot(root.shadowRoot);
    }

    const walker = (root.ownerDocument || root).createTreeWalker(root, 0x1 | 0x4, {
      acceptNode(n) {
        if (n.nodeType === 3) return 1; // ACCEPT
        if (F.exclusionReason(n, opts) === 'skip') return 2; // REJECT 서브트리
        if (n.shadowRoot && opts.onShadowRoot) opts.onShadowRoot(n.shadowRoot);
        return 3; // SKIP (자식은 계속)
      },
    });
    for (let n; (n = walker.nextNode());) visitText(n);
    flush();
    if (undecided.length && kanaBlocks > undecided.length) {
      for (const r of undecided) if (out.includes(r)) r.lang = r.block.lang = 'ja';
    }
    return out;
  }

  KT.segmenter = { collectBlocks, newRec, MAX_BLOCK_CHARS };
  KT.collectBlocks = collectBlocks;
})();
