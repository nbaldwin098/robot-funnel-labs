# Waitlist integration — presale funnel

**Status: WIRED (2026-09-15).** The form POSTs directly to Supabase; the
`localStorage` outbox (`aorila_waitlist_outbox_v1`) remains only as a fallback
when the network request fails.

## Live wiring

- **Table:** `robot_waitlist` in the Atraly Supabase project (`umpaqcpcvwpvlmvqptrp`,
  us-east-1) — columns: `email` (unique, required), `utm_source`,
  `utm_medium`, `utm_campaign`, `referrer`, `page_url`, `user_agent`,
  `created_at` (default now()).
- **Security:** Row Level Security ON; exactly one policy — `anon` may
  `INSERT` only. Verified: anon INSERT → 201, anon SELECT → 401 blocked.
  The anon key in `main.js` is public by design; RLS is the protection.
  Never put a service-role key in this page.
- **Endpoint** (`assets/js/main.js` → `WAITLIST_CONFIG`):
  `POST https://umpaqcpcvwpvlmvqptrp.supabase.co/rest/v1/robot_waitlist`
  with `apikey` + `Authorization: Bearer` (anon) + `Prefer: return=minimal`.
- **Verified end-to-end 2026-09-15:** real form submit in headless Chromium with
  `?utm_source=tiktok&utm_medium=cpc&utm_campaign=launch-01` → row landed in
  Supabase with all UTM fields intact → test row deleted.

## The integration point

`assets/js/main.js`, top of file:

```js
const WAITLIST_CONFIG = {
  endpoint: "https://umpaqcpcvwpvlmvqptrp.supabase.co/rest/v1/robot_waitlist",
  headers: { apikey: "<anon>", Authorization: "Bearer <anon>", Prefer: "return=minimal" },
  ...
};
```

On every signup the page POSTs:

```json
{
  "email": "person@example.com",
  "utm_source": "tiktok",
  "utm_medium": "cpc",
  "utm_campaign": "launch-01",
  "referrer": "https://…",
  "page_url": "https://robotics.aorila.com/?utm_source=…",
  "user_agent": "…",
  "created_at": "2026-09-15T20:00:00.000Z"
}
```

Behavior:
- **Endpoint set + request succeeds** → signup sent to your store.
- **Endpoint set + request fails** (network, timeout >10s, non-2xx) → signup is
  appended to the local outbox so it is never lost. Sync it later.
- **Endpoint empty** → signup goes straight to the local outbox.

Read the outbox any time in the browser console:

```js
JSON.parse(localStorage.getItem("aorila_waitlist_outbox_v1") || "[]")
```

Export it as CSV before you need it — there is no server-side copy until you
wire the endpoint.

## Recommended wiring (pick one)

1. **Supabase (matches atraly.com's stack).** Create a `robot_waitlist` table
   `(email text unique, utm_source text, utm_medium text, utm_campaign text,
   referrer text, page_url text, created_at timestamptz default now())`, enable
   Row Level Security with an INSERT-only policy, and point `endpoint` at a tiny
   edge function or PostgREST insert. Never expose a service-role key in this
   page.
2. **Formspree / Basin / Loops.** Paste their form endpoint as `endpoint`.
   Confirm their field mapping accepts the JSON keys above (or add a small
   adapter).
3. **Custom API.** Any endpoint returning 2xx on valid JSON works.

## Pre-launch checklist

- [x] `endpoint` set and tested end-to-end (2026-09-15, UTM intact, test row deleted)
- [ ] Double opt-in email configured if you want confirmed addresses (recommended before PR cites the count)
- [ ] Privacy notice added when the reservation stage goes live (footer marks Privacy/Terms as "live at reservation stage")
- [ ] UTM-tagged ad URLs tested live on `https://robotics.aorila.com` after deploy (`?utm_source=tiktok&utm_medium=cpc&utm_campaign=launch-01`)

## What NOT to build here

Per the funnel spec: **no payment flow, no reservation flow** until counsel
reviews the terms. The roadmap section marks refundable reservations as
"coming after legal review." Do not add pricing buttons or checkout to this
page without that review.
