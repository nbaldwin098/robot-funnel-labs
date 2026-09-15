# Presale funnel — deploy notes

Static site. No build step, no backend required for v1. Serve the folder as-is.

## What Nicholas needs to do to deploy

The code is pushed to GitHub (`nbaldwin098/robot-funnel`). Render has no API
key on file, so the service must be created with ~10 clicks in the dashboard:

1. **Render dashboard** (dashboard.render.com) → **New +** → **Static Site**.
2. Connect GitHub if prompted → select **`nbaldwin098/robot-funnel`** → branch `main`.
3. Build Command: leave empty. Publish Directory: `.` (repo root). Name the
   service e.g. `aorila-robot-funnel` → **Create Static Site**. Render assigns
   `https://aorila-robot-funnel.onrender.com` (your name may differ — use the
   exact hostname Render shows).
4. In the new service → **Settings** → **Custom Domains** → **Add Custom
   Domain** → enter `robotics.aorila.com`.
5. **DNS** — at your domain registrar for `aorila.com`, add exactly this record:

   | Type  | Host / Name | Value |
   |-------|-------------|-------|
   | CNAME | `robotics`  | `aorila-robot-funnel.onrender.com` |

   Use the **exact** `*.onrender.com` hostname Render displays in
   Settings → Custom Domains (it matches the service URL from step 3).
   TTL: automatic/default.
6. Wait for Render to verify DNS and issue the HTTPS certificate (automatic,
   usually minutes). The funnel is live at `https://robotics.aorila.com`.
   (Keeps the robot story off aorila.com for now; `aorila.com/robot` is
   reserved for the eventual merge.)
7. **Swap the hero video** when the robot-POV commercial is shot: replace the
   `.video-frame` placeholder in `index.html` with a `<video>` tag (keep the
   caption "Industrial design concept — prototype in build." until real-hardware
   footage exists).
8. **Verify:** load `https://robotics.aorila.com` on desktop + a phone, submit a
   test email, confirm it lands in Supabase `robot_waitlist`, then delete the
   test row.

## Files

- `index.html` — the page (all copy per `~/workspace/funding/presale-page.md`)
- `assets/css/style.css` — Aorila playbook theme (ink/paper/acid/orange/blue)
- `assets/js/main.js` — form capture, UTM tracking, FAQ accordion
- `assets/img/concept.svg` — stylized concept illustration (labeled on-page)
- `assets/img/og.svg` — social share image · `assets/img/favicon.svg` — favicon
- `INTEGRATION.md` — waitlist endpoint wiring guide

## Rules baked in (do not regress)

- 112,000 always labeled **waitlist interest** — never orders/customers/revenue
- Renders labeled "Industrial design concept — prototype in build"
- Specs labeled engineering targets · $2,999 target price · no dates promised
- Waitlist only — reservation step marked "coming after legal review", no payments
- No "love" language · corporate mission verbatim in footer
- Branded `robotics.aorila.com` — never presents itself as aorila.com
