# BUGS — 실사용 검증 발견 목록

형식: B번호 | 상태(open/fixed/still/regressed/보류) | 항목(T#) | 재현 | 기대 / 실제 | 증거 | 심각도 | 가이드(F#)

## B1 | fixed(H, R1) | T1 | 링크 안 텍스트 전부 미번역
- 재현: 하네스(TEST_LOOP H)로 the-race.com 홈 → measure.js.
- 기대: 헤드라인·카드·메뉴 번역. 실제: 번역 블록 12개, 남은 영어 85개 전부 `<a>` 안(블록 레벨 링크 카드 67개).
- 원인(확인): `content/filter.js` `KEEP_TAGS`에 `a` → 링크 텍스트는 항상 x 항목(원문 유지). 뉴스 사이트는 헤드라인·카드 전체가 링크.
- 증거: measure `{ko:12, en:85, inLink:85, inBlockLink:67}`, 사용자 Safari 스크린샷(우측 하단 버튼만 번역).
- 심각도: 높음(주 사용 사이트에서 사실상 번역 안 됨). 요구사항 해석 필요 → Opus.
- R1 확인(H, site-coverage): the-race 홈 남은 영어 135→0(never 대비), 목록 2쪽 5(아이콘 라벨 "lock-1", 무시). Safari 실기 확인 대기.

## B2 | fixed(R2, 측정 오류 보정) | T1 | NHK(일본어) 화면 텍스트 50개 미번역
- 재현: `node tests/e2e/site-coverage.mjs tests/e2e/sites/nhk.html --json` → remaining 50, 전부 "other"(링크·코드·버튼 아님). 예: 地域を選択, 都道府県を選ぶとその地域のニュースページへ移動します。, 北海道, 青森県…
- 원인(R2 확인): select/option 48 + SVG title/desc 2 = 확장의 의도된 제외. 도구 분류 누락 → F7.
- 심각도: 중(일본어 사이트 메뉴·지역 선택).

## 관찰 (버그 아님, D15 범위)
- HN: 제목은 번역, 부가 줄의 링크("55 minutes ago", "hide", "2 comments")는 문장 속 링크 규칙으로 원문 유지. Wikipedia 본문 인라인 링크 1101개 원문 유지(의도). MDN code 134·translate=no 18 원문 유지(의도).

## B3 | fixed(H, R2) | T1 | 일본어 페이지의 한자-only 블록을 zh로 판정
- 재현: detectLang("北海道")="zh", "青森県"="zh", "東海"="zh" (text.js 가나 없음+한자≥0.5 규칙). F5로 링크 헤드라인·메뉴가 번역 대상이 되면서 일본어 사이트 메뉴·지명에 zh→ko 요청 발생 가능.
- 심각도: 중(오역 위험, 번역 자체는 됨).
- R2 확인(H): NHK 블록 lang zh 67→10, ja 121→178, 요청 수 99→24(배치 병합 개선). F7 후 NHK remaining 0(formControl 48, graphic 2).

## B4 | fixed(H, R3) | T8 | PDF 링크 고정 구간이 단어 중간에서 잘림
- 재현: 내장 브라우저 `tests/e2e/pdf-harness.html?src=…/tests/e2e/sample.pdf`(mock 번역기).
- 기대: "See the " 번역 + 링크 텍스트 원문 + 나머지 번역. 실제: "See the onli번역(ne guide for details …)" — 원문 유지 구간이 문단 처음부터 12글자, 단어 중간에서 끊김. 실제 엔진이면 링크 문장이 깨짐.
- 원인(R3 확인): 픽스처 rect 오류 + 비례 글자 위치 근사(가변폭에서 단어 절단 가능) → F9.
- 심각도: 높음(링크가 있는 PDF 문단 전부).

## B5 | fixed(H, R3) | T6 | 옵션 저장 오류 메시지에 입력칸 구분 없음
- 재현: options 하네스(`.local/options-h.html`, storage 스텁)에서 제외 셀렉터 `the-race.com | ##bad[`, 용어집 `bad line` 입력 후 저장 → "1줄: 잘못된 셀렉터", "1줄: `원문 => 번역` 형식…" (어느 칸인지 불명).
- 저장 차단·기존 값 보존은 정상. 심각도: 낮음(UX).
- 같은 회차 확인(H): 저장 → 재열기 시 사이트 3개·용어집 2개·프리셋 값·linkMode 체크 복원, pdfAuto 등 화면 밖 키 보존. 비루프백 baseUrl 거부.

## B6 | fixed(H, R3) | T5 | 팝업 재열기 시 원문/번역 라벨이 실제 상태와 반대일 수 있음
- 재현(코드 검토로 확인): popup.js가 mode='translated'로 시작, content에 현재 모드 질의 메시지 없음. 원문 보기 상태에서 팝업 재열기 → 라벨 "원문 보기", 클릭 시 번역으로 전환.
- 심각도: 낮음~중(혼동).

### R3 확인 (H)
- B4: pdf-harness → "번역(See the)online guide번역(for details …)" — 링크 구간 = "online guide" 정확(sample.pdf rect 재생성 + 단어 경계 스냅). 공백 붙음은 mock 번역기가 trim하는 탓(실엔진은 바깥 공백 보존).
- B5: "사이트 2줄: 잘못된 호스트", "제외 셀렉터 1줄: …", "용어집 1줄: …", "Localhost: …".
- B6: popup 하네스(원문 상태로 열기) 라벨 "번역 보기" → 토글 "원문 보기" → "번역 보기", getMode 질의 확인.

## B7 | open(F12) | T1/T12 | Safari 실기: Apple 번역 엔진 사용 불가(engine_unavailable)
- 재현(S, 사용자 2026-10-08): Safari 재시작 후 the-race.com·news.ycombinator.com에서 팝업 "native:apple-mt · error", "번역 엔진을 사용할 수 없습니다". content 스크립트·팝업·원문 토글은 동작, 번역 안 됨.
- 의심: (a) Safari 실행 중 install.sh 재설치(14:22, 14:29)로 확장 프로세스 불일치, (b) sendNativeMessage 호출 형태, (c) Swift 핸들러(샌드박스·Translation) 실패. 원인(R4 확인): (a) Safari 실행 중 재설치 — 로그 `No such plugin (uuid not found)`, `Other version in use`(옛 플러그인 UUID 고정). 핸들러·권한·호출 형태 정상 → F12.
- 심각도: 치명(실기 번역 불가).
- 함께 받은 S 결과: T11 1회 재시작 후 확장 켜짐·오류 없음(T12 일부 통과), T6 옵션 값 유지(통과), T5 원문 토글 왕복(통과).
- 운영 수정: 사용자 실기 확인 중에는 재설치 금지(재설치 후엔 반드시 Safari 재시작 안내).

## 관찰 R5 (실엔진 하네스 F13, Apple 번역 marker)
- the-race 기사 122블록 전부 응답(152s, 직렬), 남은 1 = 문장 속 링크(의도).
- 링크 문장 품질: `now-[banned engine trick] deployed …` → "…노출된 현재 [링크] 배치된 것과 유사합니다"처럼 하이픈에 붙은 링크에서 어순 어색·"배치" 중복. 엔진(Apple 번역) + 표식 방식 한계로 판단 — 블라인드 평가(F2, Apple 4.33/5)와 일치. 버그 아님, DECISIONS D16(알려진 한계)로 기록.
- 용어 품질: "Manufacturers' return"→"제조업체의 반품", "privateers"→"해적들" — 엔진 오역(문맥 부족). 용어집으로 보완 가능.

## B9 | fixed(S, R6→R7 확인) | T1 | Safari 실기: 짧은 라벨만 번역, 나머지 미번역 + 배지 "!"
- 재현(S, Opus 스크린샷 R5): the-race.com — "MotoGP"→"모토GP" 2곳만 번역, 헤드라인·카드 영어, 툴바 배지 "!". 재설치(14:33 UTC) 후 Safari 재시작 전 상태였으나 옛 플러그인 오류는 없음(새 appex가 요청 처리).
- 원인(R6, 로그·코드): 40블록 배치 × 블록당 1~2초 > 45초 기한 → 타임아웃 → 서킷브레이커 → engine_unavailable. 로그상 2분간 125블록 처리·요청 6건 완료 후 호출 끊김.
- 심각도: 치명.
- R7 확인(S·로그): 재설치 후 appex 로그 `translate start blocks=10 deadline=45s` → `done completed=10 code=ok ms≈6000~15500`, timeout·breaker 0. Safari 스크린샷: 헤드라인·카드·본문 요약 번역, 배지 "!" 없음.

## B10 | fixed(S, R10) | T1 | 링크만 여러 개인 블록 → 번역이 첫 링크에 몰리고 버튼 텍스트가 비어 버림
- 재현(S, Opus 스크린샷 R7): the-race 헤더 "Login" → "회원가입 회원클럽에 가입하기", "Join Members' Club" 버튼 빈 칸.
- 원인: F5 승격 후 같은 div 블록의 t 슬롯 2개가 하나의 런으로 번역되어 첫 슬롯에 전부 들어감(EngineMT runs/plainBlock).
- 심각도: 높음(UI 파손).

## 관찰 R7 (S)
- 용어집 적용 확인: 메뉴·분류 라벨 "Formula 1" → "포뮬러 원"(T7 S 통과).
- 메뉴 단어 단독 번역 품질: "Extra"→"여분의", "Business"→"업무", "Podcasts" 그대로 — 문맥 없는 한 단어 번역 한계(엔진). D16에 추가, 용어집으로 보완 가능.
- 번역 순서: 페이지 위쪽 메뉴가 카드보다 늦게 번역됨(전체 약 2~3분). 개선 여지(보이는 영역·위쪽 우선) — 관찰만.

## 관찰 R8 (실엔진 하네스, ja/zh/HN 각 30블록)
- NHK(ja 26·zh 4)·BBC 중문(zh 28)·HN 모두 오류 0, 응답 30/30, 각 17~24초. 일본어·중국어 언어팩 경로 정상(T1 ja/zh 실엔진 통과).
- HN 부가 줄 "17 points by [user] …" → "17점by" — 링크 사이 짧은 조각의 공백·전치사 처리 어색(엔진·표식 한계, D16 범주). 버그 아님.

## B11 | open(F16) | T1 | 새로고침 후 번역이 안 되는 것처럼 보임(느린 첫 결과, 위쪽이 나중)
- 재현(S, 사용자 2026-10-09 10:5x): the-race 새로고침 → "번역이 안 됨". appex 로그: 10:50:11부터 요청 정상(10블록 3.6~18.5초, 오류 0) → 진행 중이었음.
- 원인 후보: 직렬 배치로 첫 결과까지 ~10초, 화면 위쪽(메뉴)이 큐 뒤쪽(R7 관찰). 심각도: 높음(체감상 고장).

## R10 Safari 실기 결과 (사용자, 2026-10-09 11:01 재시작 후)
- 1 재시작 후 확장 정상(T11 1회 추가 통과). 2 the-race: 5초 안에 번역 시작(F16 효과), 헤더 버튼 따로 번역(B10 fixed). 단 전체는 1분 넘게 미완(Apple 번역 처리량 ~1블록/초 — 로그 11:01:29~11:03:26 요청 연속 성공) → 엔진 속도 한계.
- appex 로그(11:01~11:04): 요청 36건 전부 code=ok, 블록당 약 1초.

## B12 | open(F18) | T5 | 팝업 "남은 N블록"이 9에서 멈춤
- 재현(S): the-race 번역 중 남은 블록 수가 줄다가 9에서 정체, 0이 되지 않음. 조사 중.

## B13 | open(F18) | T4 | HN "More"(다음 쪽) 이후 번역이 진행되지 않음
- 재현(S): news.ycombinator.com 맨 아래 More → 번역 진행 안 됨. 조사 중.

## B14 | open(F17) | T8 | PDF 자동 진입 안 됨
- 재현(S): arxiv.org(사이트 목록에 있음)에서 https://arxiv.org/pdf/1706.03762 → 번역 뷰어로 자동 이동 안 함. 조사 중(URL에 .pdf 없음, Safari 내비게이션 이벤트 의심).

## R11 고품질 번역(Ollama TranslateGemma) 실엔진 하네스 (F19)
- the-race·기사·HN·NHK 각 30블록: 오류 0, 표식 누출·빈 출력·언어 오류·타임아웃 0, 블록당 0.48~0.86초(Apple ~1초보다 빠름), Ollama 2.9GB·GPU·keepAlive 5분. 일반 문장 품질 양호.

## B15 | open(F20) | T2 | 링크가 많은 메타 줄에서 표식 번역이 깨짐
- 재현(H-real): HN `17 points by [user][time] | hide | comments` → TG "93점 (출처: )", Apple "17점by".
