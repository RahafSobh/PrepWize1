# Cloud & Data Security

## Secrets management

| Do | Don't |
|----|-------|
| Platform env vars (Render, Fly, AWS) | Commit `.env.local` |
| `.env.example` placeholders | Real keys in Docker layers |
| Separate dev/staging/prod secrets | One key for all environments |
| Rotate on leak suspicion | Log env at startup |

PrepWize:

- `dotenv.config({ path: '.env.local' })` then `.env` — correct for dev
- `.dockerignore` blocks `.env.*` — verify in review
- CI: `GEMINI_API_KEY: ""` — good

## Git exposure

```bash
git log --all --name-only --oneline -- ".env" ".env.local" "*.pem" "*.key"
git log -p -S "AKIA" --all
git log -p -S "sk-" --all
```

If secrets were committed: rotate immediately, use `git filter-repo` or BFG, force-push only with team approval.

## Docker

- Multi-stage build; no secrets in `COPY . .` layers if `.dockerignore` fails
- Run as non-root user when possible
- No debug ports exposed in production image

PrepWize Dockerfile: Node 22 Alpine, `NODE_ENV=production`, HEALTHCHECK on `/api/health`.

## CI/CD

- Least privilege `GITHUB_TOKEN`
- Secrets in GitHub Environments (staging/production)
- No secrets in workflow logs
- Deploy hooks via secrets, not hardcoded URLs

## Data at rest

PrepWize: data in browser `localStorage` — not encrypted, cleared per browser profile.

If adding DB later:

- Encrypt backups
- TLS to database
- Field-level encryption for sensitive columns

## Access control (cloud)

- IAM least privilege
- Separate staging/production projects
- Audit logs enabled on cloud provider

## Sensitive data exposure

- `/api/health` — should not leak versions/secrets (PrepWize returns env name only — OK)
- `/api/config` — public client ID OK; never expose secrets

## Backups & retention

Document:

- What is backed up (sessions, PII, logs)
- Retention period
- Deletion process (GDPR erasure)

PrepWize: no server persistence — user clears via browser; document in privacy notice if EU users.

## Verification

- Inspect built `dist/` for secret strings
- `docker history` — no env files in layers
- Review Render/cloud dashboard env var access controls
