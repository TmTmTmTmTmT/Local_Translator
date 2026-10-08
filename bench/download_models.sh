#!/usr/bin/env bash
# 벤치 후보 모델 다운로드 (CANDIDATES.md). 사용자 승인 후 실행. MLX 모델은 HF 캐시(~/.cache/huggingface), CT2는 bench/models/.
set -u
cd "$(dirname "$0")"
. .venv/bin/activate
export HF_HUB_DISABLE_TELEMETRY=1
LOG=results/download.log
mkdir -p models results
ts() { date '+%H:%M:%S'; }

MLX=(
  mlx-community/Hy-MT2-1.8B-4bit
  mlx-community/translategemma-4b-it-4bit
  mlx-community/Qwen3.5-2B-4bit
  mlx-community/Qwen3-1.7B-4bit
  mlx-community/Qwen3.5-4B-4bit
  mlx-community/kanana-2-3b-instruct-4bit
  mlx-community/gemma-3-1b-it-qat-4bit
  mlx-community/gemma-4-e2b-it-4bit
  senaw/HyperCLOVAX-SEED-Text-Instruct-1.5B-MLX-Q4
)
CT2=(
  "Nextcloud-AI/madlad400-3b-mt-ct2-int8 madlad-3b"
  "jncraton/m2m100_418M-ct2-int8 m2m100-418m"
)
OLLAMA=(translategemma:4b qwen3.5:2b qwen3:1.7b)

{
  for r in "${MLX[@]}"; do
    echo "[$(ts)] hf mlx $r"; hf download "$r" >/dev/null 2>&1 && echo "  ok" || echo "  FAIL $r"
  done
  for e in "${CT2[@]}"; do
    set -- $e; echo "[$(ts)] hf ct2 $1 -> models/$2"; hf download "$1" --local-dir "models/$2" >/dev/null 2>&1 && echo "  ok" || echo "  FAIL $1"
  done
  echo "[$(ts)] hf opus-mt-tc-big-en-ko (원본, 변환 필요)"; hf download Helsinki-NLP/opus-mt-tc-big-en-ko --local-dir models/opus-tc-big-en-ko-src >/dev/null 2>&1 && echo "  ok" || echo "  FAIL opus"
  for m in "${OLLAMA[@]}"; do
    echo "[$(ts)] ollama pull $m"; ollama pull "$m" >/dev/null 2>&1 && echo "  ok" || echo "  FAIL $m"
  done
  echo "[$(ts)] DONE"
} >> "$LOG" 2>&1
