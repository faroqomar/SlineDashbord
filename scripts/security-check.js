import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEY_PATTERN = /SUPABASE_SERVICE_ROLE_KEY/;
const EXCLUDED_DIRS = ['node_modules', '.next', '.git', 'scripts', 'src/lib/supabase', 'src/actions', 'src/proxy.ts', 'src/instrumentation.ts', 'src/features/finance/services'];
const ROOT_DIR = path.resolve(__dirname, '..');

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  let foundLeak = false;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    // Check exclusion
    const relativePath = path.relative(ROOT_DIR, fullPath);
    if (EXCLUDED_DIRS.some(excluded => relativePath.startsWith(excluded))) {
      continue;
    }

    if (stat.isDirectory()) {
      if (scanDirectory(fullPath)) {
        foundLeak = true;
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
      // Read file content
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (KEY_PATTERN.test(content)) {
        console.error(`\x1b[31m[SECURITY ALERT] Potential secret leak detected in: ${relativePath}\x1b[0m`);
        console.error(`  Reason: File contains 'SUPABASE_SERVICE_ROLE_KEY'.`);
        console.error(`  This key should ONLY be used in server-only files (e.g., src/actions, src/lib/supabase/admin.ts).`);
        foundLeak = true;
      }
    }
  }

  return foundLeak;
}

console.log('🔒 Starting Security Scan...');
const hasLeak = scanDirectory(ROOT_DIR);

if (hasLeak) {
  console.error('\x1b[31m❌ Security Check Failed: Secrets found in potentially unsafe locations.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32m✅ Security Check Passed: No obvious secret leaks found.\x1b[0m');
  process.exit(0);
}
