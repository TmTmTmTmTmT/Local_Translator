// MT 모드: 번역 특화 모델(Hy-MT2, TranslateGemma)용 블록 단위 평문 번역. 블록당 1요청, x 항목은 ⟦n⟧ 표식으로 치환 후
// 표식에서 분할, 표식이 어긋나면 x 경계 구간 분할(PLAN §4.4)로 폴백. bench/lib/mtmode.mjs의 포팅 (프롬프트 문구 동일).
(function () {
  'use strict';
  const E = () => globalThis.KT.engines;

  const FAMILIES = ['hymt2', 'translategemma', 'chat'];
  const TARGET = { code: 'ko', en: 'Korean', zh: '韩语' };
  const SRC_LANGS = {
    en: { code: 'en', name: 'English', zh: '英语' },
    ja: { code: 'ja', name: 'Japanese', zh: '日语' },
    'zh-Hans': { code: 'zh-Hans', name: 'Chinese', zh: '中文' },
    'zh-Hant': { code: 'zh-Hant', name: 'Chinese', zh: '中文' },
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
      return `将以下文本翻译为${TARGET.zh}，注意只需要输出翻译后的结果，不要额外解释：\n\n${text}`;
    }
    return `Translate the following text into ${TARGET.en}. Note that you should only output the translated result without any additional explanation:\n\n${text}`;
  }

  const CHAT_SYSTEM = [
    '당신은 웹페이지 번역가입니다. 주어진 외국어 텍스트를 자연스러운 한국어로 번역하고, 번역문만 출력합니다. 설명·인사·따옴표·마크다운 코드펜스는 출력하지 않습니다.',
    '1. 직역투를 피하고 원문의 어조(격식체/구어체/유머/커뮤니티 말투)를 유지합니다.',
    '2. 고유명사·제품명·브랜드명·코드·단위는 원문 그대로 두고, 숫자와 URL은 바꾸지 않습니다.',
    '3. ⟦1⟧, ⟦2⟧ 같은 표식은 링크·코드 등 위치가 고정된 항목의 자리입니다. 번역하거나 고치지 말고, 표식마다 정확히 한 번씩 같은 순서와 같은 형식으로 출력에 남깁니다. 표식 앞뒤 조사·어미가 자연스럽게 이어지도록 한국어 어순으로 작성합니다.',
  ].join('\n');

  function chatSystemText(srcLang) {
    const note = (E().LANG_NOTES || {})[srcLang];
    return note ? `${CHAT_SYSTEM}\n${note}` : CHAT_SYSTEM;
  }

  // {messages} (chat 엔드포인트) 또는 {prompt, stop} (raw completion). mlx_lm.server는 list content를 문자열로 납작하게 만들어
  // TranslateGemma 템플릿이 깨지므로 mlx에서는 렌더된 턴을 raw prompt로 보낸다(<bos>는 토크나이저가 추가).
  function buildMtRequest({ family, runtime, srcLang, text, userSuffix }) {
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
        { role: 'system', content: chatSystemText(srcLang) },
        { role: 'user', content: text + (userSuffix ? `\n${userSuffix}` : '') },
      ] };
    }
    throw E().makeError('engine_unavailable', `mt mode: unknown family ${family}`);
  }

  const marker = (n) => `⟦${n}⟧`;

  // 표식 1..n이 각각 정확히 한 번, 순서대로 있어야 ok.
  function splitAtMarkers(text, n) {
    const found = [...text.matchAll(/⟦\s*(\d+)\s*⟧/g)];
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

  const ABORT_CODES = ['engine_unavailable', 'timeout', 'rate_limited'];

  // chat({request, block}) -> text. 블록당 순차 1요청(concurrency 1).
  // translate({blocks, lang}) -> {out: Map<id, slots>, errors:[{id, code, message}], stats}
  function makeMtTranslator({ chat, family, runtime, userSuffix }) {
    const stats = { markerBlocks: 0, fallbackBlocks: 0, plainBlocks: 0, passthroughBlocks: 0 };
    const ask = (srcLang, text, block) => Promise.resolve(chat({ request: buildMtRequest({ family, runtime, srcLang, text, userSuffix }), block })).then(clean);

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
      if (!/[⟦⟧]/.test(plan.segs.map((s) => s.text).join(''))) {
        const sp = splitAtMarkers(await ask(srcLang, plan.text, block), plan.nX);
        const slots = sp.ok ? assembleMarker(plan, sp.pieces) : null;
        if (slots) { stats.markerBlocks++; return slots; }
      }
      stats.fallbackBlocks++;
      const tr = [];
      for (const seg of plan.segs) tr.push(seg.translatable ? await ask(srcLang, seg.text.trim(), block) : null);
      const slots = E().assemblePlain(plan.segs, tr);
      return Object.keys(slots).length || !expected ? slots : null;
    }

    return async function translate({ blocks, lang }) {
      const out = new Map();
      const errors = [];
      for (const b of blocks) {
        try {
          const slots = await oneBlock(b, lang);
          if (slots && Object.keys(slots).length) out.set(b.id, slots);
          else if (slots === null) errors.push({ id: b.id, code: 'bad_response', message: 'no translation returned' });
        } catch (e) {
          if (e && ABORT_CODES.includes(e.code)) throw e; // 서버 불능: 남은 블록도 실패하므로 즉시 중단
          errors.push({ id: b.id, code: (e && e.code) || 'unknown', message: String((e && e.message) || e) });
        }
      }
      return { out, errors, stats };
    };
  }

  const api = { FAMILIES, SAMPLING, SRC_LANGS, inferFamily, resolveSrcLang, translateGemmaUserText, hyMtUserText, chatSystemText, buildMtRequest, marker, splitAtMarkers, planMarkerBlock, assembleMarker, makeMtTranslator };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.engines = Object.assign(globalThis.KT.engines || {}, { mtmode: api });
  if (typeof module !== 'undefined') module.exports = api;
})();
