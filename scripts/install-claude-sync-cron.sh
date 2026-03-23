#!/bin/bash
# install-claude-sync-cron.sh
#
# Installs a daily launchd job (macOS) that syncs your local Claude config
# to the website repo at 9:03am every day.
#
# Run once:  bash scripts/install-claude-sync-cron.sh
# Remove:    launchctl unload ~/Library/LaunchAgents/com.francescoronel.claude-sync.plist

set -e

REPO_DIR="/Users/francescoronel/Documents/GitHub/francescoronel.com"
SCRIPT="$REPO_DIR/scripts/sync-claude-config.mjs"
PLIST="$HOME/Library/LaunchAgents/com.francescoronel.claude-sync.plist"
LOG_DIR="$HOME/Library/Logs/claude-sync"

mkdir -p "$LOG_DIR"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.francescoronel.claude-sync</string>

  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>$SCRIPT</string>
  </array>

  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>9</integer>
    <key>Minute</key>
    <integer>3</integer>
  </dict>

  <key>StandardOutPath</key>
  <string>$LOG_DIR/sync.log</string>

  <key>StandardErrorPath</key>
  <string>$LOG_DIR/sync.error.log</string>

  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
    <key>HOME</key>
    <string>$HOME</string>
  </dict>

  <key>RunAtLoad</key>
  <false/>
</dict>
</plist>
EOF

# Unload if already registered, then load fresh
launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"

echo "✓ Claude sync job installed — runs daily at 9:03am"
echo "  Logs: $LOG_DIR/sync.log"
echo "  To remove: launchctl unload $PLIST"
echo ""
echo "  Test it now with:"
echo "    node $SCRIPT"
