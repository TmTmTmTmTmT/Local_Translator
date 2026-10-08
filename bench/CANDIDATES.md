# bench/CANDIDATES.md — 벤치 후보 (T0.1 조사, 2026-10-07)

크기는 Hugging Face 파일 합계 기준(MLX 4bit / CT2 int8). 품질 코멘트는 벤더 주장 포함, 독립 벤치 아님. **다운로드는 사용자 승인 후.**

| # | 모델 | 런타임 | 식별자 | GB | 라이선스 | 등급 |
|---|---|---|---|---|---|---|
| 1 | Hy-MT2-1.8B (Tencent 번역특화, 2026-05) | MLX | mlx-community/Hy-MT2-1.8B-4bit | 1.02 | Apache-2.0 | L |
| 2 | TranslateGemma 4B (Google 번역특화) | Ollama / MLX | translategemma:4b / mlx-community/translategemma-4b-it-4bit | 2.22 | Gemma terms | M |
~~| 3 | NLLB-200 distilled 1.3B | CT2 | OpenNMT/nllb-200-distilled-1.3B-ct2-int8 | 1.4 | CC-BY-NC (개인용 OK) | L |~~ (D8: NC 라이선스 — 2026-10-08 벤치에서 제거)
~~| 4 | NLLB-200 distilled 600M | CT2 | JustFrederik/nllb-200-distilled-600M-ct2-int8 | 0.6 | CC-BY-NC | L |~~ (D8: NC 라이선스 — 2026-10-08 벤치에서 제거)
| 5 | MADLAD-400 3B | CT2 | Nextcloud-AI/madlad400-3b-mt-ct2-int8 | 3.0 | Apache-2.0 | M |
| 6 | m2m100 418M | CT2 | jncraton/m2m100_418M-ct2-int8 | 0.45 | MIT | L |
| 7 | opus-mt-tc-big-en-ko (en→ko만, 직접 변환) | CT2 | Helsinki-NLP/opus-mt-tc-big-en-ko | 0.45 | CC-BY-4.0 | L |
| 8 | Qwen3.5 2B | MLX / Ollama | mlx-community/Qwen3.5-2B-4bit / qwen3.5:2b | 1.75 | Apache-2.0 | L~M |
| 9 | Qwen3 1.7B | MLX / Ollama | mlx-community/Qwen3-1.7B-4bit / qwen3:1.7b | 0.98 | Apache-2.0 | L |
| 10 | Qwen3.5 4B | MLX | mlx-community/Qwen3.5-4B-4bit | 3.06 | Apache-2.0 | M~H |
~~| 11 | EXAONE 4.0 1.2B (ko 특화, en/ko/es 공식) | MLX | mlx-community/exaone-4.0-1.2b-4bit | 0.73 | EXAONE NC | L |~~ (D8: NC 라이선스 — 2026-10-08 벤치에서 제거)
| 12 | Kanana 2 3B (ko 특화) | MLX | mlx-community/kanana-2-3b-instruct-4bit | 2.0 | kanana-open | M |
| 13 | Gemma 3 1B | MLX | mlx-community/gemma-3-1b-it-qat-4bit | 0.77 | Gemma terms | L |
| 14 | Gemma 4 E2B | MLX | mlx-community/gemma-4-e2b-it-4bit | 3.58 | Gemma terms | H |
| 15 | HyperCLOVA X SEED 1.5B (커뮤니티 포트) | MLX | senaw/HyperCLOVAX-SEED-Text-Instruct-1.5B-MLX-Q4 | 0.9 | hyperclovax-seed | L |

합계 ≈ 23GB (3GB 이하 모델만 ≈ 14GB). 참고용(예산 초과, 선택): Hy-MT2-7B-4bit 4.24GB, translategemma-12b ~7GB.
이미 설치됨(추가 다운로드 없음, H 등급 기준점): Ollama `gemma4:e2b`(7.2GB), `gemma4:e4b`(9.6GB).
Apple Translation / Apple FM은 시스템 내장(다운로드는 언어팩만).

## 메모
- opus-mt `en-ko`/`ja-ko`/`zh-ko`는 HF에 없음. en→ko만 tc-big 존재 → ja/zh는 NLLB·MADLAD로 대체.
- CTranslate2 4.8.2는 Python 3.14 macOS arm64 wheel 있음. mlx/transformers의 3.14 호환은 미확인(실패 시 3.12 venv).
- `mlx_lm.server` OpenAI 호환 엔드포인트는 미검증(설치 후 확인).
- EXAONE 4.0은 en/ko/es만 공식 → ja/zh 약할 가능성. 라이선스 NC 계열(EXAONE, NLLB, Tower)은 개인용 한정.
