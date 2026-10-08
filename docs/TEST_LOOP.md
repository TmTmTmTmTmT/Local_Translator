# 실사용 검증 체크리스트·하네스 (GOAL_PROMPT.md 루프용)

결과 표기: 통과 / 실패(B번호) / 보류(D번호) / 미실행. 근거: H=내장 브라우저 하네스, S=Safari 실기(사용자 조작 + read 스크린샷), A=컨테이너 앱 직접 조작, U=단위 테스트.

| # | 항목 | 확인 방법 | 결과 |
|---|---|---|---|
| T1 | 지정 사이트 자동 번역: 본문·헤드라인·메뉴·카드 커버리지 ≥95% (보이는 영어 텍스트 기준, 의도된 제외 빼고) | H site-coverage, S 스크린샷 | H 통과(en·ja·zh, R1~R2), H-real 통과(R5·R8: 기사·NHK·BBC중문·HN 오류 0), S R7 통과(헤드라인·카드 번역) — 헤더 링크 합쳐짐 B10 수정 설치 후 재확인 필요 |
| T2 | 문장 속 링크는 원문·클릭 유지, 어순·조사 자연스러움 | H, H-real(F13), S | R5 H-real: 링크 원문 유지 통과, 자연스러움은 대체로 양호하나 하이픈 붙은 링크 어색(D16 알려진 한계). S 미확인 |
| T3 | code/pre, 입력값, translate=no, .notranslate, 사이트별 제외 셀렉터 원문 유지 | H, U | 통과(R1 H: MDN code 134·translate=no 18 유지, U: content-units) |
| T4 | 동적 콘텐츠: 더보기, 무한스크롤, details 펼침, SPA 라우팅 후 새 구간만 번역·중복 요청 없음 | H(__kt.calls/blocks), U, S | U 통과(content-main dynamic 11건: 추가·숨김→표시·재적용 상한·SPA·shadow), S 미확인 |
| T5 | 팝업: 사이트 토글, 원문 보기 왕복, 상태(엔진·ready/translating/error) | H(popup 하네스), S | R3 H 통과(라벨·토글·상태 표시, B6 수정). S 통과(원문 토글 왕복, 사용자) — 단 상태 error(B7) |
| T6 | 옵션: 사이트·제외·엔진·TranslateGemma 프리셋·용어집 저장 후 재열기 복원, 오류 메시지 | H(options 하네스), S, U | R3 H 통과(저장·복원·키 보존·검증·칸별 오류 메시지). S 통과(사이트 3개·용어집 저장 후 재열기 유지, 사용자) |
| T7 | 용어집 적용(kerbs → 연석 등)·변경 시 해당 문장만 재번역 | H(mock은 치환 확인), S | S 통과(R7: "Formula 1"→"포뮬러 원" 메뉴·분류 라벨), U 통과(캐시 키) |
| T8 | PDF: 자동 진입(pdfAuto), 수동 버튼, 문단 번역, 링크 동작, 원본 열기 | S, 기존 pdf-harness | R3 H 통과(렌더·문단·원본 링크·링크 구간 "online guide"). S 미확인(자동 진입·실제 PDF) |
| T9 | 컨테이너 앱: 언어팩 상태, 서명 상태 "팀 서명됨", Safari 확장 설정 열기 | A | 통과(R1: 언어팩 4개 설치됨, "팀 서명됨 (K3YUPJD653)", 버튼 → Safari 확장 설정 창 전면) |
| T10 | install.sh 재설치: 실행 중 앱 종료, 단일 등록(pluginkit), 팀 서명 검증 | Bash | 통과(R0: 실행 중 앱 종료, pluginkit 1곳, TeamIdentifier 검증) — 수정 후 재설치 때마다 재확인 |
| T11 | Safari 재시작 2회 후 확장 유지("서명되지 않은 확장 허용" 꺼짐) | S | 1회 통과(사용자), 2회째 미확인 |
| T12 | Safari 확장 오류 창 없음, 엔진 오류 시 배지·팝업 안내 | S | S: 오류 창 없음·엔진 오류 팝업 안내 표시(사용자) — 엔진 오류 자체가 B7 |

## 하네스 절차 (H)
1. `scratchpad/serve.py <dir>` — 127.0.0.1:8799, CORS 허용, no-store.
2. `inject.js` 생성: 머리말(IntersectionObserver·requestAnimationFrame 폴링 스텁 — 내장 브라우저 창이 숨겨지면 innerHeight=0이라 IO가 멈춤, `window.__ktAll=true`면 전체 페이지를 보이는 것으로 간주) + `window.browser` 스텁(translate → 각 t 슬롯 `한(원문)`, 호출·블록 수 `window.__kt`) + `lib/josa.js, content/text.js, filter.js, segmenter.js, apply.js, main.js`를 각각 `(0,eval)(JSON 문자열)`로. zsh `echo`는 `\n`을 해석하므로 생성은 node로.
3. 대상 사이트 HTML을 curl(Safari UA)로 받아 CSP meta 제거, `<base href=원 사이트>`, `</body>` 앞에 `<script>window.__ktAll=true</script><script src="http://127.0.0.1:8799/inject.js">` 삽입.
4. 내장 브라우저로 `http://127.0.0.1:8799/<page>.html` 열고 10초 뒤 `measure.js`(절대 URL로 fetch — `<base>` 때문에 상대경로는 원 사이트로 감)로 집계: 남은 영어 텍스트 수, 링크 안/블록 링크 안/버튼 안 분류.
- 한계: 사이트 JS가 렌더하는 부분은 하네스에서 다를 수 있음, 엔진은 mock(번역 품질 아님), Safari 고유 문제(인코딩·등록)는 S로만 확인.

### 실엔진(Apple 번역) 하네스 (수동 도구, npm test 제외)
1. `node tests/e2e/apple-bridge.mjs &` — 127.0.0.1:8797 브리지, bench `kt-bench`(apple-mt-marker)로 번역(요청 직렬 처리, 요청당 120s 타임아웃). 먼저 `bench/engines/apple`에서 release 빌드 필요.
2. `node tests/e2e/site-coverage.mjs tests/e2e/sites/<page>.html --engine apple [--max-blocks N] --json` — 결과의 `linkSamples`(원문 `[링크]` 표시 → 한국어 슬롯 결과)로 링크 문장 어순·조사 확인.
3. 끝나면 브리지 프로세스 종료. 한계: 링크 안 텍스트(x 항목)는 번역되지 않음, 슬롯 결과는 `|`로 이어 표시.
