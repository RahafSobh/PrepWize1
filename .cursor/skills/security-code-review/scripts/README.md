# Scripts

Safe, local-only checks. **Do not** use against production without approval.

## run-safe-checks.mjs

From repository root:

```bash
node .cursor/skills/security-code-review/scripts/run-safe-checks.mjs
```

Performs:

1. Pattern scan for obvious secrets in source (excludes `node_modules`, `dist`)
2. Git history check for committed `.env` files
3. `.gitignore` verification for `.env`
4. `npm audit --audit-level=moderate`

Exit code `1` if warnings or audit issues found.

Re-run before releases; CVE data changes over time.
