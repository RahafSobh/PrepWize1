# Documentation Index — Agent Orchestration

מסמך זה מגדיר **איזה תיעוד לקרוא** לפי סוג המשימה. קרא תמיד [`../AGENTS.md`](../AGENTS.md) לפני כל עבודה.

---

## Decision Tree

```
משימה חדשה?
│
├─ לא מכיר את הפרויקט?
│   → AGENTS.md → ARCHITECTURE.md
│
├─ שינוי UI / component / styling?
│   → docs/frontend.md
│   → docs/data-and-state.md (אם נוגע ב-state)
│
├─ שינוי API / server / code runner?
│   → docs/backend-api.md
│   → docs/ai-integration.md (אם endpoint AI)
│
├─ שינוי prompts / Gemini / fallbacks?
│   → docs/ai-integration.md
│   → docs/backend-api.md
│
├─ שינוי flow סימולציה (setup → chat → feedback)?
│   → docs/interview-flow.md
│   → docs/frontend.md + docs/backend-api.md
│
├─ שינוי types / localStorage / profile?
│   → docs/data-and-state.md
│
├─ build / Docker / deploy / env?
│   → docs/deployment.md
│
└─ refactor גדול / ארכיטקטורה?
    → ARCHITECTURE.md → כל docs/ הרלוונטיים
```

---

## Task → Documents Matrix

| סוג משימה | מסמכים חובה | מסמכים מומלצים |
|-----------|-------------|----------------|
| Bug fix ב-Dashboard | frontend, data-and-state | AGENTS |
| Bug fix ב-Simulator | interview-flow, frontend, backend-api | ai-integration |
| שינוי prompt AI | ai-integration, backend-api | interview-flow |
| הוספת interview type | types.ts, interview-flow, backend-api, ai-integration, frontend | ARCHITECTURE |
| שינוי plan gating | frontend (App.tsx), data-and-state | AGENTS |
| שיפור code runner | backend-api | interview-flow |
| Docker / CI | deployment | AGENTS |
| Auth / DB (feature חדש) | ARCHITECTURE, AGENTS | data-and-state |
| עבודה ב-PrepWize1 | frontend, AGENTS (סעיף PrepWize1) | ARCHITECTURE |

---

## File Map

| קובץ | תפקיד |
|------|-------|
| [`../AGENTS.md`](../AGENTS.md) | כללי עבודה, conventions, env, "אל תשבור" |
| [`../ARCHITECTURE.md`](../ARCHITECTURE.md) | ארכיטקטורה, request flow, dependencies |
| [`frontend.md`](frontend.md) | React components, views, styling |
| [`backend-api.md`](backend-api.md) | Express endpoints, request/response |
| [`ai-integration.md`](ai-integration.md) | Gemini SDK, prompts, fallbacks |
| [`interview-flow.md`](interview-flow.md) | Setup → Simulator → Feedback lifecycle |
| [`data-and-state.md`](data-and-state.md) | TypeScript types, localStorage |
| [`deployment.md`](deployment.md) | Build, Docker, environment |

---

## Canonical Code Paths

| מה | איפה |
|----|------|
| Frontend entry | `src/main.tsx` |
| App state / routing | `src/App.tsx` |
| Shared types | `src/types.ts` |
| Simulator + API calls | `src/components/SimulatorScreen.tsx` |
| Backend | `server.ts` |
| Build config | `vite.config.ts`, `package.json` |
| AI Studio manifest | `metadata.json` |

**לא canonical:** `PrepWize1/` (refactor copy), `PrepWize_backend/` (placeholder).

---

## Before You Commit

1. `npm run lint` — TypeScript check
2. `npm run dev` — smoke test locally
3. ודא שלא commit `.env*`
4. אם שינית API shape — עדכן `types.ts` + `SimulatorScreen.tsx` + `server.ts` + docs
