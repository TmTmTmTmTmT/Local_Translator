# extension/PROTOCOL.md — 모듈 간 계약 (Phase 2)

상위: `../PLAN.md` §2–§4, `../GUIDELINES.md`. 변경 시 이 파일을 먼저 수정(Opus 확인 사항이면 STATUS에 기록).

## 1. 설정 (`browser.storage.sync` key `settings`, 기본값)
```json
{
  "sites": [ { "host": "example.com", "exclude": "" } ],
  "engine": { "default": "native:apple-mt", "byLang": { "ja": null, "zh": null } },
  "localhost": { "baseUrl": "http://127.0.0.1:11434", "kind": "ollama|mlx|ct2", "model": "" },
  "enabled": true
}
```
- `engine` 값은 엔진 ID 문자열. 엔진 레지스트리(`engines/registry.js`)가 ID → 엔진 객체 해석.

## 2. 메시지 (runtime.sendMessage, `{type, ...}`)
| type | 방향 | 요청 | 응답 |
|---|---|---|---|
| `translate` | content/viewer → background | `{blocks:[Block], context:{title,host}, lang}` | `{ok:true, results:[{id, slots:{"0":"…"}}], engine}` 또는 `{ok:false, code, message}` |
| `getState` | popup/content → background | `{url?, tabId?}` (popup은 tabId 권장) | `{siteEnabled, host, engine, status, pending, errorCode?}` |
| `setSiteEnabled` | popup → background | `{host, enabled}` | `{ok:true}` |
| `toggleOriginal` | popup → content(tabs.sendMessage) | `{}` | `{mode:"translated"|"original"}` |
| `reportStatus` | content → background | `{pending, done, error}` | — |
| `openPdfViewer` | popup → background | `{url}` | `{ok}` |
| `clearCache` | options → background | `{}` | `{ok}` |

- `Block` = `{id, lang, items:[{k:"t",i,text}|{k:"x",text}]}` (PLAN §4.3). `results[].slots`의 키는 슬롯 i 문자열. 누락 키 = 해당 슬롯 원문 유지.
- 에러 `code`: `needs_language_pack`, `engine_unavailable`, `rate_limited`, `bad_response`, `unsupported_lang`, `timeout`, `unknown`.

## 3. 엔진 인터페이스 (`engines/*`)
```js
{ id, kind: "native"|"localhost", langs: ["en","ja","zh"],
  batchLimit: {chars, blocks}, concurrency: n,
  async translate(blocks, context, lang, settings) -> Map<blockId, {slotIdx: text}>  // throws {code, message}
  async status() -> {available:boolean, reason?:string}
}
```

## 4. 네이티브 메시지 (native 엔진 ↔ Swift 핸들러, `runtime.sendNativeMessage`)
요청 `{type:"translate", engine:"apple-mt"|"apple-fm", lang, context, blocks}` → 응답 `{ok, results:[{id,slots}], error?:{code,message}}`. `{type:"status"}` → `{ok, engines:{...}, languagePacks:{en:"installed"|"supported"|"unsupported",...}}`.

## 5. content 전역 (`globalThis.KT`)
`text.js`: cleanText, isNonlinguistic, withOuterWhitespace, scriptCounts, detectLang(text)->"en"|"ja"|"zh"|"ko"|null
`filter.js`: isExcluded(node, opts), blockOf(textNode)
`segmenter.js`: collectBlocks(root, opts)->[{el, block, slots:[{node,original}]}]
`apply.js`: createApplier() -> {apply(blockRec, slotMap), showOriginal(), showTranslation(), records, stats}
`main.js`: 진입, 관찰자, 큐.

## 6. 캐시 키
`hash(engineId + "|" + model + "|" + JSON(block.items))`. 값 = slotMap.

## 7. 구현 중 확정된 해석 (T4/T6 보고)
- native `status` 응답: `engines: {"apple-mt": true|{available,reason}, ...}`, `languagePacks: {en: "installed"|"supported"|"unsupported"}` — `supported`(= 지원되나 미설치)면 `needs_language_pack`. native 에러 코드는 `error:{code:"needs_language_pack", lang:"ja"}` 형식 권장(접미형 `needs_language_pack:ja`도 허용).
- `getState.status`: `ready|translating|error`. 배지 `!`: `engine_unavailable`, `needs_language_pack`.
- Apple FM 컨텍스트 4096토큰 → 배치 ≤1500자, 오버플로 시 새 세션으로 재시도.
