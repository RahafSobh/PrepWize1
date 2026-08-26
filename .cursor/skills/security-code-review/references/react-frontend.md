# React Frontend Security

## XSS vectors

| Pattern | Risk |
|---------|------|
| `dangerouslySetInnerHTML` | High if content is user/AI-generated |
| `innerHTML` / `outerHTML` | High if dynamic |
| `{userText}` in JSX | Low — React escapes by default |
| Custom markdown → HTML without sanitize | High |
| URL `javascript:` in `href` | Medium |

## Safe rendering

```tsx
// GOOD — React escapes
<p>{message.text}</p>

// BAD — unless sanitized with DOMPurify
<div dangerouslySetInnerHTML={{ __html: aiSummary }} />
```

For markdown from AI/users: use `react-markdown` with `rehype-sanitize` or render as plain text nodes (PrepWize `CustomMarkdownRenderer` pattern — verify no HTML passthrough).

## Client-side storage

`localStorage` / `sessionStorage`:

- Accessible to any XSS on origin
- Do not store: auth tokens (prefer httpOnly cookies), PII you wouldn't expose in DevTools
- Do not use storage flags as sole auth (`prepwise_authenticated`)

## Environment variables

Only `VITE_*` / `NEXT_PUBLIC_*` are exposed to browser — **never** put API keys there.

PrepWize: Gemini key stays server-side; `googleClientId` via `/api/config` is intentional.

## CSRF with cookie auth

If API uses `credentials: 'include'`:

- SameSite=Lax/Strict on cookies
- CSRF token for state-changing POSTs if cross-site forms possible

## CSP (via server headers)

Example directive themes:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
connect-src 'self' https://generativelanguage.googleapis.com;
frame-ancestors 'none';
```

Tune per app; avoid `'unsafe-inline'` for scripts when possible.

## Third-party scripts

Google Sign-In GIS script — ensure loaded from official CDN; restrict origins in Google Cloud Console.

## Verification

```bash
rg "dangerouslySetInnerHTML|innerHTML|document\.write" src/
rg "localStorage\.(setItem|getItem)" src/
```

Manual: inject `<script>alert(1)</script>` in chat/input fields; confirm not executed.
