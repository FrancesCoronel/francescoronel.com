#!/usr/bin/env bash
# PostToolUse: runs ESLint with --fix on an edited .ts/.tsx file. There is no
# Prettier in this repo, so ESLint is the formatter. Lint errors go back to
# Claude (exit 2) so it can fix them; the edit itself has already happened.
set -euo pipefail

file_path=$(jq -r '.tool_input.file_path // empty')

case "$file_path" in
  *.ts | *.tsx) ;;
  *) exit 0 ;;
esac

[ -f "$file_path" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}"
[ -x node_modules/.bin/eslint ] || exit 0

if ! output=$(node_modules/.bin/eslint --fix "$file_path" 2>&1); then
  echo "$output" >&2
  exit 2
fi
