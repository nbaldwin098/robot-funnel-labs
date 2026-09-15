# Deploy — presale funnel (Render)

The funnel is deployed as a **Render Static Site** — no build step.
Pushes to `main` on the connected repo redeploy automatically.

## Live setup

| Render service | Repo | Custom domains |
|----------------|------|----------------|
| `aorila-robotics-site` | `nbaldwin098/robot-funnel` (branch `main`, build command empty, publish dir `.`) | `robotics.aorila.com`, `robotics.aorilalabs.com` |

## DNS — at the registrar (Nicholas)

| Domain | Type | Host / Name | Value |
|--------|------|-------------|-------|
| aorila.com | CNAME | `robotics` | `aorila-robotics-site.onrender.com` |
| aorilalabs.com | CNAME | `robotics` | `aorila-robotics-site.onrender.com` |

Render verifies DNS and issues the HTTPS certificates automatically.

## Waitlist backend

Supabase `robot_waitlist` table, anon INSERT-only RLS (public can submit,
nobody can read emails). Wiring: `assets/js/main.js` → `WAITLIST_CONFIG`.
Full guide in `INTEGRATION.md`.

## Verify go-live

1. Load both URLs on desktop + a phone — expect "Zero setup. It just helps."
   with the waitlist signup, NOT the "Robotics updates are not public yet."
   placeholder.
2. Submit a test email with `?utm_source=test&utm_medium=verify&utm_campaign=go-live`.
3. Confirm the row in Supabase (`robot_waitlist` table), then **delete the test row**.

## When the POV commercial is shot

Replace the `.video-frame` placeholder in `index.html` with a `<video>`
tag. Keep the caption "Industrial design concept — prototype in build."
until real-hardware footage exists.

## Notes

- The robot story stays off `aorila.com` for now.
- Do not add payment/reservation flows — counsel review gates that stage.
- `nbaldwin098/robot-funnel-labs` is a spare mirror repo (unused — both
  domains are served from `robot-funnel`).
- GitHub Pages was disabled on both repos on 2026-09-15; Render is the host.
