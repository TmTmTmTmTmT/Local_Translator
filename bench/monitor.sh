#!/usr/bin/env bash
# System-wide RSS/swap sampler (1 Hz) for engine resource cost. No sudo.
#   monitor.sh start <outfile.csv>   begin sampling in background
#   monitor.sh mark <label>          append a marker row (e.g. "end"); idle recovery is read from samples after it
#   monitor.sh idle [label]          mark + append snapshots of matching processes at +1/+3/+5 min (background)
#   monitor.sh stop                  stop sampler
#   monitor.sh status
# CSV columns: epoch,kind,f1,f2,f3,f4
#   proc: pid,rss_kb,comm,baseline_rss_kb   sys: swapouts,free_pct,pages_free   mark: label
#   idle: offset_sec,pid,rss_kb,comm
# proc rows are emitted for name-matched processes, and for any process whose RSS grew > 20MB over its baseline
# (baseline = first sample, kept in <outfile>.base).
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
STATE="$DIR/results/.monitor.state"
NAMES='ollama|python|mlx|kt-bench|translation|intelligence|foundation|generativeexperiences|^ane|anecompiler|com\.apple\..*translat'
GROW_KB=20480

sample_procs() { # $1=now $2=base file $3=first(1/0) $4=mode(proc|all)
  ps -axo pid=,rss=,comm= | awk -v now="$1" -v base="$2" -v first="$3" -v names="$NAMES" -v grow="$GROW_KB" -v mode="$4" '
    BEGIN { if (first != 1 && mode == "proc") { while ((getline l < base) > 0) { split(l, a, " "); b[a[1]] = a[2] } close(base) } }
    {
      pid = $1; rss = $2; name = ""
      for (i = 3; i <= NF; i++) name = name (i > 3 ? " " : "") $i
      n = split(name, parts, "/"); short = parts[n]; gsub(/,/, "_", short)
      if (first == 1 && mode == "proc") print pid, rss > base
      match_name = (tolower(short) ~ names)
      bs = (pid in b) ? b[pid] : (first == 1 ? rss : 0)
      if (mode == "all") { if (match_name) print now ",idle," pid "," rss "," short; next }
      if (match_name || (rss - bs) > grow) print now ",proc," pid "," rss "," short "," bs
    }'
}

sample_sys() { # $1=now $2=free_pct
  local so pf
  so=$(vm_stat 2>/dev/null | awk '/Swapouts/ { gsub(/\./, "", $2); print $2 }')
  pf=$(vm_stat 2>/dev/null | awk '/Pages free/ { gsub(/\./, "", $3); print $3 }')
  echo "$1,sys,${so:-},${2:-},${pf:-},"
}

loop() {
  local out="$1" base="$1.base" first=1 tick=0 free=""
  echo "epoch,kind,f1,f2,f3,f4" > "$out"
  while true; do
    now=$(date +%s)
    if (( tick % 5 == 0 )); then
      free=$(memory_pressure 2>/dev/null | awk -F': ' '/free percentage/ { gsub(/%/, "", $2); print $2 }')
    fi
    { sample_procs "$now" "$base" "$first" proc; sample_sys "$now" "$free"; } >> "$out"
    first=0; tick=$((tick + 1))
    sleep 1
  done
}

cmd="${1:-}"
case "$cmd" in
  start)
    out="${2:?usage: monitor.sh start <outfile>}"
    mkdir -p "$DIR/results" "$(dirname "$out")"
    out="$(cd "$(dirname "$out")" && pwd)/$(basename "$out")"
    if [[ -f "$STATE" ]] && kill -0 "$(sed -n 1p "$STATE")" 2>/dev/null; then echo "monitor already running (pid $(sed -n 1p "$STATE"))" >&2; exit 1; fi
    nohup "$0" _loop "$out" > /dev/null 2>&1 &
    echo "$!" > "$STATE"; echo "$out" >> "$STATE"
    echo "monitor started pid $! -> $out"
    ;;
  _loop) loop "$2" ;;
  mark)
    [[ -f "$STATE" ]] || { echo "monitor not running" >&2; exit 1; }
    label="${2:-mark}"; label="${label//,/_}"
    echo "$(date +%s),mark,$label,,," >> "$(sed -n 2p "$STATE")"
    ;;
  idle)
    [[ -f "$STATE" ]] || { echo "monitor not running" >&2; exit 1; }
    out="$(sed -n 2p "$STATE")"; label="${2:-idle}"; label="${label//,/_}"
    echo "$(date +%s),mark,$label,,," >> "$out"
    (
      for off in 60 180 300; do
        sleep $((off - ${prev:-0})); prev=$off
        sample_procs "$(date +%s)" /dev/null 0 all | sed "s/,idle,/,idle,$off,/" >> "$out"
      done
    ) > /dev/null 2>&1 &
    echo "idle samples scheduled at +1/+3/+5 min"
    ;;
  stop)
    [[ -f "$STATE" ]] || { echo "monitor not running" >&2; exit 0; }
    pid="$(sed -n 1p "$STATE")"; out="$(sed -n 2p "$STATE")"
    echo "$(date +%s),mark,stop,,," >> "$out"
    kill "$pid" 2>/dev/null; rm -f "$STATE" "$out.base"
    echo "monitor stopped -> $out"
    ;;
  status)
    if [[ -f "$STATE" ]] && kill -0 "$(sed -n 1p "$STATE")" 2>/dev/null; then echo "running pid $(sed -n 1p "$STATE") -> $(sed -n 2p "$STATE")"; else echo "not running"; fi
    ;;
  *) sed -n 2,13p "$0"; exit 2 ;;
esac
