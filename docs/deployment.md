# Deployment

תיעוד build, Docker, environment, והרצה — לפי מה שקיים ב-repo.

---

## Environments

| Environment | Command | NODE_ENV | Frontend |
|-------------|---------|----------|----------|
| Development | `npm run dev` | unset / development | Vite HMR via Express middleware |
| Production | `npm run build && npm start` | production | Static files from `dist/` |
| Docker | `docker build && docker run` | production (set in Dockerfile) | Static files from `dist/` |

---

## Development Setup

### Prerequisites

- Node.js 22+ (matches `Dockerfile`: `node:22-alpine`)
- npm

### Steps

```bash
cd PrepWize          # repo root
npm install
cp .env.example .env.local   # if .env.example exists; otherwise create .env.local
# Add: GEMINI_API_KEY=your_key_here
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

### Required environment variables

Set these in the platform dashboard (**never** in the repo or Dockerfile):

| Variable | Required | Notes |
|----------|----------|-------|
| `GEMINI_API_KEY` | Yes (for real AI) | From Google AI Studio / Gemini API |
| `NODE_ENV` | Recommended | Set to `production` |
| `PORT` | Auto | Render and Railway inject this; `server.ts` reads `process.env.PORT` |

Without `GEMINI_API_KEY`, the app still runs using built-in server fallbacks.

### Render

1. **New → Web Service** → connect your GitHub repo
2. **Environment:** Docker (uses root `Dockerfile`)
3. **Environment variables:** add `GEMINI_API_KEY`, `NODE_ENV=production`
4. Deploy — Render sets `PORT` automatically; health check path: `/api/health`

### Railway

1. **New Project → Deploy from GitHub**
2. Railway detects `Dockerfile` and builds automatically
3. **Variables:** add `GEMINI_API_KEY`, `NODE_ENV=production`
4. Railway assigns a public URL and sets `PORT`

### Local production container (same as cloud)

```bash
docker build -t prepwize .
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e GEMINI_API_KEY=your_key \
  prepwize
```

Cloud platforms map their dynamic port via `-e PORT=...` internally — no change needed in the app.

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
