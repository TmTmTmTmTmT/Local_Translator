// `--mode mt`: plain translation prompts for translation-specialized models (Hy-MT2, TranslateGemma) that cannot follow
// the JSON-slot prompt. One request per block; x items become ⟦n⟧ markers (bench/marker-probe/FINDINGS.md), split back
// at the markers; fallback = run-splitting (lib/plain.mjs) when markers are missing/duplicated/out of order.
import { planSegments, assemblePlain, hasLetters } from './plain.mjs';

export const TARGET = { code: 'ko', en: 'Korean', zh: '韩语' };
export const SRC_LANGS = {
  en: { code: 'en', name: 'English', zh: '英语' },
  ja: { code: 'ja', name: 'Japanese', zh: '日语' },
  'zh-Hans': { code: 'zh-Hans', name: 'Chinese', zh: '中文' },
  'zh-Hant': { code: 'zh-Hant', name: 'Chinese', zh: '中文' },
};

export function mtFamily(model) {
  if (/translategemma/i.test(model || '')) return 'translategemma';
  if (/hy-?mt/i.test(model || '')) return 'hymt';
  return null;
}

// Decoding params per family. Hy-MT2: values from the mlx-community card (--temp 0.7 --top-p 0.6 --top-k 20) +
// generation_config repetition_penalty 1.05. TranslateGemma: generation_config top_k 64 / top_p 0.95 (card gives no
// temperature; 0.2 matches the other adapters).
export const SAMPLING = {
  hymt: { temperature: 0.7, top_p: 0.6, top_k: 20, repetition_penalty: 1.05 },
  translategemma: { temperature: 0.2, top_p: 0.95, top_k: 64 },
};

// TranslateGemma user turn, verbatim from the model's chat_template.jinja (type 'text').
export function translateGemmaUserText(srcName, srcCode, text, tgtName = TARGET.en, tgtCode = TARGET.code) {
  return `You are a professional ${srcName} (${srcCode}) to ${tgtName} (${tgtCode}) translator. Your goal is to accurately convey the meaning and `
    + `nuances of the original ${srcName} text while adhering to ${tgtName} grammar, vocabulary, and cultural sensitivities.\n`
    + `Produce only the ${tgtName} translation, without any additional explanations or commentary. `
    + `Please translate the following ${srcName} text into ${tgtName}:\n\n\n${text.trim()}`;
}

// Hy-MT2: zh source -> Chinese instruction (official), others -> English instruction (mlx card quick start).
export function hyMtUserText(lang, text) {
  if (lang === 'zh-Hans' || lang === 'zh-Hant') {
    return `将以下文本翻译为${TARGET.zh}，注意只需要输出翻译后的结果，不要额外解释：\n\n${text}`;
  }
  return `Translate the following text into ${TARGET.en}. Note that you should only output the translated result without any additional explanation:\n\n${text}`;
}

// Returns {messages} (chat endpoint) or {prompt} (raw completion endpoint).
// mlx_lm.server flattens list content to a string, which breaks TranslateGemma's template (needs structured content), so
// on mlx we send the rendered turn as a raw prompt (no <bos>: the tokenizer adds it). Ollama's own template wraps the
// user message, so a plain user message is right there.
export function buildMtRequest({ family, runtime, lang, text }) {
  const src = SRC_LANGS[lang];
  if (!src) throw new Error(`mt mode: unsupported source lang ${lang}`);
  if (family === 'hymt') return { messages: [{ role: 'user', content: hyMtUserText(lang, text) }] };
  if (family === 'translategemma') {
    const user = translateGemmaUserText(src.name, src.code, text);
    if (runtime === 'mlx') return { prompt: `<start_of_turn>user\n${user}<end_of_turn>\n<start_of_turn>model\n` };
    return { messages: [{ role: 'user', content: user }] };
  }
  throw new Error(`mt mode: unknown model family for ${family}`);
}

export const marker = (n) => `⟦${n}⟧`;
const MARKER_RE = /⟦\s*(\d+)\s*⟧/g;

// Split text at ⟦n⟧ markers. ok only if markers 1..n each appear exactly once, in order.
export function splitAtMarkers(text, n) {
  const found = [...text.matchAll(MARKER_RE)];
  if (found.length !== n || found.some((m, i) => Number(m[1]) !== i + 1)) return { ok: false, pieces: null };
  const pieces = [];
  let pos = 0;
  for (const m of found) { pieces.push(text.slice(pos, m.index)); pos = m.index + m[0].length; }
  pieces.push(text.slice(pos));
  return { ok: true, pieces };
}

// Block -> marker text + gap structure. gaps[g] = t-run before marker g+1 (g=0..nX); null when slot-less.
export function planMarkerBlock(block) {
  const segs = planSegments(block);
  const gaps = [];
  let nX = 0, segIdx = 0, inRun = false, text = '';
  gaps.push(null);
  for (const it of block.items) {
    if (it.k === 't') {
      if (!inRun) { gaps[nX] = segIdx++; inRun = true; }
      text += it.text;
    } else { nX++; gaps.push(null); inRun = false; text += marker(nX); }
  }
  return { segs, gaps, nX, text: text.trim() };
}

const clean = (s) => String(s ?? '').replace(/^```\w*\n?|\n?```$/g, '').trim();

// Marker path slots. Whitespace next to a marker comes from the model output (Korean spacing differs from the source);
// only the block's outer edges keep the source whitespace. Returns slots, or null => fallback.
export function assembleMarker(plan, pieces) {
  const last = plan.gaps.length - 1;
  const slots = {};
  for (let g = 0; g <= last; g++) {
    const si = plan.gaps[g];
    const piece = pieces[g];
    if (si === null) { if (piece.trim()) return null; continue; } // text in a slot-less gap: marker order not trustworthy
    const seg = plan.segs[si];
    if (!seg.translatable) { seg.slotIdx.forEach((i, j) => { slots[String(i)] = seg.texts[j]; }); continue; }
    if (!piece.trim()) return null; // model dropped this part
    let v = piece;
    if (g === 0) v = seg.text.match(/^\s*/)[0] + v.trimStart();
    if (g === last) v = v.trimEnd() + seg.text.match(/\s*$/)[0];
    seg.slotIdx.forEach((i, j) => { slots[String(i)] = j === 0 ? v : ''; });
  }
  return slots;
}

// chat({request, block}) -> text. request = {messages}|{prompt}. Sequential, one request per block (concurrency 1).
export function makeMtTranslator({ chat, family, runtime }) {
  const stats = { markerBlocks: 0, fallbackBlocks: 0, plainBlocks: 0, passthroughBlocks: 0 };
  const ask = (lang, text, block) => chat({ request: buildMtRequest({ family, runtime, lang, text }), block }).then(clean);

  async function oneBlock(block, lang) {
    const expected = block.items.filter((it) => it.k === 't').length;
    const plan = planMarkerBlock(block);
    if (!plan.segs.some((s) => s.translatable)) { stats.passthroughBlocks++; return { id: block.id, slots: assemblePlain(plan.segs, []), error: null }; }
    if (plan.nX === 0) {
      stats.plainBlocks++;
      const out = await ask(lang, plan.text, block);
      const slots = assemblePlain(plan.segs, [out]);
      return Object.keys(slots).length || !expected ? { id: block.id, slots, error: null } : { id: block.id, slots: null, error: 'no translation returned' };
    }
    if (!/[⟦⟧]/.test(plan.segs.map((s) => s.text).join(''))) {
      const out = await ask(lang, plan.text, block);
      const sp = splitAtMarkers(out, plan.nX);
      const slots = sp.ok ? assembleMarker(plan, sp.pieces) : null;
      if (slots) { stats.markerBlocks++; return { id: block.id, slots, error: null, xPreserved: true }; }
    }
    stats.fallbackBlocks++;
    const tr = [];
    for (const seg of plan.segs) tr.push(seg.translatable && hasLetters(seg.text) ? await ask(lang, seg.text.trim(), block) : null);
    const slots = assemblePlain(plan.segs, tr);
    return Object.keys(slots).length || !expected ? { id: block.id, slots, error: null, xPreserved: true } : { id: block.id, slots: null, error: 'no translation returned' };
  }

  const translate = async ({ batch, lang }) => {
    const blocks = [];
    for (const b of batch) {
      try { blocks.push(await oneBlock(b, lang)); } catch (e) { blocks.push({ id: b.id, slots: null, error: String(e.message || e) }); }
    }
    return { blocks };
  };
  translate.stats = stats;
  return translate;
}
