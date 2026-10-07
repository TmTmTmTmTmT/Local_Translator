// mlx_lm.server adapter (OpenAI-compatible at 127.0.0.1:8080). keep-alive is not a server concept here.
import { pathToFileURL } from 'node:url';
import { runAdapter } from '../lib/adapter.mjs';
import { postJson } from '../lib/http.mjs';
import { makeLlmTranslator, estimateMaxTokens, isQwen3 } from '../lib/llm.mjs';
import { parseArgs } from '../lib/cli.mjs';

const DEFAULT_BASE = 'http://127.0.0.1:8080';

export function makeMlxChat(opts) {
  const base = (opts.baseUrl || DEFAULT_BASE).replace(/\/$/, '');
  return async ({ messages }) => {
    const body = {
      model: opts.model, messages, stream: false, temperature: 0.2,
      max_tokens: estimateMaxTokens(messages),
      ...(isQwen3(opts.model) ? { chat_template_kwargs: { enable_thinking: false } } : {}),
    };
    const r = await postJson(`${base}/v1/chat/completions`, body);
    return r.choices?.[0]?.message?.content ?? '';
  };
}

export async function main(argv) {
  const a = parseArgs(argv);
  return runAdapter({
    argv,
    makeTranslator: (opts) => {
      if (!opts.model) throw new Error('mlx: --model required');
      const suffix = isQwen3(opts.model) && !a.thinking ? '/no_think' : '';
      return makeLlmTranslator({ chat: makeMlxChat(opts), userSuffix: suffix });
    },
    notes: () => 'keep-alive not applicable (server-resident model)',
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((e) => { console.error(e.stack || e); process.exit(1); });
}
