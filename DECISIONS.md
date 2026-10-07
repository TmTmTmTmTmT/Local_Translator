# DECISIONS — 사용자 결정·평가 대기 항목

/goal 방침(2026-10-07): 구현에 급하지 않은 사용자 결정은 건너뛰고 먼저 끝까지 완성 → 이후 이 목록을 사용자가 결정·평가 → 수정.
임시 기본값으로 진행하며, 결정 후 바꿀 지점을 함께 적는다.

| # | 결정/평가 | 임시 처리 | 바꿀 곳 |
|---|---|---|---|
| D1 | 기본 엔진 확정 (G0) — 자연스러움 블라인드 평가 (bench/rate/rate-*.html) | 자동 지표(+하드 조건) 1위로 임시 선택 | settings.engine.default, PLAN §4.7 |
| D2 | 언어별 엔진 분리 여부 (en/ja/zh) | 단일 기본 엔진 | settings.engine.byLang |
| D3 | 고품질 "문맥 모드" 엔진 후보 (H 등급 포함 여부) | 옵션에서 선택 가능하게만 노출 | options |
| D4 | GPU/ANE 전력 측정 (`sudo powermetrics`) | 미측정 표기 | bench/powermetrics.md |
| D5 | 언어팩 설치 (시스템 설정 > 번역 언어), Apple Intelligence 켜기 | 미설치 시 해당 엔진 "unavailable"로 기록 | README |
| D6 | Xcode 서명(Apple Team)·Safari "서명되지 않은 확장 허용" | 서명 없이 로컬 빌드 | xcode/ |
| D7 | PDF 자동 진입 방식 (Safari 동작 확인 후) | 수동 버튼 경로 우선 구현 | background.js |
| D8 | 라이선스 NC 계열 모델(NLLB/EXAONE) 사용 가능 범위 | 개인용으로만 벤치, 기본 후보에서 제외 가능 | CANDIDATES.md |
| D9 | repo 라이선스 선택 (공개 repo) | 미지정 | LICENSE |
| D10 | 서명: Team 서명 vs ad-hoc (Safari 재시작마다 "서명되지 않은 확장 허용" 재설정 필요) | ad-hoc 서명 | xcode/README.md |
