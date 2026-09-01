#!/bin/bash
set -euo pipefail
FRONTEND="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$FRONTEND/.." && pwd)"
DIST="$FRONTEND/dist"
HTML="$DIST/index.html"

if [[ ! -f "$HTML" ]]; then
  echo "Missing $HTML — run: npm run build" >&2
  exit 1
fi
if ! grep -q '/Meeting/assets/' "$HTML"; then
  echo "dist/index.html still points at /assets/. Rebuild with --base /Meeting/" >&2
  exit 1
fi

mkdir -p "$ROOT/assets"
cp "$HTML" "$ROOT/index.html"
cp -r "$DIST/assets/." "$ROOT/assets/"
for extra in .htaccess web.config api-proxy.php; do
  if [[ -f "$DIST/$extra" ]]; then
    cp "$DIST/$extra" "$ROOT/$extra"
  fi
done
echo "Published UI to $ROOT"
echo "Check: grep assets $ROOT/index.html"


