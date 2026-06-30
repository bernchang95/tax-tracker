# Tasks — tax-tracker

## Sprint 1 — Database & Core Transaction CRUD
**Goal:** The transaction list page is live, shows demo data, and full add/edit/delete works against the database. No login required.

- [ ] Run migration SQL (categories + transactions tables, seed 10 demo rows)
- [ ] Transaction list page (`/`) — renders all rows from Supabase, no login gate
- [ ] Add Transaction form — all fields, client-side validation, inserts to DB
- [ ] Edit Transaction — pre-filled form, updates DB row
- [ ] Delete Transaction — confirmation dialog, hard delete
- [ ] Loading skeleton, empty state ("No transactions yet — add your first one"), error toast
- [ ] Category dropdown in form pulls from `categories` table

**Definition of Done:** Add a new transaction, edit its amount, delete it — all changes persist and are reflected immediately in the list. Demo rows visible on first load without login.

---

## Sprint 2 — Filters, Totals & Annual Summary Engine
**Goal:** Filtering and the annual summary page work end-to-end against live data.

- [ ] Filter bar: year select, month select, type toggle (income/expense/all), category dropdown
- [ ] Totals bar above list: Gross Income / Total Expenses / Net Profit — recalculates on filter change
- [ ] Annual Summary page (`/summary`) — year picker, income total, expenses grouped by category, monthly breakdown table, net profit
- [ ] Summary figures derived from `transactions` table SQL aggregation (no hardcoding)
- [ ] Verify totals match raw row data (test with seed data arithmetic)

**Definition of Done:** Select year 2024 → summary shows correct totals matching seed data. Change year to one with no data → all totals show RM 0.00.

---

## Sprint 3 — Category Management, Export & Polish ✅ v1 functional
**Goal:** Complete v1. User can manage categories, export data, and the UI is clean and responsive.

- [ ] Category management page (`/categories`) — list, add, edit, delete
- [ ] CSV export: filtered transaction list
- [ ] CSV export: annual summary (income, expense categories, monthly totals, net profit)
- [ ] Responsive layout (desktop + tablet)
- [ ] Clear UI copy on all buttons, labels, empty states
- [ ] End-to-end manual test pass per TEST_PLAN.md

**Definition of Done:** Full success scenario in TEST_PLAN.md passes. CSV exports open correctly in Excel/Sheets. All buttons do something real.

---

## Sprint 4 — Lock It Down (Auth + Per-User Isolation)
**Goal:** Real data is safe. Each user sees only their own transactions.

- [ ] Supabase Auth: email/password sign-up, sign-in, sign-out
- [ ] Replace v1 permissive RLS policies with `auth.uid() = user_id` on both tables
- [ ] All writes stamp `user_id = auth.uid()`
- [ ] Unauthenticated visitors redirected to `/login`
- [ ] Verify zero cross-user data leakage (test with two accounts)

**Definition of Done:** Two test accounts each see only their own data. Anonymous access returns 0 rows.

---

## Gantt (sprint → feature lands)
```
Sprint 1 │ DB schema · transaction list · add/edit/delete
Sprint 2 │ filters · totals bar · annual summary page
Sprint 3 │ category CRUD · CSV export · responsive polish  ← v1 functional
Sprint 4 │ auth · per-user RLS · login/logout
```
