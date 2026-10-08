# FIX_GUIDE.md

## F1. orchestrate.mjs가 `--corpus-dir`를 run.mjs로 전달하지 않음 (2026-10-08)

### 증상
`node bench/orchestrate.mjs --only all --langs en --corpus-dir corpus-articles --results-dir results-articles` 실행 결과가 새 코퍼스(26블록, `art-*`)가 아니라 기존 `bench/corpus/en.json`(29블록, `en-*`)으로 생성됨. 결과 디렉터리만 반영됨.

### 원인
`bench/lib/orchestrate.mjs` `runMjsArgs()`가 `--results-dir`, `--model-map` 등만 넘기고 `--corpus-dir`는 빠뜨림. `run.mjs`는 `a.corpusDir` 없으면 기본 `bench/corpus` 사용 (`run.mjs:149`).

### 수정 방향
1. `runMjsArgs(entry, {..., corpusDir})`: `corpusDir`가 있으면 `'--corpus-dir', corpusDir` 추가.
2. `orchestrate.mjs` 두 호출부(96행 dry-run 출력, 152행 실제 실행)에 `corpusDir: a.corpusDir ? resolve(a.corpusDir) : undefined` 전달. 상대경로는 cwd 기준 resolve(run.mjs와 동일).
3. dry-run 출력에 corpus 경로가 보이는지 확인.
4. 단위 테스트(`tests/`의 orchestrate 테스트)에 corpusDir 전달/미전달 케이스 추가.
5. 사용법 주석(orchestrate.mjs 3행, usage 문자열)에 `[--corpus-dir dir]` 추가.

### 영향 범위
- `bench/lib/orchestrate.mjs`, `bench/orchestrate.mjs`, 해당 테스트만. 확장(extension/)·run.mjs 변경 없음.
- 기본 코퍼스 사용 시(`--corpus-dir` 미지정) 동작 동일해야 함.
- 기존 `bench/results/` 결과는 영향 없음 (기본 코퍼스로 생성됐으므로 유효).

### 검증
- `npm test` 통과.
- dry-run에서 `--corpus-dir .../corpus-articles` 확인.
- 엔진 1개(`ct2-nllb-600m`)만 실제 실행 → 결과 블록 수 26, id가 `art-`로 시작.

### 이후 작업 (같은 세션, Sonnet)
- `bench/results-articles/` 기존 잘못된 결과 삭제 후 전체 재실행 (`--only all --langs en --corpus-dir corpus-articles --results-dir results-articles`). 백그라운드, orchestrator 프로세스 종료까지 확인.
- 완료 후 `node bench/rate/build.mjs --lang en --corpus-dir bench/corpus-articles --results-dir bench/results-articles --max-blocks 26 --out bench/rate/rate-articles-en.html` → 열기. (`sampleBlocks`는 link 장르 우선 포함, max-blocks로 전부 포함)
- 평가 결과 저장 위치는 `bench/results-articles/ratings-en.json`. summarize 연동은 별도 확인.
- 사용자 요구: 평가 페이지는 영어만, 기사 중심(the-race.com 류). 기존 ja/zh 페이지는 D1 평가에서 제외. DECISIONS.md D1에 반영.
- 참고: 직전 잘못된 실행에서도 m2m100(토크나이저 HTTP 500), mlx JSON 모드 Hy-MT/qwen3.5(슬롯 프로토콜 실패), mlx translategemma 비-MT(시스템 롤 404)는 기존과 같은 이미 알려진 실패. 평가 페이지에는 `-mt` 변형과 정상 엔진 위주로 포함 권장 (`--engines`로 선택).

## F2. ✅ 종결(2026-10-08: 평균 Apple 4.33 / TG 4.42·4.33 → 현행 유지, bench/D1_RATING_EN.md) — 기사 코퍼스 링크 블록에 x 항목 없음 → 링크 문장 재평가 범위 판단 (2026-10-08, Opus)

### 오류 원인
`bench/corpus-articles/en.json` 생성 스크립트(Opus 작성)가 `("텍스트")`를 튜플로 착각 → 링크 6블록(art-link-01..03, art-nav-01..02, art-cta-01)이 전부 `t` 슬롯. 링크 앞뒤 공백도 빠짐(예: `"Marco Delacroix"` 다음 `"admitted…"`). `validateCorpus`는 genre와 x 항목 존재를 검사하지 않아 통과.

### 판단: 전체 재평가 하지 않음, 표적 재측정만
- D1 기본값(Apple marker)은 링크 처리 근거가 이미 있음: marker-probe 270요청 표식 생존 100%, 기존 코퍼스 en-link-01..03 정상(`계속하려면 [here]을 클릭하세요.`). 이번 결함은 D1 결정을 바꾸지 않음.
- 문제는 **옵션 엔진 TranslateGemma의 링크 문장 처리**. 기존 코퍼스에서 mlx TG-MT `클릭 [here] 계속.`(어순 깨짐, 표식 실패→run-splitting 폴백 추정), ollama TG-MT `자세한 내용은 [guide] 참조`(문장 잘림). 옵션으로 권하는 이상 이 부분만 확인.
- 20엔진 × 6블록 재평가는 비용 대비 효과 없음(탈락 엔진 다수).

### 수정 방향 (Sonnet)
1. 코퍼스 정정: 위 6블록을 실제 x 항목으로 수정(링크 텍스트 = 각 괄호 문자열). x 앞뒤 공백은 인접 t 항목에 둠(예: `"Team principal "`, x `"Marco Delacroix"`, `" admitted the call …"`). art-nav-02는 x 2개(쉼표 t 항목 `", "`). 나머지 20블록 불변.
2. 재발 방지: `bench/lib/corpus.mjs` `validateCorpus`에 규칙 추가 — `genre === 'link'`이면 x 항목 ≥1, 아니면 에러. 기존 4개 코퍼스와 정정본이 통과해야 함. 테스트 추가.
3. 재측정: 정정된 링크 6블록만 담은 하위 코퍼스(`bench/link-recheck/corpus/en.json`)로 `apple-mt-marker`, `mlx-translategemma-4b-4bit-mt`, `ollama-translategemma-4b-mt` 실행(`--corpus-dir`, `--results-dir bench/link-recheck/results`).
4. 자동 지표(STATUS에 표로): 엔진별 marker 경로 성공/폴백 블록 수(MT 모드 stats), x 텍스트 원문 유지(`xPreserved`), 문장 잘림(번역 t 텍스트 합 길이 < 원문 t 길이의 40%면 의심), 이중 공백/가장자리 공백 이상.
5. 사용자 확인용 소형 페이지: `node bench/rate/build.mjs --lang en --corpus-dir bench/link-recheck/corpus --results-dir bench/link-recheck/results --engines <3개> --max-blocks 6 --out bench/rate/rate-links-en.html` (6블록 × 3엔진, 약 5분). 결과 저장 `bench/link-recheck/ratings-en.json`.
6. 기존 `bench/results-articles/`의 해당 6블록 결과와 평가 점수는 그대로 둠(D1_RATING_EN.md에 "링크 블록은 x 없음, 일반 문장으로만 해석" 주석 1줄 추가).

### 영향 범위
- bench 전용(`bench/corpus-articles/en.json`, `bench/lib/corpus.mjs`+테스트, 신규 `bench/link-recheck/`, `bench/D1_RATING_EN.md` 주석). 확장 코드 변경 없음.
- `validateCorpus` 규칙 추가로 기존 코퍼스가 실패하면 → 코퍼스 수정 말고 보고(Opus).

### 재현/검증
- 정정 후 `node -e` 로 corpus-articles x 항목 수 ≥7 확인, `npm test` 통과.
- 재측정 3엔진 결과에서 6블록 모두 슬롯 존재.

### 후속 판단 기준 (Opus, 데이터 받은 뒤)
- TG-MT 폴백 ≥2/6 또는 사용자 평가에서 링크 문장 평균이 Apple보다 1점 이상 낮음 → 별도 계획: TG 링크 처리 개선(표식 스타일 `[n]` 재시도 등) 또는 "링크 포함 블록은 Apple로 처리" 하이브리드 검토.
- 그렇지 않으면 현행 유지, 종결.

## F3. "Safari 확장 설정 열기" 실패 (SFErrorDomain error 1) + 옛 앱 프로세스 (2026-10-08, Opus)

### 오류 원인
- `SFErrorDomain` code 1 = `SFErrorNoExtensionFound`: Safari가 그 확장 ID를 아직 모름. install.sh가 Safari 실행 중에 번들을 두 번 교체·재등록했고, 실행 중이던 Safari가 새 등록을 반영하지 못한 상태로 추정.
- 화면에 서명 상태 줄(T16)이 없음 → 떠 있는 앱은 재설치 **전**에 실행된 프로세스(13:52 실행, 13:53 재등록). install.sh가 실행 중인 앱을 끄지 않고 번들을 교체했고, `open`은 이미 떠 있는 옛 프로세스를 앞으로 가져오기만 함.

### 수정 방향 (Sonnet)
1. install.sh: 설치(휴지통 이동·ditto) 전에 실행 중인 앱 종료 — `osascript -e 'tell application id "com.tmtmtmtmtmt.localtranslator" to quit'` 후 최대 5초 대기, 남아 있으면 `pkill -x "Local Translator"`(해당 번들 경로 프로세스만). `--dry-run`이면 출력만.
2. install.sh 끝 안내: Safari가 실행 중이면(`pgrep -x Safari`) "Safari를 완전히 종료(⌘Q) 후 다시 열어야 확장이 보입니다" 출력. Safari를 스크립트가 끄지는 않음.
3. ContentView: `showPreferencesForExtension` 오류가 `SFErrorDomain` code 1이면 "Safari가 아직 확장을 인식하지 못했습니다. Safari를 완전히 종료(⌘Q)했다가 다시 연 뒤 시도하세요."로 표시(그 외 오류는 기존 문구).
4. install.sh 테스트: dry-run 출력에 앱 종료 단계 포함 확인.

### 영향 범위
`scripts/install.sh`, `tests/install-script.test.mjs`, `xcode/.../ContentView.swift`. 확장 JS 변경 없음.

### 검증
- 앱 실행 중 install.sh 실행 → 새 프로세스로 뜨고 서명 상태 줄 보임.
- Safari 재시작 후 "Safari 확장 설정 열기" 정상 동작.

## F4. Safari에서 background/content 스크립트가 UTF-8로 해석되지 않음 (2026-10-08, Opus) — **긴급**

### 증상
Safari 확장 오류: `SyntaxError: Invalid regular expression: range out of order in character class (lib/glossary.js:6)`, `(engines/localhost.js:26)`. 두 줄 모두 정규식 문자 클래스에 한글/CJK 문자를 **그대로** 씀(`/[ᄀ-ᇿ…가-힯…]/`, `/[　-鿿가-힯]/`).

### 원인
`manifest.background.scripts`와 `scripting.registerContentScripts`로 넣는 스크립트는 문서 `<meta charset>`이 없어 Safari가 UTF-8이 아닌 기본 인코딩(Latin-1/Windows-1252 추정)으로 디코딩 → 멀티바이트 문자가 여러 글자로 깨져 범위 순서 오류. Node 테스트·HTML 하네스는 UTF-8이라 못 잡음.
**더 위험한 부분**: 문법 오류가 안 나는 비ASCII 리터럴도 조용히 깨짐 — `engines/prompt.js`·`mtmode.js` 한국어 지시문(LLM에 깨진 글자 전송), `lib/josa.js` 조사 표, `content/text.js`·`lib/lang.js` 언어 판별 정규식(잘못된 범위면 언어 오판→번역 안 됨), 용어집 힌트 등. popup/options/viewer는 HTML에 `meta charset=utf-8`이 있어 해당 없음(그 페이지의 스크립트는 문서 인코딩 상속).

### 수정 방향 (Sonnet) — 두 겹으로 막는다
1. **비ASCII를 코드에서 제거(확실한 해결)**: background·content 경로로 로드되는 모든 JS(`background.js`, `lib/*.js`, `engines/*.js`, `content/*.js`)의 **문자열·정규식·템플릿 리터럴** 안 비ASCII 문자를 `\uXXXX`(BMP 밖이면 `\u{…}`, 정규식은 `u` 플래그 확인)로 바꾼다. 주석의 한글은 그대로 둬도 됨(깨져도 실행 영향 없음). 수작업 대신 스크립트 `scripts/escape-nonascii.mjs`(주석/리터럴 구분: 간단한 토크나이저 또는 `acorn` 미사용 시 정규식 기반이 위험하므로 — 리터럴 위치는 Node 내장 파서가 없으니 **각 파일을 수정 후 테스트로 검증**하는 방식 허용). 사람이 읽을 원문은 리터럴 옆 주석으로 1줄 남김(긴 프롬프트는 주석 블록으로 원문 유지).
   - prompt.js 한국어 지시문은 Swift 쪽과 "문구 동일" 규칙(GUIDELINES) — 의미 동일 유지, 표현만 escape.
2. **회귀 방지 테스트**: `tests/ascii-only.test.mjs` — 위 경로 JS에서 주석을 제거한 코드에 비ASCII가 있으면 실패(간단한 주석 제거기: `//`·`/* */` 처리, 문자열 안 `//`는 escape 후엔 ASCII라 오탐 낮음). vendor/·popup/·options/·viewer/는 제외(HTML 인코딩 보장).
3. 동작 검증 테스트: 기존 테스트 전부 통과(escape 전후 의미 동일) + `KT.text.detectLang`·josa·glossary CJK 정규식 단위 테스트가 그대로 통과하는지.
4. 재설치: `scripts/install.sh` (F3 반영 후) → 사용자에게 Safari 오류 창 사라졌는지 확인 요청.
- BOM 추가는 대안이지만 Safari의 확장 스크립트 BOM 처리 미검증 → 채택 안 함.

### 영향 범위
확장 JS(문자열 표현만, 의미 불변), 신규 테스트·스크립트. Swift·HTML 변경 없음.

### 검증
`npm test` 통과, ascii-only 테스트 통과, Safari 확장 오류 목록 비어 있음(사용자), 지정 사이트에서 번역 동작(사용자).

### 순서
F4 먼저(번역 자체가 막힘) → F3 → 재설치.

### F4 추가 증상 (사용자 Safari 실사용, the-race.com)
- 확장 로드·팝업 정상(`native:apple-mt · ready`), 화면 우측 하단 떠 있는 버튼 1개만 번역되고 본문·헤드라인·메뉴는 원문 그대로.
- 추정: background에서 `engines/localhost.js`가 SyntaxError로 로드 실패 → 이후 스크립트(registry 등)·라우팅 일부가 깨졌거나, content 쪽 비ASCII 리터럴(`content/text.js` cleanText 정규식 등) 오해석. Apple 번역 속도(블록당 ~2초, 동시성 1)로 대기 중일 가능성도 배제 못 함.
- Sonnet 처리: F4 수정 후 재설치 → 사용자 재확인. 그래도 부분 번역이면 다음 로그를 사용자에게 요청해 STATUS에 기록 후 Opus 보고:
  1. Safari › 개발자용 › 웹 확장 프로그램 백그라운드 콘텐츠 › Local Translator → 콘솔 오류
  2. 해당 페이지에서 개발자용 › 웹 속성 검사기 표시 → 콘솔(`kt` 관련 오류·경고)
  3. 1분 기다린 뒤 번역 진행 여부(느린 것인지 멈춘 것인지)
- 추가로 background 스크립트 하나가 로드 실패해도 나머지가 동작하도록 이미 있는 가드(`KT.lib.glossary` 없으면 건너뜀)와 같은 방어를 registry의 localhost/mtmode 참조에도 적용할지 확인(엔진 하나 실패가 전체 번역을 막지 않게). 계획 밖 변경이면 보고만.
