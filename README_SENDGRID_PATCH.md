# SendGrid Test Route Patch

**Purpose:** quickly test your SENDGRID_API_KEY and ALERTS_FROM_EMAIL on Vercel.

## Apply the patch
1) Download this zip.
2) In your repo, create `app/api/send-test-email/`.
3) Add `route.ts` inside it.
4) Commit & push → Vercel deploys.

## Test
Open your site and run this in the browser console:
fetch("/api/send-test-email", { method: "POST" }).then(r=>r.json()).then(console.log)