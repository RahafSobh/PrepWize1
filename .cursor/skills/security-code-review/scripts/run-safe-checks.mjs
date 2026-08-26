#!/usr/bin/env node
/**
 * Safe, non-invasive security checks for PrepWize / Node projects.
 * Does NOT scan production URLs or run exploitation tests.
 */
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set([
  'node_modules', 'dist', '.git', 'PrepWize1', 'PrepWize_backend',
  'playwright-report', 'test-results', 'coverage',
]);

const SECRET_PATTERNS = [
  { name: 'AWS Access Key', re: /AKIA[0-9A-Z]{16}/ },
  { name: 'Generic API key assignment', re: /(?:api[_-]?key|secret|password)\s*[:=]\s*['"][^'"\s]{8,}['"]/i },
  { name: 'Google API key', re: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: 'Private key block', re: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/ },
  { name: 'JWT-like in source', re: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./ },
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else files.push(p);
  }
  return files;
}

function scanTrackedFiles() {
  const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.yml', '.yaml', '.md', '.env.example']);
  const findings = [];
  for (const file of walk(ROOT)) {
    const rel = relative(ROOT, file);
    if (rel.includes('.cursor')) continue;
    if (rel.startsWith('.env') && !rel.endsWith('.example')) continue;
    const ext = file.slice(file.lastIndexOf('.'));
    if (!exts.has(ext) && !file.endsWith('.env.example')) continue;
    let content;
    try { content = readFileSync(file, 'utf8'); } catch { continue; }
    const PLACEHOLDER = /your_|replace_with|changeme|example|xxx|\$\{/i;
    for (const { name, re } of SECRET_PATTERNS) {
      const m = content.match(re);
      if (m && !PLACEHOLDER.test(m[0])) {
        findings.push({ file: rel, pattern: name });
        break;
      }
    }
  }
  return findings;
}

function gitEnvHistory() {
  try {
    const out = execSync(
      'git log --all --name-only --oneline -- ".env" ".env.local" ".env.production"',
      { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim();
    return out || null;
  } catch {
    return null;
  }
}

function npmAudit() {
  try {
    execSync('npm audit --audit-level=moderate', { cwd: ROOT, stdio: 'inherit' });
    return 0;
  } catch (e) {
    return e.status ?? 1;
  }
}

console.log('=== Security Safe Checks ===');
console.log(`Root: ${ROOT}`);
console.log(`Date: ${new Date().toISOString()}\n`);

// 1. Secret pattern scan
console.log('--- Secret pattern scan (tracked source files) ---');
const secretHits = scanTrackedFiles();
if (secretHits.length === 0) {
  console.log('No obvious secret patterns in scanned files.');
} else {
  for (const h of secretHits) {
    console.log(`  [WARN] ${h.pattern} → ${h.file}`);
  }
}

// 2. Git history for env files
console.log('\n--- Git history: .env files ---');
const hist = gitEnvHistory();
if (!hist) console.log('No .env/.env.local commits found (or not a git repo).');
else console.log(hist);

// 3. .gitignore
console.log('\n--- .gitignore ---');
const gi = join(ROOT, '.gitignore');
if (existsSync(gi)) {
  const txt = readFileSync(gi, 'utf8');
  console.log(txt.includes('.env') ? '.env* pattern present in .gitignore' : '[WARN] .env not in .gitignore');
} else {
  console.log('[WARN] No .gitignore');
}

// 4. npm audit
console.log('\n--- npm audit (moderate+) ---');
const auditCode = npmAudit();
if (auditCode !== 0) console.log(`npm audit exited with code ${auditCode}`);

console.log('\n=== Done (read-only checks only) ===');
process.exit(secretHits.length > 0 || auditCode !== 0 ? 1 : 0);
