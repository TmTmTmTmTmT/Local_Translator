# extension/PROTOCOL.md — 모듈 간 계약 (Phase 2)

상위: `../PLAN.md` §2–§4, `../GUIDELINES.md`. 변경 시 이 파일을 먼저 수정(Opus 확인 사항이면 STATUS에 기록).

## 1. 설정 (`browser.storage.sync` key `settings`, 기본값)
```json
{
  "sites": [ { "host": "example.com", "exclude": "" } ],
  "engine": { "default": "native:apple-mt", "byLang": { "ja": null, "zh": null } },
  "localhost": { "baseUrl": "http://127.0.0.1:11434", "kind": "ollama|mlx|ct2", "model": "", "family": "hymt2|translategemma|chat", "keepAlive": 300 },
  "enabled": true,
  "translateAttrs": false,
  "fixParticles": true,
  "linkMode": "standalone",
  "glossary": [ { "src": "kerbs", "dst": "연석", "lang": "en", "case": false } ]
}
```
- `localhost.family`/`keepAlive`(초, 기본 300)는 MT 모드 엔진(`local:mt-ollama`, `local:mt-mlx`) 전용. `family` 미지정/무효 시 모델명에서 추정(translategemma/hy-mt) 후 `chat`. `local:mt-mlx`는 `model` 무시(요청 model=`default_model`). `baseUrl`은 모든 localhost 엔진 공통이므로 mlx는 8080 등으로 직접 지정. 루프백 검증 동일.
- `translateAttrs`(boolean, 기본 false): true면 `content/extra.js`를 main.js 앞에 추가 주입해 title/alt/placeholder/aria-label 속성도 번역. `fixParticles`(boolean, 기본 true): main.js `start({fixParticles})` → `createApplier({fixParticles})`로 전달, false면 링크 뒤 조사 보정 안 함. 알 수 없는 키는 병합 시 그대로 통과.
- `linkMode`(`"standalone"` 기본 | `"never"`): `standalone`은 문장 속 인라인 링크만 원문 유지(x)하고, 블록에 글자 있는 `t` 슬롯이 없고 링크 유래 x만 있으면(헤드라인·카드·메뉴) 그 링크 텍스트를 `t`로 승격해 번역. `never`는 링크를 항상 x로 유지(이전 동작). 빈 값/알 수 없는 값은 `standalone`. main.js가 `start({linkMode})` → `collectBlocks(root,{linkMode})`로 전달. filter의 `exclusionReason`은 링크 유래 `'link'`와 코드 계열 `'keep'`을 구분(코드 계열 조상 안의 링크는 `'keep'`).
- `glossary`(기본 `[]`, PLAN §11.3): `{src, dst, lang?: "en"|"ja"|"zh"|null, case?: boolean}` 배열. 최대 500개, src 1~80자, dst 비어 있지 않음, 무효 항목은 버리고 소문자 src+lang 중복은 첫 항목만 유지(`lib/glossary.js normalize`). background가 엔진 호출 직전 블록의 `t` 항목(`x` 제외)에 사전 치환을 적용한다(라틴어 용어는 단어 경계·`case`가 true가 아니면 대소문자 무시, CJK/한글 용어는 단순 포함, 긴 용어 우선·겹침 없음, `lang`이 있으면 블록 언어와 일치할 때만). 캐시 키에 블록에 실제 적용된 용어 쌍의 해시가 들어간다(§6). 프롬프트 기반 엔진에는 적용된 쌍이 `context.glossary = [[src,dst],...]`로 전달되고(적용이 없으면 키 자체가 없음) prompt.js 시스템 프롬프트와 MT 모드 `chat` family 시스템 프롬프트에 한 줄 힌트로 붙는다(hymt2/translategemma 템플릿은 불변). 네이티브(Swift) 쪽 힌트는 아직 미구현이며 `context.glossary`는 그대로 전달만 된다.
- `engine` 값은 엔진 ID 문자열. 엔진 레지스트리(`engines/registry.js`)가 ID → 엔진 객체 해석.

## 2. 메시지 (runtime.sendMessage, `{type, ...}`)
| type | 방향 | 요청 | 응답 |
|---|---|---|---|
| `translate` | content/viewer → background | `{blocks:[Block], context:{title,host}, lang}` | `{ok:true, results:[{id, slots:{"0":"…"}}], engine}` 또는 `{ok:false, code, message}` |
| `getState` | popup/content → background | `{url?, tabId?}` (popup은 tabId 권장) | `{siteEnabled, host, engine, status, pending, errorCode?}` |
| `setSiteEnabled` | popup → background | `{host, enabled}` | `{ok:true}` |
| `toggleOriginal` | popup → content(tabs.sendMessage) | `{}` | `{mode:"translated"|"original"}` |
| `getMode` | popup → content(tabs.sendMessage) | `{}` | `{mode:"translated"|"original"}` (상태 변경 없음) |
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
`hash(engineId + "|" + model + "|" + JSON(block.items))`. 값 = slotMap. 용어집이 블록에 적용된 경우에만 model 자리가 `model + "|g" + appliedKey`(적용된 [src,dst] 쌍의 FNV 해시)가 되고 items는 항상 원본이다. 적용이 없으면 키는 용어집 도입 전과 동일.

## 7. 구현 중 확정된 해석 (T4/T6 보고)
- native `status` 응답: `engines: {"apple-mt": true|{available,reason}, ...}`, `languagePacks: {en: "installed"|"supported"|"unsupported"}` — `supported`(= 지원되나 미설치)면 `needs_language_pack`. native 에러 코드는 `error:{code:"needs_language_pack", lang:"ja"}` 형식 권장(접미형 `needs_language_pack:ja`도 허용).
- `getState.status`: `ready|translating|error`. 배지 `!`: `engine_unavailable`, `needs_language_pack`.
- Apple FM 컨텍스트 4096토큰 → 배치 ≤1500자, 오버플로 시 새 세션으로 재시도.
- native `status(lang)` JS 반환: `{available:false, reason:"needs_language_pack", lang}` (미설치), `{available:false, reason:"unsupported_lang"}`, 엔진 불가 시 `reason`은 Swift가 준 값(예: `appleIntelligenceNotEnabled`).

## 8. MT 모드 엔진 (`engines/mtmode.js`, `local:mt-ollama` / `local:mt-mlx`)
- 번역 특화 모델용. JSON 슬롯 프롬프트 대신 **블록당 1요청(동시성 1)**, 평문 출력. 블록의 x 항목은 `⟦n⟧`(1부터) 표식으로 치환해 보내고, 응답을 표식에서 분할해 t-구간 슬롯에 배분(구간 전체 번역은 구간 첫 슬롯, 나머지 `""`). 표식이 1..n 각 1회·순서대로가 아니거나 원문에 `⟦⟧`가 있거나 빈 구간이면 x 경계 구간별 별도 요청(run-splitting)으로 폴백. 표식 옆 공백은 모델 출력을 따르고 블록 바깥 가장자리만 원문 공백 유지. 문자 없는 구간/블록은 원문 유지.
- family별 프롬프트: `hymt2`(en/ja 영어 지시문, zh 중국어 지시문 `将以下文本翻译为韩语，…`), `translategemma`(모델 템플릿 원문), `chat`(system: 한국어 번역 지시 + 표식 규칙 + 언어별 보충 `LANG_NOTES`; qwen3는 `/no_think`).
- 전송: Ollama는 `/api/chat`(`keep_alive`, `options.num_ctx` 등). MLX는 translategemma만 raw `/v1/completions`(렌더된 prompt, `stop:["<end_of_turn>"]`), 그 외 `/v1/chat/completions`(model `default_model`).
- 에러: `engine_unavailable`/`timeout`/`rate_limited`는 배치 즉시 중단(throw). 그 외 블록 단위 실패는 해당 블록만 Map에서 누락, 전부 실패하면 첫 에러 throw. 배치 한도 `{chars:1500, blocks:8}`.
- 스크립트 순서: `common.js, prompt.js, mtmode.js, native.js, localhost.js, registry.js`.
