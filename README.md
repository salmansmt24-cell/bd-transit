# BD Transit 🇧🇩

Bilingual (Bangla / English) Next.js 15 + Tailwind CSS 4 transport information MVP for Bangladesh. **No fabricated live GPS, fare, or schedule data.**

## Included
- Responsive homepage, header, navigation, language switcher
- Bus/train route finder (direct and ordered intermediate stops)
- Fare checker with source/update information
- Protected admin CRUD console for places, routes, route stops, fares
- Supabase PostgreSQL schema with RLS
- Read-only routes API and freshness-gated GPS API
- Vercel-compatible deployment

## Local setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Create Supabase project, execute `supabase/schema.sql` in SQL Editor.
4. Enable Supabase Email/Password auth. Create your admin user in Supabase Auth dashboard.
5. Copy `.env.example` to `.env.local` and set URL, anon key, **server-only** service role key and `ADMIN_EMAILS` (comma-separated email allowlist).
6. Run `npm run dev`, open http://localhost:3000.
7. Visit `/admin` and sign in. Create places first, then routes using place UUIDs, then route stops and fares. Set `published: true` only for sourced/verified entries. Add `source_url` and `verified_at` when known.

## Deploy on Vercel
1. Push files to a new GitHub repository.
2. Vercel → Add New → Project → Import repository.
3. Framework: Next.js; Build: `npm run build`.
4. Set the four environment variables from `.env.example` in Vercel Project Settings → Environment Variables. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only; NEVER prefix it with NEXT_PUBLIC.
5. Deploy. Configure a custom domain later if needed.

## Data and limitations
- The database starts **empty intentionally**. Coverage is national in architecture, not a claim of populated nationwide routes.
- Search matches published direct routes and ordered stops, but does **not** yet compute multi-vehicle transfers, shortest path, or stop-to-stop fare breakdowns.
- Fare records represent the listed route/class. Intermediate-stop-specific fares need a later schema extension.
- GPS API `/api/tracking/{vehicleId}` returns `unavailable` if no fresh position within 5 minutes; no simulated coordinates. GPS ingestion must be implemented only after permission and integration with a real provider. No public live map is shown before this.
- Public route API `/api/routes?from=Dhaka&to=Chattogram&mode=bus`.
- Admin auth is Supabase Auth + server-side email allowlist. Change admin credentials, enforce MFA where supported, and add rate limiting/audit logs before production use.
- Source URLs and verified dates should be supplied by administrators; the app does not scrape railway or operator websites.
- The default admin editor uses JSON for efficient MVP management. A polished form-driven admin, detailed schedule data, and transfer planning are next-phase features.
- Protect personal data and obtain operator permission before collecting/publishing vehicle positions.

## Project layout
`src/app` — pages and APIs; `src/components` — UI; `src/lib` — types, database, translations, authorization; `supabase/schema.sql` — PostgreSQL schema.
