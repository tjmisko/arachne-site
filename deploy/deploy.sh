#!/usr/bin/env bash
# Build the site and rsync it to the nginx root on the VPS.
#
# Usage:
#   DEPLOY_HOST=deploy@vps.example.com ./deploy/deploy.sh
#
# Override the remote path with DEPLOY_PATH (default /var/www/arachne-site).
# Assumes SSH key auth to DEPLOY_HOST and that the remote dir is writable.
set -euo pipefail

DEPLOY_HOST="${DEPLOY_HOST:?set DEPLOY_HOST, e.g. deploy@vps.example.com}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/arachne-site}"

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

echo "==> Building (astro build → dist/)"
npm run build

echo "==> Deploying dist/ → ${DEPLOY_HOST}:${DEPLOY_PATH}"
# --delete removes stale files; trailing slash on dist/ copies contents, not the dir.
rsync -az --delete \
    --human-readable \
    dist/ "${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "==> Done."
