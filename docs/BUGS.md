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
