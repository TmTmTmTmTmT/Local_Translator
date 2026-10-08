# D1 영어 기사 블라인드 평가 결과 (2026-10-08)

자료: `bench/rate/ratings-en.json` (26블록 × 20엔진, 1~5점), 코퍼스 `bench/corpus-articles/en.json`, 성능 `bench/results-articles/orchestrate.log`·`run.log`.
시간은 26블록 1회 실행 전체(모델 로드 포함), 메모리는 서버 프로세스 최대 RSS(ollama는 `ollama ps` 상주 크기).

## 상위 엔진

| 순위 | 엔진 | 평균(자연/정확) | 최고 선택 | 4점↑ | 1점 | 26블록 시간 | 메모리 |
|---|---|---|---|---|---|---|---|
| 1 | mlx-translategemma-4b (MT) | 3.38 (3.42/3.35) | 5 | 13 | 2 | 35s | ~2.9GB |
| 2 | ollama-gemma4-e2b (MT) | 3.29 | 5 | 10 | 0 | 196s | 7.0GB |
| 3 | ollama-translategemma-4b (MT) | 3.19 | 4 | 9 | 1 | 39s | 2.9GB |
| 4 | ollama-gemma4-e2b (JSON) | 3.19 | 1 | 10 | 1 | 73s | 7.0GB |
| 5 | mlx-gemma-4-e2b (MT) | 3.10 | 1 | 10 | 3 | 229s | 3.3GB |
| 6 | ct2-madlad-3b | 3.06 | 3 | 9 | 2 | 66s | 6.6GB |
| 7 | **apple-mt-plain** | 2.98 | 1 | 7 | 1 | 56s | 시스템(추가 설치 없음) |
| 8 | mlx-hy-mt2-1.8b (MT) | 2.77 | 0 | 7 | 3 | 25s | 1.5GB |
| 11 | **apple-mt-marker** (현재 기본) | 2.65 | 2 | 7 | 3 | 58s | 시스템 |
| 12 | ct2-nllb-600m | 2.62 | 0 | 5 | 4 | 13s | 2.6GB |

탈락(평균 ≤1.83): qwen3/3.5 소형, hyperclovax 1.5b, gemma-3-1b, kanana-2-3b, opus-tc-big(전부 1점). translategemma JSON 방식은 링크 블록 슬롯 누락(6블록).

## 해석
- 품질 1위는 TranslateGemma 4B(MT 모드). 속도도 빠름(블록당 ~1.3s, 로드 포함). 다만 메모리 ~2.9GB로 기존 요구(추가 ≤1.5GB)를 넘고, 사용자가 "Gemma급은 무겁다"고 했던 범주.
- Gemma4-e2b는 품질 상위지만 7GB·느림 → 제외 권장.
- 1.5GB 이내 후보는 Hy-MT2 1.8B뿐인데 Apple 번역(설치·추가 메모리 없음)보다 낮음 → 로컬 경량 모델의 이점 없음.
- Apple plain(2.98) > marker(2.65): 링크 없는 블록은 두 방식 출력이 같아야 하므로 점수 차의 상당 부분은 평가 편차로 추정. 링크 문장 3개에서는 marker 4/4·2/1·3/3, plain 3/4·3/3·5/4로 plain이 나쁘지 않음. 출력 동일 여부 확인 필요(Sonnet 작업).
- 공통 약점: 모터스포츠 용어(kerbs→연석, safety car→세이프티카, undercut 등). 용어집(glossary) 기능이 엔진 교체보다 효과적일 수 있음.

## 권장안 (사용자 결정 필요)
- **A. 기본 = Apple 번역 유지**, 고품질 옵션 = TranslateGemma 4B(MT, mlx 또는 ollama). 설정에서 선택. ← 권장
- B. 기본 = TranslateGemma 4B (설치 필요, ~2.9GB 상주, 유휴 시 언로드)
- C. Apple 번역만 (로컬 모델 지원은 옵션으로만 남김)

추가 확인 항목:
1. Apple marker vs plain 출력 비교 → 기본 variant 결정
2. 모터스포츠 등 사용자 용어집 기능을 계획에 넣을지
3. ja/zh는 이번 평가 제외 → 기존 결과(DECISION_BRIEF) 기준으로 Apple 유지할지
