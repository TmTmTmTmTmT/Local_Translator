#!/usr/bin/env bash
# 최종 후보 재측정: Apple marker 중국어 + 상위 후보(새 메모리 압력 모니터, 유휴 5분)
set -u
cd "$(dirname "$0")/.."
node bench/run.mjs --engines apple-mt-marker --langs zh-Hans,zh-Hant --runs 1
node bench/orchestrate.mjs --only ct2-nllb-600m,mlx-hy-mt2-1.8b-4bit-mt,mlx-translategemma-4b-4bit-mt --langs en,ja,zh-Hans,zh-Hant --runs 1 --idle-wait 300
node bench/summarize.mjs
echo FINAL_PASS_DONE
