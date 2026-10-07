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
요청 `{type:"translate", engine:"apple-mt"|"apple-fm", lang, context, blocks, variant?}` → 응답 `{ok:true, results:[{id,slots}], engine}` 또는 `{ok:false, error:{code, message, lang?}}`.
`{type:"status"}` → `{ok, engines:{"apple-mt":{available,reason?}, "apple-fm":{...}}, languagePacks:{en|ja|zh|zh-Hans|zh-Hant: "installed"|"supported"|"unsupported"}}`.

에러 코드 (Swift `error.code`, 모두 `message` 포함):
| code | 의미 | 비고 |
|---|---|---|
| `needs_language_pack` | 지원되나 미설치 | `lang` 필수. 확장은 다운로드/준비하지 않음(컨테이너 앱 담당) |
| `unsupported_lang` | 언어/쌍 미지원 | `lang` 선택 |
| `timeout` | 요청 제한시간 초과 (MT 45s, FM 90s) | 서킷브레이커 집계 대상 |
| `engine_unavailable` | 엔진 사용 불가, 알 수 없는 엔진, 서킷브레이커 열림 | 집계 대상 |
| `bad_response` | 요청 형식 오류(깨진 메시지·알 수 없는 type) 또는 모델 컨텍스트 초과 | 집계 대상 |
| `unknown` | 그 외 | 집계 대상 |

핸들러 하드닝 규칙:
- 형식이 깨진 메시지(비-객체, 타입 불일치, 알 수 없는 type)는 항상 `{ok:false,error:{code:"bad_response",message}}`로 응답하고 크래시하지 않는다.
- 언어팩 상태(LanguageAvailability)는 언어별 약 30초 캐시. 엔진 오류·타임아웃 시 전체 무효화. `status` 요청은 캐시를 건너뛰고 갱신(컨테이너 앱에서 방금 설치한 경우 반영).
- 서킷브레이커(엔진별): 60초 안에 연속 3회 실패(`timeout`/`engine_unavailable`/`unknown`/`bad_response`) → 30초간 프레임워크 호출 없이 `engine_unavailable`. 성공 또는 `needs_language_pack`/`unsupported_lang` 응답은 카운트를 초기화.
- TranslationSession 캐시: 언어쌍당 1개, 최대 8개(초과 시 가장 오래 쓰지 않은 것 제거), 60초 유휴 시 해제. FM 세션도 60초 유휴 해제.
- JS(`native.js`)는 `error.lang`을 우선 사용하고 없으면 `needs_language_pack:ja` 접미형에서 추출한다. 알 수 없는 코드는 `unknown`.

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
- native `status(lang)` JS 반환: `{available:false, reason:"needs_language_pack", lang}` (미설치), `{available:false, reason:"unsupported_lang"}`, 엔진 불가 시 `reason`은 Swift가 준 값(예: `appleIntelligenceNotEnabled`).
