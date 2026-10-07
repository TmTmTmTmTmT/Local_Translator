# STATUS

## 2026-10-07 — Opus 계획 r1~r5 (요약)
- r1 초안 → r2 meeco.kr 분석(nodeValue 교체·슬롯 모델) → r3 로컬 우선 엔진 → r4 자원 예산(≤1.5GB, gemma 제외) → r5 PDF 뷰어

## 2026-10-07 — Opus 계획 r6 (통합본)
- `PLAN.md` 전면 재작성. 엔진 결정은 Phase 0 벤치마크 후 G0로 연기
- 언어: en/ja/zh(Hans·Hant)→ko, 언어 표 구조로 추가 가능
- 벤치 후보 확대: Apple Translation·AFM, 전용 MT(m2m100/NLLB/Opus-MT/madlad), 한국어 특화 소형 LLM(EXAONE/HyperCLOVA X SEED/Kanana), 범용 소형 LLM, 번역 특화 7B(참고), Ollama vs MLX
- 다음 단계: Sonnet 전환 → T0 → T0.1(가용성 조사 → 다운로드 승인 요청)

## 2026-10-07 — Opus 계획 r7
- §4.5.1 동적 콘텐츠(더보기·무한스크롤·AJAX·SPA·details·iframe·open shadow DOM) 추가, T7·DoD·테스트 반영
- §5.4 상주/즉시 언로드/실사용 모사 3시나리오 자원 측정, gemma4:e2b 전체 측정·문맥 모드 후보 허용

## 2026-10-07 — Sonnet T0, T0.1, T0.2 완료
- T0: repo 생성 https://github.com/TmTmTmTmTmT/Local_Translator (private), 골격 커밋
- T0.1: 후보 15개 조사 → `bench/CANDIDATES.md` (합계 ~23GB, 승인 대기)
- T0.2: 코퍼스 4언어×29블록 `bench/corpus/*.json`
- 진행 중: T0.3 Swift CLI, T0.4 Node 어댑터·실행기, T0.5 MT 서버, T0.6 평가 페이지
- 다음: 다운로드 승인 → 설치·변환(bench/.venv) → T0.7 1차 실행

## Opus 확인 필요
- (없음)
