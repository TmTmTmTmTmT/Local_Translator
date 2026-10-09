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

## 메모리·압력 모니터 강화 (사용자 요청)
- monitor.sh sys 행에 압력단계(kern.memorystatus_vm_pressure_level 1/2/4), 스왑 사용량 MB, swapins, 압축 메모리 페이지 추가. summarize 리포트에 `압력/스왑사용/swapin/압축` 열 추가. 이전 CSV는 해당 값 '-'
- 현재 머신 기준선: 다른 앱 때문에 이미 스왑 ~2.6GB 사용(swapusage 4GB 중), free 36%, 압력 1(정상). 판정은 엔진 실행 중 증가분(Δ)과 압력 단계 변화로 본다
- 이후 재측정 대상(압력 데이터 필요): 최종 후보 엔진은 `--idle-wait 300`과 usage-sim 시나리오로 재측정

## Apple MT 속도 실험 (bench/apple-speed/FINDINGS.md)
- 단일 번역 29블록(en) ~50초(블록당 ~1.7초, 글자당 ~13~14ms). 배치 API(translations/translate(batch:))·세션 병렬(2/4/29동시)·AttributedString 모두 개선 없음(시스템 번역 서비스가 직렬 처리). 확장 EngineMT 변경 없음
- 시사점: Apple MT만으로 "첫 화면 <1초" 불가. 보이는 블록 우선(이미 IO로 구현), translate(batch:) 스트리밍(첫 결과 1.46초), 세션 예열이 현실적 완화책(미구현)
- 속도 기준 로컬 대안: ct2 NLLB-600M(~0.25초/블록, RSS ~2GB, 슬롯 100%), Hy-MT2-1.8B mlx MT모드(~0.7초/블록, 슬롯·x 100%, ~1.4GB). 임시 결론: 기본 엔진은 설치 없이 동작하는 apple-mt 유지, 속도/품질 상위는 로컬 서버 엔진을 옵션으로 제공 (D1 사용자 최종 결정)

## PDF 뷰어 실브라우저 e2e + 수정 (tests/e2e/pdf-harness.html, sample.pdf)
- 확인: pdf.js 6.x ESM 로드·워커·캔버스 렌더, 문단 2개/쪽 분리, 반복 머리글·쪽번호 제거, 번역 호출·적용, 링크 영역(x) 원문 유지
- 버그 수정: pdf.js 6.x에 PageViewport.convertToViewportRectangle 없음 → 링크 오버레이가 안 만들어짐 → 변환 행렬로 직접 계산(`toViewportRect`). 링크 오버레이 정상(href·target=_blank·rel)
- 렌더·번역 오류를 삼키던 catch에 console.error 추가
- 환경 메모: 내장 브라우저 창이 숨김 상태면 IntersectionObserver·rAF 정지 → 하네스에서 즉시 교차·setTimeout rAF로 대체(실제 Safari 영향 없음)

## 콘텐츠 스크립트 용량 정리
- 기본 주입(lib/josa+content 5개) 45.9KB → 34.2KB (content/*.js 31.6KB). lib/lang.js 제거(text.js 내장 detectLang), 속성 번역은 content/extra.js로 분리(translateAttrs 켤 때만 주입). 목표 30KB 미달 4.2KB → D14로 이관(DoD 해석 or 선택 주입 확대)
- translateAttrs 옵션 UI 없음(storage에 직접) → 옵션 UI 추가 예정

## 내장 브라우저 harness 재검증 (trim 후) — 보류
- 증상: trim 후 harness.html에서 로드 시 보이는 블록(h1, p1)이 번역 호출 안 됨, 스크롤로 들어온 p5만 번역(호출 kt8). 단위 테스트 231 통과(jsdom, 첫 로드 번역 포함)
- 추정: harness 환경 문제 — 창이 숨김이고 에뮬레이션 뷰포트가 턴 종료 시 해제되어 innerHeight=0 → 폴링 IO 스텁이 rect.top < innerHeight*2.5 판정 실패. 실제 코드 회귀 아님 가능성 높음. 사용자가 browser 도구 호출을 거부한 상태라 재확인 보류(허용 시 재시도: harness.html?r=…, 뷰포트 설정 후 3초 대기)

## 최종 후보 재측정·결정 자료 완료
- final_pass 완료: Apple marker 4언어, nllb-600m·hy-mt2-mt·translategemma-mt 재측정(새 모니터). summarize가 matrix 모니터 CSV 인식하도록 수정
- 모니터 한계: 서버 기동 후 baseline을 잡아 "추가 RSS" 열은 서버 자체를 못 잡고 무관한 프로세스가 섞임 → 서버 프로세스 RSS(orchestrate.log peakRssMb)를 주 지표로 사용(DECISION_BRIEF)
- 산출: bench/DECISION_BRIEF.md, bench/rate/rate-{en,ja,zh-Hans,zh-Hant}.html (후보 6개 블라인드)
- GitHub push가 17:55부터 Internal Server Error(원격 일시 장애 추정) — 로컬 커밋 유지, 재시도 필요

## 최종 상태 (2026-10-08)
- PLAN §6 구현 항목 전부 완료(테스트 233 통과, Xcode ad-hoc 빌드 성공). 남은 것은 사용자 결정·실기 확인뿐 → DECISIONS.md
- 사용자 결정: D1 엔진(블라인드 평가 `bench/rate/rate-*.html`, 자료 `bench/DECISION_BRIEF.md`), D2 언어별 엔진, D3 문맥 모드, D4 GPU 전력, D5 언어팩·Apple Intelligence, D6/D10 서명, D7 PDF 자동 진입, D8 NC 라이선스 모델, D9/D12 repo 라이선스, D11 lowLatency, D13 Bergamot, D14 용량 DoD
- 실기 확인(Safari): 서명 안 된 확장 허용 → 확장 로딩 → sendNativeMessage 왕복 → 실제 사이트 번역·PDF 수동 버튼. README 절차
- 미해결: 내장 브라우저 harness 재검증 보류 (GitHub push 오류는 해소, origin/main 동기화)

## D1 영어 기사 평가 준비 (2026-10-08)
- 사용자 요청: 평가 페이지 영어만, the-race.com류 기사 중심. 자체 작성 모터스포츠 기사 코퍼스 `bench/corpus-articles/en.json`(26블록: 제목·리드·본문·인용·링크 문장·캡션·관련기사)
- 첫 실행 실패: orchestrate.mjs가 `--corpus-dir`를 run.mjs로 넘기지 않아 기존 코퍼스로 측정됨 → 결과 폐기, FIX_GUIDE F1 작성 → 수정 완료(runMjsArgs corpusDir 전달, 테스트 233 통과, nllb-600m로 26블록 확인). 전체 en 재실행 완료(results-articles/, apple-mt-marker/plain/fm 포함). 평가 페이지 `bench/rate/rate-articles-en.html` 생성(엔진 20개·26블록, 오류 ≤2 엔진만; JSON 슬롯 방식 실패 엔진·apple-fm(7오류) 제외). 평가 결과 저장 대기 → `bench/results-articles/ratings-en.json`

## T11–T13 (2026-10-08, PLAN §11)
- **T11 완료**: apple-mt-marker vs plain 26블록 출력 100% 동일 → 평가 점수 차(2.98 vs 2.65)는 같은 출력에 대한 평가 편차(블라인드 라벨별 ±0.3). variant 결정 근거 없음 → marker 유지(링크 어순 근거 §4.3).
- **발견(Opus 확인 필요)**: `bench/corpus-articles/en.json` 링크 블록에 `x` 항목이 0개. 생성 스크립트가 `("텍스트")`를 튜플로 착각해 링크가 일반 `t` 슬롯이 됨(art-link-*, art-nav-*, art-cta-01, 앞뒤 공백도 누락). 결과: 이번 D1 평가는 링크 문장 처리(marker/MT 표식)를 검증하지 못함. 순위 자체(일반 문장 품질)는 유효. 수정=코퍼스 데이터 정정 + 해당 6블록 재번역·재평가(사용자 평가 필요) — 진행 여부는 Opus/사용자 판단. → **Opus 판단(FIX_GUIDE F2)**: 전체 재평가 안 함. 코퍼스 정정 + validateCorpus 링크 규칙 + Apple/TG 3엔진만 링크 6블록 재측정·소형 확인 페이지.
- **T13 완료**: `extension/lib/glossary.js`(사전 치환·힌트·캐시키) + background 연동(빈 용어집이면 기존 캐시 키와 동일) + `context.glossary`로 chat 계열 프롬프트 힌트(hymt2/translategemma 템플릿 불변) + 옵션 화면 `원문 => 번역` 편집. 테스트 248 통과(신규 15). 범위 외/미구현: apple-fm Swift 쪽 힌트(사전 치환만 적용됨), 사이트별 용어집.
- **T13 벤치 프로브**(`bench/glossary-probe/`, 용어 5개·적용 블록 4개): apple-mt-marker 5/5 용어 반영·문장 정상, gemma4-e2b-mt 5/5, mlx-translategemma-mt 4/5(kerbs를 "트랙을 벗어나지"로 의역해 누락). 한국어 훼손·음차 없음 → 중단 조건 미해당.
- **T12 완료(코드)**: 옵션 화면 TranslateGemma 프리셋 버튼 + 메모리 안내, README "고품질 번역(선택)"·"용어집" 절(사용자용).

## F2 링크 6블록 재측정 (2026-10-08)
- 코퍼스 정정(x 7개) + `validateCorpus` 링크 규칙(테스트 249 통과). 재측정: `bench/link-recheck/` (apple-mt-marker, mlx-translategemma-mt, ollama-translategemma-mt, 6블록).
- 자동 지표: 3엔진 모두 6블록 슬롯 존재·x 원문 유지(TG는 xPreserved=true)·잘림/이중공백/가장자리공백 없음. 폴백 블록 수는 결과 파일에 기록 안 돼 집계 불가(mtmode stats 미저장 — 필요하면 Opus 판단).
- 육안 비교(수치 아님): Apple은 링크 뒤 조사·어순 자연(Verhoeven을, Marco Delacroix는). TG는 조사 누락/어색(mlx link-03 "race report and driver ratings 지금", link-01 인용부호 위치 이상; ollama link-01 "Marco Delacroix 그들은", link-03 "영상" 추가). → 링크 문장은 Apple 우위. 사용자 평가 페이지 `bench/rate/rate-links-en.html`(6블록×3엔진) 준비, 결과 저장 시 `bench/link-recheck/ratings-en.json`.

- **F2 종결(Opus)**: 사용자 평가 평균 Apple 4.33, TG ollama 4.42, TG mlx 4.33 → 차이 없음. 현행(Apple 기본 + TG 옵션) 유지. 폴백 통계 저장 불필요.

## 결정 D2–D14 반영 (2026-10-08)
- 반영 완료: D7 pdfAuto 기본 ON(테스트 수정), D8 NC 모델(NLLB·EXAONE) bench/models.json 28개로 축소(테스트·스크립트·CANDIDATES), D14 PLAN §7 gzip 기준(측정 gzip 13.9KB), D2·D3·D5·D13 현행 유지, D9/D12 라이선스 없음. 테스트 249 통과.
- 사용자 작업 대기: D4 powermetrics 2개 측정(bench/powermetrics.md), D6/D10 Apple ID 추가 + Team ID 전달.
- Opus 계획 필요: D11 lowLatency (컨테이너 앱에 lowLatency 언어 모델 준비 화면 필요).

## T14–T16 서명·설치 (2026-10-08, PLAN §12)
- **T14**: 배포 대상 26.0. 베타 SDK(27.2)로 빌드해 보니 26.4 전용 API는 `attr` variant(`TranslationAttributes`, `translate(AttributedString)`)뿐 → `#available(macOS 26.4)` 분기, 그 아래는 marker 폴백. 나머지 Translation/FoundationModels API는 26.0에서 가용(`init(installedSource:target:)` 26.0). 빌드 성공.
- **T15**: `scripts/install.sh`(--dry-run/-y/--no-open). 팀 ID 자동 탐지(이 머신: Apple Development 인증서 OU로 K3YUPJD653 탐지) → Release 팀 서명 빌드 → 앱·appex `TeamIdentifier` 검증 → 옛 사본(mdfind + pluginkit 등록 경로, /tmp 포함)을 휴지통으로 → `/Applications` 설치. 실제 실행 2회 성공(`codesign`: 앱·appex 모두 TeamIdentifier 있음, pluginkit 등록은 /Applications 한 곳). 테스트 3개 추가(252 통과).
- **T16**: 컨테이너 앱 서명 상태 표시(팀 서명/ad-hoc/미확인), README 설치 절 교체(사용자용), xcode/README 갱신.
- **사용자 확인 대기(Safari 실기)**: Safari › 확장 프로그램에서 Local Translator 켜기 → Safari 종료·재시작 2회 후 확장이 유지되는지(“서명되지 않은 확장 허용”은 끈 상태로). 유지 안 되면 Opus 보고.

## F4/F3 (2026-10-08) — Safari 실사용 오류 대응
- **F4**: Safari가 background/content 스크립트를 charset 없이 읽어 한글·CJK 리터럴이 깨짐(`range out of order`, glossary.js·localhost.js). background·content 경로 JS 19개의 코드 속 비ASCII를 `\uXXXX`로 변환(`scripts/escape-nonascii.mjs`, 렉서 `scripts/lib/jslex.mjs`, 주석 제외·왕복 검증 일치), 가드 테스트 `tests/ascii-only.test.mjs`.
- **발견·수정**: `manifest.json` background scripts에 `engines/common.js`가 빠져 있었음(엔진이 `KT.engines.common` 의존) → 추가, 순서 테스트 추가. 부분 번역 증상의 원인 후보였음.
- **F3**: install.sh가 실행 중 앱 종료·Safari 실행 중 안내, 앱의 `SFErrorDomain 1` 안내 문구.
- 테스트 257 통과, 재설치 완료(설치본 코드 비ASCII 0). **사용자 재확인 대기**: Safari ⌘Q 후 재실행 → 오류 창 사라짐, the-race.com 본문 번역 여부. 여전히 부분 번역이면 Safari 콘솔 로그 요청(FIX_GUIDE F4).

## 실사용 검증 루프 (docs/GOAL_PROMPT.md, docs/TEST_LOOP.md, docs/BUGS.md)
- **R1 (2026-10-08)**: 탐색 — 하네스로 the-race.com 남은 영어 85개 전부 링크 안(B1). Opus F5(링크로만 된 블록 번역, D15 임시 결정)·F6(jsdom 사이트 커버리지 도구). Sonnet 병렬 구현, 테스트 268 통과. Haiku 확인 — the-race 남은 0, wiki/mdn/hn 남은 것은 의도된 인라인 링크·코드, bbczh 1, NHK 50 미번역(B2 조사 중). T3·T9·T10 통과. install.sh 재설치(팀 서명·단일 등록 확인).

- **R2**: B2는 측정 도구 문제(select/option·SVG = 의도된 제외) → F7 도구 보정. B3 일본어 한자-only 블록 zh 판정 → F8 페이지 lang 힌트·문서 다수결(NHK zh 67→10). 테스트 272 통과, 재설치. PDF 하네스에서 링크 구간 단어 중간 절단 발견(B4, 조사 중).

- **R3**: B4 PDF 링크 구간 단어 절단 → F9(픽스처 rect 재생성 + 단어 경계 스냅), B5 옵션 오류 칸 구분 → F10, B6 팝업 모드 라벨 → F11(getMode). 하네스 3종 확인, 테스트 278. Safari 실기(사용자): 재시작 1회·옵션 유지·원문 토글 통과, 번역 불가(B7).
- **R4**: B7 원인 = Safari 실행 중 재설치로 옛 플러그인 고정(로그 `No such plugin`/`Other version in use`) → F12(install.sh가 Safari 실행 중 중단, needs_safari_restart 코드·팝업 안내). 테스트 283, --allow-safari-running 재설치 완료. 사용자 Safari 재시작 후 실기 재확인 대기.

- **R5**: F13 실엔진 하네스(Apple 브리지) — 기사 122블록 번역, 링크 원문 유지, 하이픈 붙은 링크 어순 어색(D16 알려진 한계). Opus Safari 스크린샷: 짧은 라벨만 번역·배지 "!"(B9).
- **R6**: B9 원인 = 40블록 배치 > 45초 기한 → 타임아웃 → 브레이커(로그·코드). F14: MT 배치 10블록·동시 1, Swift 기한 min(120,15+3×블록), 기한 시 부분 결과 반환, 진행 0인 실패만 브레이커, 진단 로그(텍스트 미기록). 테스트 284, 빌드 성공, 재설치(14:46 UTC). Safari 재시작 후 실기 확인 대기.

- **R7**: Safari 실기(Opus 스크린샷·appex 로그) — F14 후 요청 전부 성공(10블록 6~15초, timeout 0), 헤드라인·카드 번역, 용어집 "포뮬러 원" 적용(T7 S 통과). B10(헤더 링크 2개가 한 블록 → 버튼 텍스트 소실) → F15 앵커별 블록 분리, 테스트 288. 재설치는 사용자 실기 확인 끝난 뒤(약속).

- **R8**: 실엔진 하네스 ja/zh/HN 오류 0. B10 수정 설치(14:56 UTC).
- **R9**: 사용자 "새로고침 후 번역 안 됨"(B11) — 로그상 정상 진행이나 느림·위쪽 나중. F16: 뷰포트 우선·문서 순, 첫 요청 4블록·이후 10블록/1500자, background 세마포어 우선순위, 팝업 "번역 중… (남은 N블록)". 테스트 294, 재설치(01:55 UTC). Safari 재시작 후 실기 확인 대기.

- **R10**: Safari(사용자): 재시작 OK, 5초 내 번역 시작, 헤더 분리(B10 fixed), 남은 9블록 정체(B12)·HN 진행 안 됨(B13)·PDF 자동 진입 실패(B14). F17(.pdf 없는 PDF URL: HEAD content-type 확인, onCommitted/tabs.onUpdated 보강), F18(프레임별 pending·이동 시 초기화·즉시 0 보고·요청/엔진 상한 타임아웃). 테스트 306, 재설치(02:10 UTC).
- **R11**: 사용자 요청으로 고품질(Ollama TranslateGemma) 검증 — F19 하네스(확장 엔진 코드+실제 Ollama): 4사이트 오류 0, 블록당 0.5~0.9초. B15(링크 많은 메타 줄 깨짐) → F20 구간별 번역(JS+Swift)·F20b 빈 괄호 제거. 테스트 308. 설치는 사용자 Safari 확인 후.

- **R12**: Safari(사용자): the-race 즉시 번역(B12 fixed), arxiv 빈 탭(B14 still), 고품질 "엔진 사용 불가"(B17). B17 원인 = Ollama가 safari-web-extension 출처 CORS 403(curl 재현) → F21 네이티브 루프백 HTTP 대리(URLSession, 루프백·크기·시간 제한, 리다이렉트 거부, 확장 타깃 network.client). B14 → F22 onCommitted만·새 탭 열고 원탭 닫기·오류 로그. 테스트 319, 재설치(02:35 UTC).

- **R13**: Safari: PDF 자동 진입 새 탭 뷰어(B14 fixed), 고품질 번역 동작(로그 57건 200, B17 fixed), 체감 속도 느림 → D18 사용자 결정(DeepL 옵트인 + 로컬 병렬화).
- **R14**: F23 로컬 병렬(측정: N=1→4 블록당 996→909ms, Ollama 서버가 사실상 직렬 — 효과 ~10%, 기본 4), F24 DeepL 엔진(XML 태그로 링크 원문 유지, 키는 storage.local만, Safari CORS 시 네이티브 https 허용목록 대리). 테스트 336, 재설치(02:49 UTC). 실제 DeepL 호출은 사용자 키 필요.

- **루프 종료 판정(Opus, 2026-10-09)**: TEST_LOOP T1~T12 전부 통과(근거 H/H-real/U/S 기록), BUGS open 0(B11·B13 보류=엔진 처리량, D18/D19; B15 잔여·하이픈 링크=D16 한계), DeepL 실사용 확인은 사용자 키 필요(D20). 테스트 336, main 병합 완료.

## Opus 확인 필요
- (T9) 뷰어가 문서에서 최대 20쪽 표본으로 반복 머리글·언어 판정, 문맥은 "같은 쪽 앞 문단" 대신 연속 문단 배치 — PLAN §4.8 변형 허용 여부
- (T9) pdfjs 6.x가 Safari 최소 버전을 18.2+로 올림 — 배포 대상(macOS 26.4+)에서는 충족
- (T8) FM 시스템 프롬프트 [출력 형식] 단락이 prompt.js와 다름(guided generation 스키마 때문). GUIDELINES "문구 동일" 규칙과 상충 — 허용 여부 확인
- (T8) 요청 lang이 "zh"만 오면 간체로 처리(블록 lang 우선). 필요 시 content에서 zh-Hans/zh-Hant 판별 전달
- (T3) content 쪽 자체 캐시와 background 캐시 이중 구조 — 유지해도 무방(교체 노드 즉시 적용 목적). 역할 분담 확인
- (T3) SPA URL 감지: Safari content script 격리 월드라 pushState 래핑 불완전 → popstate/hashchange/변이 틱 비교 병행
- (없음)
