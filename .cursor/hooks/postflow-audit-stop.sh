#!/usr/bin/env bash
# Auto-trigger post-flow audit once after a successful agent completion with code edits.
set -euo pipefail

input=$(cat)
status=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status',''))" 2>/dev/null || echo "")
loop_count=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('loop_count',0))" 2>/dev/null || echo "0")
conversation_id=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('conversation_id','unknown'))" 2>/dev/null || echo "unknown")
transcript_path=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('transcript_path') or '')" 2>/dev/null || echo "")

STATE_DIR="${HOME}/.cursor/hooks/state"
mkdir -p "$STATE_DIR"
STATE_FILE="${STATE_DIR}/postflow-audit-${conversation_id}.flag"

# Only on successful first completion (avoid infinite loops / aborted runs)
if [[ "$status" != "completed" ]]; then
  echo '{}'
  exit 0
fi
if [[ "${loop_count}" != "0" ]]; then
  echo '{}'
  exit 0
fi
if [[ -f "$STATE_FILE" ]]; then
  echo '{}'
  exit 0
fi

# Skip if transcript already contains a scorecard / audit in progress
if [[ -n "$transcript_path" && -f "$transcript_path" ]]; then
  if python3 - << PY
import pathlib, sys
p = pathlib.Path("$transcript_path")
try:
    t = p.read_text(encoding="utf-8", errors="ignore")[-80000:]
except Exception:
    sys.exit(0)
markers = (
    "Post-Flow Audit",
    "web-service-postflow-audit",
    "/postflow-audit",
    "Verdict",
    "GO WITH CAVEATS",
)
# If user/agent already auditing, skip
if any(m in t for m in markers) and "Scorecard" in t:
    sys.exit(1)
# Require some signal of implementation work
impl = ("git commit", "gh pr create", "feat:", "fix:", "Merged", "type-check", "npm run build", "WorkspaceStub", "StrReplace", "Wrote contents")
if not any(s in t for s in impl):
    sys.exit(2)
sys.exit(0)
PY
  then
    :
  else
    code=$?
    if [[ $code -eq 1 || $code -eq 2 ]]; then
      echo '{}'
      exit 0
    fi
  fi
fi

touch "$STATE_FILE"

python3 - << 'PY'
import json
msg = (
  "전체적인 플로우 구현이 끝난 것으로 보입니다. "
  "`web-service-postflow-audit` 스킬을 즉시 실행하세요 "
  "(/postflow-audit 과 동일). Phase 0–8을 수행하고 "
  "GO / GO WITH CAVEATS / NO-GO 스코어카드로 보고하세요. "
  "이미 이번 핸드오프에 대해 스코어카드를 냈다면 생략하세요."
)
print(json.dumps({"followup_message": msg}, ensure_ascii=False))
PY
exit 0
