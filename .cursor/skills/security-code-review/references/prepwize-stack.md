# PrepWize Stack — Security Review Baseline

Reference for the canonical repo at project root (`server.ts`, `src/`). Not a certification statement.

## Architecture summary

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind v4, localStorage (profile/sessions) |
| Backend | Express monolith (`server.ts`), Gemini via `@google/genai` |
| Auth | Google Sign-In + httpOnly JWT cookie; demo auth in dev (`POST /api/auth/demo`) |
| Persistence | localStorage only (no DB) |
| Deploy | Docker, GitHub Actions, Render (staging/production hooks) |

## Controls implemented (verify on each review)

| Control | Status |
|---------|--------|
| `requireAuth` on `/api/interview/*`, `/api/code/run` | ✅ |
| Rate limiting (API + AI + auth) | ✅ |
| Helmet + CSP (production) | ✅ |
| `/api/code/run` disabled in production | ✅ |
| Demo auth disabled in production | ✅ |
| Auth from `/api/auth/me` only (no localStorage flag) | ✅ |
| `email_verified` on Google login | ✅ |
| `SESSION_SECRET` min 32 chars (staging/production) | ✅ |
| Generic 500 errors to clients | ✅ |
| Input/body size limits | ✅ |

## Remaining gaps (future work)

| Item | Severity | Notes |
|------|----------|-------|
| `/api/code/run` sandbox | High (dev/staging) | Still uses `Function`/`eval` — replace with isolated runner or disable entirely |
| Plan gating | Medium | Client-side only — OK until real billing |
| Server-side user DB | Low | No IDOR today; needed for multi-device sync |

## Environment variables (server-only secrets)

| Variable | Risk if leaked |
|----------|----------------|
| `GEMINI_API_KEY` | API cost, data via model |
| `SESSION_SECRET` | Session forgery |
| `GOOGLE_CLIENT_ID` | Public by design |
| `ALLOWED_ORIGINS` | Misconfig → CORS + credentials risk |

Verify: `.env.local` gitignored, `.dockerignore` excludes `.env.*`, CI uses empty `GEMINI_API_KEY`.

## Safe checks for this repo

```bash
node .cursor/skills/security-code-review/scripts/run-safe-checks.mjs
npm audit
npm run lint
npm run test:e2e
```

## Files to grep during review

```bash
rg "eval|Function\(|dangerouslySetInnerHTML|innerHTML" server.ts src/
rg "localStorage\.(set|get)Item.*authenticated" src/
rg "GEMINI_API_KEY|SESSION_SECRET" --glob '!*.example'
```
