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

## B4 | open(F9) | T8 | PDF 링크 고정 구간이 단어 중간에서 잘림
- 재현: 내장 브라우저 `tests/e2e/pdf-harness.html?src=…/tests/e2e/sample.pdf`(mock 번역기).
- 기대: "See the " 번역 + 링크 텍스트 원문 + 나머지 번역. 실제: "See the onli번역(ne guide for details …)" — 원문 유지 구간이 문단 처음부터 12글자, 단어 중간에서 끊김. 실제 엔진이면 링크 문장이 깨짐.
- 원인(R3 확인): 픽스처 rect 오류 + 비례 글자 위치 근사(가변폭에서 단어 절단 가능) → F9.
- 심각도: 높음(링크가 있는 PDF 문단 전부).

## B5 | open(F10) | T6 | 옵션 저장 오류 메시지에 입력칸 구분 없음
- 재현: options 하네스(`.local/options-h.html`, storage 스텁)에서 제외 셀렉터 `the-race.com | ##bad[`, 용어집 `bad line` 입력 후 저장 → "1줄: 잘못된 셀렉터", "1줄: `원문 => 번역` 형식…" (어느 칸인지 불명).
- 저장 차단·기존 값 보존은 정상. 심각도: 낮음(UX).
- 같은 회차 확인(H): 저장 → 재열기 시 사이트 3개·용어집 2개·프리셋 값·linkMode 체크 복원, pdfAuto 등 화면 밖 키 보존. 비루프백 baseUrl 거부.

## B6 | open(F11) | T5 | 팝업 재열기 시 원문/번역 라벨이 실제 상태와 반대일 수 있음
- 재현(코드 검토로 확인): popup.js가 mode='translated'로 시작, content에 현재 모드 질의 메시지 없음. 원문 보기 상태에서 팝업 재열기 → 라벨 "원문 보기", 클릭 시 번역으로 전환.
- 심각도: 낮음~중(혼동).
