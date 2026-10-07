// `--mode mt` backends for mlx / ollama (new code path; see lib/mtmode.mjs). Selected by `--mode mt` or an engine id ending in `-mt`.
import { runAdapter } from '../lib/adapter.mjs';
import { postJson } from '../lib/http.mjs';
import { estimateMaxTokens, estimateNumCtx } from '../lib/llm.mjs';
import { parseArgs } from '../lib/cli.mjs';
import { makeMtTranslator, mtFamily, SAMPLING } from '../lib/mtmode.mjs';

const asMessages = (req) => req.messages || [{ role: 'user', content: req.prompt }];

export function makeMlxMtChat(opts, family, post = postJson) {
  const base = (opts.baseUrl || 'http://127.0.0.1:8080').replace(/\/$/, '');
  const s = SAMPLING[family];
  return async ({ request }) => {
    const max_tokens = estimateMaxTokens(asMessages(request));
    const common = { model: 'default_model', stream: false, max_tokens, temperature: s.temperature, top_p: s.top_p, top_k: s.top_k,
      ...(s.repetition_penalty ? { repetition_penalty: s.repetition_penalty } : {}) };
    if (request.prompt !== undefined) {
      const r = await post(`${base}/v1/completions`, { ...common, prompt: request.prompt, stop: ['<end_of_turn>'] });
      return r.choices?.[0]?.text ?? '';
    }
    const r = await post(`${base}/v1/chat/completions`, { ...common, messages: request.messages });
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
      const family = mtFamily(opts.model);
      if (!family) throw new Error(`mt mode: no prompt template for model ${opts.model}`);
      const chat = (runtime === 'mlx' ? makeMlxMtChat : makeOllamaMtChat)(opts, family);
      tr = makeMtTranslator({ chat, family, runtime });
      return tr;
    },
    notes: () => `mode=mt${tr ? ` marker=${tr.stats.markerBlocks} fallback=${tr.stats.fallbackBlocks} plain=${tr.stats.plainBlocks} passthrough=${tr.stats.passthroughBlocks}` : ''}`,
  });
}
