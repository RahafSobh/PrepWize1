# Frontend

תיעוד שכבת ה-Frontend — React SPA ב-`src/`.

---

## Stack

- **React 19** — functional components, hooks
- **TypeScript** — types מ-`src/types.ts`
- **Tailwind CSS v4** — utilities + `@import "tailwindcss"` ב-`index.css`
- **motion/react** — אנימציות (modals, transitions)
- **lucide-react** — אייקונים

אין: React Router, state management library, CSS modules, component library חיצוני (MUI/Chakra).

---

## Entry Point

```
index.html → src/main.tsx → App.tsx
```

`main.tsx` עוטף ב-`StrictMode` וטוען `index.css`.

---

## View State Machine

`App.tsx` מנהל navigation דרך `currentView`:

| View | Component | תיאור |
|------|-----------|-------|
| *(gate)* | `AuthScreen` | מוצג כש-`!isAuthenticated` |
| `dashboard` | `Dashboard` | analytics, history, achievements |
| `setup` | `SetupScreen` | בחירת פרמטרי סימולציה |
| `simulator` | `SimulatorScreen` | ראיון חי |
| `feedback` | `FeedbackReportScreen` | דוח לאחר סימולציה |
| `pricing` | `PricingScreen` | tier selection |

### Navigation Triggers

```typescript
// Dashboard → Setup
onStartNew={() => setCurrentView('setup')}

// Setup → Simulator (via handleLaunchSession)
onLaunch={handleLaunchSession}

// Simulator → Feedback (via handleFeedbackGenerated)
onFeedbackGenerated={handleFeedbackGenerated}

// Feedback → Dashboard
onClose={() => setCurrentView('dashboard')}

// Any → Pricing
onOpenPricing / plan gating redirect
```

---

## Components

### Core Flow

| File | Props (key) | Responsibility |
|------|-------------|----------------|
| `AuthScreen.tsx` | `onAuthSuccess`, `mockProfile` | Mock login/signup; avatar presets |
| `Dashboard.tsx` | `pastSessions`, `profile`, callbacks | Score chart, session list, role focus |
| `SetupScreen.tsx` | `onLaunch`, `onBack`, `userPlan` | Interview config form |
| `SimulatorScreen.tsx` | `preferences`, `onExit`, `onFeedbackGenerated` | Chat, editor, code run, feedback |
| `FeedbackReportScreen.tsx` | `session`, `onClose`, `onRetake` | Score display, markdown summary |
| `PricingScreen.tsx` | `currentProfile`, `onUpdatePlan` | Plan tier UI |

### Engagement / UI

| File | Used in | Responsibility |
|------|---------|----------------|
| `OnboardingGuide.tsx` | `App.tsx` (modal) | First-time carousel tour |
| `AchievementsSection.tsx` | `Dashboard.tsx` | Badge unlock system |
| `TipOfTheDay.tsx` | `Dashboard.tsx` | Rotating tips widget |
| `Logo.tsx` | Header, Auth | SVG hexagonal brand |

---

## Plan Gating (App.tsx)

```typescript
// Free tier: max 3 completed sessions (unless topic specified)
if (profile.plan === 'Free' && completedCount >= 3 && !prefs.topic) → pricing

// System Design requires paid plan
if (prefs.type === 'System Design' && profile.plan === 'Free') → pricing
```

Agent שמשנה gating — עדכן גם `SetupScreen` (UI hints) ו-`PricingScreen`.

---

## SimulatorScreen — Frontend Heart

הקומפוננטה הגדולה ביותר (~890 שורות). מחזיקה:

- **Chat state** — `messages: ChatMessage[]`
- **Algo editor** — `editorCode`, `problem: AlgorithmProblem`
- **System Design** — `designDraft`, `designNodes[]`
- **Behavioral** — `starChecklist` (Situation/Task/Action/Result)
- **Timer** — 45 minutes countdown
- **Test runner UI** — terminal tab, results display
- **Speech** — Web Speech API (`isRecording`) — UI only

### API Calls (inline fetch)

| Action | Endpoint |
|--------|----------|
| Session init | `POST /api/interview/start` |
| Send message | `POST /api/interview/chat` |
| Request hint | `POST /api/interview/chat` (root only) |
| Run code | `POST /api/code/run` |
| Generate feedback | `POST /api/interview/feedback` |

כל call כולל **client-side fallback** ב-`catch`.

---

## Styling Conventions

### Root Theme (canonical)

- Light background: `bg-zinc-50`, `text-zinc-900`
- Accent: emerald (`emerald-500`, `emerald-600`)
- Font: Inter (sans), Outfit (display), JetBrains Mono (code)
- Custom animations ב-`index.css`: `orbitalPulse`, `slideUp`, `colorWave`

### Patterns

```tsx
// Buttons — Tailwind utilities, no shared Button component in root
className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"

// Cards
className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6"

// Loading
<Loader2 className="w-5 h-5 animate-spin" />
```

### PrepWize1 Difference

`PrepWize1/src/` uses dark theme + reusable `ui/Button.tsx`, `ui/Card.tsx`, etc. Root does **not** have these — don't import from PrepWize1 into root.

---

## Path Alias

```typescript
import Something from '@/src/components/...'  // @/ → project root
```

---

## Adding a New Component

1. Create in `src/components/` (or `src/components/ui/` if building shared primitives)
2. Define props interface at top of file
3. Import types from `../types` (not duplicate)
4. Wire into `App.tsx` view switch or parent component
5. Use existing Tailwind patterns
6. Run `npm run lint`

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Adding React Router | Project uses state-based routing — extend `currentView` |
| Importing from PrepWize1 | Separate copy — don't cross-import |
| API calls in new component | Follow SimulatorScreen pattern or extract carefully |
| Hardcoded user data | Profile comes from `UserProfile` state / localStorage |
| Breaking onboarding | Check `prepwise_onboarded` key in localStorage |
