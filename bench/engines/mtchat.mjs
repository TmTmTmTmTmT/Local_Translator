// `--mode mt` backends for mlx / ollama (new code path; see lib/mtmode.mjs). Selected by `--mode mt` or an engine id ending in `-mt`.
import { runAdapter } from '../lib/adapter.mjs';
import { postJson } from '../lib/http.mjs';
import { estimateMaxTokens, estimateNumCtx } from '../lib/llm.mjs';
import { parseArgs } from '../lib/cli.mjs';
import { makeMtTranslator, mtFamily, needsNoThink, SAMPLING } from '../lib/mtmode.mjs';

const asMessages = (req) => req.messages || [{ role: 'user', content: req.prompt }];

// Some chat templates reject a system turn (HTTP 400/404 from mlx_lm.server, e.g. "Conversations must start with a user
// prompt"). Fold the system text into the user turn and remember, so only the first request pays for the retry.
export const foldSystem = (messages) => {
  const sys = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n');
  const rest = messages.filter((m) => m.role !== 'system');
  return sys && rest.length ? [{ ...rest[0], content: `${sys}\n\n${rest[0].content}` }, ...rest.slice(1)] : rest;
};

export function makeMlxMtChat(opts, family, post = postJson) {
  const base = (opts.baseUrl || 'http://127.0.0.1:8080').replace(/\/$/, '');
  const s = SAMPLING[family];
  let foldSys = false;
  return async ({ request }) => {
    const max_tokens = estimateMaxTokens(asMessages(request));
    const common = { model: 'default_model', stream: false, max_tokens, temperature: s.temperature, top_p: s.top_p, top_k: s.top_k,
      ...(s.repetition_penalty ? { repetition_penalty: s.repetition_penalty } : {}),
      ...(needsNoThink(opts.model) ? { chat_template_kwargs: { enable_thinking: false } } : {}) };
    if (request.prompt !== undefined) {
      const r = await post(`${base}/v1/completions`, { ...common, prompt: request.prompt, stop: ['<end_of_turn>'] });
      return r.choices?.[0]?.text ?? '';
    }
    const send = (messages) => post(`${base}/v1/chat/completions`, { ...common, messages });
    let r;
    if (foldSys) r = await send(foldSystem(request.messages));
    else {
      try { r = await send(request.messages); }
      catch (e) {
        if (!(e.status === 400 || e.status === 404) || !request.messages.some((m) => m.role === 'system')) throw e;
        foldSys = true;
        r = await send(foldSystem(request.messages));
      }
    }
    return r.choices?.[0]?.message?.content ?? '';
  };
}

export function makeOllamaMtChat(opts, family, post = postJson) {
  const base = (opts.baseUrl || 'http://127.0.0.1:11434').replace(/\/$/, '');
  const s = SAMPLING[family];
  return async ({ request }) => {
    const messages = asMessages(request);
    const body = {
      model: opts.model, messages, stream: false,
      options: { temperature: s.temperature, top_p: s.top_p, top_k: s.top_k, num_ctx: estimateNumCtx(messages),
        ...(s.repetition_penalty ? { repeat_penalty: s.repetition_penalty } : {}) },
      ...(needsNoThink(opts.model) ? { think: false } : {}),
      ...(opts.keepAlive !== undefined ? { keep_alive: opts.keepAlive } : {}),
    };
    const r = await post(`${base}/api/chat`, body);
    return r.message?.content ?? '';
  };
}

// One request per block => default --max-blocks 1 so each batch record / coldMs is a single request.
export async function mtMain(runtime, argv) {
  const args = argv.includes('--max-blocks') || argv.some((x) => x.startsWith('--max-blocks=')) ? argv : [...argv, '--max-blocks', '1'];
  let tr;
  return runAdapter({
    argv: args,
    makeTranslator: (opts) => {
      if (!opts.model) throw new Error(`${runtime}: --model required`);
      const family = mtFamily(opts.model, opts.raw.mtFamily);
      const chat = (runtime === 'mlx' ? makeMlxMtChat : makeOllamaMtChat)(opts, family);
      tr = makeMtTranslator({ chat, family, runtime, model: opts.model });
      return tr;
    },
    notes: (opts) => `mode=mt family=${mtFamily(opts.model, opts.raw.mtFamily)}${tr ? ` marker=${tr.stats.markerBlocks} fallback=${tr.stats.fallbackBlocks} plain=${tr.stats.plainBlocks} passthrough=${tr.stats.passthroughBlocks}` : ''}`,
  });
}
