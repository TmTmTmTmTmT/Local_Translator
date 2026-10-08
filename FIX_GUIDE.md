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

## F5. 링크만으로 된 블록(헤드라인·카드·메뉴)도 번역 (B1, 2026-10-08, Opus)

### 원인
`content/filter.js` `KEEP_TAGS`에 `a` → 링크 텍스트는 항상 `x`(원문 유지). 뉴스·포털은 헤드라인·카드·메뉴 전체가 `<a>`라 블록에 `t` 슬롯이 0개 → 번역 요청 자체가 없음(the-race.com: 남은 영어 85개 전부 링크 안).

### 판단
원 요구 "링크 제외"의 목적은 문장 속 링크 텍스트(클릭 대상 이름)를 보존하는 것. 사용자는 헤드라인이 번역되지 않는 것을 버그로 보고함 → **문장 속 인라인 링크만 원문 유지, 블록 전체가 링크뿐이면 번역**을 기본값으로(D15에 기록, 사용자 확인 대기지만 진행).

### 수정 방향 (Sonnet)
1. filter: 제외 사유를 구분 — 링크 유래 `'link'`와 코드 계열 `'keep'`(pre/code/kbd/samp/var/tt/role=code). 가장 가까운 KEEP 조상이 `a`면 `'link'`. skip 우선 규칙 유지. 기존 `isExcluded`/`exclusionReason` 호출부 의미 유지(‘link’도 제외로 취급되는 곳은 그대로).
2. segmenter: 링크 유래 x 항목에는 원래 텍스트 노드를 함께 보관. `flush()`에서 **블록에 글자 있는 `t` 슬롯이 하나도 없고** 링크 유래 x가 1개 이상이면, 그 링크 x들을 원래 순서대로 `t` 슬롯으로 승격(코드 계열 x는 그대로 x). 승격 후 언어 판정·MAX_BLOCK_CHARS 규칙 동일 적용.
   - 예: `li > a "MotoGP"`, `a > h3 "What's really…"`, `a > p "Formula 1"`, 단독 "Read more" 링크 → 번역. `p: "Click <a>here</a> to continue"` → 링크 원문 유지(기존). `"Related: <a>title</a>"` → t가 있으므로 링크 유지(기존).
3. 설정 `linkMode`: `"standalone"`(기본) | `"never"`(기존 동작). content `main.js`가 settings에서 읽어 `collectBlocks` opts로 전달(fixParticles와 같은 경로). background DEFAULT_SETTINGS·options(`options-lib` defaults/merge, 체크박스 "제목·메뉴처럼 링크로만 된 문장도 번역", 기본 체크)·PROTOCOL §1 갱신.
4. 원문 토글: 승격된 링크 텍스트 노드도 applier 기록에 들어가 원문 보기 왕복 정상이어야 함.
5. 테스트(jsdom): 카드(`a>h3+p`), 메뉴(`ul>li>a`), 인라인 링크 문장(변화 없음), 코드만 있는 블록(번역 안 함), `linkMode:"never"`(기존 동작), 원문 토글 왕복.

### 영향 범위
`content/filter.js`, `content/segmenter.js`, `content/main.js`, `background.js`(DEFAULT_SETTINGS), `options/*`, `PROTOCOL.md`, 테스트. 비ASCII 리터럴 금지(F4 가드).

### 검증
`npm test` 전부 통과 + F6 도구로 the-race.com 커버리지: 남은 영어 중 링크 안 비율이 인라인 링크 수준으로 감소(블록 링크 남은 수 0 목표).

## F6. 헤드리스 사이트 커버리지 도구 (검증 루프용, 2026-10-08, Opus)

### 목적
내장 브라우저 하네스는 한 창을 공유해 병렬·반복이 어렵고 IO가 숨김 창에서 멈춤. 서브에이전트가 반복 측정할 수 있게 jsdom 기반 측정기를 만든다(레이아웃 없음 → 가시성 대신 숨김 속성만 판정).

### 수정 방향 (Sonnet)
1. `tests/e2e/site-coverage.mjs <html파일> [--link-mode standalone|never] [--json]`: jsdom으로 HTML 로드(사이트 스크립트 실행 안 함), IntersectionObserver(전부 교차)·rAF 스텁, `browser` 스텁(translate → 각 t 슬롯 `한(원문)`, 호출·블록 수 집계), 기존 테스트 헬퍼(`tests/helpers/load-content.mjs`)처럼 content 스크립트 6개 로드 → 큐가 빌 때까지 대기 → 집계: 번역 텍스트 노드 수, 남은 영어(라틴 3글자↑) 수와 분류(inLink, inBlockLink=블록 요소를 품은 a, inCode, inButton, translateNo/notranslate, hidden=hidden 속성·aria-hidden·인라인 display:none·head 안 제외), errors. 일본어·중국어 페이지는 "남은 원문" 판정을 각 문자 범위로(가나/한자 2글자↑, 정규식은 `\u` 이스케이프).
2. `tests/e2e/fetch-site.sh <name> <url>`: Safari UA curl → `tests/e2e/sites/<name>.html`(`.gitignore`에 추가 — 사이트 HTML 저작권, 커밋 금지).
3. `tests/e2e/build-inject.mjs <out.js>`: 내장 브라우저 하네스용 주입 번들 생성(TEST_LOOP H 절차 그대로, node로 생성).
4. 오프라인 픽스처 `tests/e2e/fixtures/cards.html`(직접 작성: 카드 링크·메뉴·인라인 링크·code·translate=no·details) + `tests/site-coverage.test.mjs`(픽스처로 도구 동작 검증, npm test 포함, 네트워크 없음).
5. `package.json` script `e2e:coverage`.

### 영향 범위
`tests/**`, `package.json`, `.gitignore`. 확장 코드 변경 없음(F5와 파일 겹치지 않음).

### 검증
픽스처 테스트 통과, 실제 사이트 1개에서 JSON 출력 확인.

## F7. 커버리지 도구가 의도된 제외(폼 컨트롤·SVG)를 미번역으로 셈 (B2, R2, Opus)

### 원인 (Sonnet 조사로 확인)
NHK 남은 50개 = `<select>/<optgroup>/<option>` 48개 + SVG `<title>/<desc>` 2개. 확장은 `filter.js` SKIP_TAGS로 의도적으로 건너뜀. `tests/e2e/site-coverage.mjs`의 숨김/분류 판정이 확장보다 좁아 "other"로 집계.

### 수정 방향 (Sonnet)
- site-coverage: `select/optgroup/option/datalist/textarea/input` 조상 → `formControl` 분류, `svg/math` 조상 → `graphic` 분류(둘 다 remaining에서는 제외하고 별도 카운트로 보고). `other`는 진짜 미번역만 남게.
- 픽스처 `cards.html`에 select/option, svg title 추가 + 테스트 갱신.
### 영향 범위: `tests/e2e/site-coverage.mjs`, `tests/e2e/fixtures/cards.html`, `tests/site-coverage.test.mjs`.
### 검증: nhk.html → other 0, formControl 48, graphic 2.

## F8. 한자만 있는 짧은 블록을 일본어 페이지에서 zh로 판정 (B3, R2, Opus)

### 원인 (확인)
`content/text.js` detectLang: 가나가 없고 한자 비율 ≥0.5면 `zh`. 일본어 페이지의 지명·제목·메뉴(北海道, 東京都, 東海…)가 `zh`로 분류 → 엔진에 zh→ko로 요청(일본식 한자 표현 오역 위험). 현재 select 안이라 영향 없었지만 헤드라인·카드·메뉴 링크(F5로 이제 번역됨)에서 나타남.

### 수정 방향 (Sonnet)
- 페이지 언어 힌트: `document.documentElement.lang`(BCP-47 앞부분)이 `ja`면 "가나 없음 + 한자 위주" 블록을 `ja`로, `zh*`면 `zh` 유지. lang 속성이 없거나 다른 값이면, 같은 수집 회차에서 가나가 있는 블록 수가 한자-only 블록보다 많으면 `ja`로(문서 다수결). 가까운 조상 요소의 `lang` 속성이 있으면 그것을 최우선.
- 구현 위치: `segmenter.js` flush의 언어 결정(텍스트 판정이 `zh`이고 가나 0일 때만 힌트 적용). `text.js` detectLang 시그니처는 유지하고 힌트 적용은 segmenter에서. 비ASCII 리터럴 금지.
- 테스트: `<html lang="ja">` + "北海道" → ja, `<html lang="zh-CN">` → zh, lang 없음 + 가나 블록 다수 → ja, 조상 `lang="zh"` 우선, 기존 detectLang 테스트 불변.
### 영향 범위: `extension/content/segmenter.js`(필요 시 `main.js`에서 힌트 전달), 테스트. F7과 파일 겹치지 않음.
### 검증: npm test, nhk.html 커버리지에서 calls·blocks 변화 없이 블록 lang 분포 확인(도구가 블록 lang 집계를 내면 좋음 — F7에 `langs` 카운트 추가).

## F9. PDF 링크 구간이 단어 중간에서 잘림 (B4, R3, Opus)

### 원인 (Sonnet 조사로 확인)
1. 픽스처 `tests/e2e/sample.pdf`의 Link rect가 문단 시작(x=72)부터 58pt로 잘못 작성됨("online guide" 위치 아님).
2. 그러나 코드도 취약: `viewer/pdfseg.js` `splitByLink`는 글자 위치를 `(x - item.x) / item.w * len` 비례로 근사 → 가변폭 글꼴인 실제 PDF에서 1~2글자 어긋나 단어가 반으로 잘릴 수 있음. 기존 테스트는 고정폭·글자 경계 정렬 rect만 다룸.

### 수정 방향 (Sonnet)
1. `splitByLink`: 비례 계산한 `i0`/`i1`을 **단어 경계로 스냅** — `i0`은 왼쪽 공백 다음까지(현재 위치가 단어 중간일 때만), `i1`은 오른쪽 공백 직전까지 이동. 이동 폭이 단어 길이 절반을 넘거나 6글자를 넘으면 스냅하지 않고 가까운 경계(앞/뒤 중 짧은 쪽)로. CJK(공백 없는 문자)는 스냅하지 않음(현행). 결과 구간이 비면 링크를 해당 item 전체가 아닌 "겹침 비율이 가장 큰 단어"로.
2. 픽스처 재생성: sample.pdf의 Link rect를 "online guide" 실제 글리프 범위로(Helvetica 11pt 폭 기준 x≈111..169.5). 생성 스크립트가 있으면 그걸 고치고, 없으면 `tests/e2e/make-sample-pdf.mjs`로 재현 가능하게 추가(외부 의존 없이).
3. 테스트: (a) rect 끝이 단어 중간인 경우 스냅되어 단어 전체가 x, (b) 시작이 단어 중간, (c) CJK 무스냅, (d) 실제 pdf.js로 sample.pdf를 파싱해 segmentPage 결과에서 x 항목 = "online guide"(tests/pdf-parse.test.mjs에 링크 포함 케이스).
### 영향 범위: `extension/viewer/pdfseg.js`, `tests/e2e/sample.pdf`(+생성 스크립트), `tests/pdf-seg.test.mjs`, `tests/pdf-parse.test.mjs`. viewer는 HTML이 utf-8 선언이라 비ASCII 가드 대상 아님(그래도 리터럴 비ASCII는 피함).
### 검증: npm test, 내장 브라우저 pdf-harness에서 "번역(See the) online guide 번역(for details …)" 형태.

## F10. 옵션 오류 메시지에 어느 칸의 줄인지 없음 (B5, R3, Opus)
### 원인
`options/options.js` save(): 사이트·제외 셀렉터·용어집 오류를 모두 `${line}줄: …`로 합쳐 표시 → "1줄: 잘못된 셀렉터", "1줄: 형식…"이 어느 입력칸인지 모름.
### 수정 방향 (Sonnet)
오류 출처별 접두: "사이트 N줄:", "제외 셀렉터 N줄:", "용어집 N줄:", localhost 오류는 "Localhost:". `buildSites`가 사이트/제외를 구분해 주지 않으면 options-lib에 출처 필드(`field: 'sites'|'excludes'`)를 추가. 테스트(ui-options)에 출처 구분 케이스.
### 영향 범위: `extension/options/options.js`, `options-lib.js`, `tests/ui-options.test.mjs`. (F9와 파일 겹치지 않음)
### 검증: npm test, options 하네스(.local/options-h.html)에서 메시지 확인.

## F11. 팝업을 다시 열면 원문/번역 버튼 라벨이 실제 상태와 다름 (B6, R3, Opus)
### 원인 (코드 확인)
`popup/popup.js`는 `mode='translated'`로 시작하고 토글 응답으로만 갱신. 페이지가 원문 보기 상태에서 팝업을 닫았다 다시 열면 "원문 보기"로 표시 → 누르면 번역으로 돌아가 라벨과 동작이 반대. content `main.js` 리스너는 `toggleOriginal`만 처리.
### 수정 방향 (Sonnet)
- content `main.js` handleMessage: `{type:'getMode'}` → 상태 변경 없이 `{mode:'translated'|'original'}`.
- popup init: 탭에 `getMode` 질의(실패하면 기본 'translated') 후 렌더. 토글 처리 그대로.
- PROTOCOL §2 메시지 표에 `getMode` 추가.
- 테스트: content-main(getMode가 상태 불변·토글 후 값 반영), ui-popup(초기 mode 반영 — 기존 테스트 구조에 맞게).
### 영향 범위: `extension/content/main.js`, `extension/popup/popup.js`(필요 시 popup-lib), `extension/PROTOCOL.md`, `tests/content-main.test.mjs`, `tests/ui-popup.test.mjs`. 비ASCII 리터럴 금지(content).
### 검증: npm test, Safari 실기 T5.

## F12. Safari 실행 중 재설치 → 확장이 옛 플러그인을 붙잡아 번역 불가 (B7, R4, Opus)
### 원인 (Sonnet 조사, 로그로 확인, 신뢰도 높음)
14:29 UTC install.sh가 Safari 실행 중 appex를 교체·재등록 → Safari 로그 `sendNativeMessage(). No such plugin (uuid not found)`, `Other version in use … [u 7EEC860A…]`, "보조 응용 프로그램과 통신할 수 없습니다". native.js가 모든 거부를 `engine_unavailable`로 바꿔 팝업에 "번역 엔진을 사용할 수 없습니다"만 보임. Swift 핸들러·권한·호출 형태는 정상.
### 수정 방향 (Sonnet)
1. `scripts/install.sh`: Safari 실행 중이면 기본 **중단**(exit 3, "Safari를 완전히 종료(⌘Q)한 뒤 다시 실행하세요"). `--allow-safari-running` 지정 시에만 진행하고 끝에 "지금 Safari를 재시작해야 번역이 동작합니다" 강조 출력. `--dry-run`은 판정만 출력. 테스트 갱신(dry-run에 판정 표시, 옵션 파싱).
2. `engines/native.js`: sendNativeMessage 거부 메시지에 `No such plugin`·`Other version in use`·`uuid not found` 또는 helper 통신 실패 문구가 있으면 code `needs_safari_restart`로 매핑(그 외 기존대로 engine_unavailable). 문자열 비교는 ASCII 부분만(한국어 로케일 문구는 `helper`/보조 앱 대신 앞 두 패턴 + 일반 실패는 기존 코드).
3. background `KNOWN_CODES`·`BADGE_CODES`에 `needs_safari_restart` 추가, PROTOCOL §2 에러 코드 목록 갱신. popup-lib 문구: "확장이 업데이트되었습니다. Safari를 완전히 종료(⌘Q)했다가 다시 여세요."
4. 테스트: native.js 매핑(3패턴 → needs_safari_restart, 기타 → engine_unavailable), popup 문구, background 배지.
### 영향 범위: `scripts/install.sh`, `tests/install-script.test.mjs`, `extension/engines/native.js`, `extension/background.js`, `extension/popup/popup-lib.js`, `extension/PROTOCOL.md`, 관련 테스트. 비ASCII 리터럴 금지(background/engines).
### 검증: npm test. 재설치는 --allow-safari-running으로 하고 사용자 Safari 재시작 후 실기 T1/T2.
### 운영 규칙(루프): 사용자 실기 확인 중에는 재설치하지 않는다.

## F13. 실엔진(Apple 번역) 하네스 — 문장 자연스러움·엔진 통합 자동 확인 (R5 도구, Opus)
### 목적
mock 번역기로는 T2(링크 문장 어순·조사)·엔진 통합(marker 다중 링크, 긴 블록, 배치)을 못 봄. Safari 실기는 사용자 조작이 필요해 반복이 어려움 → 같은 Swift 엔진 로직(bench kt-bench, `bench/engines/apple`)을 로컬 HTTP 브리지로 띄워 하네스에서 실제 번역.
### 수정 방향 (Sonnet)
1. `tests/e2e/apple-bridge.mjs`: 127.0.0.1:8797 전용 HTTP 서버. `POST /translate {blocks, lang}` → 블록을 임시 코퍼스 JSON으로 써서 bench apple 어댑터(apple-mt-marker 경로, `bench/run.mjs`/어댑터가 쓰는 kt-bench 실행 방식 재사용)로 번역 → `{ok, results:[{id,slots}]}`. CORS 허용, 요청당 타임아웃 120s, 루프백 바인딩만.
2. `site-coverage.mjs`에 `--engine apple` 옵션: mock 대신 브리지 호출(번역문은 그대로 적용, 번역 노드 판정은 "블록이 요청·응답됐는지"로). 결과 JSON에 링크 포함 블록 샘플(원문 → 번역 결과 텍스트, 링크 원문 유지 여부) 10개 추가: `linkSamples`.
3. 네트워크·브리지 없는 npm test에는 넣지 않음(수동 도구). README-dev 성격 문서는 docs/TEST_LOOP.md 하네스 절에 사용법 3줄.
### 영향 범위: `tests/e2e/apple-bridge.mjs`, `tests/e2e/site-coverage.mjs`, `docs/TEST_LOOP.md`. 확장 코드 변경 없음, 재설치 없음.
### 검증: the-race 기사 1쪽·wiki로 실행, linkSamples 보고.

## F14. 큰 배치가 Apple 번역 45초 제한을 넘겨 타임아웃 → 서킷브레이커 → 대부분 미번역 (B9, R6, Opus)
### 원인 (Sonnet 조사: 로그·코드, 신뢰도 중상)
- content·background·native MT 배치 한도 40블록/6000자(`content/main.js:8`, `engines/native.js:54`), MT 동시성 2(`native.js:55`).
- Swift는 요청 전체를 `withDeadline(Limits.mtTimeout=45s)`로 감쌈(`SafariWebExtensionHandler.swift:58,68`, `Protocol.swift:205`), 블록은 순차 번역(`EngineMT.swift:255`). Apple 번역 블록당 1~2초 → 40블록은 40~80초 → 타임아웃, 이미 번역한 블록까지 버림. 타임아웃 3회/60초 → 브레이커 30초 열림(`Protocol.swift:165,187`) → engine_unavailable, 배지 "!". 짧은 배치(메뉴 라벨)만 성공. 취소가 프레임워크 호출을 멈추지 않아 버려진 작업이 엔진을 계속 점유.
- 로그: 23:33~23:35 KST 사이 블록 125개 처리, 요청 완료 6건 후 호출 끊김.
### 수정 방향
**JS (Sonnet A)**
1. `engines/native.js` apple-mt `batchLimit` → `{chars: 1500, blocks: 10}`, concurrency 1. apple-fm은 현행.
2. 응답 `{ok:true, results, partial:true}` 허용: 받은 결과만 반환(누락 블록은 기존 "누락 = 원문 유지" 처리). 에러 아님.
3. 테스트: 배치 분할(10블록), partial 응답 처리, 기존 테스트 유지.
**Swift (Sonnet B)**
1. 요청 기한을 블록 수 비례: `min(120, 15 + 3 × blocks)`초(MT). FM은 현행 90s 유지.
2. 블록 사이 협조적 취소(`Task.checkCancellation()` 또는 기한 확인)로 기한 넘으면 더 진행하지 않고 **이미 번역한 결과를 `partial:true`로 반환**(전부 실패일 때만 timeout 에러).
3. 서킷브레이커: 결과가 1개 이상인 partial/timeout은 실패로 세지 않음. 진행 0인 실패만 카운트.
4. 진단 로그(`os_log`/Logger, subsystem `com.tmtmtmtmtmt.localtranslator`): 요청 시작(엔진·블록 수·언어), 소요 시간, 결과 코드·완료 블록 수. **번역 텍스트는 기록 금지**(개인정보).
5. `xcodebuild`(Xcode-beta, `CODE_SIGNING_ALLOWED=NO` 컴파일 확인)만 — 설치는 메인이 지시.
6. PROTOCOL §4 응답 `partial` 필드·기한 규칙 갱신(Sonnet A가 PROTOCOL 담당, B는 건드리지 않음).
### 영향 범위
A: `extension/engines/native.js`, `extension/PROTOCOL.md`, `tests/engines-native.test.mjs`. B: `xcode/Local Translator/Local Translator Extension/*.swift`. 파일 겹침 없음.
### 검증
npm test, xcodebuild 성공, 재설치 후 Safari 재시작 → the-race 홈 번역 진행(사용자) + `log show`로 요청별 소요 시간·완료 블록 수 확인(타임아웃 0, 브레이커 열림 0).

## F15. 링크 여러 개만 있는 블록에서 번역이 첫 링크에 몰리고 나머지 링크가 비어 버림 (B10, R7, Opus)
### 원인 (Sonnet 조사, Safari 실기 스크린샷)
the-race 헤더 `div.gh-navigation-members > a "Login" + a.gh-button "Join Members' Club"` → 블록 하나(div), F5 승격으로 t 슬롯 2개가 붙어 있음. Swift `EngineMT.swift` runs()가 연속 t를 구분자 없이 이어 붙여("LoginJoin Members' Club") 한 번 번역하고 첫 슬롯에 전부, 나머지 `''`(`EngineMT.swift:242, 264`) → "회원가입 회원클럽에 가입하기" + 빈 버튼. 메뉴·버튼 UI 파손.
### 수정 방향 (Sonnet)
1. `content/segmenter.js` flush 승격: 승격 대상 링크가 **서로 다른 `<a>` 요소 2개 이상**이면 링크(앵커)별로 별도 블록 레코드로 나눠 내보냄(각 블록 = 그 앵커 안의 텍스트 노드들, 블록 el은 앵커). 앵커 하나 안의 여러 텍스트 노드는 한 블록(현행).
2. 언어 판정·F8 힌트·MAX 규칙은 나뉜 블록마다 적용. 요청 수가 늘어도 background 배치가 묶어 보냄.
3. (방어, 확장 JS 쪽만) 이번엔 Swift 수정 없음 — 슬롯 분배 규칙은 문장 단위 설계라 유지.
4. 테스트: 헤더 패턴(div > a + a) → 블록 2개, 각 1슬롯; 앵커 하나에 span 2개 → 블록 1개; 기존 승격 테스트 유지; `linkMode:"never"` 불변.
### 영향 범위: `extension/content/segmenter.js`, `tests/content-linkmode.test.mjs`(또는 새 테스트). 비ASCII 리터럴 금지.
### 검증: npm test, site-coverage(therace) 블록 수 증가 확인, 재설치 후 Safari 헤더 "로그인"·"회원 클럽 가입"류로 각각 표시.
