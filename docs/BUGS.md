# BUGS — 실사용 검증 발견 목록

형식: B번호 | 상태(open/fixed/still/regressed/보류) | 항목(T#) | 재현 | 기대 / 실제 | 증거 | 심각도 | 가이드(F#)

## B1 | fixed(H, R1) | T1 | 링크 안 텍스트 전부 미번역
- 재현: 하네스(TEST_LOOP H)로 the-race.com 홈 → measure.js.
- 기대: 헤드라인·카드·메뉴 번역. 실제: 번역 블록 12개, 남은 영어 85개 전부 `<a>` 안(블록 레벨 링크 카드 67개).
- 원인(확인): `content/filter.js` `KEEP_TAGS`에 `a` → 링크 텍스트는 항상 x 항목(원문 유지). 뉴스 사이트는 헤드라인·카드 전체가 링크.
- 증거: measure `{ko:12, en:85, inLink:85, inBlockLink:67}`, 사용자 Safari 스크린샷(우측 하단 버튼만 번역).
- 심각도: 높음(주 사용 사이트에서 사실상 번역 안 됨). 요구사항 해석 필요 → Opus.
- R1 확인(H, site-coverage): the-race 홈 남은 영어 135→0(never 대비), 목록 2쪽 5(아이콘 라벨 "lock-1", 무시). Safari 실기 확인 대기.

## B2 | open(F7, 측정 오류) | T1 | NHK(일본어) 화면 텍스트 50개 미번역
- 재현: `node tests/e2e/site-coverage.mjs tests/e2e/sites/nhk.html --json` → remaining 50, 전부 "other"(링크·코드·버튼 아님). 예: 地域を選択, 都道府県を選ぶとその地域のニュースページへ移動します。, 北海道, 青森県…
- 원인(R2 확인): select/option 48 + SVG title/desc 2 = 확장의 의도된 제외. 도구 분류 누락 → F7.
- 심각도: 중(일본어 사이트 메뉴·지역 선택).

## 관찰 (버그 아님, D15 범위)
- HN: 제목은 번역, 부가 줄의 링크("55 minutes ago", "hide", "2 comments")는 문장 속 링크 규칙으로 원문 유지. Wikipedia 본문 인라인 링크 1101개 원문 유지(의도). MDN code 134·translate=no 18 원문 유지(의도).

## B3 | open(F8) | T1 | 일본어 페이지의 한자-only 블록을 zh로 판정
- 재현: detectLang("北海道")="zh", "青森県"="zh", "東海"="zh" (text.js 가나 없음+한자≥0.5 규칙). F5로 링크 헤드라인·메뉴가 번역 대상이 되면서 일본어 사이트 메뉴·지명에 zh→ko 요청 발생 가능.
- 심각도: 중(오역 위험, 번역 자체는 됨).
