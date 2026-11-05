# BD Transit — Neon PostgreSQL edition

Next.js 15 / Tailwind CSS 4 bilingual Bangladesh transport information MVP.

## Setup

1. Create a Neon PostgreSQL project. In Neon SQL Editor (production branch), execute `neon/schema.sql`. This creates **empty** tables, no fake fares, routes or GPS.
2. Copy `.env.example` to `.env.local`. Set `DATABASE_URL` to the pooled Neon connection string (keep it secret).
3. Run `node scripts/create-admin.mjs` locally. Enter a password (12+ characters). Copy the printed `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` to `.env.local`. Set `ADMIN_EMAIL` to your email. Do **not** commit secrets or `.env.local`.
4. Run `npm install && npm run dev`. Open `/admin` and sign in with your email and chosen password.
5. Add places first, then routes with their origin/destination place UUIDs, then route stops and fares. Publish only verified data with sources.
6. In Vercel Project Settings → Environment Variables, set `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` (Production; optionally Preview/Development). Redeploy.

## Notes

- Supabase has been removed; no Supabase keys or accounts required.
- Database access happens only on the server via `postgres` and parameterized SQL.
- Admin uses a server-validated, HttpOnly, SameSite=Strict, HMAC-signed 8-hour session cookie. For a public production service, add persistent login rate limiting, MFA, audit logs, monitoring and backup/restore procedures.
- Routes support direct travel and ordered intermediate stops. No transfer graph, segment fare calculations or official nationwide route data yet.
- GPS API returns `unavailable` unless a vehicle has an authorized GPS source, a published route and a real position from the last 5 minutes. No GPS ingestion or fabricated coordinates.
- Data is empty until administrators add sourced records.
- Public routes endpoint: `/api/routes?from=Dhaka&to=Chattogram&mode=bus`.
- `DATABASE_URL` and admin secrets must never have `NEXT_PUBLIC_` prefix.
