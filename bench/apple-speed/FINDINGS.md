# Apple Translation speed experiments (2026-10-07)

Machine: charging, load avg ~17 from unrelated processes (noisy; baseline matches REPORT section 1). Probe code: `bench/engines/apple/Sources/kt-bench/Speed.swift` (`--speed`, `--speed2`), `MTBatch.swift` (engine `apple-mt-marker-batch`). Corpus en.json, 29 blocks, mean 111 chars (12..186), 3271 chars total.

## Results (en)

| variant | total ms, 29 blocks | ms/block | notes |
|---|---|---|---|
| sequential translate(String) (E1) | 51338 (pass 2: 49782) | ~1740 | p50 1902, p90 2519, max 2788; short (<80 ch) p50 689 |
| first call, new session | 1499-2639 | - | cold penalty only ~0.5-1 s, once per session |
| translations(from:) one call, all blocks (E2) | 48753 (warm 49471) | 1680 | clientIdentifier order preserved (inOrder=true) |
| translate(batch:) streaming (E2) | 48572 | 1675 | first result at 1462 ms, then ~1.7 s apart |
| translations(from:) chunks of 5 | 49545 | 1708 | first chunk 9326 ms |
| 2 sessions parallel (E3) | 48489 | 1672 | no speedup |
| 4 sessions parallel (E3) | 51798 | 1786 | no speedup |
| 1 session, 29 concurrent translate() (E3) | 49240 | 1698 | no speedup |
| AttributedString vs String, 10 blocks (E5) | 21696 vs 21751 | 2170 | identical |
| blocks joined by "\n", one request (E4b) | k=8: 15854 vs 16020 sum of singles; all 29: 47478 | 1637 | no gain; output had 2x lines (blank lines inserted), so unsafe to split |
| apple-mt-marker-batch engine (en) | 49613 | 1711 | slots identical to apple-mt-marker for 29/29 blocks (previous run 59187) |
| apple-mt-marker-batch engine (ja) | 42983 | 1482 | slots identical 29/29 (previous marker run 51365) |

## Length dependence (E4)

- Cost is proportional to distinct text volume: about 13-14 ms per source char (singles first 8 blocks: 1178 chars, 16020 ms; joined 4/8/29 blocks cost the same as the sum of the parts). Fixed overhead per request is small (~0.5 s for a 12-char block; 'a'/'Hello' ~60 ms because they are short-circuited).
- Repeating one sentence (E4 "len=1823: 12 s") scales sub-linearly, so repeated text is deduplicated; do not use it as a length model.

## Conclusions

1. The system translator is throughput bound (~70 source chars/s on this load), serialized in the translation service: batch API, multiple sessions, and in-flight concurrency all give about 1.0x. AttributedString has no extra cost.
2. No variant reaches the 2x threshold, so `EngineMT.swift` was NOT changed. The batch engine is only ~5-15% faster (within noise) with identical output.
3. "<1 s to first screen" is not reachable by Apple MT for a full 29-block document; per-block 12-110 char latency is 0.5-2 s. Feasible lever: translate only the visible blocks first (priority ordering in JS) and use `translate(batch:)` streaming so each result is delivered as soon as it is done (first result ~1.5 s with a warm session). Keep a session warm to avoid the cold ~1 s.
4. Not tested: ja/zh speed scripts (only engine runs), lowLatency (needs separate pack).
