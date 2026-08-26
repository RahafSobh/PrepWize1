---
name: security-code-review
description: >-
  Performs systematic security code and configuration review for web applications,
  REST/GraphQL APIs, cloud deployments, AI integrations, and user data handling.
  Use before deployment or production exposure, when reviewing pull requests, running
  vulnerability or dependency audits, secret scanning, secure coding checks, pentest
  checklists, API/auth reviews, cloud/data handling review, compliance or security
  readiness assessment, or when the user asks about risk, hardening, or safety—even
  if they do not say "security" explicitly.
---

# Security Code Review

Systematic, **read-only** security review for digital products during development.
Reusable across stacks; see [references/prepwize-stack.md](references/prepwize-stack.md) for the current monorepo baseline.

**This skill finds and prioritizes issues — it does not fix them unless the user explicitly asks.**

## Boundaries

- **Do:** static code review, config review, safe dependency/secret/git-history checks, threat modeling from code.
- **Do not:** aggressive pentest, brute force, DoS, or live exploitation against production without **explicit written approval**.
- **Do not:** claim ISO, SOC 2, PCI, or GDPR **compliance/certification** without a formal audit. Use OWASP, ISO 27001/27002, ASVS, SOC 2 principles, and GDPR as **reference frameworks only**.

## Workflow

Copy and track progress:

```
Review Progress:
- [ ] 1. Scope mapping
- [ ] 2. Safe automated checks (scripts)
- [ ] 3. Systematic category review
- [ ] 4. Stack-specific deep dive (references)
- [ ] 5. Findings report + prioritized remediation plan
- [ ] 6. (Only if asked) implement fixes
```

### Step 1 — Scope mapping

Before reviewing, document:

| Area | Questions |
|------|-----------|
| Languages | TS/JS, Python, Go, SQL, etc.? |
| Frameworks | React, Express, Next, Django, etc.? |
| Frontend / backend | SPA, SSR, BFF, monolith, microservices? |
| APIs | REST, GraphQL, webhooks, public vs internal? |
| Authentication | OAuth, JWT, sessions, mock/demo auth? |
| Database / storage | DB, localStorage, S3, Redis, files? |
| Cloud / deployment | Docker, Render, AWS, CI/CD, env vars? |
| Third-party services | AI, payments, email, analytics? |
| AI integrations | LLM provider, prompts, user content in context? |
| Payments | Stripe, card data, PCI scope? |
| Data types | PII, credentials, interview content, logs? |

Read project docs (`AGENTS.md`, `ARCHITECTURE.md`, `README`, `.env.example`) when present.

### Step 2 — Safe automated checks

Run from repo root (adjust per stack):

```bash
node .cursor/skills/security-code-review/scripts/run-safe-checks.mjs
npm audit
```

CVE/advisory data **changes over time**. Always verify with current tools:

- `npm audit` / `pnpm audit` / `yarn audit`
- `pip-audit`, `cargo audit`, `govulncheck` (as applicable)
- GitHub Dependabot / Advisory Database, Snyk, OSV.dev

Document tool versions and audit date in the report.

Also check:

- `.gitignore` covers `.env*`, secrets, keys
- `git log --all --name-only -- ".env" ".env.local"` (no committed secrets)
- CI workflows for leaked secrets or overly broad permissions

### Step 3 — Systematic category review

Review every category below. Skip only if clearly N/A; state "N/A" with reason.

| Category | Reference |
|----------|-----------|
| Injection (SQL, NoSQL, command, LDAP) | [api-security.md](references/api-security.md) |
| XSS (reflected, stored, DOM) | [react-frontend.md](references/react-frontend.md) |
| Authentication | [authentication.md](references/authentication.md) |
| Authorization, RBAC, IDOR | [api-security.md](references/api-security.md) |
| Session management, JWT | [authentication.md](references/authentication.md) |
| Secrets, API keys, `.env` exposure | [cloud-data-security.md](references/cloud-data-security.md) |
| Cryptography, password hashing | [authentication.md](references/authentication.md) |
| CSRF | [api-security.md](references/api-security.md) |
| SSRF | [api-security.md](references/api-security.md) |
| Insecure deserialization | [javascript-node.md](references/javascript-node.md) |
| File uploads, path traversal | [api-security.md](references/api-security.md) |
| Input validation, sanitization | [api-security.md](references/api-security.md) |
| Error handling, sensitive logging | [javascript-node.md](references/javascript-node.md) |
| Dependency CVEs | Step 2 + [review-checklist.md](references/review-checklist.md) |
| CORS, security headers, CSP, HSTS | [api-security.md](references/api-security.md) |
| Rate limiting, abuse prevention | [api-security.md](references/api-security.md) |
| Sensitive data exposure | [cloud-data-security.md](references/cloud-data-security.md) |
| Cloud configuration, access control | [cloud-data-security.md](references/cloud-data-security.md) |
| Backups, retention | [cloud-data-security.md](references/cloud-data-security.md) |
| AI abuse (prompt injection, cost abuse) | [ai-security.md](references/ai-security.md) |
| Privacy / GDPR (if PII) | [privacy-gdpr.md](references/privacy-gdpr.md) |
| ISO / SOC 2 readiness (reference) | [compliance-iso-soc2.md](references/compliance-iso-soc2.md) |
| Payments / PCI (if applicable) | [payment-security.md](references/payment-security.md) |

Full checklist: [references/review-checklist.md](references/review-checklist.md).

### Step 4 — Stack-specific deep dive

| Stack | File |
|-------|------|
| Node / Express / TypeScript | [javascript-node.md](references/javascript-node.md) |
| React SPA | [react-frontend.md](references/react-frontend.md) |
| PrepWize monolith (this repo) | [prepwize-stack.md](references/prepwize-stack.md) |

Search codebase with targeted patterns: `eval`, `Function(`, `dangerouslySetInnerHTML`, `innerHTML`, `process.env` in client bundle, `res.json({ error: err.message`, missing auth middleware, open CORS, hardcoded secrets.

### Step 5 — Report

Produce findings sorted **Critical → High → Medium → Low**, then a **prioritized remediation plan** (Phase 0 = blockers before public deploy).

**Do not implement broad fixes automatically** unless the user approves the plan.

## Finding format (required)

Use this template for **every** finding:

```markdown
### [SEVERITY] Title

**Description:** What is wrong and why it matters.

**File:** `path/to/file.ext`

**Line:** 123 (or line range)

**Severity:** Critical | High | Medium | Low

**Relevant standard/category:** e.g. OWASP A01 Broken Access Control, OWASP LLM01, ISO 27001 A.9

**Risk:** Impact on confidentiality, integrity, availability, cost, or compliance posture.

**Exploitation scenario:** Concrete attacker or abuse path.

**Concrete remediation:** Specific fix steps.

**Corrected code example:** (when applicable)

**Verification method:** How to confirm the fix (test, grep, audit re-run, manual check).
```

## Severity guide

| Level | Criteria |
|-------|----------|
| **Critical** | RCE, auth bypass with data access, exposed secrets, unauthenticated admin |
| **High** | Missing auth on sensitive APIs, weak session/crypto, major AI cost abuse, stored XSS |
| **Medium** | Missing headers, verbose errors, client-only gating, CORS misconfig risk |
| **Low** | Hygiene, logging noise, demo defaults, defense-in-depth gaps |

## Standards reference (not certification)

Map findings to frameworks for prioritization:

- **OWASP Top 10** (2021) — web risks
- **OWASP ASVS** — verification depth by level
- **OWASP LLM Top 10** — AI-specific risks
- **ISO/IEC 27001 & 27002** — control themes (access, crypto, ops)
- **SOC 2 Type II principles** — security, availability, confidentiality
- **GDPR** — if EU personal data is processed; apply privacy by design
- **PCI DSS** — only if cardholder data is stored/processed in scope

## Relationship to other tools

- **`review-security` skill / security-review subagent:** diff-focused review of branch/uncommitted changes. Use for PRs; use **this skill** for full product posture or pre-deploy reviews.
- **Remediation:** After report approval, implement minimal scoped fixes per project conventions (`AGENTS.md`).

## PrepWize quick baseline (known hotspots)

When reviewing this repo, always inspect:

1. `server.ts` — `/api/code/run` (code execution), unauthenticated `/api/interview/*`, CORS, errors
2. `src/App.tsx` — localStorage auth flag, client-side plan gating
3. `src/components/AuthScreen.tsx` — mock auth paths
4. `.env.example`, `.dockerignore`, `.github/workflows/` — secrets and CI

Details: [references/prepwize-stack.md](references/prepwize-stack.md).
