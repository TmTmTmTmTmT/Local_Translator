# DECISIONS — 사용자 결정·평가 대기 항목

/goal 방침(2026-10-07): 구현에 급하지 않은 사용자 결정은 건너뛰고 먼저 끝까지 완성 → 이후 이 목록을 사용자가 결정·평가 → 수정.
임시 기본값으로 진행하며, 결정 후 바꿀 지점을 함께 적는다.

| # | 결정/평가 | 임시 처리 | 바꿀 곳 |
|---|---|---|---|
| D1 | ✅ **확정 2026-10-08: 기본 Apple 번역 + 고품질 옵션 TranslateGemma 4B(MT)** — 근거 bench/D1_RATING_EN.md, 후속 PLAN §11. 용어집 기능 추가 확정(§11.3). 이전 내용: 기본 엔진 확정 (G0) — 자료 [bench/DECISION_BRIEF.md](bench/DECISION_BRIEF.md), 자연스러움 블라인드 평가는 **영어만, 기사 중심**(사용자 요청 2026-10-08; 코퍼스 `bench/corpus-articles/en.json`, 페이지 `bench/rate/rate-articles-en.html` 재실행 후 생성 — FIX_GUIDE F1). 기존 rate-ja/zh 페이지는 D1 평가 제외. 속도: apple-mt ~1.7s/블록(느림), nllb-600m ~0.25s, hy-mt2 ~0.7s | apple-mt 기본(설치 불필요) + 로컬 서버 엔진 옵션 | settings.engine.default, PLAN §4.7 |
| D2 | 언어별 엔진 분리 여부 (en/ja/zh) | 단일 기본 엔진 | settings.engine.byLang |
| D3 | 고품질 "문맥 모드" 엔진 후보 (H 등급 포함 여부) | 옵션에서 선택 가능하게만 노출 | options |
| D4 | GPU/ANE 전력 측정 (`sudo powermetrics`) | 미측정 표기 | bench/powermetrics.md |
| D5 | 언어팩 설치 (시스템 설정 > 번역 언어), Apple Intelligence 켜기 | 미설치 시 해당 엔진 "unavailable"로 기록 | README |
| D6 | Xcode 서명(Apple Team)·Safari "서명되지 않은 확장 허용" | 서명 없이 로컬 빌드 | xcode/ |
| D7 | PDF 자동 진입 방식 (Safari 동작 확인 후) | 수동 버튼 경로 우선 구현 | background.js |
| D8 | 라이선스 NC 계열 모델(NLLB/EXAONE) 사용 가능 범위 | 개인용으로만 벤치, 기본 후보에서 제외 가능 | CANDIDATES.md |
| D9 | repo 라이선스 선택 (공개 repo) | 미지정 | LICENSE |
| D10 | 서명: Team 서명 vs ad-hoc (Safari 재시작마다 "서명되지 않은 확장 허용" 재설정 필요) | ad-hoc 서명 | xcode/README.md |
| D11 | Apple lowLatency 번역 전략 사용하려면 별도 언어 모델 설치 필요(현재 미설치, 측정 보류) | 제외 | bench/models.json |
| D12 | repo 라이선스를 허용형(MIT/Apache-2.0)으로 할지 — GPL/AGPL 코드는 복사 불가(영감만) | 미지정(허용형 가정) | LICENSE |
| D13 | Mozilla Bergamot 모델(en→ko/ja, MPL-2.0)을 벤치·폴백 후보로 추가할지 | 보류 | bench/models.json |
| D14 | 콘텐츠 스크립트 용량 DoD(<30KB): 현재 기본 주입 34.2KB(content/*.js 31.6KB). 기준을 "주석 제외/gzip"으로 바꿀지, Shadow DOM·재적용·조사 보정 등을 선택 주입으로 더 뺄지 | 현 상태 유지(동작 우선) | PLAN §7 |
