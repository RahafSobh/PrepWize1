# AI Integration

תיעוד אינטגרציית Google Gemini — SDK, prompts, schemas, fallbacks.

---

## SDK & Configuration

```typescript
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});
```

| Setting | Value |
|---------|-------|
| Package | `@google/genai` ^2.4.0 |
| Model | `gemini-3.5-flash` |
| Env var | `GEMINI_API_KEY` |
| Client init | Lazy singleton in `getGeminiClient()` |
| User-Agent | `aistudio-build` (Google AI Studio requirement) |

---

## AI Studio Integration

`metadata.json`:
```json
{
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"],
  "requestFramePermissions": ["microphone"]
}
```

- Gemini calls run **server-side only** (`server.ts`)
- Frontend never imports `@google/genai`
- Microphone permission declared for future voice features (Career+ tier in PRD)

---

## Three AI Endpoints

### 1. Interview Start — Structured JSON

**Purpose:** Generate opening message + problem definition.

**Call:**
```typescript
await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: requestPrompt,
  config: {
    systemInstruction: systemPrompt,
    responseMimeType: "application/json",
    responseSchema: responseSchema,  // varies by type
    temperature: 0.8
  }
});
```

**System prompt includes:**
- Interviewer personality (`style`: Friendly/Neutral/Strict/Challenging)
- Target role and difficulty
- Optional topic focus
- Type-specific instructions (Algo problem vs Behavioral question vs System Design scenario)

**Response schema — Algo:**
```typescript
{
  initialMessage: string,
  problem: {
    title: string,
    description: string,      // Markdown
    starterCode: string,      // skeleton only, no solution
    testCases: [{ input, expected }]
  }
}
```

**Response schema — Behavioral:**
```typescript
{ initialMessage: string }  // STAR-oriented question embedded
```

**Response schema — System Design:**
```typescript
{
  initialMessage: string,
  problem: {
    title, description, starterCode, testCases  // testCases usually empty
  }
}
```

---

### 2. Interview Chat — Free Text

**Purpose:** Maintain interviewer persona during conversation.

**Call:**
```typescript
await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: requestInstructions,  // formatted conversation log
  config: {
    systemInstruction: systemPrompt,
    temperature: 0.7
  }
});
```

**Context injected:**
- Full conversation history (`Interviewer: ... / Candidate: ...`)
- `currentCode` (Algo) or `currentDraft` (System Design)

**System prompt rules:**
1. Stay in character (persona style)
2. Ask follow-ups, challenge explanations
3. Hints based on style (Friendly = helpful hint; Strict = point out flaws)
4. Focus on complexity (Algo) or scalability (System Design)
5. **Do NOT** generate final feedback report
6. Keep responses 1-3 paragraphs

**Response:** plain text → wrapped as `{ text: response.text }`

---

### 3. Interview Feedback — Structured JSON

**Purpose:** Post-session evaluation report.

**Call:**
```typescript
await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: instructions,
  config: {
    systemInstruction: systemPrompt,
    responseMimeType: "application/json",
    responseSchema: feedbackSchema,
    temperature: 0.4
  }
});
```

**Feedback schema:**
```typescript
{
  overallScore: integer,           // 1-5
  strengths: string[],
  weaknesses: string[],
  technicalAccuracyScore: integer, // 1-5
  communicationSkillsScore: integer,
  answerQualityScore: integer,
  improvementSuggestions: string[],
  detailedSummary: string          // Markdown
}
```

**Context:** full conversation + final code/draft.

---

## Fallback System

When Gemini fails (missing key, API error, parse failure), server uses **local generators**:

| Function | Trigger | Logic |
|----------|---------|-------|
| `buildFallbackStartResponse()` | `/start` failure | Pre-built problems by type/difficulty/language |
| `buildFallbackChatResponse()` | `/chat` failure | Keyword matching on last user message |
| `buildFallbackFeedbackResponse()` | `/feedback` failure | Heuristic scoring by message count |

### Fallback Start Examples

| Type | Difficulty | Problem |
|------|------------|---------|
| Algo | Entry/Junior | Two Sum |
| Algo | Mid-Level | Merge Intervals |
| Algo | Senior | Longest Valid Parentheses |
| Behavioral | * | STAR situational questions |
| System Design | Entry | URL Shortener |
| System Design | Mid | Rate Limiter |
| System Design | Senior | Collaborative Canvas |

Each includes persona-specific greeting prefix (Friendly/Strict/Challenging/Neutral).

### Frontend Fallbacks

`SimulatorScreen.tsx` also has local fallbacks in `catch` blocks:
- `getSampleProblem()` for Algo
- Mock chat responses
- Mock feedback with default scores

**Result:** App works fully in degraded mode without API key.

---

## Prompt Engineering Guidelines for Agents

When modifying prompts:

1. **Preserve JSON schema compatibility** — frontend expects exact field names
2. **Keep persona styles consistent** — four styles used across all endpoints
3. **Algo starterCode** — skeleton only; never include solutions
4. **Feedback scores** — integers 1-5, not floats
5. **Temperature:**
   - Start: 0.8 (creative variety)
   - Chat: 0.7 (natural dialogue)
   - Feedback: 0.4 (consistent evaluation)
6. **Test without API key** — verify fallback still works after changes

---

## Model Changes

Current model: **`gemini-3.5-flash`**

If changing model:
1. Update all three `generateContent` calls in `server.ts`
2. Verify JSON schema support in new model
3. Update footer text in `App.tsx` if model name displayed
4. Test structured output parsing

---

## Cost & Performance Considerations

- Each session = 1 start + N chat + 1 feedback calls
- No caching, no conversation memory beyond request payload
- No streaming — synchronous request/response
- PRD mentions SLA < 4s P95 — no enforcement in code

---

## What NOT to Do

| Action | Why |
|--------|-----|
| Move Gemini to frontend | Exposes API key |
| Remove fallbacks | Breaks offline/demo mode |
| Change response field names | Breaks frontend parsing |
| Add RAG/vector DB without request | Not in current architecture |
| Use different models per endpoint | Inconsistent behavior; document if needed |
