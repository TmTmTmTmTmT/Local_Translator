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
