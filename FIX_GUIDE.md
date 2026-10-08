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
