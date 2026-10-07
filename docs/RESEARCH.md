# RESEARCH — 재사용/참고 가능한 오픈소스 조사

작성: 2026-10-07 (조사 기준일). 방법: GitHub API/레포 페이지/WebSearch. 별/최근 푸시는 조사 시점 값.
**신뢰도 주의**: 일부 항목(Mozilla 모델의 ko-en/ja-en/zh-en 존재 여부, MADLAD 등 모델 용량, Transformers.js ONNX 용량)은 레지스트리 응답이 잘려 **미확인**으로 표기. 실제 채택 전 직접 확인 필요.
**우리 레포 라이선스는 "미정"** (README). 아래 "코드 복사" 가능 여부는 (a) 퍼미시브(MIT/Apache) 공개 레포 (b) GPL 계열 공개 레포 어느 쪽으로 갈지에 따라 달라짐. 기본 가정은 (a).

---

## 1. 요약 표

| # | 후보 | 라이선스 | 활동/별 | 판정 | 노력 |
|---|---|---|---|---|---|
| A1 | mozilla/translations (Firefox Translations 학습·모델·추론) | MPL-2.0 (모델도 MPL-2.0) | 2026-09 / 359 | ADAPT (모델 평가용) | L |
| A2 | mozilla/firefox-translations-models | MPL-2.0 | 2025-12 아카이브 / 467 | SKIP (구 저장소; mozilla/translations로 이전) | - |
| A3 | browsermt/bergamot-translator (WASM) | MPL-2.0 | 2024-05 / 550 | ADAPT-조건부 (Safari WASM 스파이크 후) | L |
| A4 | translateLocally / translatelocally-web-ext | MIT / MPL-2.0 | 2025-03~04 / 632, 95 | INSPIRATION | - |
| A5 | Argos Translate | MIT | 2026-08 / 6.5k | SKIP (OpenNMT 소형, ko 품질 낮음; CT2 직접 사용 중) | - |
| A6 | LibreTranslate | AGPL-3.0 | 2026-09 / 17k | SKIP (AGPL + Argos 기반) | - |
| A7 | Transformers.js (+Xenova/nllb, m2m100 ONNX) | Apache-2.0 (NLLB 가중치 CC-BY-NC) | 2026-10 / 16k | INSPIRATION (Safari 확장 내 상주 불리) | L |
| A8 | CTranslate2 | MIT | 2026-10 / 4.7k | ADOPT (이미 bench 사용) | S |
| B1 | Firefox TranslationsDocument (mozilla-central) | MPL-2.0 | 상시 / - | ADAPT (알고리즘 참고, 파일 단위 카피 가능) | M |
| B2 | UnpxreTW/Koine (Safari + Apple Translation) | 혼합: Extension/JS Apache-2.0, Koine 코어 FSL-1.1-ALv2 | 2026-10 / 0 (WIP) | ADAPT(Apache 부분)/INSPIRATION(FSL 부분) | M |
| B3 | Kiss Translator | GPL-3.0 | 2026-10 / 12.8k | INSPIRATION (GPL: 코드 복사 불가) | - |
| B4 | Read Frog (read-frog) | GPL-3.0 | 2026-10 / ~10k | INSPIRATION | - |
| B5 | Polyglot / safarikai / TransFrog류 Safari 확장 | 혼합/없음 | 대부분 2019~2023 | SKIP | - |
| C1 | PDFMathTranslate-next (pdf2zh) | AGPL-3.0 | 2026-04 / 725 | INSPIRATION | - |
| C2 | BabelDOC | AGPL-3.0 | 2026-08 / 9.7k | INSPIRATION | - |
| C3 | EmbedPDF 레이아웃 분석(ONNX, 브라우저) / pdf-inspector / PDF2TXT(pdf.js 기반) | 미확인 | - | INSPIRATION (X-Y cut 개념) | - |
| D1 | NLLanguageRecognizer (Apple, 시스템) | 시스템 | - | ADOPT (네이티브 측) | S |
| D2 | efficient-language-detector-js (ELD) | Apache-2.0 | 127 / 60개 언어 | 보류 (현 스크립트 기반 감지로 충분) | S |
| D3 | tinyld / franc / cld3-asm | MIT / MIT / MIT | tinyld 2023 정체, franc 2024 정체 | SKIP | - |
| D4 | toss/es-hangul (조사 함수 포함) | MIT | 2026-08 / 1.9k | ADAPT (조사 선택 로직만 발췌 or 의존) | S |
| D5 | hangul-josa 등 (npm) | 미확인(MIT 계열 추정) | - | INSPIRATION | S |
| E1 | Koine `TranslationSession(installedSource:target:)` 패턴 | (API 사용법, 코드는 FSL) | 2026-10 | ADAPT (재구현) | M |

---

## 2. 후보별 노트

### A) 브라우저 내 로컬 MT

**A1/A2 Mozilla Translations / models** — 모델: Marian 계열 지식증류 소형(언어쌍당 약 20~60MB 비압축, "base-memory" 변형). 레지스트리에서 확인된 CJK: **en→ja** (base 59.4MB, COMET22 0.8935), **en→ko** (base 59.5MB, COMET22 0.8651; base-memory 43.8MB, 0.8708). **ko→en, ja→en, zh→en, en→zh은 응답 잘려 미확인** (Firefox CJK 지원 공지에는 CJK 포함이라 존재 가능성 높음). **xx→ko 직접쌍은 없음 → 영어 피벗(ja→en→ko) 필요 = 품질·지연 2배 손실.** 모델 MPL-2.0, GCS 버킷 공개. 한계: 소형 증류모델은 문체/뉘앙스(R3)에서 LLM·NLLB에 못 미칠 가능성이 큼.
**A3 bergamot-translator** — Marian C++를 WASM으로 빌드(SIMD int8). 한국어 모델이 나왔으므로 기술적으론 가능. Safari 리스크: WASM 메모리 한계(힙 확장 실패 시 탭/프로세스가 알림 없이 종료되는 사례 보고), 확장 background(MV3 service worker)의 수명·메모리 압박 시 종료, 4GB 이상 미지원. 소형(<100MB) 모델이라 메모리 자체는 감당 가능하나 **스레드(SharedArrayBuffer) 가능 여부가 Safari 확장 컨텍스트에서 불확실** → 단일 스레드 WASM이면 속도 저하. 마지막 푸시 2024-05로 정체.
**A4 translateLocally** — macOS 네이티브 앱(Marian+Bergamot) + 웹확장 포크. 우리와 같은 구조(네이티브 엔진 + 확장). 참고용: 모델 패키지 포맷, 웹확장↔네이티브 메시징.
**A5/A6 Argos·LibreTranslate** — Argos는 OpenNMT 소형(CT2 기반) 모델 팩. ko 지원 목록에는 있으나 품질은 쌍별 편차가 크다는 일반 평가뿐, **ko 팩의 구체적 품질·크기는 미확인**. LibreTranslate는 AGPL 서버라 번들 불가. 우리 bench가 이미 CT2+NLLB/MADLAD를 직접 평가하므로 중복.
**A7 Transformers.js** — Apache-2.0, ONNX Runtime Web 기반, WebGPU+WASM 폴백(4.x). NLLB-600M ONNX 변환본(Xenova)은 있으나 **가중치 CC-BY-NC-4.0**. Safari 26은 WebGPU 기본 탑재이나 확장 컨텍스트에서의 동작·메모리 보증이 없고 모델 수백 MB를 IndexedDB 캐시해야 함 → **네이티브(Swift/CT2/MLX) 경로가 우월**. 비교 벤치용 오프라인 참조로만.

### B) 웹페이지 번역 확장 / DOM 처리

**B1 Firefox TranslationsDocument** (mozilla-central `toolkit/components/translations/`) — 핵심 아이디어: 블록(인라인 묶음) 단위로 한 번 번역 요청, 텍스트 노드 값만 교체, 변경 노드는 MutationObserver로 감지해 **같은 노드의 다중 변경을 배치로 합쳐 최종 상태 1회만 번역**(테스트 `browser_translations_translation_document_mutations.js` 존재), 속성(alt/title 등)은 별도 번역 요청, 뷰포트 우선 큐잉. 우리 PLAN §4.5.1과 일치. MPL-2.0이라 파일 단위 카피 가능(해당 파일은 MPL 유지)이나, Gecko 전용 API(actor, `isContentVisible` 등)가 많아 **알고리즘만 이식(재구현)** 권장.
**B2 Koine** — Safari Web Extension + Apple Translation + (예정) Foundation Models. 2026-06 시작, 매우 초기(별 0). 확장 쪽 `content.js`(2.9k줄, Apache-2.0): block/inline 판정(computed display + 강제 블록 태그), SKIP_SUBTREE/OPAQUE_INLINE(code·time 등 원자 취급), `translate="no"`/role/숨김/`content-visibility` 검사, 이미 번역된 노드 재채집 방지(속성 마킹), MutationObserver 재채집 루프 방지(읽기/쓰기 분리). **주의: 번역문을 요소로 삽입하는 병렬(bilingual) 방식 → 우리 "nodeValue만 교체" 원칙과 다름**. 코어 Swift(`AppleTranslationEngine`, `TranslationSessionPool` 등)는 **FSL-1.1-ALv2**(경쟁 용도 금지, 2년 후 Apache 전환) → 우리는 번역기라 "경쟁 용도"에 해당할 소지가 큼 → **복사 금지, 설계만 참고**. 또한 content.js가 Read Frog(GPL-3.0)의 상수 목록을 인용한다고 주석에 명시 → 계보가 GPL일 수 있어 복사 전 법적 확인 필요.
**B3 Kiss Translator** (GPL-3.0, 12.8k★, Safari mac/iOS 지원, Ollama는 OpenAI 호환 주소만) — 링크·스타일 보존 "리치 텍스트" 번역과 규칙 시스템(사이트별 셀렉터)이 참고 가치. GPL이라 복사 불가.
**B4 Read Frog** (GPL-3.0, TS) — Koine이 FORCE_BLOCK 25 태그 등을 가져온 원형. 아이디어 참고.
**B5 기타 Safari 확장** — Polyglot(선택 텍스트), safarikai(일본어 단어), TransFrog 등은 전체 페이지 번역 아님/정체. SKIP. "링크 유지 + SPA" 처리의 전형적 오픈소스 구현은 위 B1·B2뿐.

### C) PDF 번역
**C1 PDFMathTranslate-next / C2 BabelDOC** — Python 서버·CLI, DocLayout-YOLO(ONNX)로 레이아웃 분석 후 번역 PDF를 재조판(수식·표 보존). **AGPL-3.0 → 번들·코드 복사 불가, 네트워크 서비스로 연동해도 사용자 배포 시 AGPL 의무 논란**. 우리 요구(PDF.js 뷰어에서 문단 분할·나란히 표시)는 재조판이 아니라 **문단 세그먼트 + 병렬 표시**라 범위가 다름. 참고: 문단 병합 규칙, 수식/표 보호, 폰트 처리 아이디어. Korean 폰트 임베딩 이슈(BabelDOC-Assets)는 재조판할 경우에만 해당.
**C3 레이아웃 분석 라이브러리** — pdf-inspector(Rust, 열 감지: 수평 투영 히스토그램), Tabula layout(Go), PDF2TXT(Deno, pdf.js 기반), EmbedPDF(브라우저 ONNX). X-Y cut/투영 히스토그램 기반 열 감지 개념을 우리 `extension/viewer/pdfseg.js`에 **재구현(자체 코드)**하면 됨. 라이선스 미확인이므로 복사 안 함.

### D) 언어 감지 / 한국어 후처리
**D1** 네이티브 핸들러에서 `NLLanguageRecognizer` 사용(Koine도 신뢰도 0.72 미만이면 CJK 동형 한자 구분 불안정으로 취급). 우리 `extension/lib/lang.js`의 스크립트 카운트 감지(ko/ja/zh/en, zh 간·번체 variant)는 이미 경량·충분. 한자만 있는 짧은 문자열의 ja/zh 구분이 약점이면 페이지 `<html lang>` 우선 + 네이티브 `NLLanguageRecognizer`로 폴백.
**D2/D3** ELD(Apache-2.0, 60개 언어, JS 264KB gz~, 단문 정확도 우수 주장)가 유일하게 의미 있는 대안이나 우리는 4개 언어뿐이라 **도입 이득 낮음**. tinyld(2023 이후 정체)/franc(2024 이후 정체)/cld3-asm(WASM, 용량 큼) SKIP.
**D4 es-hangul** (MIT, TS, 활발) — `josa(word, '을/를')` 등 받침 판정으로 조사 선택(은/는, 이/가, 을/를, 와/과, (으)로 처리). 우리 과제는 **링크 텍스트(원문 유지, 영문·숫자·한자 가능) 앞뒤 조사**: 영어 단어 뒤 조사는 발음 기준(예: "API"→"에이피아이"→받침 없음)이 필요해 라이브러리도 한계가 있음. 현실적 방안: 프롬프트가 "을(를)/은(는)" 병기 형태를 쓰게 하고(현재 방식), 후처리에서 **링크 텍스트의 마지막 글자가 한글일 때만** 받침 판정으로 확정. es-hangul 전체를 번들하기보다 해당 함수(받침 판정 ~20줄)만 자체 구현 권장(MIT라 발췌도 가능, 저작권 고지 유지).

### E) Apple Translation / Foundation Models
**E1** 핵심 사실(Koine에서 확인): macOS 26의 `TranslationSession(installedSource:target:)` 이니셜라이저를 쓰면 **SwiftUI `translationTask` 없이** appex(NSExtension 서브프로세스)에서 `translationd`로 직접 번역 가능. 같이 얻을 설계: (1) `LanguageAvailability` 결과 캐시(양성만), (2) 호출 타임아웃·서킷브레이커(translationd가 응답 안 할 수 있음), (3) 세션 풀(동시 다중 호출은 translationd 내부 직렬화 → 이득 없음), (4) 언어팩 자동 다운로드 금지, 상태(installed/supported/unsupported) 노출. Foundation Models 사용 사례는 Koine에도 "예정"일 뿐 구현 없음 — 오픈소스 선례 부재(우리 `EngineFM.swift`가 선행).

---

## 3. 적용 제안 (Top 5)

### 1) Apple Translation 세션 안정화 패턴 이식 (Koine E1, ADAPT-재구현)
- 변경: `xcode/Local Translator/Local Translator Extension/SafariWebExtensionHandler.swift`, `Protocol.swift`, (신규) 세션 풀/가용성 캐시 Swift 파일, `extension/engines/native.js`, `extension/PROTOCOL.md`, `tests/engines-native.test.mjs`.
- 단계: ① 현재 Apple 엔진이 `TranslationSession` 생성에 SwiftUI/컨테이너 앱을 거치는지 확인 → standalone init로 교체. ② `LanguageAvailability` 양성 캐시 + 5초 타임아웃. ③ 요청 타임아웃/연속 실패 시 서킷브레이커, JS에는 `{status:"unavailable", reason}` 응답 규약 추가. ④ 언어팩 미설치 시 자동 다운로드 대신 팝업/옵션에 안내.
- **타당성**: 장점—SwiftUI 의존 제거로 appex 단독 동작, 행(hang) 방지, 엔진 폴백(R7 비교)과 자연스럽게 결합. 단점—macOS 26+ 한정(우리 타깃과 일치), translationd 직렬화로 병렬 가속 없음. 메모리: 시스템 프로세스에 위임되어 확장 상주 메모리 증가 거의 없음. 속도: 문장 단위 호출 오버헤드 있음 → 블록 배치(`batcher`) 유지. 라이선스: Koine 코어는 FSL이라 **코드는 복사하지 않고 API 사용법·구조 아이디어만** 취해 자체 작성 → 문제 없음.

### 2) 콘텐츠 스크립트 DOM 수집 규칙 보강 (B1 알고리즘 + B2 Apache 부분 발상)
- 변경: `extension/content/filter.js`, `segmenter.js`, `main.js`, `apply.js`, `tests/content-units.test.mjs`, `content-main.test.mjs`.
- 단계: ① 같은 텍스트 노드의 다중 변경을 디바운스·병합해 최종 상태만 번역(Firefox 방식). ② 번역 적용 중 자체 변경으로 MutationObserver가 재트리거되는 루프 방지(적용 시 WeakMap으로 "우리가 쓴 값" 기록, 값이 같으면 무시; 요소 속성 마킹 불필요 — nodeValue 원칙 유지). ③ `translate="no"`, `role`, `aria-hidden`, `display:none`, `content-visibility:hidden` 건너뛰기, `<code>` 등 OPAQUE 인라인 규칙을 테이블화. ④ alt/title/placeholder 속성 번역은 옵션(별도 큐). ⑤ Shadow DOM open root 순회.
- **타당성**: 장점—SPA/무한스크롤 재번역·깜빡임 방지, 이미 있는 구조에 추가만. 단점—규칙 과다 시 오탐(번역 누락) → 사이트별 예외 UI 필요. 메모리/속도: WeakMap·IntersectionObserver 사용으로 영향 미미. 라이선스: Mozilla(MPL)·Koine(Apache)·Kiss/ReadFrog(GPL) 중 **코드 복사 없이 자체 구현**이 가장 안전; Koine content.js를 직접 쓰려면 Read Frog 계보(GPL) 확인 필수.

### 3) 한국어 조사 후처리 (D4 es-hangul 로직 발췌/자체 구현)
- 변경: `extension/engines/prompt.js`(규칙 유지), 신규 `extension/lib/josa.js`, `extension/content/apply.js`(슬롯 적용 직전 후처리), `tests/engines-prompt.test.mjs` + 신규 `tests/lib-josa.test.mjs`.
- 단계: ① 한글 받침 판정 함수(유니코드 `(code-0xAC00)%28`, ㄹ받침 예외 "(으)로") 구현. ② 슬롯 규칙: x(링크/코드) 슬롯 바로 뒤 t 슬롯이 `을(를)|은(는)|이(가)|와(과)|(으)로`로 시작하면, x 텍스트의 **마지막 한글 음절**이 있을 때만 확정 치환; 영문/숫자 끝이면 "을(를)" 병기 유지(또는 숫자·알파벳 발음표 소규모 맵: 0,1,3,6,7,8,10→받침 유무, l·m·n·r 등). ③ 단위 테스트(링크 "문서"/"API"/"Python"/"3").
- **타당성**: 장점—링크 고정 문장 품질 즉시 개선, 엔진 무관. 단점—영문 발음 기반 판정 한계(소규모 맵으로 근사). 비용: 수십 줄, 메모리/속도 무시. 라이선스: es-hangul MIT → 발췌 시 고지 유지, 자체 구현이면 무관.

### 4) PDF 문단 분할 개선 (C3 개념, 자체 구현)
- 변경: `extension/viewer/pdfseg.js`, `viewer.js`, `tests/pdf-seg.test.mjs`, `tests/pdf-parse.test.mjs`.
- 단계: ① pdf.js `getTextContent` 항목을 X-Y cut(수평/수직 투영 히스토그램)으로 다단 감지 → 읽기 순서 정렬. ② 문단 병합 규칙(줄 간격 ≤ 1.5×폰트, 들여쓰기, 줄끝 하이픈 처리, 머리글/바닥글 반복 제거). ③ 수식·코드로 보이는 블록(비문자 비율/폰트명 휴리스틱)은 원문 유지(pdf2zh의 수식 보호 발상). ④ 병렬 뷰는 현행 유지(재조판은 범위 밖).
- **타당성**: 장점—학술 PDF(2단)에서 번역 문맥 품질 큰 향상, 외부 모델 불필요. 단점—스캔 PDF/복잡 표는 한계(OCR 없음). 메모리: 페이지 단위 처리로 낮음. AGPL(pdf2zh/BabelDOC)은 **코드·모델 모두 가져오지 않음**; 알고리즘 아이디어(일반 지식)만 사용.

### 5) Mozilla(Bergamot) en↔ko/ja 소형 모델을 bench 후보로 추가하고, Safari WASM은 스파이크로만 검증 (A1/A3, ADAPT-조건부)
- 변경: `bench/CANDIDATES.md`, `bench/models.json`, `bench/engines/`(Marian/bergamot CLI 또는 translateLocally 호출 어댑터), 이후 통과 시 `extension/engines/` 신규 엔진(WASM)과 `manifest` WASM CSP/리소스.
- 단계: ① models.json 레지스트리 전체를 받아 ko/ja/zh 쌍(양방향) 존재 확인(미확인 항목). ② translateLocally 또는 bergamot CLI로 맥에서 en→ko/ja→(en)→ko 벤치(속도·메모리·품질, 20~60MB라 다운로드 부담 작음, 사용자 승인 후). ③ 품질이 NLLB/Apple 대비 경쟁력 있을 때만 Safari 확장 내 WASM 스파이크(메모리·스레드·콜드스타트).
- **타당성**: 장점—매우 작음(~50MB), CPU만으로 빠름, MPL-2.0로 공개 레포·재배포 가능(모델 파일은 MPL 고지 유지), 오프라인. 단점—**ja/zh→ko 직접쌍 없어 영어 피벗**(품질 저하·2배 지연), 증류 모델의 한국어 문체 한계, Safari WASM 스레드/메모리/service worker 수명 불확실, bergamot-translator 유지보수 정체(2024-05). 판정: 네이티브 CT2/MLX 경로가 이미 있으므로 **벤치 비교용 + 저사양 폴백 후보**로만 두고, 브라우저 내 WASM 직접 탑재는 G1 이후 선택 과제.

---

## 4. 요약 결론
- 그대로 가져다 쓸 "ADOPT" 수준 완제품은 없음. 가장 가까운 선례는 **Koine**(Safari+Apple Translation, 단 FSL/WIP)과 **Firefox TranslationsDocument**(알고리즘).
- GPL/AGPL(Kiss, Read Frog, pdf2zh, BabelDOC, LibreTranslate)은 코드 복사 금지, 아이디어만.
- 한국어 조사 처리·PDF 문단 분할은 외부 의존 없이 소규모 자체 구현이 가장 비용 대비 효과 큼.
- Safari 확장 내 WASM/WebGPU 모델 탑재는 메모리·수명 리스크가 커서 네이티브 핸들러 경로를 유지.
