# API Security

## Authentication on every sensitive route

```typescript
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await readSessionFromRequest(req);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  req.user = session;
  next();
}

app.post('/api/interview/start', requireAuth, handler);
```

PrepWize gap: interview routes lack this middleware.

## Input validation

```typescript
import { z } from 'zod';

const StartSchema = z.object({
  type: z.enum(['Algo', 'Behavioral', 'System Design']),
  difficulty: z.enum(['Junior', 'Mid', 'Senior']),
  role: z.string().max(100),
  language: z.string().max(50).optional(),
  topic: z.string().max(500).optional(),
});

const body = StartSchema.safeParse(req.body);
if (!body.success) return res.status(400).json({ error: 'Invalid input' });
```

## IDOR

- Resource IDs must map to authenticated user
- PrepWize: no server-side sessions DB — lower IDOR risk today, but APIs still abusable anonymously

## CORS

```javascript
// BAD with credentials
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Credentials', 'true');

// GOOD — explicit allowlist
if (ALLOWED_ORIGINS.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');
}
```

Review `ALLOWED_ORIGINS` per environment; never add attacker domains.

## Security headers

Use `helmet()` or set manually:

- `Content-Security-Policy`
- `Strict-Transport-Security` (HTTPS only)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` or CSP `frame-ancestors`
- `Referrer-Policy: strict-origin-when-cross-origin`

PrepWize: headers not set today — Medium finding.

## Rate limiting

Apply to:

- `/api/auth/*` (brute force)
- `/api/interview/*` (cost abuse)
- `/api/code/run` (CPU abuse)

Layer: reverse proxy (Cloudflare, Render) + app-level limiter.

## SSRF

If endpoints fetch URLs from users (webhooks, "import from URL"):

- Block private IP ranges (10.x, 127.x, 169.254.x, metadata URLs)
- Allowlist domains

PrepWize: no user URL fetch today — N/A unless added.

## Injection in APIs

- SQL: use parameterized queries
- NoSQL: sanitize operators
- Command: never shell with user input
- PrepWize `/api/code/run`: command/code injection via user JS — Critical

## Error responses

Uniform shape; no stack traces or internal paths in JSON responses.

## Verification

- Call sensitive endpoints without cookies — expect 401
- OPTIONS from wrong Origin — no ACAO header
- Oversized JSON body — expect 413
- `curl -I https://host/api/health` — check security headers
