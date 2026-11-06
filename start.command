#!/bin/sh
cd "$(dirname "$0")" || exit 1
python3 -m http.server 4173 &
SERVER_PID=$!
sleep 1
if command -v open >/dev/null 2>&1; then
  open http://127.0.0.1:4173
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open http://127.0.0.1:4173
fi
wait "$SERVER_PID"
