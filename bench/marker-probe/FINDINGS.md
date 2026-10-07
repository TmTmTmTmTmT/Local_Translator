# Marker probe findings (apple-mt, Translation framework, en/ja/zh-Hans -> ko)

Probe: `kt-bench --marker-probe` (Marker.swift). 15 x-bearing blocks per language (7 corpus + 8 extra link-style blocks defined in Marker.swift) x 6 styles = 270 requests, ~5 min under background load. Raw rows: `probe.json`.

survival = every marker present exactly once; in-order = also in source order (required for split); sane = no double spaces / no edge whitespace.

| style | n | survival | in-order | sane spacing | en / ja / zh survival |
|---|---|---|---|---|---|
| `⟦n⟧` | 45 | 100% | 100% | 100% | 100% / 100% / 100% |
| `[n]` | 45 | 100% | 100% | 100% | 100% / 100% / 100% |
| `{n}` | 45 | 100% | 100% | 100% | 100% / 100% / 100% |
| `<xn/>` | 45 | 100% | 100% | 100% | 100% / 100% / 100% |
| `<an>text</an>` | 45 | 100% | 100% | 100% | 100% / 100% / 100% |
| `«n»` | 45 | 98% | 98% | 100% | 100% / 100% / 93% |

Wrap style `<aN>link</aN>`: tags survive 100%, but the link text itself was kept verbatim in only 15/45 cases (translated, e.g. 여기 클릭하세요) - unusable since x text must stay original.

## Sample outputs (5 blocks per style)

### `⟦n⟧`
- en-link-01: `Click ⟦1⟧ to continue.` -> `계속하려면 ⟦1⟧을 클릭하세요.`
- ja-link-01: `続行するには⟦1⟧をクリックしてください。` -> `계속하려면⟦1⟧를 클릭하십시오.`
- zh-Hans-link-01: `点击⟦1⟧继续。` -> `⟦1⟧를 클릭하여 계속하세요.`
- en-extra-6: `Visit ⟦1⟧ or ⟦2⟧ to ask questions.` -> `질문을 하기 위해 ⟦1⟧ 또는 ⟦2⟧를 방문하세요.`
- ja-link-03: `問題が解決しない場合は、⟦1⟧し、ログファイルを添付してください。` -> `문제가 해결되지 않는 경우, ⟦1⟧하고, 로그 파일을 첨부해 주세요.`

### `[n]`
- en-link-01: `Click [1] to continue.` -> `계속하려면 [1]을 클릭하세요.`
- ja-link-01: `続行するには[1]をクリックしてください。` -> `계속하려면 [1]을 클릭하십시오.`
- zh-Hans-link-01: `点击[1]继续。` -> `[1]을 클릭하여 계속하십시오.`
- en-extra-6: `Visit [1] or [2] to ask questions.` -> `질문을 하기 위해서는 [1] 또는 [2]를 방문하십시오.`
- ja-link-03: `問題が解決しない場合は、[1]し、ログファイルを添付してください。` -> `문제가 해결되지 않는 경우, [1]하고, 로그 파일을 첨부해 주세요.`

### `{n}`
- en-link-01: `Click {1} to continue.` -> `계속하려면 {1}을 클릭하세요.`
- ja-link-01: `続行するには{1}をクリックしてください。` -> `계속하려면 {1}을 클릭하십시오.`
- zh-Hans-link-01: `点击{1}继续。` -> `{1}을 클릭하여 계속하세요.`
- en-extra-6: `Visit {1} or {2} to ask questions.` -> `질문을 하기 위해 {1} 또는 {2}를 방문하세요.`
- ja-link-03: `問題が解決しない場合は、{1}し、ログファイルを添付してください。` -> `문제가 해결되지 않는 경우, {1}하고, 로그 파일을 첨부해 주세요.`

### `<xn/>`
- en-link-01: `Click <x1/> to continue.` -> `<x1/>을 클릭하여 계속하세요.`
- ja-link-01: `続行するには<x1/>をクリックしてください。` -> `계속하려면 <x1/>를 클릭하십시오.`
- zh-Hans-link-01: `点击<x1/>继续。` -> `<x1/>를 클릭하여 계속하세요.`
- en-extra-6: `Visit <x1/> or <x2/> to ask questions.` -> `<x1/> 또는 <x2/>를 방문하여 질문하십시오.`
- ja-link-03: `問題が解決しない場合は、<x1/>し、ログファイルを添付してください。` -> `문제가 해결되지 않는 경우, <x1/>하고, 로그 파일을 첨부해 주세요.`

### `<an>text</an>`
- en-link-01: `Click <a1>here</a1> to continue.` -> `<a1>여기 클릭하세요</a1>를 클릭하여 계속하세요.`
- ja-link-01: `続行するには<a1>こちら</a1>をクリックしてください。` -> `계속하려면 <a1>여기를</a1> 클릭하십시오.`
- zh-Hans-link-01: `点击<a1>此处</a1>继续。` -> `<a1>여기에 클릭하세요</a1> 계속하세요.`
- en-extra-6: `Visit <a1>the community forum</a1> or <a2>the chat room</a2> to ask questions.` -> `<a1>커뮤니티 포럼</a1> 또는 <a2>채팅룸</a2>를 방문하여 질문하십시오.`
- ja-link-03: `問題が解決しない場合は、<a1>トラッカーでイシューを作成</a1>し、ログファイルを添付してください。` -> `문제가 해결되지 않는 경우, <a1>트래커로 이슈를 생성</a1>하고, 로그 파일을 첨부해 주세요.`

### `«n»`
- en-link-01: `Click «1» to continue.` -> `계속하려면 «1»을 클릭하세요.`
- ja-link-01: `続行するには«1»をクリックしてください。` -> `계속하려면 «1»을 클릭하십시오.`
- zh-Hans-link-01: `点击«1»继续。` -> `«1»을 클릭하여 계속하십시오.`
- en-extra-6: `Visit «1» or «2» to ask questions.` -> `질문을 하기 위해서는 «1» 또는 «2»를 방문하십시오.`
- ja-link-03: `問題が解決しない場合は、«1»し、ログファイルを添付してください。` -> `문제가 해결되지 않는 경우, «1»하고, 로그 파일을 첨부해 주세요.`

## Decision
- Survival is saturated (100%) for all styles except `«n»` (98%, one zh-Hans loss), so naturalness and collision risk decide. Korean wording is practically identical across `⟦n⟧`, `{n}`, `[n]`, `<xn/>`; differences are sentence-level MT noise (e.g. `[1]` once dropped the verb in en-link-03, `<x1/>` once reordered to a different phrasing). `⟦n⟧` once dropped a space in ja-link-01 (harmless for Korean).
- Chosen: `⟦n⟧` - never occurs in real page text, whereas `[1]` (citations) / `{1}` / `<x1/>` can; a collision makes counts != 1 and triggers fallback.
- Engine `apple-mt-marker`: one request per block with x; split at markers (must be exactly once, in order, and no non-blank piece in a slot-less segment), else fallback to run-splitting. Blocks without x use plain translation.
- Known limit: the MT cannot see the link text, so particle (을/를) and verb choice is generic; and fidelity of surrounding text can drop link semantics (en-link-03: "open an issue" -> "실행하고"). Still far better than run-splitting.

## Engine run (apple-mt-marker, default strategy, r1, with background-job contention - timing indicative only)
- en: totalMs ~59000 (plain r1: ~55000); ja: ~51000 (plain r1: ~49000). 7/7 x-blocks split via markers, 0 fallbacks, 22 no-x blocks plain.
- link outputs: en-link-01 `계속하려면 ` + x + `을 클릭하세요.`; ja-link-01 `계속하려면` + x + `를 클릭하십시오.`
