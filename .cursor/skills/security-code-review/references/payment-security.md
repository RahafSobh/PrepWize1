# Payment Security & PCI DSS (Reference)

Apply **only if** the product stores, processes, or transmits payment card data.

## PrepWize status

Current codebase uses **simulated pricing tiers** (`PricingScreen.tsx`) with client-side plan updates — **no real payment processor integrated**. PCI scope is **minimal today** unless Stripe/similar is added.

## PCI DSS principles (if payments added)

1. **Do not store** PAN, CVV, magnetic stripe data
2. Use **tokenization** via payment provider (Stripe Checkout, Elements)
3. Card data never touches your server (SAQ A or A-EP depending on integration)
4. Verify **webhook signatures** (Stripe `constructEvent`)
5. TLS everywhere; secure admin access

## Secure integration pattern

```typescript
// GOOD — Stripe Checkout redirect; no card on your server
const session = await stripe.checkout.sessions.create({ ... });

// BAD — posting card numbers to your API
app.post('/api/charge', (req) => {
  const { cardNumber, cvv } = req.body; // NEVER
});
```

## Common mistakes

- Logging payment payloads
- Storing last4 + expiry without need
- Client-side only "Pro plan" unlock (PrepWize today — billing bypass, not PCI)

## Using a third party ≠ automatic compliance

Still required:

- Secure integration (no card on server)
- Access control to billing admin
- Vendor due diligence (Stripe PCI Level 1)
- Privacy notice for billing data
- Incident response if webhook secret leaks

## Verification

- Search: `stripe`, `paypal`, `cardNumber`, `cvv`, `PAN`
- If none: mark PCI section **N/A — no payment processing**
- If added: map integration to PCI SAQ type with QSA/legal counsel
