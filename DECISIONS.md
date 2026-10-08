# DECISIONS — 사용자 결정·평가 대기 항목

/goal 방침(2026-10-07): 구현에 급하지 않은 사용자 결정은 건너뛰고 먼저 끝까지 완성 → 이후 이 목록을 사용자가 결정·평가 → 수정.
임시 기본값으로 진행하며, 결정 후 바꿀 지점을 함께 적는다.

| # | 결정/평가 | 임시 처리 | 바꿀 곳 |
|---|---|---|---|
| D1 | ✅ **확정 2026-10-08: 기본 Apple 번역 + 고품질 옵션 TranslateGemma 4B(MT)** — 근거 bench/D1_RATING_EN.md, 후속 PLAN §11. 용어집 기능 추가 확정(§11.3). 이전 내용: 기본 엔진 확정 (G0) — 자료 [bench/DECISION_BRIEF.md](bench/DECISION_BRIEF.md), 자연스러움 블라인드 평가는 **영어만, 기사 중심**(사용자 요청 2026-10-08; 코퍼스 `bench/corpus-articles/en.json`, 페이지 `bench/rate/rate-articles-en.html` 재실행 후 생성 — FIX_GUIDE F1). 기존 rate-ja/zh 페이지는 D1 평가 제외. 속도: apple-mt ~1.7s/블록(느림), nllb-600m ~0.25s, hy-mt2 ~0.7s | apple-mt 기본(설치 불필요) + 로컬 서버 엔진 옵션 | settings.engine.default, PLAN §4.7 |
| D2 | ✅ **확정 2026-10-08: 단일 기본 엔진(Apple) 유지**, 일본어·중국어 별도 지정은 옵션으로만 | 단일 기본 엔진 | settings.engine.byLang |
| D3 | ✅ **확정 2026-10-08: TranslateGemma 4B로 충분, 별도 문맥 모드·고메모리 프리셋 없음**(수동 지정은 허용) | 옵션에서 선택 가능하게만 노출 | options |
| D4 | 🔄 **측정 진행 2026-10-08**: 사용자가 sudo로 Apple/TranslateGemma 2개 측정 → 저장 후 summarize. 안내 bench/powermetrics.md |  미측정 표기 | bench/powermetrics.md |
| D5 | ✅ **확정 2026-10-08: 언어팩 설치 완료**(사용자). Apple Intelligence는 apple-fm 옵션 전용이라 필수 아님 | — | README |
| D6 | ✅ **확정 2026-10-08: 무료 개인 팀(Personal Team) 서명** → 방식 확정: Safari-Extension-HDR처럼 `scripts/install.sh`가 팀 ID 자동 탐지·서명·설치(PLAN §12, T14–T16). 배포 대상 26.0, 베타 Xcode. 구현 완료(T14–T16, 설치 실행됨). 남은 것: Safari 재시작 후 확장 유지 여부 사용자 확인. 재시작마다 재허용이 실제로 사라지는지 확인(무료 팀 프로파일은 7일 만료 가능) | ad-hoc 서명 | xcode/ |
| D7 | ✅ **확정 2026-10-08: PDF 자동 진입 기본 ON**(`pdfAuto: true`, 적용 완료). Safari 실기 미검증 — 안 되면 알려주기 | 수동 버튼 경로 우선 구현 | background.js |
| D8 | ✅ **확정 2026-10-08: NC 라이선스 모델(NLLB 1.3B/600M, EXAONE) 벤치에서 제거** — models.json 28개로 축소, 스크립트·CANDIDATES 반영. 기존 결과·보고서 파일은 기록으로 유지 | — | CANDIDATES.md |
| D9 | ✅ **확정 2026-10-08: 라이선스 파일 없음(기본 저작권)**. 다른 사람이 복사·수정·재배포할 수 없음. vendor/pdfjs는 원 라이선스(Apache-2.0) 유지 | — | LICENSE |
| D10 | ✅ D6과 동일(무료 개인 팀 서명) | — | xcode/README.md |
| D11 | 🔄 **확정 2026-10-08: 한 번 측정** — 하지만 lowLatency 언어 모델 설치 경로가 컨테이너 앱에 없음(현재 `needs_language_pack`). 측정하려면 컨테이너 앱에 lowLatency 준비 화면 추가가 필요 → **Opus 계획 필요(PLAN 항목 신설)** | 제외 | bench/models.json |
| D12 | ✅ D9와 동일(라이선스 없음) | — | LICENSE |
| D13 | ✅ **확정 2026-10-08: Bergamot 추가 안 함** | — | — |
| D14 | ✅ **확정 2026-10-08: 용량 기준을 gzip으로 변경.** 측정: 기본 주입 비압축 34.3KB / gzip 13.9KB (<30KB 충족). PLAN §7 문구 수정 | — | PLAN §7 |
| D15 | 링크 텍스트 번역 범위: **임시 결정(2026-10-08, Opus)** 문장 속 인라인 링크만 원문 유지, 블록 전체가 링크뿐(헤드라인·카드·메뉴)이면 번역. 옵션 `linkMode`(standalone 기본/never)로 이전 동작 선택 가능. 근거: B1(the-race.com 헤드라인 미번역) — 사용자 확인 필요 | standalone | content/segmenter.js, options |
