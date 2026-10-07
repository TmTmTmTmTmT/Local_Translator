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

## 2026-10-07 — Sonnet 진행 (/goal: 결정 항목은 DECISIONS.md로 넘기고 끝까지 완성)
- 완료: T0 repo(public, 작성자 TmTmTmTmTmT로 정리), T0.1 후보 조사, T0.2 코퍼스, T0.3 Swift bench, T0.4 Node bench, T0.5 MT 서버(코드), T0.6 평가 페이지, T2 lib, T3/T7 content, T4 engines, T5 popup/options/manifest, T6 background. 테스트 전체 통과(`npm test`=`node --test`)
- 확인: 언어팩 4종 설치됨, AFM available, Translation 헤드리스 세션 동작, SlotID 속성 보존 29/29(슬롯 전부 복구 28/29), AFM 컨텍스트 4096토큰
- 진행 중: 모델 다운로드(15개, bench/results/download.log), T0.7 Apple 엔진 1차 실행, T8 Xcode/Swift, T9 PDF 뷰어
- 조정: segmenter MAX_BLOCK_CHARS 2000→6000 (긴 단일 텍스트 노드가 번역 제외되던 문제)

## Opus 확인 필요
- (T3) content 쪽 자체 캐시와 background 캐시 이중 구조 — 유지해도 무방(교체 노드 즉시 적용 목적). 역할 분담 확인
- (T3) SPA URL 감지: Safari content script 격리 월드라 pushState 래핑 불완전 → popstate/hashchange/변이 틱 비교 병행
- (없음)
