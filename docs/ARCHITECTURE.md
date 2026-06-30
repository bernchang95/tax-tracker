# Architecture — tax-tracker

## Stack
- **Frontend:** Next.js (App Router) — single-page transaction list + summary page
- **Database:** Supabase (Postgres + RLS)
- **Hosting:** Vercel
- **Auth (later):** Supabase Auth, added in Lock-Down sprint

## What to Build Now vs Later
**Now:** transaction CRUD, category CRUD, filter/totals bar, annual summary, CSV export 
**Later:** auth + RLS owner policies, receipt upload, bank import, multi-year compare, tax-band estimate

## Key User Action — Step-by-Step
1. User fills the Add Transaction form and clicks Save
2. Next.js client validates required fields client-side
3. Supabase client inserts a row into `transactions` linked to a `categories` row
4. The transaction list re-fetches; totals bar recalculates from the updated row set
5. Annual summary page aggregates the same `transactions` table by `txn_date` year/month

## Layer Plan
1. **Data layer first:** `transactions` and `categories` tables with RLS — all logic is SQL aggregation (SUM, GROUP BY year/month/category). Core app works with zero AI.
2. **App logic:** Next.js server components for summary aggregation; client components for form and filters
3. **Smart features (later):** auto-suggested categories, anomaly flags — layered on top; removing them does not break anything

## Why Core Runs Without AI
All totals are plain SQL sums. No AI field is required to read, write, filter, or summarise transactions.
