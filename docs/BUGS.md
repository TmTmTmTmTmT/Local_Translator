# BUGS — 실사용 검증 발견 목록

형식: B번호 | 상태(open/fixed/still/regressed/보류) | 항목(T#) | 재현 | 기대 / 실제 | 증거 | 심각도 | 가이드(F#)

## B1 | open(F5) | T1 | 링크 안 텍스트 전부 미번역
- 재현: 하네스(TEST_LOOP H)로 the-race.com 홈 → measure.js.
- 기대: 헤드라인·카드·메뉴 번역. 실제: 번역 블록 12개, 남은 영어 85개 전부 `<a>` 안(블록 레벨 링크 카드 67개).
- 원인(확인): `content/filter.js` `KEEP_TAGS`에 `a` → 링크 텍스트는 항상 x 항목(원문 유지). 뉴스 사이트는 헤드라인·카드 전체가 링크.
- 증거: measure `{ko:12, en:85, inLink:85, inBlockLink:67}`, 사용자 Safari 스크린샷(우측 하단 버튼만 번역).
- 심각도: 높음(주 사용 사이트에서 사실상 번역 안 됨). 요구사항 해석 필요 → Opus.
