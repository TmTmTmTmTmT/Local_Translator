# 엔진 결정 자료 (D1)

측정 환경: M1 Pro 16GB, macOS 27.2, 코퍼스 29블록×4언어. 상세 표는 [REPORT.md](REPORT.md). 아래 수치는 서버 프로세스 RSS(`orchestrate.log`)와 블록당 warm 지연 기준. 메모리 압력은 다른 앱 영향이 커서 참고값(기준선: 이미 스왑 ~2.6GB 사용).

| 엔진 | 블록당 | 슬롯·링크 보존 | 서버 메모리 | 설치 | 유휴 해제 | 비고 |
|---|---|---|---|---|---|---|
| **apple-mt (marker)** | ~1.7초 | 100% | 시스템 관리(별도 서버 없음) | 언어팩만 | 시스템 관리 | 배치·병렬로도 빨라지지 않음(시스템 서비스 직렬). 보이는 블록 우선으로 완화 |
| **ct2 NLLB-600M** | ~0.25초 | 100% | ~1.6–2.0GB | CT2 서버 + 모델 변환 | `--idle-unload-sec` 지원 | 가장 빠름. 번역문 자연스러움은 평가 필요. 라이선스 CC-BY-NC(개인용) |
| ct2 NLLB-1.3B | ~0.45초 | 100% | ~3.1GB | 〃 | 〃 | 메모리 초과 |
| **mlx Hy-MT2-1.8B (MT모드)** | ~0.7초 | 100% | ~0.8–1.5GB | `mlx_lm.server` + 모델 | 서버가 자동 해제 안 함(서버 종료로 해제) | 4개 언어 안정. Apache-2.0 |
| mlx TranslateGemma-4B (MT모드) | ~1.2초 | 100% | ~2.9GB | 〃 | 〃 | 메모리 큼 |
| ct2 MADLAD-3B | ~1.9초 | 100% | ~5.8GB | 〃 | 〃 | 예산 초과(참고) |
| 범용 소형 LLM (Qwen/Gemma3/Kanana, MT모드) | 1–5초 | 100% | 1.2–1.6GB | 〃 | 〃 | 영어 외 미번역 많음 → 제외 |
| Apple 온디바이스 AI | 5초+ | 일본어·중국어 거의 실패 | 큼 | Apple Intelligence | 60초 | 제외 |

## 임시 선택 (평가 전)
- 기본: **apple-mt (marker)** — 설치 불필요. 느림은 보이는 블록 우선·캐시로 완화.
- 로컬 서버 옵션(설정에서 선택): 속도 **NLLB-600M**, 품질·균형 **Hy-MT2-1.8B**.

## 사용자 평가 방법
1. `bench/rate/rate-en.html`, `rate-ja.html`, `rate-zh-Hans.html`, `rate-zh-Hant.html`을 Safari에서 열기 (오프라인, 엔진 이름 숨김).
2. 블록마다 후보(A–F)의 자연스러움·정확성 1–5, 최선 1개 선택 → "결과 다운로드".
3. 내려받은 JSON을 `bench/results/ratings-<lang>.json`으로 저장 → `node bench/summarize.mjs`가 리포트에 엔진별 평균을 반영.
4. 결과로 `DECISIONS.md` D1/D2(언어별 엔진) 확정 → 설정 기본값(`extension/background.js` DEFAULT_SETTINGS.engine) 변경.

## 아직 측정 못 한 것
- GPU/ANE 전력(`sudo powermetrics`, [powermetrics.md](powermetrics.md))
- 후보 엔진의 5분 유휴 후 메모리 해제·실사용 시나리오(30초 간격 5분)의 압력 변화 — 새 모니터(압력단계·스왑·압축)로 `node bench/orchestrate.mjs --only <엔진> --idle-wait 300` 실행
