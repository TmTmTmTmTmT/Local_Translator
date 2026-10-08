# /goal 프롬프트 — 실사용 버그 탐색·수정 루프

아래 블록을 그대로 `/goal` 뒤에 붙여 넣는다.

```
Local_Translator(/Users/kimmingyu/Documents/Claude/translator) 실사용 검증 루프를 끝까지 돌려라. 역할: Opus=메인(판단·FIX_GUIDE 작성·결과 판정, 코드 직접 수정 금지), 서브에이전트=탐색·수정·확인(Haiku: 반복 실행·관찰·로그 수집, Sonnet: 원인 추적·코드 수정·테스트). 서브에이전트는 대화 내용을 못 보므로 매 위임 프롬프트에 대상 문서 항목·실행 명령·반환 형식을 적는다.

[검증 대상 기능 — docs/TEST_LOOP.md 체크리스트 T1~T12 전부]
웹 자동 번역(지정 사이트), 링크/코드/입력/translate=no 처리, 동적 콘텐츠(더보기·무한스크롤·details·SPA), 원문/번역 토글, 팝업(사이트 토글·상태), 옵션(사이트·제외 셀렉터·엔진·프리셋·용어집 저장/복원), 용어집 적용, PDF 뷰어(수동·자동 진입·링크·문단), 컨테이너 앱(언어팩 상태·서명 상태·Safari 설정 열기), install.sh 재설치, Safari 재시작 후 확장 유지, 오류 창 없음.

[Mac 제어 규칙]
- Safari는 computer-use에서 read 등급: 스크린샷 관찰만. 클릭·입력·셸/AppleScript로 조작하거나 우회 금지. Safari에서 사람 조작이 필요한 단계(페이지 이동, 팝업 클릭, 재시작)는 한 번에 묶어 사용자에게 요청하고, 결과를 스크린샷으로 확인.
- Local Translator 앱(com.tmtmtmtmtmt.localtranslator)은 full 등급: 직접 조작·확인.
- 웹 동작 자동 검증은 내장 브라우저 하네스: 대상 사이트 HTML을 curl로 받아 <base>와 주입 스크립트(scratchpad/inject.js: IntersectionObserver·rAF 폴링 스텁 + mock 번역기 + content 스크립트 6개)를 넣고 127.0.0.1에서 서빙 → mock 결과 '한(…)' 커버리지 측정(measure.js). 페이지 CSP 때문에 실사이트 직접 주입은 안 됨. 하네스 결과와 Safari 실기 결과를 구분해 기록.
- 테스트 사이트: the-race.com(기사·카드형 링크), en.wikipedia.org(본문·각주 링크), developer.mozilla.org(코드), news.ycombinator.com(목록·더보기), 일본어·중국어 뉴스 각 1곳, PDF 1개.

[루프 — 모든 체크리스트가 통과할 때까지 반복, 최소 5회]
1. 탐색(Haiku/Sonnet): 체크리스트 항목별로 실행·관찰 → docs/BUGS.md에 B번호, 재현 절차, 기대/실제, 증거(스크린샷 경로·측정값·콘솔), 심각도 기록. 추측과 확인을 구분.
2. 판정·가이드(Opus): BUGS.md를 읽고 원인 분석 → FIX_GUIDE.md에 F번호(원인·수정 방향·영향 범위·검증 방법, 코드 없음). 요구사항과 충돌하거나 사용자 판단이 필요한 건 DECISIONS.md로 넘기고 그 항목만 보류, 나머지는 계속.
3. 수정(Sonnet, impl-worker 병렬 시 파일 겹치지 않게): FIX_GUIDE대로만 수정, 테스트 추가, npm test 전부 통과, 필요하면 Xcode-beta 빌드 + scripts/install.sh 재설치.
4. 확인(Haiku): 같은 재현 절차로 재검증 → BUGS.md 항목을 fixed/still/regressed로 갱신. 회귀가 있으면 1로.
5. 기록: 매 회차 끝에 STATUS.md에 회차·발견/수정/남은 버그 요약, 브랜치→PR→merge(커밋 작성자 TmTmTmTmTmT noreply, README는 사용자용만).

[제약]
- 로컬 우선: 외부 번역 API·유료 API 금지, 루프백만. 모델 다운로드·설치·sudo·Safari 보안 설정 변경은 사용자 승인 없이 금지.
- 진행 중 채팅 보고 금지, 문서만 갱신. 최종 보고 또는 사용자만 풀 수 있는 막힘(실기 조작 요청 포함)일 때만 말한다.
- 종료 조건: TEST_LOOP 체크리스트 전 항목 "통과"(Safari 실기 항목은 사용자 확인 스크린샷 기준), BUGS.md에 open 없음(보류는 DECISIONS.md에 사유와 함께), npm test 통과, main 병합 완료.
```

## 현재 알려진 상태 (루프 시작점)

- B1 (확인됨, 하네스): the-race.com에서 미번역 텍스트 85개 전부 링크 안(카드형 블록 링크 67개). `content/filter.js`의 `KEEP_TAGS`에 `a`가 있어 링크 텍스트는 항상 원문 유지 → 헤드라인·메뉴·카드 전체가 번역 안 됨. 사용자 Safari 증상(우측 하단 버튼만 번역)과 일치. 요구사항("링크 제외")과의 해석 문제라 Opus 판단 필요: 문장 속 인라인 링크만 원문 유지, 블록 전체가 링크인 경우(헤드라인·카드·메뉴)는 번역하는 방향 검토.
- 하네스 파일은 세션 scratchpad에 있음(`inject.js`, `measure.js`, `serve.py`). 다음 세션이면 docs/TEST_LOOP.md 절차로 재생성.
