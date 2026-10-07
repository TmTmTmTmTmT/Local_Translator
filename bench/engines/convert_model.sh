#!/usr/bin/env bash
# Convert a HF model to CTranslate2 int8 under bench/models/<name>. Runs only when invoked.
# Requires bench/.venv activated with ctranslate2 + transformers (see README-mt.md).
set -euo pipefail

usage() {
  cat <<'U'
Usage: convert_model.sh <name>            # use a known name below
       convert_model.sh <name> <hf_id>    # custom (e.g. opus-mt ids, filled by human)

Known names -> HF ids:
  m2m100_418M                  facebook/m2m100_418M
  m2m100_1.2B                  facebook/m2m100_1.2B
  nllb-200-distilled-600M      facebook/nllb-200-distilled-600M      (CC-BY-NC)
  nllb-200-distilled-1.3B      facebook/nllb-200-distilled-1.3B      (CC-BY-NC)
  madlad400-3b-mt              google/madlad400-3b-mt                (large, H tier)
  opus-mt/en-ko, opus-mt/ja-ko, opus-mt/zh-ko   -> HF ids TBD by human; pass as 2nd arg
      e.g. convert_model.sh opus-mt/en-ko <hf_id>  (use --model-dir bench/models/opus-mt)

Output: bench/models/<name>  (gitignored). Downloads the model from Hugging Face.
U
}

[ $# -ge 1 ] || { usage; exit 1; }
case "$1" in -h|--help) usage; exit 0;; esac

NAME="$1"; HF_ID="${2:-}"
if [ -z "$HF_ID" ]; then
  case "$NAME" in
    m2m100_418M) HF_ID=facebook/m2m100_418M;;
    m2m100_1.2B) HF_ID=facebook/m2m100_1.2B;;
    nllb-200-distilled-600M) HF_ID=facebook/nllb-200-distilled-600M;;
    nllb-200-distilled-1.3B) HF_ID=facebook/nllb-200-distilled-1.3B;;
    madlad400-3b-mt) HF_ID=google/madlad400-3b-mt;;
    *) echo "unknown name '$NAME' and no hf id given" >&2; usage; exit 1;;
  esac
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/models/$NAME"
[ ! -e "$OUT" ] || { echo "$OUT already exists; remove it first" >&2; exit 1; }
mkdir -p "$(dirname "$OUT")"

# copy_files keeps tokenizer files next to the model so mt_server needs no --tokenizer.
# Files missing in a given repo make the converter fail; adjust the list per model if so.
ct2-transformers-converter --model "$HF_ID" --output_dir "$OUT" --quantization int8 \
  --copy_files tokenizer.json tokenizer_config.json special_tokens_map.json \
               sentencepiece.bpe.model spiece.model vocab.json source.spm target.spm
echo "done: $OUT"
