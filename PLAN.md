# PLAN — ko-translator (Safari 한국어 자동번역 확장)

작성: Opus · 2026-10-07 · **r7 (통합본 + 동적 콘텐츠 §4.5.1, 상주 메모리 측정)**. 이전 개정(r1~r5) 내용을 모두 반영해 재작성.
구현은 Sonnet이 이 문서 + `GUIDELINES.md` 기준으로 진행. 계획 밖 설계 변경은 `STATUS.md` "Opus 확인 필요"로.

---

## 0. 요구사항 요약 (사용자 결정 이력)

| # | 요구 | 반영 |
|---|---|---|
| R1 | Safari 확장. 지정 사이트는 **항상 자동 한국어 번역** | §4.1 |
| R2 | **링크 텍스트·원문 유지 부분 제외** | §4.2 |
| R3 | 자연스럽고 문맥 맞는 번역 (뉘앙스) — meeco.kr 번역기 참고 | §4.3, §4.4, §9 |
| R4 | **로컬 우선**: macOS 내장 또는 오프라인 모델. 유료 API 기본 사용 안 함 | §2, §5 |
| R5 | 최대한 가볍고 빠르게. **AFM 메모리·GPU 우려, Gemma급(5B) 무거움** | §5.4, §5.5 |
| R6 | **웹에서 연 PDF도 번역** | §4.8 |
| R7 | **모델은 최대한 많이 테스트 → 자연스러움·속도·자원 종합해 추후 결정** | §5 (Phase 0) |
| R8 | 언어: **en→ko, ja→ko, zh→ko** 기본. 추후 추가 가능 구조만 | §3 |
| R9 | GitHub 새 repo | T0 |
| R10 | **"더보기"·무한스크롤·AJAX로 추가된 내용도 자동 인식해 안 된 구간 이어서 번역** | §4.5.1 |

---

## 1. 단계 개요

| Phase | 내용 | 산출 | 게이트 |
|---|---|---|---|
| **0. 엔진 벤치마크** | 후보 엔진 광범위 테스트 (품질·속도·자원) | `bench/REPORT.md`, 사용자 평가 | **G0: 엔진 결정** (사용자 + Opus) |
| 1. 스파이크 | Safari 확장 프로세스 안 엔진 동작, PDF 진입 방식 확인 | STATUS 기록 | **G1**: 실패 시 Opus 재설계 |
| 2. 웹페이지 번역 코어 | 콘텐츠 스크립트·background·엔진 연결·UI·컨테이너 앱 | 동작하는 확장 | — |
| 3. PDF 번역 | 확장 자체 PDF 뷰어 | 뷰어 | — |
| 4. 마감 | E2E, README, 정리 | v0.1 | — |
| 이후 | 언어 추가, 클라우드 엔진(옵션), iOS | — | Opus 재검토 |

엔진은 G0 전까지 **미정**. Phase 2 코드는 엔진 추상화(§2)로 작성해 엔진 교체·추가가 쉬워야 함. Phase 1·2 착수는 G0 후.

---

## 2. 아키텍처 (확정 사항)

| 항목 | 결정 | 이유 |
|---|---|---|
| 형태 | Safari Web Extension (MV3) + macOS 컨테이너 앱 | 표준 API, JS 소스 단일 관리 |
| Xcode | `xcrun safari-web-extension-packager`로 `extension/`에서 생성 | 웹 확장 소스가 원본 |
| JS 빌드 | 번들러·트랜스파일 없음, 런타임 의존성 0 (PDF.js 벤더 번들 제외) | 가벼움 |
| 배포 대상 | macOS 26.4+ (실사용 머신: M1 Pro 16GB, macOS 27.2) | Translation AttributedString API |
| DOM 적용 | **텍스트 노드 `nodeValue`만 교체**. 요소 생성·이동·삭제 없음 | meeco 방식. SPA 안전, 링크·이벤트 보존, XSS 표면 0 |
| 주입 범위 | 지정 사이트에만 `scripting.registerContentScripts` 동적 등록 | 비지정 사이트 0바이트 |
| 엔진 추상화 | 엔진 = `{id, kind: "native"|"localhost", langs, translate(blocks, ctx) → slotMap}` | G0 결과로 교체·추가, 언어별 다른 엔진 가능 |
| 엔진 실행 위치 | `native`: 확장 Swift 핸들러(`sendNativeMessage`) / `localhost`: background `fetch` (127.0.0.1만) | 페이지 컨텍스트 노출 없음, 외부 전송 없음 |
| 저장 | 설정 `storage.sync`, 캐시 `storage.local` | — |

### 디렉터리

```
ko-translator/
├── extension/
│   ├── manifest.json
│   ├── background.js            # 메시지 라우팅, 엔진 호출, 배치, 캐시, 스크립트 등록, PDF 진입
│   ├── engines/
│   │   ├── registry.js          # 엔진 목록·선택·언어별 엔진 매핑
│   │   ├── native.js            # sendNativeMessage 래퍼 (Apple 계열)
│   │   ├── localhost.js         # OpenAI 호환 / MT 서버 클라이언트
│   │   └── prompt.js            # LLM 공통 지시문 (언어별 보충 포함)
│   ├── lib/      sites.js · cache.js · hash.js · lang.js(언어 표·스크립트 판정)
│   ├── content/  text.js · filter.js · segmenter.js · apply.js · main.js
│   ├── viewer/   viewer.html · viewer.js · pdfseg.js · viewer.css
│   ├── vendor/pdfjs/            # PDF.js 고정 버전 (Apache-2.0)
│   └── popup/ · options/ · icons/
├── xcode/                       # 컨테이너 앱(SwiftUI) + 확장 핸들러(Swift)
├── bench/                       # Phase 0 (§5)
├── tests/                       # node:test + jsdom
└── PLAN.md · GUIDELINES.md · STATUS.md · README.md
```

---

## 3. 언어

- 기본 소스: **en, ja, zh (간체 zh-Hans + 번체 zh-Hant)** → 대상 **ko** 고정.
- `lib/lang.js` 언어 표 1곳에서 관리: `{code, 스크립트 정규식, 지시문 보충}`. 엔진별 지원 여부는 `engines/registry.js`. 언어 추가 = 표 항목 + 벤치 코퍼스 추가, 그 외 코드 변경 없도록 설계.
- 원문 언어 판정 (가벼운 순):
  1. 문자 스크립트 카운트(meeco 방식): Hangul 비율 ≥ 50% → 스킵. Hiragana/Katakana 존재 → ja. Han 위주 → zh (간/번체는 전용 문자 2개 이상 + 다수결, meeco 로직 참고). Latin → en.
  2. 애매하면 native 쪽 `NLLanguageRecognizer` 결과 사용.
- 표 밖 언어 블록은 번역하지 않음.

---

## 4. 기능 명세

### 4.1 사이트 지정
- 옵션: 호스트 목록(1줄 1호스트). `example.com` = 서브도메인 포함, `docs.example.com` = 정확.
- 팝업: 현재 사이트 "항상 번역" 토글, 원문/번역 토글, 현재 엔진, 오류 안내, PDF 수동 버튼.
- 목록 변경 → background가 콘텐츠 스크립트 재등록 (`*://host/*`, `*://*.host/*`).
- 사이트별 추가 제외 셀렉터(옵션).
- 호스트 권한 `<all_urls>` 선언, Safari 사이트별 허용 UI 따름. 미허용 시 팝업 안내.

### 4.2 제외 규칙
텍스트 노드 조상 중 해당 시 원문 유지:
1. `a` (링크 텍스트)
2. `script, style, noscript, template, svg, math, canvas, iframe, object, video, audio`
3. `pre, code, kbd, samp, var, tt`
4. `input, textarea, select, option` (button 텍스트는 번역)
5. `[translate="no"]`, `.notranslate`, `[contenteditable="true"|""]`, 확장 UI `[data-kt-ui]`
6. 사이트별 사용자 셀렉터
- 텍스트 스킵: `cleanText`(제로폭 제거·trim), `isNonlinguistic`(`\p{L}\p{M}` 없음 / URL만 / 이메일만), 한국어 판정(§3), 미지원 언어.
- 조상 판정은 요소별 `WeakMap` 캐시.

### 4.3 세그먼트화 — 슬롯 모델
- 블록: p, h1–h6, li, td, th, dd, dt, blockquote, figcaption, summary, caption, 직계 텍스트 가진 div/section 등. 하위 블록은 별도.
- 슬롯: 블록 내 번역 대상 텍스트 노드 1개 = 슬롯 1개.
- 중간 표현 (모든 엔진 공통 입력):
  ```
  block = { id, lang, items: [ {k:"t", i:N, text}, {k:"x", text}, ... ] }
  ```
  `t` = 번역 슬롯, `x` = 고정 항목(링크·코드 등, 문맥 전달용, 수정 금지).
- 한도: 블록 ≤ 2000자, 요청 ≤ 6000자 / 40블록 (엔진별 하향 가능, 예: 소형 LLM 컨텍스트).
- 요청은 **문서 순서 연속 블록 묶음** → 문맥 유지.

### 4.4 적용 — `nodeValue`만
- `node.nodeValue = withOuterWhitespace(original, translated)`.
- 레코드 `{node, original, translated}` → 원문/번역 토글은 `nodeValue` 왕복.
- 번역 블록에 `lang="ko"`, 원래 값 기록·복원. 상태 `data-kt="pending|done|error"`.
- 적용 직전 `isConnected` + `nodeValue === original` 확인 (페이지가 바꾼 노드 건너뜀).
- 슬롯 누락: 해당 슬롯 원문 유지. 절반 이상 누락: 블록 전체 원문 + `error`.
- 엔진 출력이 슬롯 단위가 아닐 때(전용 MT 등) 대체 규칙: `x` 경계로 나눈 구간을 각각 번역, 구간 내 슬롯 여러 개면 첫 슬롯에 전체·나머지 `""`.

### 4.5 스케줄링·성능
- `document_idle` 시작. `IntersectionObserver`(`rootMargin: 0px 0px 150% 0px`) 진입 블록만 큐.
- 큐 50ms 디바운스 → 배치. `MutationObserver` 300ms 디바운스로 새/변경 블록만 재처리 (자기 변경은 레코드 대조로 무시).
- DOM 쓰기는 `requestAnimationFrame` 일괄.
- background: 엔진별 동시성(로컬 LLM 1, MT 2~3), 실패 시 백오프 2회.

#### 4.5.1 동적 콘텐츠 ("더보기"·무한스크롤·AJAX·SPA)
원칙: **페이지 전체 재스캔 없이 변경된 부분만** 찾아 이어서 번역. 이미 번역된 블록은 재요청 안 함.
- **추가된 노드** (더보기 버튼, 무한스크롤, 댓글 로드, AJAX 삽입): `MutationObserver`(`childList, subtree`)의 `addedNodes`만 모아 300ms 디바운스 → 해당 서브트리만 세그먼트 → `IntersectionObserver` 등록. 보이는 것부터 번역, 나머지는 스크롤 시.
- **숨겨졌다 펼쳐지는 내용** (접힌 본문 "더보기", `<details>`, 탭, 아코디언): 처음부터 블록으로 등록해 두되 숨김 상태는 교차 안 함 → 펼쳐지는 순간 `IntersectionObserver`가 감지해 번역. 별도 처리 불필요.
- **텍스트 변경** (`characterData`): 번역한 노드의 값이 `translated`도 `original`도 아닌 새 값 → 원문 변경으로 보고 해당 블록 재번역. 페이지가 원문으로 되돌린 경우(React 재렌더 등) → 캐시로 즉시 재적용. **노드당 재적용 3회 제한**(페이지와 무한 반복 방지), 초과 시 해당 블록 포기·`data-kt="error"`.
- **교체된 노드** (프레임워크가 같은 문구를 새 노드로 다시 그림): 새 노드로 취급 → 캐시 히트로 네트워크 없이 즉시 적용.
- **제거된 노드**: 레코드·관찰 해제 (`WeakMap`/`WeakRef` 기반으로 누수 방지), 진행 중 요청 결과는 `isConnected` 검사로 버림.
- **SPA 라우팅** (`pushState`/`popstate`): 위 변이 처리로 자연히 커버. 추가로 URL 변경 감지 시 대기 큐 비우고 현재 화면 블록 재큐잉.
- **같은 출처 iframe**: `registerContentScripts`에 `allFrames: true` (지정 사이트 프레임만). 다른 출처 iframe은 해당 호스트가 목록에 있을 때만.
- **열린 Shadow DOM**: 초기·변이 시 `element.shadowRoot`(open) 있으면 그 안도 같은 방식으로 관찰. closed는 범위 외.
- **폭주 방지**: 변이 대량 발생(무한스크롤 수백 노드) 시 `requestIdleCallback`(없으면 `setTimeout`)으로 프레임당 처리량 제한(예: 200노드/틱). 자기 `nodeValue` 쓰기는 레코드 대조로 무시해 관찰 루프 차단.
- **진행 표시**: 팝업에 "번역 대기 N블록" (디버그용, 기본 숨김).
- 캐시: 블록 단위, 키 = `hash(engineId + model + 블록 직렬화)`. 메모리 LRU 2000 + `storage.local` ~5000 (디바운스 저장).

### 4.6 LLM 공통 지시문 (`prompt.js`, Swift 쪽 동일 문구)
1. 자연스러운 한국어. 직역투 금지, 원문 어조(격식/구어/유머/커뮤니티 말투) 유지.
2. 주어진 범위 전체를 읽고 용어·호칭·문체 일관성 유지.
3. 한 블록의 슬롯은 한 문장의 조각일 수 있음 → 한국어 어순으로 의미를 슬롯 사이 재배분 가능. `x`는 위치 고정·번역 금지, 앞뒤 조사·어미가 자연스럽게 이어지게 (예: `Click [x:here] to continue` → t0 `계속하려면 `, t2 `을(를) 클릭하세요`).
4. 고유명사·제품명·브랜드·코드·단위 원문 유지. 숫자·URL 변경 금지.
5. 모든 슬롯 id 반환(빈 값 `""` 허용). JSON만 출력.
- 언어별 보충: ja — 경어 수준을 한국어 존댓말 수준에 대응 / zh — 한자어 직역 지양, 고유명사는 한국 통용 표기 우선.

### 4.7 엔진 연결 (G0 후 확정, 후보는 §5.2)
- **native (Apple 계열)**: 확장 Swift 핸들러가 Translation / Foundation Models 실행. 언어팩·모델 다운로드는 확장 프로세스에서 하지 않음 → 컨테이너 앱 담당. 미설치 시 `needs_language_pack:<lang>` 에러 → 팝업 안내.
- **localhost (오프라인 모델)**: background → `http://127.0.0.1:<port>` (Ollama / MLX 서버 / MT 서버). 다른 호스트 금지. 서버 미기동 시 팝업 안내. 모델 설치·서버 실행은 사용자 몫(README 안내).
- AFM(Foundation Models) 채택 시 자원 정책: 기본 OFF 옵트인, 동시 1, prewarm 안 함, 60초 유휴 시 세션 해제, 온디바이스만(`PrivateCloudComputeLanguageModel` 금지).
- 클라우드(DeepL/Claude 등 유료 API): 기본 범위 외. 필요 시 Opus 재검토.

### 4.8 PDF 번역
Safari 기본 PDF 뷰어는 웹 DOM이 아님 → **확장 자체 뷰어**(`viewer/`, PDF.js 번들)로 열어 번역.
- 진입: 자동(지정 사이트 또는 직전 페이지가 지정 사이트인 탭에서 PDF로 이동 시 뷰어로 전환) + 수동(팝업 "이 PDF 번역해서 보기", 모든 사이트). 자동 방식 후보 a) `webNavigation`+`tabs.update` b) DNR `extensionPath` redirect c) PDF 문서 콘텐츠 스크립트 감지 — Phase 1에서 확인.
- 로딩: background `fetch` → ArrayBuffer 전달. 로그인 필요 PDF 실패 시 "원본 열기" 안내.
- 표시: 기본 **나란히 보기**(좌 원본 캔버스 + 주석 레이어로 링크 유지 / 우 번역 문단, hover 시 원본 위치 강조). 토글 "번역만(리플로우)". 상단 "원본 PDF 열기"(`#kt-original`로 재전환 방지).
- `pdfseg.js`(순수 함수): textContent items → 줄(baseline) → 문단(줄 간격·들여쓰기·폰트 크기) → 하이픈 연결 → 다단 열 분리. 블록 = 문단, 슬롯 1개. `x` = 링크 주석 rect 겹침·고정폭 폰트·`isNonlinguistic`. 반복 머리글/쪽번호 생략. ja/zh는 줄바꿈 시 공백 삽입 안 함. 텍스트 없는 스캔 PDF → "OCR 미지원" 표시.
- 번역·캐시는 웹과 공용. 보이는 페이지 ±1만 렌더·번역. 문맥 = PDF 제목 + 같은 페이지 앞 문단.
- 세로쓰기 ja/zh PDF: 감지만 하고 "미지원" 표시.

### 4.9 UI
- 옵션: 엔진 선택(언어별 가능), localhost 포트·모델명, 사이트 목록, 사이트별 제외 셀렉터, 캐시 비우기.
- 팝업: §4.1.
- 컨테이너 앱(SwiftUI 1화면): Safari 확장 활성화 버튼, 언어팩 상태(en/ja/zh-Hans/zh-Hant → ko) + 설치 버튼(`translationTask`+`prepareTranslation`), Apple Intelligence 가용 여부.
- 시스템 폰트, 다크모드, 바닐라 HTML/CSS.

---

## 5. Phase 0 — 엔진 벤치마크 (최우선)

목표: **최대한 많은 후보**를 같은 조건으로 비교 → 자연스러움·속도·자원 종합 → G0에서 기본 엔진(+선택 엔진) 결정.

### 5.1 하네스 구성 (`bench/`)
```
bench/
├── corpus/  en.json · ja.json · zh-Hans.json · zh-Hant.json   # §4.3 블록 형식
├── engines/                 # 엔진 어댑터 (공통 인터페이스: blocks → slotMap + timing)
│   ├── apple/               # SwiftPM CLI `kt-bench` (Translation, FoundationModels)
│   ├── ollama.mjs           # Ollama (OpenAI 호환)
│   ├── mlx.mjs              # mlx_lm.server (OpenAI 호환)
│   └── mt_server.py         # CTranslate2 전용 MT 모델 서버 (127.0.0.1)
├── monitor.sh               # 시스템 전체 프로세스 RSS 1초 샘플링, 유휴 언로드 추적
├── run.mjs                  # 엔진×언어×반복 실행 매트릭스 → results/
├── summarize.mjs            # 수치 집계 → REPORT.md
├── rate/rate.html           # 블라인드 품질 평가 페이지 (로컬, 오프라인)
└── results/
```

### 5.2 후보 엔진 (최대한 넓게; 가용성·라이선스·크기는 T0.1에서 Sonnet 확인 후 표 갱신)

자원 등급: **L**(추가 메모리 ≤1.5GB) / **M**(≤3GB) / **H**(>3GB, 품질 상한 참고용). H는 기본 채택 불가, 비교 기준점으로만.

| 계열 | 후보 | 등급(예상) | 비고 |
|---|---|---|---|
| Apple Translation | `translate(String)`, `translate(AttributedString)+skipsTranslation` × `preferredStrategy` 전 케이스 | L | 시스템 관리·ANE. 언어팩 필요 |
| Apple FM (AFM) | `SystemLanguageModel` 온디바이스, guided generation, guardrails `permissiveContentTransformations` | 측정 | 데몬 메모리·GPU 측정이 핵심 |
| 전용 MT (CTranslate2 int8) | m2m100_418M, m2m100_1.2B, nllb-200-distilled-600M, nllb-200-distilled-1.3B, Opus-MT 계열(en/ja/zh→ko 존재분), madlad400-3b-mt | L~M (madlad H) | 슬롯 불가 → §4.4 대체 규칙. NLLB는 CC-BY-NC(개인용만) |
| 한국어 특화 소형 LLM | EXAONE (1.2B / 2.4B급), HyperCLOVA X SEED (0.5B / 1.5B급), Kanana (1.5B / 2.1B급) | L~M | 한국어 자연스러움 기대. 라이선스 확인 |
| 범용 소형 LLM | Qwen3 0.6B / 1.7B / 4B, Gemma 3 1B / Gemma 3n E2B, Llama 3.2 1B / 3B, Phi 소형 | L~M (4B는 M~H) | zh·ja 강한 모델 포함 |
| 번역 특화 LLM | Hunyuan-MT 7B, Seed-X 7B 등 | H | 품질 상한 참고, 사용자 승인 시만 |
| 런타임 비교 | 상위 LLM 2~3개 Ollama(GGUF Q4) vs MLX(4bit) | — | 같은 모델의 런타임별 메모리·속도 |

- `gemma4:e2b`(설치됨, 5.1B)는 H 등급으로 전체 시나리오 측정 (추가 다운로드 없음) — 문맥 모드 후보 여부 판단용.
- **모델 다운로드는 사용자 승인 후**. Sonnet이 후보별 다운로드 크기·합계를 먼저 보고.

### 5.3 코퍼스
- 언어별(en / ja / zh-Hans / zh-Hant) 각 ~24블록, **Sonnet이 직접 작성** (외부 문장 복사 금지).
- 장르: 기술 문서 6 / 뉴스·설명문 6 / 커뮤니티 구어·유머·슬랭 6 / UI 문구 3 / 링크가 문장 중간에 낀 블록 3.
- 일부 블록은 인라인 서식으로 슬롯 2~3개 분할. 고유명사·코드·숫자·URL 포함 블록 포함.
- 연속 문맥 세트 1개(같은 글 연속 블록: 용어·호칭 일관성 확인).
- PDF 경로 확인용: 2단 레이아웃 샘플 PDF 1개(직접 생성)에서 추출한 문단도 포함.

### 5.4 측정 지표
**자연스러움 (핵심, 주관)**
- `rate.html`: 블록마다 원문 + 엔진 출력들을 **엔진명 숨기고 무작위 순서**로 표시. 자연스러움 1–5, 정확성 1–5, 최선 1개 선택. 결과 JSON 다운로드 → `results/ratings.json`.
- 평가 부담 축소: 1차 자동 지표로 하위 컷 → 상위 ~6개만 사용자 평가. 언어별 샘플 8블록 정도.
- 자동 보조 지표: 슬롯 반환율, `x` 원형 보존율, JSON 유효율, 고유명사·숫자·URL 보존율, 출력 한글 비율(미번역 탐지), 길이 비율 이상치, 반복·환각 탐지(원문에 없는 긴 문장 추가).

**속도**
- 콜드 스타트(첫 요청), 웜 블록당 p50/p95, 24블록 배치 시간, 초당 처리 문자 수.

**자원 (시스템 전체 기준 — 모델이 별도 프로세스·데몬에서 돎)**
- **상주 vs 순간 부하 구분 측정**: 번역은 순간적이지만 로컬 LLM은 다음 요청 대비 메모리에 상주(예: Ollama 기본 keep_alive 5분)하고, 자동 번역은 스크롤·더보기마다 수시로 요청 → 실사용에선 사실상 상주. 시나리오 3종 측정:
  1. 상주(keep_alive 유지): 상주 메모리, 웜 지연
  2. 즉시 언로드(keep_alive 0 / 세션 해제): 매 요청 콜드 로드 시간
  3. 실사용 모사: 30초 간격 5분간 요청(스크롤 브라우징 흉내) 동안 메모리·GPU 시간 비율·스왑 발생(`vm_stat` swapouts, `memory_pressure`)
- 16GB 머신에서 Safari 탭 다수 열린 상태 가정 → 메모리 압력(스왑) 발생 여부를 판정에 포함.
- `ps -axo pid,rss,comm` 1초 샘플 → 증가량 상위 프로세스 = 엔진 비용.
- 최대 추가 메모리, 유휴 복귀(마지막 요청 후 1·3·5분) = 언로드 여부, 모델 디스크 크기.
- GPU/ANE/CPU 전력: `sudo powermetrics --samplers gpu_power,ane_power,cpu_power -i 1000` — sudo 필요 → **사용자가 직접 실행**, 하네스는 명령·로그 경로 안내 후 로그 파싱.

### 5.5 판정 (G0)
- 하드 조건(기본 엔진): 실사용 모사 시나리오 기준 추가 메모리 ≤ 1.5GB · 스왑 증가 없음, 유휴 시 언로드, 웜 블록당 p50 ≤ 500ms, 슬롯/`x` 보존 ≥ 95%, 오프라인 동작.
- 가중 점수(조건 통과 엔진): 자연스러움 50 / 속도 25 / 자원 25. **언어별(en/ja/zh) 따로 산출** → 언어별 다른 엔진 선택 가능.
- 결과: 기본 엔진(언어별) + 선택 엔진("문맥 모드", 고품질·고자원) 0~2. **H 등급(gemma4:e2b 등)도 품질 차이가 크면 문맥 모드 옵트인 후보로 허용**(짧은 keep_alive 설정 포함). 최종 결정은 REPORT 보고 사용자 + Opus.

### 5.6 역할 분담
- Sonnet: 코퍼스·어댑터·하네스 작성 (impl-worker 병렬: ① Swift `kt-bench` ② Node 어댑터+run/summarize/monitor ③ Python MT 서버 ④ rate.html — 파일 겹침 없음).
- `sim-runner`(Haiku): 매트릭스 실행(엔진×언어×3회), 모니터 로그 집계, 실패 요약, REPORT 생성 명령 실행.
- Sonnet: STATUS 기록, REPORT·rate.html 사용자 전달.
- 사용자: 언어팩 설치, 모델 다운로드 승인, powermetrics 실행, 블라인드 평가.

### 5.7 사전 준비 (사용자)
- 시스템 설정 › 일반 › 언어 및 지역 › 번역 언어: 영어·일본어·중국어(간체·번체)·한국어 다운로드.
- Apple Intelligence 켜기 (AFM 측정용).
- Ollama 기동. Python 패키지(ctranslate2, mlx-lm 등)는 Sonnet이 `bench/.venv`에 설치 — 설치 전 사용자 확인.

---

## 6. 작업 목록 (Sonnet)

**[P]** = impl-worker 병렬 가능 (파일 겹침 없음).

| # | 작업 | 의존 |
|---|---|---|
| **Phase 0** | | |
| T0 | repo 초기화: `git init`, 골격, `.gitignore`(node_modules, .venv, xcuserdata, DerivedData, 모델 파일), `package.json`(devDeps: jsdom), README 초안, `gh repo create ko-translator --private --source . --push` | — |
| T0.1 | 후보 엔진 가용성·라이선스·다운로드 크기 조사 → §5.2 갱신안 STATUS 기록 → **사용자 다운로드 승인** | T0 |
| T0.2 [P] | 코퍼스 4언어 작성 | T0 |
| T0.3 [P] | `bench/engines/apple` Swift CLI | T0 |
| T0.4 [P] | `ollama.mjs`, `mlx.mjs`, `run.mjs`, `summarize.mjs`, `monitor.sh` | T0 |
| T0.5 [P] | `mt_server.py` (CTranslate2, 모델 변환 스크립트 포함) | T0 |
| T0.6 [P] | `rate/rate.html` | T0 |
| T0.7 | 1차 실행(sim-runner) → 자동 지표 컷 → 상위 후보 | T0.1–T0.5 |
| T0.8 | 2차 실행(상위 후보 3회 + powermetrics 안내) → REPORT.md → 사용자 블라인드 평가 | T0.6, T0.7 |
| **G0** | 엔진 결정 (사용자 + Opus) → PLAN §4.7 확정 개정 | T0.8 |
| **Phase 1** | | |
| T1 | 스파이크(packager 최소 프로젝트): ① 확장 안 채택 엔진 동작(native: `installedSource` 세션·FM 호출·메모리 / localhost: background fetch) ② PDF 자동 진입 a/b/c 중 Safari 동작 방식 ③ 확장에서 PDF fetch 쿠키 여부 → **G1** | G0 |
| **Phase 2** | | |
| T2 [P] | `lib/*` + 테스트 | G1 |
| T3 [P] | `content/text·filter·segmenter·apply` + jsdom 테스트 | G1 |
| T4 [P] | `engines/*` (G0 채택분) + 모킹 테스트 | G1 |
| T5 [P] | `popup/*`, `options/*`, `manifest.json`, 아이콘 | G1 |
| T6 | `background.js` | T2, T4 |
| T7 | `content/main.js` (§4.5, §4.5.1 동적 콘텐츠 포함) + jsdom 테스트 | T3 |
| T8 | Swift: 확장 핸들러 + 채택 native 엔진 + 컨테이너 앱 화면, `xcodebuild` | T1, T6 |
| **Phase 3** | | |
| T9 | PDF: `vendor/pdfjs`, `viewer/*`, `pdfseg.js` + 테스트, background 진입 처리 | T1, T6 |
| **Phase 4** | | |
| T10 | 수동 E2E(§7), README(설치·언어팩·모델·서명 안 된 확장 허용), 커밋·푸시 | T7–T9 |

---

## 7. 완료 기준 (DoD)

- `npm test` 통과 (필수 케이스: GUIDELINES §테스트).
- E2E (Safari 실사용):
  - en(위키백과 영문, MDN, Hacker News), ja 1곳, zh 간체·번체 각 1곳, React SPA 1곳
  - 본문 한국어, 링크 텍스트 원문·클릭 유지, `Click [link] to …` 류 어순 자연스러움
  - code/pre 원문, 입력값 불변, SPA 상호작용·라우팅 후 깨짐·콘솔 에러 없음
  - 비지정 사이트 주입 없음, 스크롤 지연 번역, 재방문 캐시
  - 동적 콘텐츠: "더보기" 버튼(댓글·본문 펼침), 무한스크롤 피드, `<details>` 펼침, SPA 라우팅 후 새 구간 자동 번역 / 이미 번역된 구간 재요청 없음(네트워크·엔진 로그 확인) / React 재렌더 후 번역 유지·무한 반복 없음
  - 원문 토글 왕복 정상, 네트워크 차단 상태 동작
  - PDF: 지정 사이트 PDF 링크 → 뷰어, 문단 번역, PDF 링크 동작, 2단 논문 순서, 원본 열기, 비지정 사이트 수동 버튼, ja/zh PDF 1개씩
- 성능: 콘텐츠 스크립트 합계 < 30KB(비압축), 첫 화면 번역 < 1s(기본 엔진, 캐시 미스), 유휴 시 엔진 메모리 해제.

---

## 8. 범위 외 / 추후

- 언어 추가(fr, de, es 등) — 구조만 준비(§3).
- 클라우드 엔진(DeepL, Claude 등 유료 API) — 기본 OFF, 필요 시 Opus 재검토.
- iOS/iPadOS, 원문·번역 병기, 이미지 텍스트·PDF OCR, PDF 원본 덮어쓰기·번역 PDF 저장, 세로쓰기 PDF, 속성(`title`/`alt`) 번역, App Store 배포.

---

## 9. 참고: meeco.kr 번역기 분석 (`addons/meeco_translate/js/meeco_translate.js`)

반영: 텍스트 노드 `nodeValue` 교체 + `{node, original, translated}` 토글 / 문서 전체 문맥으로 LLM 번역 / `withOuterWhitespace`·`cleanText`·`isNonlinguistic` / 스크립트 문자 수 비교로 번역 필요 판정, 간·번체 전용 문자 판별 / 제외 태그 목록·`translate="no"`·`.notranslate` / 번역 요소 `lang` 설정·원복 / 요청 ~6000자·40블록.
차이: meeco는 수동 버튼·서버 비동기(폴링)·서버 공유 캐시·원문 텍스트 재매칭. 본 확장은 자동·로컬 엔진·로컬 캐시·슬롯 id 직접 매핑. 서버 프롬프트 비공개 → §4.6 자체 설계.

## 10. 근거: macOS SDK 확인 (MacOSX27.2.sdk, 2026-10-07)

- `TranslationSession(installedSource:target:)` (26.0+): UI 없이 세션 생성. 언어팩 다운로드는 UI 필요 → 컨테이너 앱.
- `translate(_: AttributedString)` + `TranslationAttributes.skipsTranslation` (26.4+): 링크 구간 고정 번역.
- `translations(from:)` 배치, `preferredStrategy` (26.4+).
- `FoundationModels.SystemLanguageModel` 온디바이스, `supportedLanguages`, guardrails `permissiveContentTransformations`. `PrivateCloudComputeLanguageModel`(27.0)은 클라우드 → 제외.
- 로컬 환경: M1 Pro / 16GB, Ollama 설치(`gemma4:e2b` 보유).
