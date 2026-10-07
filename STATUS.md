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

## T0.7 Apple 1차 결과 (16 실행, 완료)
- apple-mt-plain/attr: 4개 언어 모두 오류 0. 문서 1개(29블록) 총 49~76초(블록당 ~2초) — 목표(첫 화면 <1s) 대비 느림, 단 다운로드·다른 작업 동시 실행 중 측정이라 2차에서 재측정
- 링크(x) 낀 문장: plain은 x 경계 분할 번역이라 어색("클릭 [here] 계속하기 위해."), attr은 일부 깨짐("기를 ."). → 마커 방식(문장 통째 번역 후 마커로 슬롯 복원) 시험 작업 진행 중(a137…)
- apple-fm: en OK(121초), ja/zh는 4096토큰 초과로 블록 대부분 실패 → CJK는 배치 축소 + 배치마다 새 세션 + 초과 시 반분 재시도 필요(마커 작업 끝난 뒤 FM.swift·EngineFM.swift 수정)
- apple-mt-*-lowlatency: needs_language_pack — lowLatency 전략은 별도 설치 모델 필요(미설치). 후보에서 제외, D5에 추가
- 참고: Haiku 요약의 "ms" 표기는 초 단위 오기(55226ms = 55초)
- 진행: orchestrate로 나머지 모델 1차 실행 중(abde…)

## 마커 방식·FM 수정 (완료)
- 마커 프로브(6종, 15블록×3언어): ⟦n⟧ 포함 5종 생존율 100%. 채택 ⟦n⟧(페이지 원문에 안 나옴). `apple-mt-marker` 벤치 엔진 + 확장 `EngineMT` marker 변형 추가, **핸들러 기본값을 marker로 변경**. 링크 문장 예: "계속하려면 [here]을 클릭하세요."(기존 "클릭 [here] 계속하기 위해")
- FM: 배치마다 새 세션, CJK 배치 600자, 초과 시 반분 재시도(확장), 벤치도 동일 적용. Xcode 빌드 성공
- 대기: orchestrate(타 모델) 종료 후 apple-fm ja/zh 3종 + apple-mt-marker 4종 재실행

## 일시 중지 (사용자 요청, 충전기 연결 후 재개)
- 모든 벤치 프로세스·서버·모니터 종료. 완료: Apple 16 + marker 2 + mlx(hy-mt2, translategemma, qwen3.5-2b, qwen3-1.7b) + ollama-qwen3.5-2b + ct2(nllb 1.3b/600m, madlad-3b, m2m100) 일부. 중간에 끊긴 엔진 결과는 불완전 가능 → 재실행
- 재개 명령: `node bench/orchestrate.mjs --only all --langs en,ja,zh-Hans,zh-Hant --runs 1 --skip-existing`
- 이후: apple-fm ja/zh 3종·apple-mt-marker 4종, opus-mt 변환(torch 필요 — 설치 승인 필요), summarize, 2차(속도·자원)

## 메모 (재개 시 반영)
- sim-runner(Haiku)의 마지막 요약은 시간 단위·완료 여부가 부정확(ms/초 혼동, 중지 후 "완료" 보고). 수치는 `node bench/summarize.mjs` 결과로만 판단
- 관측: mlx-hy-mt2-1.8b, translategemma-4b는 JSON 슬롯 출력이 거의 실패 → 번역 특화 모델은 JSON 대신 모델 고유 평문 프롬프트(마커 방식으로 x 처리)로 어댑터 변경 필요. qwen3-1.7b는 ja/zh에서 오류 다수, 하드 조건 후보는 NLLB 계열(en 기준)
- Ollama 메모리는 runner 프로세스 기준으로 재측정 필요(ollama serve RSS만 잡힘)

## 오픈소스 조사 (docs/RESEARCH.md)
- 결론: GPL/AGPL/FSL 코드는 복사 금지(영감만). Koine(Safari+Apple Translation)은 JS Apache-2.0·Swift FSL → 아이디어만 재구현. Mozilla Bergamot 모델(MPL-2.0, en→ko/ja 확인, ja/zh→ko 없음)은 벤치 후보 추가 검토(제안 5, 보류)
- 적용 진행: (1) Apple 세션 하드닝(가용성 캐시·타임아웃·서킷브레이커·유휴 해제) (2) DOM 병합 변이·속성 번역 옵션 (3) 한국어 조사 후처리 lib/josa.js. 보류: PDF 구획 규칙 개선(4), Bergamot 벤치(5)
- background.js content 스크립트 목록에 lib/josa.js 추가 필요(작업 완료 후 반영)

## 오픈소스 적용 완료 (2026-10-07)
- Apple 세션 하드닝(가용성 30초 캐시·타임아웃 45/90초·서킷브레이커·세션 8개 상한·유휴 해제·비정상 메시지 방어), 확장 기본 MT 변형 marker(README 정정)
- 한국어 조사 후처리 `lib/josa.js`(x 뒤 조사 받침 맞춤), DOM 변이 병합·조상 중복 제거·자기 쓰기 메트릭, 속성 번역 옵션 `translateAttrs`(기본 꺼짐), `[role=code]` 제외
- background CONTENT_JS에 lib/lang.js, lib/josa.js 추가. bench/prompt.json에 조사 규칙(6) 동기화
- 테스트 196 통과. 미검증: Safari 실제 동작
- 알려진 초과: content/*.js 38.9KB(목표 30KB 초과, 기존에도 33KB). 압축 시 문제 없으나 정리 필요 시 main.js 분리

## 실브라우저 e2e (내장 브라우저, 모의 번역기, tests/e2e/harness.html)
- 확인(모두 정상): 링크 텍스트·href·code·pre·translate=no·input 값 불변 / 문장 중간 링크 슬롯 분할 / 스크롤 지연 번역 / 접힌 details는 펼쳐져 화면에 보일 때 번역 / "더보기" 추가 노드(p·section+링크) 자동 번역 / 페이지가 원문으로 되돌리면 캐시로 즉시 재적용 / 교체된 노드 캐시 적용 / 조사 보정(Latin 링크 뒤는 병기 유지)
- 설계상 동작: 화면 위쪽(뷰포트 밖)에 추가된 노드는 보일 때 번역(IntersectionObserver rootMargin은 아래쪽만 확장)
- 실행: `python3 -m http.server 8731` 후 tests/e2e/harness.html 열기 (엔진은 모의, Safari 네이티브 경로는 미검증)

## 재개 후 다시 중지 (17:20)
- 충전기 연결 후 재개했으나 17:20 시점 배터리 24% 방전 중(잔여 27분) → 벤치마크 중지
- 이번 재개에서 완료: ollama-qwen3-1.7b, mlx-qwen3.5-4b, mlx-exaone-4.0-1.2b (mlx-kanana 등 남음)
- 남은 벤치: kanana, gemma-3-1b, gemma-4-e2b, hyperclovax, ollama-gemma4(e2b/e4b), *-mt 3종(orchestrate.mjs args 지원 수정 후), opus(torch 설치), Apple fm ja/zh·marker 재실행

## 확장 로컬 MT 엔진 포팅 완료
- `extension/engines/mtmode.js`(hymt2/translategemma/chat, ⟦n⟧ 마커), `local:mt-ollama`·`local:mt-mlx` 엔진, 옵션 UI(family·keep-alive), 테스트 224 통과
- 한계: localhost.baseUrl 하나를 모든 localhost 엔진이 공유(MLX는 8080 직접 지정 필요) — 엔진별 URL 분리는 설정 구조 변경이라 Opus 확인 필요
- chat family 프롬프트는 확장판과 bench 판을 나중에 맞춤

## Opus 확인 필요
- (T9) 뷰어가 문서에서 최대 20쪽 표본으로 반복 머리글·언어 판정, 문맥은 "같은 쪽 앞 문단" 대신 연속 문단 배치 — PLAN §4.8 변형 허용 여부
- (T9) pdfjs 6.x가 Safari 최소 버전을 18.2+로 올림 — 배포 대상(macOS 26.4+)에서는 충족
- (T8) FM 시스템 프롬프트 [출력 형식] 단락이 prompt.js와 다름(guided generation 스키마 때문). GUIDELINES "문구 동일" 규칙과 상충 — 허용 여부 확인
- (T8) 요청 lang이 "zh"만 오면 간체로 처리(블록 lang 우선). 필요 시 content에서 zh-Hans/zh-Hant 판별 전달
- (T3) content 쪽 자체 캐시와 background 캐시 이중 구조 — 유지해도 무방(교체 노드 즉시 적용 목적). 역할 분담 확인
- (T3) SPA URL 감지: Safari content script 격리 월드라 pushState 래핑 불완전 → popstate/hashchange/변이 틱 비교 병행
- (없음)
