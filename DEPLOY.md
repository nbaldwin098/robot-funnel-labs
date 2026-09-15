# Deploy — presale funnel (GitHub Pages)

The funnel is deployed via **GitHub Pages** — no Render service needed.
Pushes to `main` redeploy automatically. `.nojekyll` bypasses Jekyll.

## Live setup

| Repo | Custom domain |
|------|---------------|
| `nbaldwin098/robot-funnel` | `https://robotics.aorila.com` |
| `nbaldwin098/robot-funnel-labs` | `https://robotics.aorilalabs.com` |

## DNS — add at the registrar

| Domain | Type | Host / Name | Value |
|--------|------|-------------|-------|
| aorila.com | CNAME | `robotics` | `nbaldwin098.github.io` |
| aorilalabs.com | CNAME | `robotics` | `nbaldwin098.github.io` |

After DNS propagates, GitHub issues the HTTPS certificate automatically
(usually under an hour), then HTTPS gets enforced on both domains.

## Render cleanup (one click)

`robotics.aorila.com` was added as a custom domain on the **aorila-web**
Render service — remove it there so traffic goes to the funnel, not the
main site. Do not re-add these subdomains to Render.

## Waitlist backend

Supabase `robot_waitlist` table, anon INSERT-only RLS (public can submit,
nobody can read emails). Wiring: `assets/js/main.js` → `WAITLIST_CONFIG`.
Full guide in `INTEGRATION.md`.

## Verify go-live

1. Load both URLs on desktop + a phone.
2. Submit a test email with `?utm_source=test&utm_medium=verify&utm_campaign=go-live`.
3. Confirm the row in Supabase (`robot_waitlist` table), then **delete the test row**.

## When the POV commercial is shot

Replace the `.video-frame` placeholder in `index.html` with a `<video>`
tag. Keep the caption "Industrial design concept — prototype in build."
until real-hardware footage exists.

## Notes

- The robot story stays off `aorila.com` for now.
- Do not add payment/reservation flows — counsel review gates that stage.
