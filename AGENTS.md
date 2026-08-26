# PrepWize — הנחיות ל-Coding Agents

מסמך זה הוא נקודת הכניסה הראשית לכל agent שעובד על PrepWize. קרא אותו לפני שינוי קוד.

> **מקור האמת:** שורש הריפו (`/`), בעיקר `src/` ו-`server.ts`.  
> לבחירת מסמכים לפי סוג משימה — ראה [`docs/README.md`](docs/README.md).

---

## מטרת הפרויקט

**PrepWize** (PrepWise AI) הוא פלטפורמת הכנה לראיונות עבודה מבוססת AI, המיועדת לסטודנטים ומפתחים junior. המערכת מספקת:

- סימולציות ראיון **Algo** (קוד + הרצת בדיקות)
- סימולציות **Behavioral** (מתודולוגיית STAR)
- סימולציות **System Design** (טיוטת ארכיטקטורה)
- משוב AI מובנה (ציונים 1–5, חוזקות, חולשות, המלצות)
- מעקב התקדמות, achievements, streak, ותמחור מדומה (Free / Starter / Pro / Career+)

האפליקציה נבנתה כפרויקט **Google AI Studio** (ראה `metadata.json`) עם Gemini בצד השרת.

---

## טכנולוגיות בפועל

| שכבה | טכנולוגיה | גרסה / הערות |
|------|-----------|--------------|
| Frontend | React | 19 |
| שפה | TypeScript | ~5.8 |
| Bundler / Dev | Vite | 6 |
| Styling | Tailwind CSS | v4 (`@tailwindcss/vite`) |
| אנימציות | motion (Framer Motion) | 12.x |
| אייקונים | lucide-react | 0.546 |
| Backend | Express | 4.21 |
| AI | `@google/genai` | Gemini `gemini-3.5-flash` |
| Runtime dev | tsx | מריץ `server.ts` ישירות |
| Build prod | esbuild | bundle ל-`dist/server.cjs` |
| Container | Docker | Node 22 Alpine |
| Persistence | localStorage | אין DB, אין auth server |

**לא קיים בפרויקט:** React Router, Redux/Zustand, PostgreSQL/MongoDB, JWT/OAuth אמיתי, microservices, Vitest/Jest, PrepWize_backend (placeholder בלבד).

---

## מבנה הפרויקט

```
PrepWize/                          ← שורש הריפו (canonical)
├── AGENTS.md                      ← מסמך זה
├── ARCHITECTURE.md                ← ארכיטקטורה
├── docs/                          ← תיעוד רכיבים
├── server.ts                      ← Express + Gemini + Vite/static
├── src/
│   ├── App.tsx                    ← state machine + routing
│   ├── main.tsx                   ← entry point
│   ├── types.ts                   ← shared types
│   ├── index.css                  ← Tailwind + theme
│   └── components/
│       ├── AuthScreen.tsx
│       ├── Dashboard.tsx
│       ├── SetupScreen.tsx
│       ├── SimulatorScreen.tsx    ← ליבת הסימולטור + API calls
│       ├── FeedbackReportScreen.tsx
│       ├── PricingScreen.tsx
│       ├── OnboardingGuide.tsx
│       ├── AchievementsSection.tsx
│       ├── TipOfTheDay.tsx
│       └── Logo.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
├── Dockerfile
├── metadata.json                  ← Google AI Studio manifest
├── PRD.md                         ← Product requirements (לא קוד)
├── PrepWize1/                     ← עותק/refactor UI — לא canonical
└── PrepWize_backend/              ← README בלבד — לא בשימוש
```

### PrepWize1 — אזהרה

`PrepWize1/` הוא עותק מקונן עם UI refactor (dark theme, `AppShell`, `LandingPage`, קומפוננטות `ui/`). **אל תערבב שינויים** בין root ל-PrepWize1 אלא אם המשימה מפורשת. ברירת המחדל: עבוד על `src/` בשורש.

---

## Conventions וכללי עבודה

### קוד

1. **TypeScript strict-ish** — הרץ `npm run lint` (`tsc --noEmit`) לפני סיום.
2. **Path alias** — `@/` מצביע לשורש (`vite.config.ts`, `tsconfig.json`).
3. **רישיון** — קבצי `.tsx` כוללים header `@license SPDX-License-Identifier: Apache-2.0`.
4. **אין React Router** — ניווט דרך `currentView` state ב-`App.tsx`.
5. **Types מרכזיים** — כל interfaces ב-`src/types.ts`; אל תכפיל.
6. **Fetch inline** — קריאות API ב-`SimulatorScreen.tsx` (אין שכבת API client נפרדת).
7. **Tailwind utilities** — styling ב-components; theme ב-`index.css`.
8. **שינוי מינימלי** — אל תוסיף abstractions, test frameworks, או DB בלי בקשה מפורשת.

### Git / קבצים

- **אל תcommit** `.env*`, `node_modules/`, `dist/`.
- **אל תשנה** `vite.config.ts` HMR logic (`DISABLE_HMR`) — מוגדר ל-AI Studio.
- **אל תמחק** fallback logic ב-server וב-frontend — האפליקציה חייבת לעבוד גם בלי Gemini key.

---

## הרצה, Build ו-Tests

### דרישות

- Node.js 22 (כמו ב-Dockerfile)
- `GEMINI_API_KEY` ב-`.env.local` (או `.env`) לתכונות AI מלאות

### פקודות

```bash
npm install
npm run dev      # tsx server.ts — Express + Vite HMR על פורט 3000
npm run build    # vite build + esbuild server.ts → dist/
npm start        # node dist/server.cjs (NODE_ENV=production)
npm run lint     # tsc --noEmit
npm run clean    # rm -rf dist server.js
```

### Docker

Production only (single container). Dev stays `npm run dev`.

```bash
docker build -t prepwize .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key prepwize

# or
GEMINI_API_KEY=your_key docker compose up --build
```

### Tests

**אין test suite.** `npm run lint` הוא ה-validation היחיד הקיים. אל תוסיף tests אלא אם התבקש.

---

## כללים לפי שכבה

### Frontend (`src/`)

- **State:** React `useState` + `useEffect`; persistence ב-localStorage.
- **Views:** `dashboard | setup | simulator | feedback | pricing` (ראה `App.tsx`).
- **Plan gating:** Free — מקסימום 3 סימולציות; System Design חסום ב-Free.
- **SimulatorScreen:** הלב של ה-UX — chat, editor, code run, feedback generation.
- **Auth:** mock בלבד (`AuthScreen` + `setTimeout`) — אין backend auth.

### Backend (`server.ts`)

- Monolith יחיד — Express משרת API + frontend (Vite dev / static prod).
- **Endpoints:** `/api/health`, `/api/interview/start`, `/api/interview/chat`, `/api/interview/feedback`, `/api/code/run`.
- **Fallbacks:** כל endpoint AI יש לו generator מקומי אם Gemini נכשל.
- **`/api/code/run`:** JavaScript/TypeScript — `Function` constructor; שפות אחרות — mock results.

### AI Integration

- SDK: `@google/genai` (`GoogleGenAI`).
- Model: `gemini-3.5-flash`.
- Structured output: `responseSchema` + `responseMimeType: application/json` ב-start ו-feedback.
- **אל תחשוף** `GEMINI_API_KEY` ב-client או בcommits.

---

## Environment Variables

| משתנה | מיקום | תפקיד |
|--------|-------|-------|
| `APP_ENV` | server | `development` / `staging` / `production` — סביבה לוגית |
| `GEMINI_API_KEY` | server | מפתח Google Gemini (חובה ל-AI אמיתי) |
| `GOOGLE_CLIENT_ID` | server + `/api/config` | Google Sign-In OAuth client ID (public) |
| `SESSION_SECRET` | server | חתימת httpOnly session cookie — **לעולם לא ב-client** |
| `APP_URL` | server | URL ציבורי (logging, CORS) |
| `ALLOWED_ORIGINS` | server | CORS — רשימת origins מופרדת בפסיקים |
| `PORT` | server | פורט HTTP (ברירת מחדל: 3000) |
| `NODE_ENV` | server | `production` → static files; אחרת → Vite middleware |
| `DISABLE_HMR` | vite.config | `true` → כיבוי HMR (AI Studio agent mode) |

### localStorage keys (client)

| Key | תוכן |
|-----|------|
| `prepwise_authenticated` | `"true"` / absent |
| `prepwise_profile` | `UserProfile` JSON |
| `prepwise_sessions` | `InterviewSession[]` JSON |
| `prepwise_onboarded` | onboarding flag |

---

## אבטחה

1. **GEMINI_API_KEY** — server-side בלבד; never in frontend bundle.
2. **Code execution** — `/api/code/run` משתמש ב-`Function` constructor; לא sandbox אמיתי. אל תרחיב בלי הערכת סיכונים.
3. **Auth mock** — אין validation server-side; אל תטען שיש אבטחה אמיתית.
4. **`.env*`** — ב-`.gitignore`; אל תcommit secrets.
5. **User-Agent** — `aistudio-build` ב-Gemini client (AI Studio requirement).

---

## מה אסור לשבור / לשנות ללא צורך

| אל תשנה | סיבה |
|---------|------|
| מבנה API endpoints + request/response shapes | Frontend תלוי בהם ישירות |
| `src/types.ts` interfaces | Shared contract frontend ↔ backend |
| Fallback generators ב-`server.ts` | Resilience כשאין API key |
| Client-side fallbacks ב-`SimulatorScreen.tsx` | Offline/degraded mode |
| Plan gating logic ב-`App.tsx` | Business rules |
| `vite.config.ts` HMR/watch config | AI Studio compatibility |
| `metadata.json` capabilities | AI Studio deployment |
| localStorage keys | Breaking change ל-users קיימים |
| `PrepWize_backend/` | Repo נפרד; לא חלק מהאפליקציה |

### שינויים שדורשים תיאום

- הוספת React Router
- הוספת DB / auth אמיתי
- שינוי model name מ-`gemini-3.5-flash`
- פיצול `server.ts` ל-microservices
- מיזוג/מחיקת `PrepWize1/`

---

## קישורים לתיעוד מפורט

| מסמך | נושא |
|------|------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | ארכיטקטורה כוללת |
| [docs/README.md](docs/README.md) | **Orchestration** — בחירת מסמכים לפי משימה |
| [docs/frontend.md](docs/frontend.md) | React SPA, components, state |
| [docs/backend-api.md](docs/backend-api.md) | Express endpoints |
| [docs/ai-integration.md](docs/ai-integration.md) | Gemini, prompts, fallbacks |
| [docs/interview-flow.md](docs/interview-flow.md) | Setup → Simulator → Feedback |
| [docs/data-and-state.md](docs/data-and-state.md) | Types, localStorage |
| [docs/deployment.md](docs/deployment.md) | Docker, build, env |
