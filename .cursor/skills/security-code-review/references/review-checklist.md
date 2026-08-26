# Security Review Checklist (Detailed)

Use during Step 3 of [SKILL.md](../SKILL.md). Mark N/A with reason.

## Injection

- [ ] SQL: parameterized queries / ORM; no string concatenation with user input
- [ ] NoSQL: operator injection in MongoDB-style queries (`$where`, `$regex` abuse)
- [ ] Command injection: `exec`, `spawn`, shell with user input
- [ ] LDAP / XPath / template injection where applicable
- [ ] Server-side code execution: `eval`, `Function`, `vm` without sandbox

## XSS

- [ ] Reflected: user input echoed in HTML/JSON without encoding
- [ ] Stored: persisted user/AI content rendered as HTML
- [ ] DOM-based: `innerHTML`, `document.write`, `dangerouslySetInnerHTML` with dynamic data
- [ ] Markdown/HTML renderers sanitize or use safe pipeline
- [ ] CSP limits inline scripts and untrusted sources

## Authentication

- [ ] No mock/demo auth in production paths
- [ ] Passwords hashed (bcrypt/argon2/scrypt); never plaintext
- [ ] MFA considered for sensitive apps
- [ ] Account lockout / rate limit on login
- [ ] OAuth: state parameter, redirect URI allowlist, ID token validation
- [ ] `email_verified` checked for Google/social login when email matters

## Authorization

- [ ] Every sensitive endpoint has server-side auth check
- [ ] RBAC / ownership checks (user A cannot access user B's resource)
- [ ] IDOR: IDs in URLs/body validated against session
- [ ] Admin routes separated and protected
- [ ] Client-side gating is not the only enforcement

## Session & JWT

- [ ] httpOnly, Secure, SameSite cookies in production
- [ ] Session secret strength enforced at startup
- [ ] Token expiry, rotation, logout invalidates session
- [ ] JWT: strong algorithm (RS256/ES256), no `alg: none`, short TTL
- [ ] No auth state in localStorage for security-sensitive apps

## Secrets & keys

- [ ] No secrets in client bundle (`import.meta.env` exposure audit)
- [ ] `.env*` gitignored; `.env.example` has placeholders only
- [ ] Git history scanned for committed keys
- [ ] Docker/CI do not copy `.env` into images
- [ ] Secrets in platform vault (Render, AWS SM), not repo

## Cryptography

- [ ] TLS in transit for production
- [ ] No custom crypto; use vetted libraries
- [ ] Keys rotated; dev/prod secrets separated

## CSRF

- [ ] State-changing requests protected (SameSite cookies, CSRF token, or double-submit)
- [ ] CORS + credentials combination reviewed

## SSRF

- [ ] User-supplied URLs not fetched server-side without allowlist
- [ ] Webhooks validated; no internal network probing

## Deserialization

- [ ] Untrusted JSON/protobuf/YAML not passed to dangerous parsers
- [ ] Prototype pollution guards on merge/extend

## File uploads & path traversal

- [ ] Extension/MIME validation, size limits, virus scan if needed
- [ ] Stored outside web root; random filenames
- [ ] `../` blocked in file paths

## Input validation

- [ ] Schema validation on API bodies (zod, joi, class-validator)
- [ ] Enum/range checks; reject unknown fields where appropriate
- [ ] Body size limits on JSON/multipart

## Error handling & logging

- [ ] Generic errors to clients; details server-side only
- [ ] No passwords, tokens, PII in logs
- [ ] Correlation IDs for support without leaking internals

## Dependencies

- [ ] `npm audit` / equivalent run and dated
- [ ] Dependabot or Snyk enabled
- [ ] Pin or review major dependency updates

## HTTP hardening

- [ ] Helmet or equivalent: CSP, X-Frame-Options, X-Content-Type-Options
- [ ] HSTS in production
- [ ] CORS: explicit origins; no `*` with credentials

## Rate limiting & abuse

- [ ] Limits on auth, AI, expensive, and public endpoints
- [ ] Cost quotas for third-party APIs (LLM, SMS, email)

## Data exposure

- [ ] PII minimization; retention policy documented
- [ ] Backups encrypted; access controlled
- [ ] Debug endpoints disabled in production

## Cloud & deployment

- [ ] Least-privilege IAM / service accounts
- [ ] Security groups / firewall minimal
- [ ] Health checks without sensitive data
- [ ] Staging vs production env separation

## AI-specific

- [ ] Prompt injection: user content separated from system instructions
- [ ] Input/output length limits
- [ ] AI endpoints authenticated and rate-limited
- [ ] No secrets in prompts or training data paths
- [ ] Monitor token/cost abuse

## Privacy (GDPR — if applicable)

- [ ] Lawful basis documented
- [ ] Data subject rights process (access, delete)
- [ ] Privacy notice; consent where required
- [ ] DPA with processors (AI provider, host)
- [ ] Cross-border transfer mechanisms if needed

## Payments (if applicable)

- [ ] No raw card data in app DB/logs
- [ ] PCI scope minimized via tokenization (Stripe etc.)
- [ ] Webhook signature verification
