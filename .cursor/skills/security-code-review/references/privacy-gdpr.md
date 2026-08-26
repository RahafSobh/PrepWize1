# Privacy & GDPR (Reference — Not Legal Advice)

Apply when the product processes **personal data** of individuals in the EU/EEA or when GDPR otherwise applies. PrepWize stores name, email, interview content in localStorage and may send content to Google Gemini — **likely personal data**.

## Privacy by design checklist

- [ ] Collect minimum data needed
- [ ] Purpose documented (interview prep, AI feedback)
- [ ] Retention limits defined
- [ ] User can delete their data
- [ ] Third-party processors listed (Google Gemini, hosting provider)
- [ ] DPA / terms with processors where required

## Lawful basis (examples — confirm with legal counsel)

| Processing | Possible basis |
|------------|----------------|
| Account (Google email) | Contract / legitimate interest |
| AI interview content | Contract / consent |
| Analytics | Consent / legitimate interest |

## Data subject rights

Prepare processes for:

- **Access** — export profile/sessions
- **Erasure** — delete account + localStorage guidance; server logs retention
- **Portability** — JSON export of sessions
- **Objection/restriction** — where applicable

PrepWize today: no server-side user DB — erasure is mostly client-side + log policy on host.

## AI & GDPR

- Inform users that prompts/responses may be processed by Google Gemini
- Review Google AI / Cloud DPA and data processing terms
- Avoid sending unnecessary PII in prompts
- Do not use user data for model training without clear basis/consent

## Cross-border transfers

If EU data processed in US (Gemini, Render):

- Document transfer mechanism (SCCs, adequacy, provider certifications)
- Do not claim "GDPR compliant" without legal review

## Cookies & consent

Session cookie (`prepwize_session`) — typically strictly necessary for auth; banner requirements depend on jurisdiction and non-essential cookies.

## Documentation for review

Look for: Privacy Policy, Terms, cookie notice, subprocessors list, retention schedule.

## Verification

- Map data flows: browser → Express → Gemini → logs
- Confirm privacy notice mentions AI processing
- Test "delete my data" path if implemented

**Disclaimer:** This file is a technical review aid, not legal compliance certification.
