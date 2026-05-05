#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy.sh "commit message"
if [ -z "${1:-}" ]; then
  echo "Error: commit message required."
  echo "Usage: ./deploy.sh \"your commit message\""
  exit 1
fi

COMMIT_MSG="$1"

echo "==> Building..."
node_modules/.bin/ng build --configuration=production

echo "==> Staging changes..."
git add -A

if git diff --cached --quiet; then
  echo "Nothing to commit, skipping git step."
else
  git commit -m "$COMMIT_MSG"
fi

echo "==> Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "==> Done."
