# Compliance Reference — ISO 27001, ISO 27002, SOC 2

**Use as control-mapping reference only.** Passing this checklist does **not** mean ISO 27001 certified or SOC 2 Type II audited.

## ISO/IEC 27001 — Annex A themes (mapping)

| Control theme | Review questions |
|---------------|------------------|
| A.5 Policies | Security policy documented? |
| A.8 Asset management | Inventory of data, keys, third parties? |
| A.9 Access control | AuthN/AuthZ on all sensitive functions? |
| A.10 Cryptography | TLS, secret management, hashing? |
| A.12 Operations | Logging, backup, change management? |
| A.14 Secure development | Code review, dependency scanning, SDLC? |
| A.15 Supplier relationships | Gemini, Google OAuth, host DPAs? |
| A.16 Incident management | Playbook for key leak, breach? |

## ISO/IEC 27002 — operational guidance

Use alongside findings to suggest **proportionate** controls for startup/small teams:

- Access reviews quarterly
- Patch dependencies monthly
- Secrets rotation on personnel change
- Secure defaults in production config

## SOC 2 Type II — trust principles (reference)

| Principle | Technical signals |
|-----------|-------------------|
| **Security** | Auth, encryption, vuln management, headers |
| **Availability** | Health checks, rate limits, monitoring |
| **Confidentiality** | Access control, encryption, minimal data |
| **Processing integrity** | Input validation, accurate AI disclaimers |
| **Privacy** | Notice, retention, subject rights (if PII) |

Auditors expect **evidence over time** (logs, tickets, policies) — not just code state.

## Security readiness report language

**Say:**

- "Finding maps to OWASP A01 / ISO 27001 A.9 access control theme"
- "Gap vs SOC 2 Security criterion: logical access controls incomplete on API layer"
- "Recommended before external audit: ..."

**Do not say:**

- "The system is ISO 27001 compliant"
- "SOC 2 certified"
- "Enterprise-grade secure"

## PrepWize typical gaps (for readiness discussions)

1. No formal ISMS or policy set
2. API access control incomplete
3. No centralized logging/SIEM
4. Mock auth in codebase
5. No documented incident response
6. Dependency audit ad hoc (should be scheduled)

## Verification for readiness assessment

- Produce gap matrix: Control → Status (Met/Partial/Gap) → Evidence → Remediation
- Separate **code fixes** from **organizational controls** (policies, training, audits)
