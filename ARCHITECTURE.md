# PrepWize — Architecture

תיאור הארכיטקטורה **כפי שהיא קיימת בקוד**, לא כפי שמתואר ב-PRD העתידי.

---

## סקירה כללית

PrepWize הוא **monolith full-stack** — אפליקציית SPA ב-React, מוגשת ומגובה על ידי שרת Express יחיד (`server.ts`). אין microservices, אין DB, אין message queue.

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React 19 SPA)                   │
│  App.tsx ── view state machine                               │
│  localStorage ← profile, sessions, auth flag                 │
│  SimulatorScreen ── fetch('/api/...')                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ same-origin HTTP
┌──────────────────────────▼──────────────────────────────────┐
│              server.ts (Express, port 3000)                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ API Layer                                                │  │
│  │  GET  /api/health                                        │  │
│  │  POST /api/interview/start   ──► Gemini (JSON schema)   │  │
│  │  POST /api/interview/chat    ──► Gemini (text)          │  │
│  │  POST /api/interview/feedback ──► Gemini (JSON schema)  │  │
│  │  POST /api/code/run          ──► JS eval / mock        │  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Static / Dev Layer                                       │  │
│  │  dev:  Vite middleware (HMR)                             │  │
│  │  prod: express.static('dist/') + SPA fallback            │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
              GEMINI_API_KEY (.env.local)
                           │
              Google Gemini API (gemini-3.5-flash)
```

---

## Frontend

### Entry & Bootstrap

- `index.html` → `src/main.tsx` → `App.tsx`
- `src/index.css` — Tailwind v4, Google Fonts (Inter, Outfit, JetBrains Mono), light theme

### Routing

**אין React Router.** ניווט מבוסס state:

```typescript
type View = 'dashboard' | 'setup' | 'simulator' | 'feedback' | 'pricing';
```

`App.tsx` מחזיק:
- `currentView` — מסך נוכחי
- `isAuthenticated` — gate לפני כל ה-views
- `profile: UserProfile` — sync ל-localStorage
- `sessions: InterviewSession[]` — היסטוריית סימולציות
- `selectedPreferences` — config לסימולטור פעיל
- `selectedSessionForReport` — session לדוח feedback

### Component Hierarchy

```
App
├── [unauthenticated] AuthScreen
└── [authenticated]
    ├── Header (Logo, streak, onboarding, profile, sign-out)
    ├── Main (view switch)
    │   ├── Dashboard (+ AchievementsSection, TipOfTheDay)
    │   ├── SetupScreen
    │   ├── SimulatorScreen
    │   ├── FeedbackReportScreen
    │   └── PricingScreen
    ├── Footer
    └── OnboardingGuide (modal)
```

### Styling

- Tailwind utility classes ב-components
- `motion/react` לאנימציות (transitions, modals)
- `lucide-react` לאייקונים
- SVG inline ב-`Logo.tsx`

---

## Backend / API

קובץ יחיד: `server.ts` (~690 שורות).

### Responsibilities

1. **JSON body parsing** — `express.json()`
2. **Gemini client** — lazy init via `getGeminiClient()`
3. **Interview lifecycle endpoints** — start, chat, feedback
4. **Code runner** — JS sandbox + mock for other languages
5. **Frontend serving** — Vite (dev) or `dist/` (prod)

### Dev vs Production

| Mode | Trigger | Frontend serving |
|------|---------|------------------|
| Development | `NODE_ENV !== 'production'` | Vite middleware (`createViteServer`) |
| Production | `NODE_ENV === 'production'` | `express.static(dist)` + `index.html` fallback |

Build pipeline (`npm run build`):
1. `vite build` → `dist/` (client assets)
2. `esbuild server.ts` → `dist/server.cjs` (Node bundle)

---

## AI Integration

### Client Setup

```typescript
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});
```

### Model

**`gemini-3.5-flash`** — בכל שלושת endpoints ה-AI.

### Three AI Touchpoints

| Endpoint | Input context | Output | Temperature |
|----------|---------------|--------|-------------|
| `/api/interview/start` | type, difficulty, role, language, style, topic | JSON: `initialMessage` + optional `problem` | 0.8 |
| `/api/interview/chat` | history, currentCode/currentDraft, persona params | `{ text: string }` | 0.7 |
| `/api/interview/feedback` | full history + final code/draft | JSON: `FeedbackReport` fields | 0.4 |

### Resilience Pattern

כל endpoint AI עטוף ב-`try/catch`:
- **Success** → Gemini response
- **Failure** (missing key, API error) → local fallback generator (`buildFallbackStartResponse`, `buildFallbackChatResponse`, `buildFallbackFeedbackResponse`)

Frontend (`SimulatorScreen`) משכפל את ה-pattern — `catch` blocks עם mock data מקומי.

---

## Request Flow — User to Response

### 1. Authentication (Mock)

```
User → AuthScreen form → setTimeout(1200ms) → onAuthSuccess(profile)
  → localStorage.prepwise_authenticated = 'true'
  → currentView = 'dashboard'
```

אין קריאת API. Validation client-side בלבד.

### 2. Session Setup

```
User → Dashboard "New Interview" → SetupScreen
  → selects: type, difficulty, role, language, style, [topic]
  → App.handleLaunchSession(prefs)
     → plan gating (Free limits)
     → currentView = 'simulator'
```

### 3. Interview Start

```
SimulatorScreen mount
  → POST /api/interview/start { preferences }
     → server: Gemini generateContent (JSON schema)
        OR buildFallbackStartResponse()
  ← { initialMessage, problem? }
  → setMessages([interviewer greeting])
  → setProblem + setEditorCode (if Algo)
```

### 4. Chat Loop

```
User sends message
  → POST /api/interview/chat {
       type, difficulty, role, language, style,
       history: ChatMessage[],
       currentCode?, currentDraft?
     }
     → server: format conversation → Gemini generateContent
        OR buildFallbackChatResponse()
  ← { text }
  → append interviewer message to chat
```

Root version also supports **hint request** — additional chat call with hint-oriented context.

### 5. Code Execution (Algo only)

```
User clicks "Run Tests"
  → POST /api/code/run { code, language, testCases }
     → if JS/TS: Function constructor evaluation per test case
     → else: mock pass/fail (~70% random)
  ← { runSuccess, consoleLogs, results[] }
  → display in terminal tab
```

### 6. Feedback Generation

```
User ends session
  → POST /api/interview/feedback {
       type, difficulty, role, language,
       history, finalCode?, finalDraft?
     }
     → server: Gemini generateContent (feedback JSON schema)
        OR buildFallbackFeedbackResponse()
  ← FeedbackReport
  → App.handleFeedbackGenerated(session)
     → sessions.unshift + profile update + currentView = 'feedback'
```

### 7. Report & Persistence

```
FeedbackReportScreen displays scores, strengths, weaknesses, summary
  → sessions saved to localStorage.prepwise_sessions
  → Dashboard charts update from session history
```

---

## Deployment

### Local Development

```bash
npm run dev   # tsx server.ts
# → Express on :3000 + Vite HMR
```

### Docker Production

```
Dockerfile (multi-stage):
  builder:  npm ci → npm run build
  production: npm ci --omit=dev + dist/
  HEALTHCHECK → GET /api/health
  CMD node dist/server.cjs

docker-compose.yml: single prepwize service (production only)
Dev workflow: npm run dev (not containerized)
```

### Google AI Studio

- `metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`
- `requestFramePermissions: ["microphone"]` — planned voice feature
- `DISABLE_HMR=true` in agent edit mode (vite.config.ts)

---

## Dependencies Between Components

```
types.ts
  ↑ imported by App.tsx, all components, server.ts (via shared shapes in req/res)

App.tsx
  → Dashboard, SetupScreen, SimulatorScreen, FeedbackReportScreen, PricingScreen
  → manages UserProfile + InterviewSession[] state
  → plan gating before simulator

SetupScreen
  → produces InterviewPreferences → App → SimulatorScreen

SimulatorScreen
  → fetch → server.ts endpoints
  → produces InterviewSession → App.handleFeedbackGenerated

server.ts
  → depends on GEMINI_API_KEY
  → independent of frontend component structure
  → serves frontend (no import from src/)

localStorage
  ← App.tsx (profile, sessions, auth)
  ← OnboardingGuide (prepwise_onboarded)
```

### External Dependencies

| Package | Used by | Purpose |
|---------|---------|---------|
| `@google/genai` | server.ts | Gemini API |
| `express` | server.ts | HTTP server |
| `vite` | server.ts (dev), build | Frontend bundling |
| `react` / `react-dom` | src/ | UI |
| `motion` | components | Animations |
| `lucide-react` | components | Icons |
| `dotenv` | server.ts | Env loading |
| `esbuild` | build script | Server bundle |

---

## What Is NOT Part of the Architecture

| Item | Status |
|------|--------|
| `PrepWize_backend/` | Placeholder README only; separate git repo |
| `PrepWize1/` | Nested UI refactor copy; not deployed separately |
| Database | Not implemented |
| Real authentication | Mock only |
| Microservices | Not implemented |
| Test infrastructure | Not implemented |
| CI/CD config | Not in repo |

---

## PrepWize1 Divergence Note

`PrepWize1/src/` contains an alternate UI generation:
- Dark theme with CSS design tokens
- `LandingPage`, `AppShell`, `ui/*` component library
- Some features (OnboardingGuide, Achievements, TipOfTheDay) exist as files but are **not wired** in App.tsx

The **backend and types are identical**. Architecture above applies to both; UI structure differs.
