# Interview Flow

תיעוד מחזור החיים המלא של סימולציית ראיון — Setup → Simulator → Feedback.

---

## Flow Diagram

```
┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────┐
│Dashboard │───►│  Setup   │───►│  Simulator   │───►│ Feedback │───►│Dashboard │
│          │    │  Screen  │    │   Screen     │    │  Report  │    │ (updated)│
└──────────┘    └──────────┘    └──────────────┘    └──────────┘    └──────────┘
                     │                 │                    │
                     │ plan gating     │ API loop           │ localStorage
                     ▼                 ▼                    ▼
               InterviewPrefs    start/chat/run/       InterviewSession
                                 feedback              + FeedbackReport
```

---

## Phase 1: Setup (`SetupScreen.tsx`)

### User Selects

| Field | Options | Required |
|-------|---------|----------|
| `type` | Algo, Behavioral, System Design | Yes |
| `difficulty` | Junior, Mid-Level, Senior, Staff | Yes |
| `role` | Frontend, Backend, Full Stack, Mobile, DevOps, System Architect | Yes |
| `language` | Javascript, Python, Java, C++, etc. | Yes (Algo); N/A others |
| `style` | Friendly, Neutral, Strict, Challenging | Yes |
| `topic` | Free text | Optional |

### Plan Restrictions (enforced in App.tsx)

- **Free + 3 completed sessions + no topic** → alert + redirect to Pricing
- **Free + System Design** → alert + redirect to Pricing

### Output

```typescript
InterviewPreferences → App.handleLaunchSession → currentView = 'simulator'
```

---

## Phase 2: Session Init (`SimulatorScreen` mount)

### API Call

```
POST /api/interview/start
Body: InterviewPreferences
```

### State Initialization

```typescript
// On success:
setMessages([{ sender: 'interviewer', text: data.initialMessage, timestamp }])
setProblem(data.problem)           // if present
setEditorCode(data.problem.starterCode)  // Algo
setTimeRemaining(2700)             // 45 min timer starts
```

### On Failure

- `getSampleProblem(preferences)` for Algo
- Default greeting message for Behavioral/System Design

---

## Phase 3: Interview Types

### Algo Track

**UI layout:** Split pane — chat (left) + editor/terminal (right)

**Features:**
- Code editor (textarea) with syntax-agnostic highlighting
- Tab switch: Editor ↔ Terminal
- **Run Tests** → `POST /api/code/run`
- **Request Hint** → `POST /api/interview/chat` (root version)
- Timer countdown (45 min)

**Chat context sent to API:**
```typescript
{ history, currentCode: editorCode }
```

### Behavioral Track

**UI layout:** Chat-focused with STAR checklist

**Features:**
- STAR checklist toggles (Situation, Task, Action, Result)
- Speech-to-text button (Web Speech API)
- No code editor

**Chat context:**
```typescript
{ history }  // no code/draft
```

### System Design Track

**UI layout:** Chat + design draft area + node boxes

**Features:**
- Text area for architecture draft
- `designNodes[]` — add/remove component boxes (Client, LB, Cache, DB, etc.)
- No real diagramming engine — ASCII/text based

**Chat context:**
```typescript
{ history, currentDraft: designDraft }
```

---

## Phase 4: Chat Loop

### Send Message Flow

```
User types → handleSendMessage()
  → append candidate message to messages[]
  → POST /api/interview/chat { preferences, history, currentCode/currentDraft }
  → append interviewer response
  → scroll to bottom
```

### Hint Request (root only)

```
handleRequestHint()
  → POST /api/interview/chat with hint-oriented last message
  → append hint as interviewer message
```

### Loading States

- `isLoading` + `loadingMessage` during API calls
- Disabled send button while loading

---

## Phase 5: Code Execution (Algo)

```
handleRunCode()
  → POST /api/code/run { code: editorCode, language, testCases: problem.testCases }
  → setTestResults(data.results)
  → setTestResultLogs(data.consoleLogs)
  → switch to terminal tab
```

### Result Display

Each test case shows: input, expected, actual, pass/fail badge.

**Note:** Non-JS languages return **mock results** — UI should not imply real compilation.

---

## Phase 6: Session End & Feedback

### Trigger

User clicks "Generate Final Assessment Feedback" (or equivalent end button).

### API Call

```
POST /api/interview/feedback
Body: {
  type, difficulty, role, language,
  history: messages,
  finalCode: editorCode,      // Algo
  finalDraft: designDraft     // System Design
}
```

### Session Assembly

```typescript
const finishedSession: InterviewSession = {
  id: crypto.randomUUID() or timestamp-based,
  preferences,
  messages,
  problem,
  status: 'completed',
  createdAt: new Date().toISOString(),
  feedback: responseData
};
```

### App Handler

```typescript
handleFeedbackGenerated(finishedSession)
  → sessions.unshift(finishedSession)
  → profile.simulationsCompleted++
  → profile.streakCount++
  → currentView = 'feedback'
```

---

## Phase 7: Feedback Report (`FeedbackReportScreen.tsx`)

### Displays

- Overall score (1-5) with visual ring/gauge
- Sub-scores: Technical Accuracy, Communication, Answer Quality
- Strengths list (bullets)
- Weaknesses list (bullets)
- Improvement suggestions
- Detailed summary (Markdown rendered)

### Actions

- **Close** → Dashboard
- **Retake** → SetupScreen (same or new config)

---

## Phase 8: Dashboard Update

`Dashboard.tsx` reads updated `pastSessions`:

- **Score trend chart** — SVG area graph from session feedback scores
- **Session list** — click to view past reports
- **AchievementsSection** — checks session history for badge unlocks:
  - First Algo session
  - STAR Expert (Behavioral)
  - System Design Master
  - Adrenaline Conqueror (Strict/Challenging style)
  - FAANG Contender (3+ sessions)
  - Elite Score 5.0
- **TipOfTheDay** — independent widget

---

## Session States

```typescript
status: 'active' | 'completed' | 'abandoned'
```

Currently only `'completed'` is written. Exit without feedback leaves no session record.

---

## Timer Behavior

- Starts at 2700 seconds (45 min) on session init
- Counts down via `setInterval`
- No auto-submit on timeout (UI indicator only)

---

## Speech Recognition

```typescript
// Web Speech API — browser-dependent
recognitionRef.current = new (window as any).webkitSpeechRecognition()
```

- Toggle mic button
- Appends transcribed text to input
- **Not sent to backend separately** — user sends as regular message
- Requires browser permission (metadata.json declares microphone for AI Studio)

---

## Modifying the Flow

| Change | Files to touch |
|--------|----------------|
| New interview type | `types.ts`, `SetupScreen`, `SimulatorScreen`, `server.ts` (start/chat/feedback), `ai-integration.md` |
| Change timer | `SimulatorScreen.tsx` |
| Add session state | `types.ts`, `SimulatorScreen`, `App.tsx` |
| Change feedback fields | `types.ts`, `server.ts` schema, `FeedbackReportScreen`, fallbacks |
| Plan limits | `App.tsx`, `SetupScreen`, `PricingScreen` |

---

## Data Created Per Session

```typescript
InterviewSession {
  id, preferences, messages[], problem?, status, createdAt, feedback?
}
```

Persisted in `localStorage.prepwise_sessions` via App.tsx `useEffect`.

Default seed data: `generatePrepopulatedHistory()` in App.tsx provides 2 demo sessions for first-time users.
