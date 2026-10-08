#!/usr/bin/env bash
# usage: fetch-site.sh <name> <url>  -> tests/e2e/sites/<name>.html (git-ignored: site HTML is copyrighted)
set -euo pipefail
[ $# -eq 2 ] || { echo "usage: $0 <name> <url>" >&2; exit 2; }
dir="$(cd "$(dirname "$0")" && pwd)/sites"
mkdir -p "$dir"
curl -sSL --max-time 60 -A 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' -o "$dir/$1.html" "$2"
echo "$dir/$1.html"
