# Deployment

תיעוד build, Docker, environment, והרצה — לפי מה שקיים ב-repo.

---

## Environments

One codebase, configuration via environment variables only. No duplicated code between environments.

| Environment | `APP_ENV` | `NODE_ENV` | How it runs | Frontend |
|-------------|-----------|------------|-------------|----------|
| **Local development** | `development` | unset / `development` | `npm run dev` | Vite HMR via Express |
| **Staging (cloud)** | `staging` | `production` | Docker on Render/Railway | Static `dist/` |
| **Production (cloud)** | `production` | `production` | Docker on Render/Railway | Static `dist/` |

Copy `.env.example` → `.env.local` for local development. Cloud secrets are set in the platform dashboard.

---

## Development Setup

### Prerequisites

- Node.js 22+ (matches `Dockerfile`: `node:22-alpine`)
- npm

### Steps

```bash
cd PrepWize          # repo root
npm install
cp .env.example .env.local   # then add your GEMINI_API_KEY
npm run dev
```

App available at: **http://localhost:3000**

### What `npm run dev` Does

```json
"dev": "tsx server.ts"
```

1. `tsx` executes `server.ts` directly (no pre-build)
2. Express starts on port 3000
3. Vite dev server created in middleware mode
4. Hot Module Replacement active (unless `DISABLE_HMR=true`)

---

## Build Pipeline

```json
"build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs"
```

### Step 1: Vite Client Build

```
vite build → dist/
├── index.html
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```

Config: `vite.config.ts`
- Plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`
- Alias: `@/` → project root

### Step 2: Server Bundle

```
esbuild server.ts → dist/server.cjs
```

- Format: CommonJS
- Platform: Node
- Packages: external (not bundled — resolved at runtime from node_modules)
- Sourcemap: enabled

### Production Start

```json
"start": "node dist/server.cjs"
```

Requires:
- `NODE_ENV=production` (set in Dockerfile)
- `dist/` directory from build
- `node_modules/` with production dependencies

---

## Docker

PrepWize runs as a **single container** (monolith). No multi-service compose stack — there is no DB or separate frontend server to orchestrate.

**Development stays native:** use `npm run dev`. Docker is for production-style runs only.

### Dockerfile (multi-stage)

1. **builder** — `npm ci` → `npm run build` (Vite client + esbuild server bundle)
2. **production** — production `node_modules` + `dist/` only; smaller image, no devDependencies

Includes a `HEALTHCHECK` against `GET /api/health`.

### Build & Run

```bash
docker build -t prepwize .
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  prepwize
```

### Docker Compose (production)

```bash
GEMINI_API_KEY=your_key docker compose up --build
```

Compose reads `GEMINI_API_KEY` and `PORT` from your shell or a `.env` file in the project root (for variable substitution only — not copied into the image).

### Optional env vars for Docker

```bash
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e GEMINI_API_KEY=your_key \
  prepwize
```

### .dockerignore

Excludes `node_modules`, secrets, `PrepWize1/`, `e2e/`, docs, and other files not needed for the production build.

---

## Cloud deploy (Render / Railway)

PrepWize is a **single Docker container** — no database, no extra services. Both platforms detect the root `Dockerfile` automatically.

Deploy **two Web Services** from the same repo for staging and production (same Docker image, different env vars).

### Environment variables by deploy target

Set in the platform dashboard (**never** in Git or the Dockerfile):

| Variable | Local dev | Staging | Production |
|----------|-----------|---------|------------|
| `APP_ENV` | `development` | `staging` | `production` |
| `NODE_ENV` | `development` | `production` | `production` |
| `GEMINI_API_KEY` | your key | staging key (recommended) | production key |
| `APP_URL` | `http://localhost:3000` | `https://your-staging-url` | `https://your-prod-url` |
| `ALLOWED_ORIGINS` | empty (same-origin) | staging URL | production URL |
| `PORT` | `3000` | auto (platform) | auto (platform) |

Without `GEMINI_API_KEY`, the app still runs using built-in server fallbacks.

### Staging vs production workflow

1. **Staging service** — auto-deploy from `main`; `APP_ENV=staging`; test full flows and Gemini integration.
2. **Production service** — manual promote or separate branch; `APP_ENV=production`.
3. The SPA shows an amber **Staging** banner when `APP_ENV=staging` (via `GET /api/config`).

### Render

**Staging**
1. New Web Service → connect repo → Environment: Docker
2. Name e.g. `prepwize-staging`
3. Env: `APP_ENV=staging`, `NODE_ENV=production`, `GEMINI_API_KEY`, `APP_URL`, `ALLOWED_ORIGINS`
4. Health check path: `/api/health`

**Production**
1. Duplicate service or create `prepwize-production`
2. Env: `APP_ENV=production`, same pattern with production URLs/keys
3. Disable auto-deploy or use manual promote from staging

### Railway

**Staging project/service**
1. Deploy from GitHub → Dockerfile detected
2. Variables: `APP_ENV=staging`, `NODE_ENV=production`, `GEMINI_API_KEY`, `APP_URL`, `ALLOWED_ORIGINS`

**Production project/service**
1. Separate service or environment with `APP_ENV=production` and production secrets

### Local production container (same as cloud)

```bash
docker build -t prepwize .
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e APP_ENV=production \
  -e GEMINI_API_KEY=your_key \
  prepwize
```

Cloud platforms map their dynamic port via `-e PORT=...` internally — no change needed in the app.

---

## CI/CD (GitHub Actions)

Three workflows — same codebase for local, staging, and production. **No secrets in YAML files.**

### Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | PR + push to `main` | `npm ci` → lint → build → Playwright E2E → Docker build verify |
| `deploy-staging.yml` | After CI succeeds on `main` | POST Render deploy hook → staging |
| `deploy-production.yml` | Manual (`workflow_dispatch`) | Requires CI pass + type `deploy` → production |

**Local dev is unchanged:** `npm run dev` + `.env.local`. Docker Compose remains optional for local production smoke tests.

### GitHub Environments

Create in **Settings → Environments**:

| Environment | Purpose | Suggested protection |
|-------------|---------|----------------------|
| `staging` | Auto deploy after CI | None |
| `production` | Manual release | Required reviewers |

### GitHub Secrets (deploy hooks only)

| Secret | Environment | Source |
|--------|-------------|--------|
| `RENDER_DEPLOY_HOOK_STAGING` | staging | Render → Service → Deploy Hook |
| `RENDER_DEPLOY_HOOK_PRODUCTION` | production | Render → Service → Deploy Hook |

Runtime secrets (`GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, `SESSION_SECRET`) stay in **Render/Railway dashboard**, not GitHub.

### CI notes

- Node **22** (matches Dockerfile)
- E2E runs with empty `GEMINI_API_KEY` — server fallbacks, no API cost
- Failed E2E uploads `playwright-report` artifact
- Staging deploy **skips gracefully** if deploy hook secret is not configured yet

### Production release

1. Merge to `main` → CI runs → staging deploys (when hook configured)
2. Verify staging URL
3. **Actions → Deploy Production → Run workflow** → confirm with `deploy`

---

## Environment Variables

### Required for Full AI Features

| Variable | Example | Where |
|----------|---------|-------|
| `GEMINI_API_KEY` | `AIza...` | `.env.local` or Docker `-e` |

Without this key:
- Server fallbacks activate automatically
- App runs in degraded mode with local mock content

### Optional

| Variable | Default | Purpose |
|----------|---------|---------|
| `APP_ENV` | `development` / inferred | Logical environment: `development`, `staging`, `production` |
| `APP_URL` | empty | Public URL for logging and future link generation |
| `ALLOWED_ORIGINS` | empty | Comma-separated CORS origins (monolith is usually same-origin) |
| `PORT` | `3000` | HTTP listen port |
| `NODE_ENV` | unset (dev) | Controls Vite vs static serving |
| `DISABLE_HMR` | unset | `true` → disable HMR (AI Studio agent edits) |

### Loading

```typescript
// server.ts
import dotenv from "dotenv";
dotenv.config();  // reads .env, .env.local, etc.
```

### Git Ignore

```
.env*
!.env.example
```

**Never commit** `.env.local`.

---

## Google AI Studio Deployment

The project originated from Google AI Studio:

- `metadata.json` — app manifest
- `GEMINI_API_KEY` configured in AI Studio Secrets tab
- `User-Agent: aistudio-build` header on Gemini client
- `DISABLE_HMR=true` recommended during agent code edits
- `assets/.aistudio/.gitignore` ignores all assets (`*`)

### AI Studio Capabilities Declared

```json
"majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
```

Server-side Gemini is **required** for full functionality; fallbacks exist for resilience.

---

## Port Configuration

| Context | Port |
|---------|------|
| Default | 3000 |
| PRD specification | 3000 |
| Docker EXPOSE | 3000 |
| PrepWize1 server.ts | hardcoded 3000 (no PORT env) |

Root `server.ts` respects `process.env.PORT`.

---

## Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `tsx server.ts` | Development server |
| `build` | `vite build && esbuild ...` | Production build |
| `start` | `node dist/server.cjs` | Production server |
| `lint` | `tsc --noEmit` | TypeScript check |
| `clean` | `rm -rf dist server.js` | Remove build artifacts |

**No test script exists.**

---

## CI/CD

**Not configured in repo.** No GitHub Actions, no cloud deploy configs.

If adding CI, minimum recommended:

```yaml
- npm install
- npm run lint
- npm run build
```

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Blank page in prod | Missing `npm run build` | Run build before start |
| AI returns fallback content | Missing/invalid `GEMINI_API_KEY` | Set key in `.env.local` |
| Port in use | Another process on 3000 | Set `PORT=3001` |
| TypeScript errors | Type mismatch | `npm run lint` |
| HMR flickering in AI Studio | Agent edits trigger reload | Set `DISABLE_HMR=true` |

---

## PrepWize1 Deployment Note

`PrepWize1/` has identical Dockerfile and package.json. It is a **separate nested git repo** — deploy independently only if explicitly intended. Default deployment target is **repo root**.

---

## PrepWize_backend

`PrepWize_backend/` contains only a README — **not deployable**. Backend is embedded in root `server.ts`.
