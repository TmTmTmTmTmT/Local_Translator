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

## T8 완료 (Xcode/Swift)
- 프로젝트 `xcode/Local Translator/Local Translator.xcodeproj`(JSON 형식 project.xcproj), 스킴 1개, 앱+appex, macOS 26.4, Swift 6. ad-hoc 서명 Debug 빌드 성공(codesign verify 통과)
- 핸들러: translate/status, apple-mt(attr 기본, plain 선택)·apple-fm, 언어팩 미설치 시 needs_language_pack. 임시 CLI로 Dispatcher 직접 실행 검증(세 방식 슬롯 반환, fr→unsupported_lang)
- 미검증: 실제 Safari 로드, sendNativeMessage 왕복(GUI 필요)
- 컨테이너 앱: 확장 활성화 버튼, 언어팩 상태·설치, Apple Intelligence 상태

## T9 완료 (PDF 뷰어)
- `extension/vendor/pdfjs`(pdfjs-dist 6.4.299, 4.2MB), `viewer/{pdfseg.js,viewer.html,viewer.js,viewer.css}`, 테스트 163개 전체 통과
- 미검증: Safari에서 viewer.js 실행(문법 검사만), pdfjs 6.x의 Promise.try·Uint8Array.toHex 지원(Safari 18.2+ 추정)
- 한계: 다단·하이픈 휴리스틱, JPX/JBIG2 wasm 미포함, 세로쓰기 미지원

## 모델 다운로드 완료 (15:30)
- MLX 10, CT2 4(+opus 원본), Ollama 3(translategemma:4b, qwen3.5:2b, qwen3:1.7b) 전부 성공. 총 bench/models + HF 캐시
- bench/orchestrate.mjs: 모델별 서버 기동·모니터·run·종료 (mlx.mjs는 default_model 사용으로 이중 로드 방지)
- 진행: Apple 엔진 1차 실행 → 이어서 orchestrate로 나머지 모델

## Opus 확인 필요
- (T9) 뷰어가 문서에서 최대 20쪽 표본으로 반복 머리글·언어 판정, 문맥은 "같은 쪽 앞 문단" 대신 연속 문단 배치 — PLAN §4.8 변형 허용 여부
- (T9) pdfjs 6.x가 Safari 최소 버전을 18.2+로 올림 — 배포 대상(macOS 26.4+)에서는 충족
- (T8) FM 시스템 프롬프트 [출력 형식] 단락이 prompt.js와 다름(guided generation 스키마 때문). GUIDELINES "문구 동일" 규칙과 상충 — 허용 여부 확인
- (T8) 요청 lang이 "zh"만 오면 간체로 처리(블록 lang 우선). 필요 시 content에서 zh-Hans/zh-Hant 판별 전달
- (T3) content 쪽 자체 캐시와 background 캐시 이중 구조 — 유지해도 무방(교체 노드 즉시 적용 목적). 역할 분담 확인
- (T3) SPA URL 감지: Safari content script 격리 월드라 pushState 래핑 불완전 → popstate/hashchange/변이 틱 비교 병행
- (없음)
