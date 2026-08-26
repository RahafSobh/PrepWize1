# Backend API

תיעוד שרת Express ב-`server.ts` — monolith יחיד, לא microservice.

---

## Overview

| Property | Value |
|----------|-------|
| File | `server.ts` |
| Framework | Express 4 |
| Port | `process.env.PORT \|\| 3000` |
| Dev runner | `tsx server.ts` (`npm run dev`) |
| Prod runner | `node dist/server.cjs` (`npm start`) |

השרת מבצע **שלוש תפקידים**:
1. REST API לסימולציית ראיונות
2. Code runner (mock/sandbox)
3. Frontend serving (Vite dev middleware או static files)

---

## Middleware

```typescript
app.use(express.json());  // parse JSON bodies
```

אין: CORS middleware (same-origin), auth middleware, rate limiting, request logging library.

---

## Endpoints

### GET `/api/health`

Health check for load balancers and Docker HEALTHCHECK.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-08-26T18:00:00.000Z",
  "environment": "development"
}
```

---

### GET `/api/config`

Public runtime config for the SPA (no secrets). Used for staging banner and client awareness.

**Response:**
```json
{
  "environment": "staging",
  "appUrl": "https://prepwize-staging.onrender.com",
  "isStaging": true,
  "googleAuthEnabled": true,
  "googleClientId": "1234567890-abc.apps.googleusercontent.com"
}
```

---

### POST `/api/auth/google`

Verify Google Identity Services ID token and issue an httpOnly session cookie.

**Request body:**
```json
{ "credential": "<google-id-token>" }
```

**Response:** `UserProfile` JSON + `Set-Cookie: prepwize_session=...`

---

### GET `/api/auth/me`

Returns the authenticated user profile from the session cookie, or `401`.

---

### POST `/api/auth/logout`

Clears the session cookie.

---

### POST `/api/interview/start`

מתחיל סימולציה — יוצר הודעת פתיחה + בעיה (Algo/System Design).

**Request body:** `InterviewPreferences`
```typescript
{
  type: 'Algo' | 'Behavioral' | 'System Design',
  difficulty: 'Junior' | 'Mid-Level' | 'Senior' | 'Staff',
  role: 'Frontend' | 'Backend' | 'Full Stack' | 'Mobile' | 'DevOps' | 'System Architect',
  language: string,  // e.g. 'Javascript', 'Python', 'Java', 'Cpp'
  style: 'Friendly' | 'Neutral' | 'Strict' | 'Challenging',
  topic?: string
}
```

**Response (success):**
```typescript
{
  initialMessage: string,
  problem?: {          // Algo and System Design only
    title: string,
    description: string,    // Markdown
    starterCode: string,
    testCases: Array<{ input: string, expected: string }>
  }
}
```

**Behavioral:** response contains only `initialMessage` (no `problem`).

**Errors:** `500 { error: string }`

**Fallback:** `buildFallbackStartResponse()` — deterministic local content by type/difficulty/language.

---

### POST `/api/interview/chat`

המשך שיחת ראיון — תגובת interviewer.

**Request body:**
```typescript
{
  type, difficulty, role, language, style,  // from InterviewPreferences
  history: Array<{ sender: 'interviewer' | 'candidate', text: string }>,
  currentCode?: string,    // Algo — editor contents
  currentDraft?: string    // System Design — architecture draft
}
```

**Response:**
```json
{ "text": "Interviewer response..." }
```

**Fallback:** `buildFallbackChatResponse()` — keyword-based responses.

---

### POST `/api/interview/feedback`

יצירת דוח סופי לאחר סימולציה.

**Request body:**
```typescript
{
  type, difficulty, role, language,
  history: ChatMessage[],
  finalCode?: string,
  finalDraft?: string
}
```

**Response:** `FeedbackReport`
```typescript
{
  overallScore: number,              // 1-5
  strengths: string[],
  weaknesses: string[],
  technicalAccuracyScore: number,    // 1-5
  communicationSkillsScore: number,  // 1-5
  answerQualityScore: number,        // 1-5
  improvementSuggestions: string[],
  detailedSummary: string            // Markdown
}
```

**Fallback:** `buildFallbackFeedbackResponse()` — heuristic scoring by message count.

---

### POST `/api/code/run`

הרצת קוד מול test cases.

**Request body:**
```typescript
{
  code: string,
  language: string,
  testCases: Array<{ input: string, expected: string }>
}
```

**Response:**
```typescript
{
  runSuccess: boolean,
  language: string,
  consoleLogs: string,
  results: Array<{
    caseNumber: number,
    input: string,
    expected: string,
    actual: string,
    passed: boolean
  }>,
  error?: string  // on compilation failure
}
```

**Behavior by language:**

| Language | Execution |
|----------|-----------|
| JavaScript / TypeScript | `Function` constructor — finds last `function` name, evals with test input |
| Python, Java, C++, etc. | **Mock** — random ~70% pass rate, simulated console output |

---

## Gemini Client

```typescript
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  // lazy init, validates GEMINI_API_KEY
  // throws if missing or placeholder "MY_GEMINI_API_KEY"
}
```

Key validation rejects:
- `undefined` / empty string
- `"MY_GEMINI_API_KEY"` placeholder

---

## Frontend Serving

### Development (`NODE_ENV !== 'production'`)

```typescript
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "spa",
});
app.use(vite.middlewares);
```

### Production

```typescript
app.use(express.static(path.join(process.cwd(), "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
```

**Order matters:** API routes registered **before** static/Vite middleware.

---

## Build Output

```
npm run build
├── dist/index.html          ← Vite client build
├── dist/assets/*            ← JS/CSS bundles
└── dist/server.cjs          ← esbuild server bundle
```

esbuild flags: `--platform=node --format=cjs --packages=external`

External packages (not bundled): express, @google/genai, vite, dotenv, etc.

---

## Error Handling Pattern

```typescript
app.post("/api/interview/start", async (req, res) => {
  try {
    let parsedData;
    try {
      const ai = getGeminiClient();
      // ... Gemini call
      parsedData = JSON.parse(response.text);
    } catch (apiErr) {
      console.warn("Gemini failed, using fallback:", apiErr);
      parsedData = buildFallbackStartResponse(...);
    }
    res.json(parsedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

**Agent rule:** preserve this dual-layer try/catch when modifying endpoints.

---

## Adding a New Endpoint

1. Add route **before** Vite/static middleware block
2. Use `express.json()` body parsing (already global)
3. If AI-powered — add fallback generator function
4. Update `SimulatorScreen.tsx` fetch call
5. Update `src/types.ts` if new shapes
6. Update docs: this file + `ai-integration.md` if applicable
7. Run `npm run lint`

---

## Security Notes

- **No authentication** on API routes — all public
- **Code execution** uses `Function` constructor — not a true sandbox
- **No input sanitization** beyond JSON parsing
- **No rate limiting** on Gemini calls

Do not remove fallbacks or expose API keys in responses.
