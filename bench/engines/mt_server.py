#!/usr/bin/env python3
"""CTranslate2 MT server for the bench harness (PLAN 5.1). Binds 127.0.0.1 only.

stdlib-only at import time; ctranslate2/transformers are imported lazily on first
model load (never with --fake). Spec: POST /translate, GET /health.
"""
import argparse
import json
import os
import subprocess
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = "127.0.0.1"  # never configurable: page text must not leave the machine
MAX_BODY = 8 * 1024 * 1024
BEAM_SIZE = 4
MAX_BATCH_SIZE = 16
MAX_DECODING_LENGTH = 512

# bench src code -> family-specific code
LANG_MAP = {
    "m2m100": {"en": "en", "ja": "ja", "zh-Hans": "zh", "zh-Hant": "zh", "ko": "ko"},
    "nllb": {"en": "eng_Latn", "ja": "jpn_Jpan", "zh-Hans": "zho_Hans",
             "zh-Hant": "zho_Hant", "ko": "kor_Hang"},
    "opus": {"en": "en-ko", "ja": "ja-ko", "zh-Hans": "zh-ko", "zh-Hant": "zh-ko", "ko": "ko"},
    "madlad": {"en": "en", "ja": "ja", "zh-Hans": "zh", "zh-Hant": "zh", "ko": "ko"},
}
SUPPORTED_SRC = ("en", "ja", "zh-Hans", "zh-Hant")


def rss_kb():
    try:
        out = subprocess.run(["ps", "-o", "rss=", "-p", str(os.getpid())],
                             capture_output=True, text=True, timeout=2).stdout.strip()
        return int(out)
    except Exception:
        return -1


class FakeBackend:
    """No-dependency stand-in so the HTTP contract can be tested."""

    def __init__(self):
        self.up = False

    def prepare(self, src):
        if self.up:
            return False
        time.sleep(0.05)
        self.up = True
        return True

    def unload(self):
        self.up = False

    def translate(self, src, tgt, texts):
        return ["[%s->%s] %s" % (src, tgt, t) for t in texts]


class CT2Backend:
    def __init__(self, a):
        self.a = a
        self.translators = {}  # key (model subdir or "") -> (translator, tokenizer)

    def _key(self, src):
        if self.a.family == "opus":
            return LANG_MAP["opus"][src]
        return ""

    def _model_path(self, key):
        if not key:
            return self.a.model_dir
        p = os.path.join(self.a.model_dir, key)
        if not os.path.isdir(p):
            raise ValueError("opus model dir missing: %s" % p)
        return p

    def prepare(self, src):
        """Load model for this direction if needed; True if a load happened."""
        key = self._key(src)
        if key in self.translators:
            return False
        self._get(key)
        return True

    def _get(self, key):
        if key in self.translators:
            return self.translators[key]
        import ctranslate2  # lazy
        import transformers  # lazy (also needs sentencepiece for most tokenizers)
        path = self._model_path(key)
        tok_path = self.a.tokenizer or path
        tr = ctranslate2.Translator(path, device="cpu", compute_type=self.a.compute_type,
                                    inter_threads=1, intra_threads=self.a.threads or 0)
        tok = transformers.AutoTokenizer.from_pretrained(tok_path)
        self.translators[key] = (tr, tok)
        return self.translators[key]

    def unload(self):
        self.translators.clear()
        import gc
        gc.collect()

    def translate(self, src, tgt, texts):
        fam = self.a.family
        key = self._key(src)
        tr, tok = self._get(key)
        codes = LANG_MAP[fam]
        prefix = None
        if fam == "m2m100":
            tok.src_lang = codes[src]
            prefix = ["__%s__" % codes[tgt]]
        elif fam == "nllb":
            tok.src_lang = codes[src]
            prefix = [codes[tgt]]
        sources = []
        for t in texts:
            s = "<2%s> %s" % (codes[tgt], t) if fam == "madlad" else t
            sources.append(tok.convert_ids_to_tokens(tok.encode(s)))
        kw = dict(beam_size=BEAM_SIZE, max_batch_size=MAX_BATCH_SIZE,
                  max_decoding_length=MAX_DECODING_LENGTH)
        if prefix:
            kw["target_prefix"] = [prefix] * len(sources)
        results = tr.translate_batch(sources, **kw)
        out = []
        for r in results:
            toks = r.hypotheses[0]
            if prefix and toks and toks[0] == prefix[0]:
                toks = toks[1:]
            out.append(tok.decode(tok.convert_tokens_to_ids(toks), skip_special_tokens=True).strip())
        return out


class Engine:
    """Lazy load, idle unload, serialized inference."""

    def __init__(self, backend, idle_sec):
        self.backend = backend
        self.idle_sec = idle_sec
        self.lock = threading.Lock()
        self.loaded = False
        self.last_used = time.monotonic()

    def translate(self, src, tgt, texts):
        with self.lock:
            t0 = time.perf_counter()
            did_load = self.backend.prepare(src)
            self.loaded = True
            load_ms = int((time.perf_counter() - t0) * 1000) if did_load else 0
            t1 = time.perf_counter()
            idx = [i for i, t in enumerate(texts) if t.strip()]
            res = list(texts)  # empty/whitespace-only pass through unchanged
            if idx:
                outs = self.backend.translate(src, tgt, [texts[i] for i in idx])
                for i, o in zip(idx, outs):
                    res[i] = o
            ms = int((time.perf_counter() - t1) * 1000)
            self.last_used = time.monotonic()
            return res, load_ms, ms

    def maybe_unload(self):
        if not self.idle_sec or not self.loaded:
            return
        if not self.lock.acquire(blocking=False):
            return
        try:
            if self.loaded and time.monotonic() - self.last_used >= self.idle_sec:
                self.backend.unload()
                self.loaded = False
                print("[mt_server] idle unload", file=sys.stderr, flush=True)
        finally:
            self.lock.release()


def make_handler(engine, args):
    class H(BaseHTTPRequestHandler):
        def log_message(self, fmt, *a):
            pass

        def _send(self, code, obj):
            body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if self.path == "/health":
                self._send(200, {"loaded": engine.loaded, "rssKb": rss_kb()})
            else:
                self._send(404, {"error": "not found"})

        def do_POST(self):
            if self.path != "/translate":
                return self._send(404, {"error": "not found"})
            try:
                n = int(self.headers.get("Content-Length", "0"))
                if n <= 0 or n > MAX_BODY:
                    return self._send(400, {"error": "bad body size"})
                req = json.loads(self.rfile.read(n).decode("utf-8"))
                src, tgt, texts = req.get("src"), req.get("tgt", "ko"), req.get("texts")
                if src not in SUPPORTED_SRC:
                    return self._send(400, {"error": "unsupported src"})
                if tgt != "ko":
                    return self._send(400, {"error": "tgt must be ko"})
                if not isinstance(texts, list) or not all(isinstance(t, str) for t in texts):
                    return self._send(400, {"error": "texts must be list of strings"})
            except (ValueError, UnicodeDecodeError) as e:
                return self._send(400, {"error": "bad request: %s" % e})
            try:
                res, load_ms, ms = engine.translate(src, tgt, texts)
            except Exception as e:  # keep server alive on model/runtime errors
                return self._send(500, {"error": "%s: %s" % (type(e).__name__, e)})
            self._send(200, {"translations": res, "loadMs": load_ms, "ms": ms})

    return H


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--model-dir")
    p.add_argument("--family", choices=sorted(LANG_MAP), default="m2m100")
    p.add_argument("--port", type=int, default=8765)
    p.add_argument("--compute-type", default="int8")
    p.add_argument("--threads", type=int, default=0, help="intra-op threads (0 = default)")
    p.add_argument("--idle-unload-sec", type=float, default=0)
    p.add_argument("--tokenizer", help="HF id or dir for tokenizer if not inside --model-dir")
    p.add_argument("--fake", action="store_true", help="fake translator, no ctranslate2")
    a = p.parse_args()
    if not a.fake and not a.model_dir:
        p.error("--model-dir required unless --fake")
    backend = FakeBackend() if a.fake else CT2Backend(a)
    engine = Engine(backend, a.idle_unload_sec)

    if a.idle_unload_sec:
        def reaper():
            while True:
                time.sleep(max(0.2, min(5.0, a.idle_unload_sec / 4)))
                engine.maybe_unload()
        threading.Thread(target=reaper, daemon=True).start()

    srv = ThreadingHTTPServer((HOST, a.port), make_handler(engine, a))
    srv.daemon_threads = True
    print("[mt_server] listening on %s:%d family=%s fake=%s" %
          (HOST, srv.server_address[1], a.family, a.fake), file=sys.stderr, flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
