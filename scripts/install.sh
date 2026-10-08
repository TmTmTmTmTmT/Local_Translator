#!/bin/bash
# Local Translator: 개인 팀(무료 Apple ID)으로 서명해 빌드하고 /Applications에 설치한다. (PLAN §12.2)
# 앱과 확장 둘 다 팀 서명되면 Safari 재시작 후에도 "서명되지 않은 확장 허용" 없이 유지된다.
#   scripts/install.sh [--update] [-y] [--no-open] [--dry-run]
# 사전: Xcode(베타 가능) › Settings › Accounts 에 Apple ID 추가. sudo·Safari 설정 변경 없음.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="$ROOT/xcode/Local Translator/Local Translator.xcodeproj"
SCHEME="Local Translator"
APP_NAME="Local Translator.app"
APP_ID="com.tmtmtmtmtmt.localtranslator"
EXT_ID="com.tmtmtmtmtmt.localtranslator.Extension"
BUILD_DIR="$ROOT/.local/build"
LSREGISTER="/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister"

DRY=0; ASSUME_YES=0; OPEN_APP=1
for a in "$@"; do
  case "$a" in
    --dry-run) DRY=1 ;;
    -y) ASSUME_YES=1 ;;
    --no-open) OPEN_APP=0 ;;
    --update) ;;  # 재설치와 동일 동작 (호환용)
    -h|--help) sed -n 2,6p "${BASH_SOURCE[0]}"; exit 0 ;;
    *) echo "알 수 없는 옵션: $a" >&2; exit 64 ;;
  esac
done

say() { printf '%s\n' "$*"; }
run() { if [ "$DRY" = 1 ]; then say "[dry-run] $*"; else "$@"; fi; }

# --- Xcode (베타 우선, xcode-select에 의존하지 않음)
if [ -z "${DEVELOPER_DIR:-}" ]; then
  if [ -d /Applications/Xcode-beta.app/Contents/Developer ]; then
    export DEVELOPER_DIR=/Applications/Xcode-beta.app/Contents/Developer
  fi
fi

# --- 팀 ID 탐지: env → 캐시 → 키체인 인증서 OU → Xcode 설정
detect_team() {
  if [ -n "${TEAM_ID:-}" ]; then echo "$TEAM_ID"; return 0; fi
  if [ -s "$ROOT/.local/team-id" ]; then cat "$ROOT/.local/team-id"; return 0; fi
  if [ "${KT_INSTALL_NO_DETECT:-0}" = 1 ]; then return 1; fi
  local t
  t="$(security find-certificate -a -c "Apple Development" -p 2>/dev/null | python3 -c '
import re,subprocess,sys
pem=sys.stdin.read()
for blk in re.findall(r"-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----",pem,re.S):
    out=subprocess.run(["openssl","x509","-noout","-subject","-nameopt","RFC2253"],input=blk,capture_output=True,text=True).stdout
    m=re.search(r"OU=([A-Z0-9]{10})",out)
    if m: print(m.group(1)); break
' 2>/dev/null || true)"
  if [ -n "$t" ]; then echo "$t"; return 0; fi
  t="$(defaults read com.apple.dt.Xcode IDEProvisioningTeamByIdentifier 2>/dev/null | grep -o 'teamID = [A-Z0-9]*' | head -1 | awk '{print $3}' || true)"
  if [ -n "$t" ]; then echo "$t"; return 0; fi
  return 1
}

if ! TEAM="$(detect_team)"; then
  say "팀 ID를 찾지 못했습니다." >&2
  say "Xcode › Settings › Accounts 에서 Apple ID를 추가(무료 개인 팀 가능)한 뒤 다시 실행하세요." >&2
  say "이미 알고 있다면: TEAM_ID=XXXXXXXXXX scripts/install.sh" >&2
  exit 2
fi
say "팀 ID: $TEAM"
if [ "$DRY" = 0 ]; then mkdir -p "$ROOT/.local"; printf '%s' "$TEAM" > "$ROOT/.local/team-id"; fi

if [ "$ASSUME_YES" = 0 ] && [ "$DRY" = 0 ] && [ -t 0 ]; then
  read -r -p "빌드하고 설치할까요? [y/N] " ans
  case "$ans" in y|Y) ;; *) say "취소했습니다."; exit 1 ;; esac
fi

# --- 설치 위치
if [ -w /Applications ]; then DEST_DIR=/Applications; else DEST_DIR="$HOME/Applications"; fi
DEST="$DEST_DIR/$APP_NAME"

# --- 빌드
VERSION="$(git -C "$ROOT" describe --tags --always 2>/dev/null || echo 0.1)"
BUILD_NO="$(git -C "$ROOT" rev-list --count HEAD 2>/dev/null || echo 1)"
run xcodebuild -quiet -project "$PROJECT" -scheme "$SCHEME" -configuration Release \
  -derivedDataPath "$BUILD_DIR" -allowProvisioningUpdates \
  DEVELOPMENT_TEAM="$TEAM" CODE_SIGN_STYLE=Automatic MACOSX_DEPLOYMENT_TARGET=26.0 \
  CURRENT_PROJECT_VERSION="$BUILD_NO" build
BUILT="$BUILD_DIR/Build/Products/Release/$APP_NAME"

# --- 서명 검증: 앱·appex 모두 TeamIdentifier 있고 adhoc 아님
verify_signed() {
  local p="$1" info
  info="$(codesign -dv "$p" 2>&1 || true)"
  if ! printf '%s\n' "$info" | grep -q "TeamIdentifier=$TEAM" || printf '%s\n' "$info" | grep -q "Signature=adhoc"; then
    say "서명 검증 실패: $p" >&2
    printf '%s\n' "$info" | grep -E "Identifier|TeamIdentifier|Signature" >&2 || true
    return 1
  fi
}
if [ "$DRY" = 1 ]; then
  say "[dry-run] codesign -dv 로 앱/확장의 TeamIdentifier=$TEAM 및 non-adhoc 검증"
else
  verify_signed "$BUILT"
  for x in "$BUILT"/Contents/PlugIns/*.appex; do verify_signed "$x"; done
fi

# --- 옛 사본 정리 (같은 번들 ID의 다른 경로) → 휴지통으로 이동, 삭제하지 않음
bundle_id_of() { /usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$1/Contents/Info.plist" 2>/dev/null || true; }
trash_copy() {
  local p="$1" base dest n=0
  [ -e "$p" ] || return 0
  for x in "$p"/Contents/PlugIns/*.appex; do [ -e "$x" ] && { run pluginkit -r "$x" 2>/dev/null || true; }; done
  run "$LSREGISTER" -u "$p" 2>/dev/null || true
  base="$(basename "$p" .app)"; dest="$HOME/.Trash/$base.$(date +%Y%m%d%H%M%S).app"
  while [ -e "$dest" ]; do n=$((n+1)); dest="$HOME/.Trash/$base.$(date +%Y%m%d%H%M%S).$n.app"; done
  say "옛 사본을 휴지통으로: $p"
  run mv "$p" "$dest"
}
OLD=()
while IFS= read -r p; do
  [ -n "$p" ] || continue
  case "$p" in "$DEST"|"$BUILT") continue ;; esac
  [ "$(bundle_id_of "$p")" = "$APP_ID" ] && OLD+=("$p")
done < <({ mdfind "kMDItemCFBundleIdentifier == '$APP_ID'" 2>/dev/null || true
           # Spotlight가 색인하지 않는 경로(/tmp 등)에 등록된 확장도 찾는다
           pluginkit -m -v -A -D -i "$EXT_ID" 2>/dev/null | awk -F'\t' 'NF>=4 {print $NF}' | sed -E 's#/Contents/PlugIns/.*##' || true; } | sort -u)
if [ "${#OLD[@]}" -gt 0 ]; then for p in "${OLD[@]}"; do trash_copy "$p"; done; else say "정리할 옛 사본 없음"; fi
if [ -e "$DEST" ]; then trash_copy "$DEST"; fi

# --- 설치
run mkdir -p "$DEST_DIR"
run ditto "$BUILT" "$DEST"
# 빌드 산출물 등록 해제 (Safari가 두 사본을 혼동하지 않게)
for x in "$BUILT"/Contents/PlugIns/*.appex; do run pluginkit -r "$x" 2>/dev/null || true; done
run "$LSREGISTER" -u "$BUILT" 2>/dev/null || true
run "$LSREGISTER" -f "$DEST"
say "설치 위치: $DEST"
if [ "$OPEN_APP" = 1 ]; then run open "$DEST"; fi
say "다음: Safari › 설정 › 확장 프로그램에서 Local Translator를 켜고 웹사이트 접근을 허용하세요."
say "(약 7일 뒤 확장이 사라지면 scripts/install.sh 를 다시 실행)"
