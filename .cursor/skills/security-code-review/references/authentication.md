# Authentication & Session Security

## Real vs mock auth

Production must not rely on:

- `setTimeout` fake login
- `localStorage.setItem('authenticated', 'true')` without server session
- Demo OAuth buttons that skip token verification

PrepWize: `AuthScreen.tsx` mock paths — remove or gate behind `APP_ENV=development`.

## Google Sign-In (GIS) — server verification

Required checks on ID token:

```typescript
const ticket = await client.verifyIdToken({
  idToken: credential,
  audience: GOOGLE_CLIENT_ID,
});
const payload = ticket.getPayload();
if (!payload?.sub || !payload.email) return 401;
if (payload.email_verified !== true) return 401; // add this
```

## Session cookies (PrepWize pattern)

```typescript
res.cookie('prepwize_session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});
```

Improvements:

- Shorter TTL for sensitive apps
- Rotate token on login
- `clearCookie` with same options on logout (already done)

## JWT / session signing

```typescript
// Startup validation
if (APP_ENV === 'production' && SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET must be at least 32 characters');
}
```

Use `jose` or `jsonwebtoken` with HS256/RS256; never accept `alg: none`.

## Password auth (if added later)

- Hash: Argon2id or bcrypt (cost ≥ 12)
- Never log passwords
- Rate limit login; generic "invalid credentials" message

## Authorization vs authentication

Auth proves identity; authorization proves permission. Both must be **server-side**.

## OWASP ASVS mapping (reference)

- V2: Authentication
- V3: Session management
- V4: Access control

## Verification

- Login → inspect cookie: `HttpOnly`, `Secure` (prod), `SameSite`
- Tamper JWT payload → `/api/auth/me` returns 401
- Logout → cookie cleared; `/api/auth/me` 401
- Mock login disabled when `googleAuthEnabled` and production
