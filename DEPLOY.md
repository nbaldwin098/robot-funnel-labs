# Deploy — presale funnel → https://robotics.aorila.com

Static site (no build step). Code lives in this repo (`nbaldwin098/robot-funnel`).
The waitlist backend is already wired (Supabase `robot_waitlist`, anon
INSERT-only — see `INTEGRATION.md`). These are the only steps left, all on
Nicholas's side (no Render API key on file, so the dashboard clicks are manual).

## 1. Create the Render static site (~10 clicks)

1. Go to **dashboard.render.com** → **New +** → **Static Site**.
2. Connect GitHub if prompted → select **`nbaldwin098/robot-funnel`** → branch `main`.
3. Build Command: *(leave empty)*. Publish Directory: `.`
4. Name the service, e.g. **`aorila-robot-funnel`** → **Create Static Site**.
5. Render assigns a URL like `https://aorila-robot-funnel.onrender.com`
   (your exact hostname may differ — note it, you need it for DNS).

## 2. Attach the custom domain in Render

1. In the new service → **Settings** → **Custom Domains** → **Add Custom Domain**.
2. Enter **`robotics.aorila.com`**.
3. Render shows the DNS target to point at — it is the `*.onrender.com`
   hostname from step 1.5. Copy it exactly.

## 3. DNS — add this ONE record at your registrar for `aorila.com`

| Type  | Host / Name | Value |
|-------|-------------|-------|
| CNAME | `robotics`  | `aorila-robot-funnel.onrender.com` |

- **Value** = the exact `*.onrender.com` hostname Render displays in
  Settings → Custom Domains (use yours verbatim if it differs from the example).
- TTL: automatic / default.
- No A record, no www, nothing else needed.

## 4. Verify

1. Wait for Render to verify DNS and issue the certificate (automatic, usually minutes).
2. Load `https://robotics.aorila.com` on desktop + a phone.
3. Submit a test email with `?utm_source=test&utm_medium=verify&utm_campaign=go-live`
   appended to the URL.
4. Confirm the row in Supabase (`robot_waitlist` table, Atraly project),
   then **delete the test row**.

## Notes

- HTTPS is terminated automatically by Render (and by Cloudflare Pages /
  Netlify / Vercel if you host there instead — any static host works, the DNS
  value just changes to that host's target).
- The robot story stays off `aorila.com` for now; `aorila.com/robot` is reserved
  for the eventual merge.
- Do not add payment/reservation flows — counsel review gates that stage.
