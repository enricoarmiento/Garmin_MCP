#!/bin/sh
# Builds dist/garmin-skill.zip: a self-contained skill folder (launcher + app source + lockfile).
set -eu
cd "$(dirname "$0")/.."
rm -rf dist/garmin && mkdir -p dist/garmin
cp skills/garmin/SKILL.md skills/garmin/README.md skills/garmin/garmin pyproject.toml uv.lock dist/garmin/
cp -R src dist/garmin/src
find dist/garmin -name __pycache__ -prune -exec rm -rf {} +
chmod +x dist/garmin/garmin
(cd dist && rm -f garmin-skill.zip && zip -qrX garmin-skill.zip garmin)
echo "dist/garmin-skill.zip"
