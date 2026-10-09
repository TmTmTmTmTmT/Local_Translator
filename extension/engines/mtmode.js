// MT 모드: 번역 특화 모델(Hy-MT2, TranslateGemma)용 블록 단위 평문 번역. 블록당 1요청, x 항목은 ⟦n⟧ 표식으로 치환 후
// 표식에서 분할, 표식이 어긋나면 x 경계 구간 분할(PLAN §4.4)로 폴백. bench/lib/mtmode.mjs의 포팅 (프롬프트 문구 동일).
(function () {
  'use strict';
  const E = () => globalThis.KT.engines;

  const FAMILIES = ['hymt2', 'translategemma', 'chat'];
  const TARGET = { code: 'ko', en: 'Korean', zh: '\u97e9\u8bed' };
  const SRC_LANGS = {
    en: { code: 'en', name: 'English', zh: '\u82f1\u8bed' },
    ja: { code: 'ja', name: 'Japanese', zh: '\u65e5\u8bed' },
    'zh-Hans': { code: 'zh-Hans', name: 'Chinese', zh: '\u4e2d\u6587' },
    'zh-Hant': { code: 'zh-Hant', name: 'Chinese', zh: '\u4e2d\u6587' },
  };

  // 모델별 권장 샘플링 (Hy-MT2 mlx 카드, TranslateGemma generation_config; chat은 기존 LLM 엔진과 동일 0.2).
  const SAMPLING = {
    hymt2: { temperature: 0.7, top_p: 0.6, top_k: 20, repetition_penalty: 1.05 },
    translategemma: { temperature: 0.2, top_p: 0.95, top_k: 64 },
    chat: { temperature: 0.2 },
  };

  // 모델명으로 family 추정. 알 수 없으면 null.
  function inferFamily(model) {
    if (/translategemma/i.test(model || '')) return 'translategemma';
    if (/hy-?mt/i.test(model || '')) return 'hymt2';
    return null;
  }

  // 블록 lang(zh-Hans/zh-Hant) 우선, 없으면 엔진 lang(zh -> zh-Hans).
  function resolveSrcLang(blockLang, lang) {
    if (SRC_LANGS[blockLang]) return blockLang;
    const k = String(lang || '').split('-')[0];
    if (k === 'zh') return /^zh-Hant/.test(String(lang)) ? 'zh-Hant' : 'zh-Hans';
    return SRC_LANGS[k] ? k : null;
  }

  // TranslateGemma 사용자 턴: 모델 chat_template.jinja 원문 그대로.
  function translateGemmaUserText(srcName, srcCode, text) {
    const t = TARGET.en, c = TARGET.code;
    return `You are a professional ${srcName} (${srcCode}) to ${t} (${c}) translator. Your goal is to accurately convey the meaning and `
      + `nuances of the original ${srcName} text while adhering to ${t} grammar, vocabulary, and cultural sensitivities.\n`
      + `Produce only the ${t} translation, without any additional explanations or commentary. `
      + `Please translate the following ${srcName} text into ${t}:\n\n\n${text.trim()}`;
  }

  // Hy-MT2: 중국어 원문은 중국어 지시문(공식), 그 외 영어 지시문.
  function hyMtUserText(srcLang, text) {
    if (srcLang === 'zh-Hans' || srcLang === 'zh-Hant') {
      return `\u5c06\u4ee5\u4e0b\u6587\u672c\u7ffb\u8bd1\u4e3a${TARGET.zh}\uff0c\u6ce8\u610f\u53ea\u9700\u8981\u8f93\u51fa\u7ffb\u8bd1\u540e\u7684\u7ed3\u679c\uff0c\u4e0d\u8981\u989d\u5916\u89e3\u91ca\uff1a\n\n${text}`;
    }
    return `Translate the following text into ${TARGET.en}. Note that you should only output the translated result without any additional explanation:\n\n${text}`;
  }

  const CHAT_SYSTEM = [
    '\ub2f9\uc2e0\uc740 \uc6f9\ud398\uc774\uc9c0 \ubc88\uc5ed\uac00\uc785\ub2c8\ub2e4. \uc8fc\uc5b4\uc9c4 \uc678\uad6d\uc5b4 \ud14d\uc2a4\ud2b8\ub97c \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \ud55c\uad6d\uc5b4\ub85c \ubc88\uc5ed\ud558\uace0, \ubc88\uc5ed\ubb38\ub9cc \ucd9c\ub825\ud569\ub2c8\ub2e4. \uc124\uba85\u00b7\uc778\uc0ac\u00b7\ub530\uc634\ud45c\u00b7\ub9c8\ud06c\ub2e4\uc6b4 \ucf54\ub4dc\ud39c\uc2a4\ub294 \ucd9c\ub825\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.',
    '1. \uc9c1\uc5ed\ud22c\ub97c \ud53c\ud558\uace0 \uc6d0\ubb38\uc758 \uc5b4\uc870(\uaca9\uc2dd\uccb4/\uad6c\uc5b4\uccb4/\uc720\uba38/\ucee4\ubba4\ub2c8\ud2f0 \ub9d0\ud22c)\ub97c \uc720\uc9c0\ud569\ub2c8\ub2e4.',
    '2. \uace0\uc720\uba85\uc0ac\u00b7\uc81c\ud488\uba85\u00b7\ube0c\ub79c\ub4dc\uba85\u00b7\ucf54\ub4dc\u00b7\ub2e8\uc704\ub294 \uc6d0\ubb38 \uadf8\ub300\ub85c \ub450\uace0, \uc22b\uc790\uc640 URL\uc740 \ubc14\uafb8\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.',
    '3. \u27e61\u27e7, \u27e62\u27e7 \uac19\uc740 \ud45c\uc2dd\uc740 \ub9c1\ud06c\u00b7\ucf54\ub4dc \ub4f1 \uc704\uce58\uac00 \uace0\uc815\ub41c \ud56d\ubaa9\uc758 \uc790\ub9ac\uc785\ub2c8\ub2e4. \ubc88\uc5ed\ud558\uac70\ub098 \uace0\uce58\uc9c0 \ub9d0\uace0, \ud45c\uc2dd\ub9c8\ub2e4 \uc815\ud655\ud788 \ud55c \ubc88\uc529 \uac19\uc740 \uc21c\uc11c\uc640 \uac19\uc740 \ud615\uc2dd\uc73c\ub85c \ucd9c\ub825\uc5d0 \ub0a8\uae41\ub2c8\ub2e4. \ud45c\uc2dd \uc55e\ub4a4 \uc870\uc0ac\u00b7\uc5b4\ubbf8\uac00 \uc790\uc5f0\uc2a4\ub7fd\uac8c \uc774\uc5b4\uc9c0\ub3c4\ub85d \ud55c\uad6d\uc5b4 \uc5b4\uc21c\uc73c\ub85c \uc791\uc131\ud569\ub2c8\ub2e4.',
  ].join('\n');

  function chatSystemText(srcLang, glossary) {
    const note = (E().LANG_NOTES || {})[srcLang];
    const base = note ? `${CHAT_SYSTEM}\n${note}` : CHAT_SYSTEM;
    const hint = E().glossaryHint ? E().glossaryHint(glossary) : '';
    return hint ? `${base}\n${hint}` : base;
  }

  // {messages} (chat 엔드포인트) 또는 {prompt, stop} (raw completion). mlx_lm.server는 list content를 문자열로 납작하게 만들어
  // TranslateGemma 템플릿이 깨지므로 mlx에서는 렌더된 턴을 raw prompt로 보낸다(<bos>는 토크나이저가 추가).
  function buildMtRequest({ family, runtime, srcLang, text, userSuffix, glossary }) {
    const src = SRC_LANGS[srcLang];
    if (!src) throw E().makeError('unsupported_lang', `mt mode: unsupported source lang ${srcLang}`);
    if (family === 'hymt2') return { messages: [{ role: 'user', content: hyMtUserText(srcLang, text) }] };
    if (family === 'translategemma') {
      const user = translateGemmaUserText(src.name, src.code, text);
      if (runtime === 'mlx') return { prompt: `<start_of_turn>user\n${user}<end_of_turn>\n<start_of_turn>model\n`, stop: ['<end_of_turn>'] };
      return { messages: [{ role: 'user', content: user }] };
    }
    if (family === 'chat') {
      return { messages: [
        { role: 'system', content: chatSystemText(srcLang, glossary) },
        { role: 'user', content: text + (userSuffix ? `\n${userSuffix}` : '') },
      ] };
    }
    throw E().makeError('engine_unavailable', `mt mode: unknown family ${family}`);
  }

  const marker = (n) => `\u27e6${n}\u27e7`;

  // 표식 1..n이 각각 정확히 한 번, 순서대로 있어야 ok.
  function splitAtMarkers(text, n) {
    const found = [...text.matchAll(/\u27e6\s*(\d+)\s*\u27e7/g)];
    if (found.length !== n || found.some((m, i) => Number(m[1]) !== i + 1)) return { ok: false, pieces: null };
    const pieces = [];
    let pos = 0;
    for (const m of found) { pieces.push(text.slice(pos, m.index)); pos = m.index + m[0].length; }
    pieces.push(text.slice(pos));
    return { ok: true, pieces };
  }

  // 블록 -> 표식 텍스트 + gap 구조. gaps[g] = g번째 표식 앞 t-구간의 segment 인덱스(없으면 null).
  function planMarkerBlock(block) {
    const segs = E().planSegments(block);
    const gaps = [null];
    let nX = 0, segIdx = 0, inRun = false, text = '';
    for (const it of block.items) {
      if (it.k === 't') {
        if (!inRun) { gaps[nX] = segIdx++; inRun = true; }
        text += it.text;
      } else { nX++; gaps.push(null); inRun = false; text += marker(nX); }
    }
    return { segs, gaps, nX, text: text.trim() };
  }

  // F20: 링크 많은 짧은 메타 줄은 표식 대신 구간별 번역. x >= 3, 또는 x >= 2 이고 글자 있는 t 구간 중 12자 이상이 없을 때.
  function preferRunSplit(block) {
    let nX = 0, longRun = false, run = '';
    const flush = () => { if (/\p{L}/u.test(run) && run.trim().length >= 12) longRun = true; run = ''; };
    for (const it of block.items) {
      if (it.k === 't') run += it.text; else { nX++; flush(); }
    }
    flush();
    return nX >= 3 || (nX >= 2 && !longRun);
  }

  // 모델 출력의 코드펜스·<think>를 제거.
  function clean(s) {
    return E().stripThink(String(s == null ? '' : s)).replace(/^```\w*\n?|\n?```$/g, '').trim();
  }

  // 표식 경로 슬롯 조립. 표식 옆 공백은 모델 출력을 따르고(한국어 띄어쓰기가 다름), 블록 바깥 가장자리만 원문 공백 유지.
  // 어긋나면 null -> 폴백.
  function assembleMarker(plan, pieces) {
    const last = plan.gaps.length - 1;
    const slots = {};
    for (let g = 0; g <= last; g++) {
      const si = plan.gaps[g];
      const piece = pieces[g];
      if (si === null) { if (piece.trim()) return null; continue; } // 슬롯 없는 gap에 텍스트: 표식 순서 불신
      const seg = plan.segs[si];
      if (!seg.translatable) { seg.slotIdx.forEach((i, j) => { slots[String(i)] = seg.texts[j]; }); continue; }
      if (!piece.trim()) return null; // 모델이 이 부분을 누락
      let v = piece;
      if (g === 0) v = seg.text.match(/^\s*/)[0] + v.trimStart();
      if (g === last) v = v.trimEnd() + seg.text.match(/\s*$/)[0];
      seg.slotIdx.forEach((i, j) => { slots[String(i)] = j === 0 ? v : ''; });
    }
    return slots;
  }

  // F20b: 원문에 괄호가 없는데 모델이 덧붙인 빈 괄호 "( )", "(작성자: )"와 그 앞 공백을 제거. 원문에 괄호가 있으면 그대로.
  function stripEmptyParens(src, out) {
    if (/[()\uff08\uff09]/.test(src)) return out;
    return out.replace(/[ \t\u00a0]*[(\uff08][ \t]*[)\uff09]/g, '')
      .replace(/[ \t\u00a0]*[(\uff08][^()\uff08\uff09:\uff1a\n]{0,6}[:\uff1a][ \t]*[)\uff09]/g, '').trim();
  }

  const ABORT_CODES = ['engine_unavailable', 'timeout', 'rate_limited'];

  // chat({request, block}) -> text. parallel(F23): 배치의 블록을 최대 parallel개까지 동시에 처리(기본 1 = 순차). 숫자 또는 () => 숫자.
  // translate({blocks, lang}) -> {out: Map<id, slots>, errors:[{id, code, message}], stats}
  function makeMtTranslator({ chat, family, runtime, userSuffix, parallel }) {
    let glossary = null; // translate() 호출마다 context.glossary로 갱신
    const stats = { markerBlocks: 0, fallbackBlocks: 0, runSplitBlocks: 0, plainBlocks: 0, passthroughBlocks: 0 };
    const ask = (srcLang, text, block) => Promise.resolve(chat({ request: buildMtRequest({ family, runtime, srcLang, text, userSuffix, glossary }), block })).then((r) => stripEmptyParens(text, clean(r)));

    async function oneBlock(block, lang) {
      const srcLang = resolveSrcLang(block.lang, lang);
      const expected = block.items.some((it) => it.k === 't');
      const plan = planMarkerBlock(block);
      if (!plan.segs.some((s) => s.translatable)) { stats.passthroughBlocks++; return E().assemblePlain(plan.segs, []); }
      if (plan.nX === 0) {
        stats.plainBlocks++;
        const slots = E().assemblePlain(plan.segs, [await ask(srcLang, plan.text, block)]);
        return Object.keys(slots).length || !expected ? slots : null;
      }
      if (!preferRunSplit(block) && !/[\u27e6\u27e7]/.test(plan.segs.map((s) => s.text).join(''))) {
        const sp = splitAtMarkers(await ask(srcLang, plan.text, block), plan.nX);
        const slots = sp.ok ? assembleMarker(plan, sp.pieces) : null;
        if (slots) { stats.markerBlocks++; return slots; }
      }
      (preferRunSplit(block) ? stats.runSplitBlocks++ : stats.fallbackBlocks++);
      const tr = [];
      for (const seg of plan.segs) tr.push(seg.translatable ? await ask(srcLang, seg.text.trim(), block) : null);
      const slots = E().assemblePlain(plan.segs, tr);
      return Object.keys(slots).length || !expected ? slots : null;
    }

    return async function translate({ blocks, lang, context }) {
      glossary = (context && context.glossary) || null;
      const out = new Map();
      const errors = [];
      const pv = Number(typeof parallel === 'function' ? parallel() : parallel);
      const width = Math.min(Math.max(1, Number.isFinite(pv) ? Math.trunc(pv) : 1), Math.max(1, blocks.length));
      const res = new Array(blocks.length); // 인덱스별 결과: 완료 순서와 무관하게 입력 순서로 조립
      let next = 0, abort = null;
      const worker = async () => {
        while (!abort && next < blocks.length) {
          const i = next++;
          const b = blocks[i];
          try { res[i] = { slots: await oneBlock(b, lang) }; } catch (e) {
            if (e && ABORT_CODES.includes(e.code)) { abort = abort || e; return; } // 서버 불능: 남은 블록도 실패하므로 즉시 중단
            res[i] = { err: e };
          }
        }
      };
      await Promise.all(Array.from({ length: width }, worker));
      if (abort) throw abort;
      blocks.forEach((b, i) => {
        const r = res[i];
        if (!r) return;
        if (r.err) { const e = r.err; errors.push({ id: b.id, code: (e && e.code) || 'unknown', message: String((e && e.message) || e) }); return; }
        if (r.slots && Object.keys(r.slots).length) out.set(b.id, r.slots);
        else if (r.slots === null) errors.push({ id: b.id, code: 'bad_response', message: 'no translation returned' });
      });
      return { out, errors, stats };
    };
  }

  const api = { FAMILIES, SAMPLING, SRC_LANGS, inferFamily, resolveSrcLang, translateGemmaUserText, hyMtUserText, chatSystemText, buildMtRequest, marker, splitAtMarkers, planMarkerBlock, assembleMarker, stripEmptyParens, makeMtTranslator };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.engines = Object.assign(globalThis.KT.engines || {}, { mtmode: api });
  if (typeof module !== 'undefined') module.exports = api;
})();
