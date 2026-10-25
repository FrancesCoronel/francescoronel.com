#!/usr/bin/env bash
# PreToolUse guard: blocks the one-off migration scripts and edits to
# generated, lock or secret files. Deny rules in settings.json are prefix
# matches, so this catches forms they miss (`cd x && ...`, absolute paths).
# Exit 2 blocks the tool call and shows stderr to Claude.
set -euo pipefail

input=$(cat)
command=$(jq -r '.tool_input.command // empty' <<<"$input")
file_path=$(jq -r '.tool_input.file_path // empty' <<<"$input")

if [ -n "$command" ] &&
  grep -Eq 'scripts/migrations/|export:webflow|import:wordpress|migrate:images' <<<"$command"; then
  echo "Blocked: scripts/migrations/ and the export:webflow, import:wordpress and migrate:images scripts are one-off migrations that rewrite content and blob storage. Don't run them (see AGENTS.md)." >&2
  exit 2
fi

if [ -n "$file_path" ]; then
  case "$file_path" in
    *.env.local.example) ;;
    *content/claude-config/* | *scripts/migrations/*)
      echo "Blocked: $file_path is generated or kept for reference only; don't edit it by hand (see AGENTS.md)." >&2
      exit 2
      ;;
    *package-lock.json)
      echo "Blocked: don't edit package-lock.json by hand. Change package.json and run npm install instead." >&2
      exit 2
      ;;
    .env* | */.env*)
      echo "Blocked: $file_path holds secrets; don't read or write env files." >&2
      exit 2
      ;;
  esac
fi

exit 0
