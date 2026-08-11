#!/usr/bin/env bash
set -euo pipefail

# BelediyeOS — GitHub'a ilk push
# Kullanım:
#   GITHUB_REPO=https://github.com/KULLANICI/belediyeos.git ./scripts/push-to-github.sh
# veya:
#   ./scripts/push-to-github.sh https://github.com/KULLANICI/belediyeos.git

REPO_URL="${1:-${GITHUB_REPO:-}}"
TOKEN="${GITHUB_TOKEN:-}"

if [[ -z "$REPO_URL" ]]; then
  echo "Hata: GitHub repo URL gerekli."
  echo "Örnek: ./scripts/push-to-github.sh https://github.com/kullanici/belediyeos.git"
  exit 1
fi

cd "$(dirname "$0")/.."

if [[ -n "$TOKEN" && "$REPO_URL" == https://* ]]; then
  REPO_URL="https://${TOKEN}@${REPO_URL#https://}"
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

echo "→ main branch push..."
git push -u origin main

echo "→ feature branch'ler push..."
for branch in $(git branch --format='%(refname:short)' | rg '^cursor/'); do
  echo "  - $branch"
  git push -u origin "$branch" || true
done

echo "Tamamlandı: $REPO_URL"
