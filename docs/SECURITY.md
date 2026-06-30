# Security — tax-tracker

## Secret Handling
- Supabase service role key: never in frontend code or committed to repo; server-side only via environment variable `SUPABASE_SERVICE_ROLE_KEY`
- Public anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) is safe to expose — RLS enforces access
- All env vars stored in Vercel environment settings, never in source

## Permission Model
- **v1 (demo mode):** permissive RLS policies — anonymous reads and writes allowed so the app is demoable without login
- **Lock-down sprint:** replace all v1 policies with `auth.uid() = user_id`; every write stamps `user_id = auth.uid()`; no cross-user data leakage
- **Agent actions:** any future agent tool executes under the authenticated user's Supabase session — it cannot access rows the user cannot access

## Approved Tools Rule
No agent or server action may execute arbitrary SQL or call `run_any` / `send_any` style tools. Every callable function is named, scoped, and logged.

## Audit Principle
Every create, update, and delete on `transactions` and `categories` is logged with: `action`, `record_id`, `old_value`, `new_value`, `performed_by`, `performed_at`. Logs are append-only; no UI delete for audit rows.
