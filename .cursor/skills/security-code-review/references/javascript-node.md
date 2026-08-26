# JavaScript / Node.js / Express Security

## Server-side execution (Critical in PrepWize)

Avoid in production API handlers:

```javascript
// BAD — full Node process access
eval(userCode);
new Function(userCode)();
require('child_process').exec(userInput);
```

Prefer isolated workers, WASM, or external judge services. If must run user code: strict timeout, memory cap, no `require`, separate user.

## Express hardening

```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(express.json({ limit: '256kb' }));

app.use('/api/', rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
}));
```

## Error handling

```javascript
// BAD
res.status(500).json({ error: err.message });

// GOOD
console.error('[interview/start]', requestId, err);
res.status(500).json({ error: 'Internal server error', requestId });
```

## Secrets in Node

- Load via `dotenv` only on server; never `VITE_*` for secrets
- Fail startup in production if `SESSION_SECRET` < 32 chars
- Rotate keys per environment

## Prototype pollution

Watch `Object.assign`, `lodash.merge`, deep merge of `req.body` into config objects.

## Deserialization

- `JSON.parse` on untrusted input: validate schema after parse
- Avoid `node-serialize`, `js-yaml` unsafe load, pickle equivalents

## Logging

- Redact: `Authorization`, cookies, passwords, tokens, API keys
- Structured JSON logs; no full `req.body` in production

## Dependency audit (re-run periodically)

```bash
npm audit
npm audit --production
npx better-npm-audit audit  # optional stricter policy
```

CVE status changes — document audit date in review report.

## Verification

- Grep: `eval|Function\(|exec\(|execSync|spawn\(`
- Confirm secrets not in `dist/` client bundle: `rg GEMINI|SECRET dist/`
- Run `npm audit` and record output
