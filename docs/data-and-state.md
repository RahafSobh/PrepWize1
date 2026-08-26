# Data & State

תיעוד types, state management, ו-localStorage persistence.

---

## State Management Approach

**No external state library.** Pure React:

- `useState` — component and app state
- `useEffect` — localStorage sync, side effects
- Props drilling — App.tsx → child components

---

## TypeScript Types (`src/types.ts`)

Single source of truth for data shapes. **Identical** in root and PrepWize1.

### Enums / Unions

```typescript
type InterviewType = 'Algo' | 'Behavioral' | 'System Design';
type DifficultyLevel = 'Junior' | 'Mid-Level' | 'Senior' | 'Staff';
type JobRole = 'Frontend' | 'Backend' | 'Full Stack' | 'Mobile' | 'DevOps' | 'System Architect';
type InterviewerStyle = 'Friendly' | 'Neutral' | 'Strict' | 'Challenging';
```

### Core Interfaces

#### InterviewPreferences
```typescript
interface InterviewPreferences {
  type: InterviewType;
  difficulty: DifficultyLevel;
  role: JobRole;
  language: string;       // free string: 'Javascript', 'Python', etc.
  style: InterviewerStyle;
  topic?: string;         // optional focus area
}
```

#### ChatMessage
```typescript
interface ChatMessage {
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;      // ISO string
  codeSnapshot?: string;  // optional context
}
```

#### AlgorithmProblem
```typescript
interface AlgorithmProblem {
  title: string;
  description: string;    // Markdown
  starterCode: string;
  testCases: Array<{ input: string; expected: string }>;
}
```

#### FeedbackReport
```typescript
interface FeedbackReport {
  overallScore: number;              // 1-5
  strengths: string[];
  weaknesses: string[];
  technicalAccuracyScore: number;    // 1-5
  communicationSkillsScore: number;  // 1-5
  answerQualityScore: number;        // 1-5
  improvementSuggestions: string[];
  detailedSummary: string;           // Markdown
}
```

#### InterviewSession
```typescript
interface InterviewSession {
  id: string;
  preferences: InterviewPreferences;
  messages: ChatMessage[];
  problem?: AlgorithmProblem;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;      // ISO string
  feedback?: FeedbackReport;
}
```

#### UserProfile
```typescript
interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;      // emoji string e.g. '🚀'
  plan: 'Free' | 'Starter' | 'Pro' | 'Career+';
  simulationsCompleted: number;
  role: JobRole;
  streakCount: number;
}
```

---

## App-Level State (`App.tsx`)

| State | Type | Initial Source |
|-------|------|----------------|
| `currentView` | view union | `'dashboard'` |
| `isAuthenticated` | boolean | `localStorage.prepwise_authenticated` |
| `profile` | `UserProfile` | `localStorage.prepwise_profile` or defaults |
| `sessions` | `InterviewSession[]` | `localStorage.prepwise_sessions` or seed data |
| `selectedPreferences` | `InterviewPreferences \| null` | `null` |
| `selectedSessionForReport` | `InterviewSession \| null` | `null` |
| `isOnboardingOpen` | boolean | auto from `prepwise_onboarded` |

### Default Profile (no localStorage)

```typescript
{
  name: 'Maya',
  email: 'rahafsobh12@gmail.com',
  avatarUrl: '🚀',
  plan: 'Free',
  simulationsCompleted: 2,
  role: 'Full Stack',
  streakCount: 3
}
```

### Seed Sessions

`generatePrepopulatedHistory()` creates 2 demo completed sessions (Algo + Behavioral) so Dashboard charts render immediately for new users.

---

## localStorage Keys

| Key | Type | Written by | Read by |
|-----|------|------------|---------|
| `prepwise_authenticated` | `"true"` / absent | `App.tsx` on auth/sign-out | `App.tsx` init |
| `prepwise_profile` | `UserProfile` JSON | `App.tsx` useEffect | `App.tsx` init |
| `prepwise_sessions` | `InterviewSession[]` JSON | `App.tsx` useEffect | `App.tsx` init, Dashboard, Achievements |
| `prepwise_onboarded` | `"true"` / absent | `OnboardingGuide` on complete | `App.tsx` useEffect |

### Sync Pattern

```typescript
useEffect(() => {
  localStorage.setItem('prepwise_profile', JSON.stringify(profile));
}, [profile]);

useEffect(() => {
  localStorage.setItem('prepwise_sessions', JSON.stringify(sessions));
}, [sessions]);
```

**No sync on every keystroke** — only on state change via React.

---

## Auth State (Mock)

```
AuthScreen.handleSubmit()
  → setTimeout(1200ms) simulation
  → onAuthSuccess(UserProfile)
    → setProfile, setIsAuthenticated(true)
    → localStorage.prepwise_authenticated = 'true'
    → currentView = 'dashboard'
```

Sign out:
```
handleSignOut()
  → setIsAuthenticated(false)
  → localStorage.removeItem('prepwise_authenticated')
  // profile and sessions PERSIST across sign-out
```

---

## Plan State

```typescript
profile.plan: 'Free' | 'Starter' | 'Pro' | 'Career+'
```

Updated via `PricingScreen → handleUpdatePlan → setProfile`.

**No payment integration** — plan change is instant client-side toggle.

### Plan Effects

| Plan | Effect |
|------|--------|
| Free | Max 3 completed sessions; System Design blocked |
| Starter | Unlimited sessions (UI claim) |
| Pro | System Design unlocked |
| Career+ | Voice features planned (not implemented) |

---

## Component-Local State

### SimulatorScreen

Not persisted to localStorage — lives only during active session:

- `messages`, `editorCode`, `designDraft`, `designNodes`
- `starChecklist`, `testResults`, `timeRemaining`
- Lost on exit without generating feedback

### Dashboard

Read-only consumer of `pastSessions` and `profile` props.

---

## API ↔ Type Mapping

| API Endpoint | Request uses | Response maps to |
|--------------|-------------|------------------|
| `/api/interview/start` | `InterviewPreferences` | `{ initialMessage, problem? }` → partial session |
| `/api/interview/chat` | preferences + `history: ChatMessage[]` | `{ text }` → new ChatMessage |
| `/api/interview/feedback` | preferences + history + code/draft | `FeedbackReport` |
| `/api/code/run` | code + language + testCases | ad-hoc result shape (not in types.ts) |

**Note:** Code run results use `any[]` in SimulatorScreen — not typed in `types.ts`.

---

## Migration / Schema Changes

When modifying types:

1. Update `src/types.ts`
2. Update all components importing the type
3. Update `server.ts` request/response handling
4. Update fallback generators in `server.ts`
5. Consider localStorage backward compatibility:
   ```typescript
   // Pattern used for streakCount migration:
   if (typeof parsed.streakCount === 'undefined') parsed.streakCount = 3;
   ```
6. Update docs

**Breaking localStorage keys** will reset user data in browser — document in PR if intentional.

---

## What Is NOT Persisted

| Data | Lifetime |
|------|----------|
| Active simulator chat | Session only (RAM) |
| Editor code (mid-session) | Session only |
| Auth password | Never stored |
| Gemini conversation history | Server stateless — sent per request |
| Test run results | Session only |

---

## Future State (Not Implemented)

PRD mentions but **not in code**:
- Server-side user database
- Session sync across devices
- Real subscription/payment state
- Cloud session backup

Do not document these as existing features.
