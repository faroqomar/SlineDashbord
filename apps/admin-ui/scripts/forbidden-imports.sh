#!/usr/bin/env bash
# PAGE 01: Forbidden-import scan for admin-ui SPA.
# Fails if any forbidden server-only or Next-era import is found.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
FAIL=0

check() {
  local pattern="$1"
  local desc="$2"
  if grep -r -l --include='*.ts' --include='*.tsx' -E "$pattern" src 2>/dev/null | grep -q .; then
    echo "FORBIDDEN: $desc (pattern: $pattern)"
    grep -r -n --include='*.ts' --include='*.tsx' -E "$pattern" src 2>/dev/null || true
    FAIL=1
  fi
}

check '@/lib/supabase/admin' 'No @/lib/supabase/admin'
check '@/lib/supabase/server' 'No @/lib/supabase/server'
check 'createAdminClient' 'No createAdminClient'
check 'auth\.admin' 'No auth.admin'
check '@/types/supabase' 'No @/types/supabase'
check "from ['\"]next/" 'No next/* imports'

if [ $FAIL -eq 1 ]; then
  echo "Forbidden-import scan failed. Remove the above patterns from apps/admin-ui."
  exit 1
fi
echo "Forbidden-import scan passed."
