# CTranslate2 MT server (bench)

`mt_server.py` serves CT2 MT models on `127.0.0.1` only. Nothing here is installed or downloaded automatically.

## 1. venv
`python3` on this machine is 3.14.7. First check whether `ctranslate2` (and `sentencepiece`, `tokenizers`) publish wheels for 3.14:
`python3 -m pip download ctranslate2 --no-deps -d /tmp/x --only-binary=:all:` (or look at PyPI file list).
If not, use Python 3.12 via uv or pyenv:

    uv venv --python 3.12 bench/.venv        # or: pyenv install 3.12 && python3.12 -m venv bench/.venv
    source bench/.venv/bin/activate
    pip install -r bench/engines/requirements-mt.txt

## 2. Convert models (downloads from Hugging Face, needs user approval)
    bench/engines/convert_model.sh m2m100_418M
    bench/engines/convert_model.sh                # prints usage and HF id list

Output goes to `bench/models/<name>` (gitignored). Tokenizer files are copied into it; if a repo lacks one of the listed files the converter errors, so trim the `--copy_files` list or pass `--tokenizer <hf id>` to the server.

## 3. Run
    python bench/engines/mt_server.py --model-dir bench/models/m2m100_418M --family m2m100 \
        --port 8765 --compute-type int8 --threads 4 --idle-unload-sec 300

Families: `m2m100`, `nllb`, `opus` (`--model-dir` holds `en-ko`, `ja-ko`, `zh-ko` subdirs, loaded per direction), `madlad`.
`--fake` runs without ctranslate2 for contract tests.

## 4. Call
    curl -s localhost:8765/translate -d '{"src":"en","tgt":"ko","texts":["Hello world.",""]}'
    # {"translations":[...],"loadMs":1234,"ms":80}   loadMs>0 only when this request (re)loaded the model
    curl -s localhost:8765/health   # {"loaded":true,"rssKb":123456}

Order is preserved; empty/whitespace-only strings pass through unchanged. After `--idle-unload-sec` idle the model is freed and `/health` reports `loaded:false`.
