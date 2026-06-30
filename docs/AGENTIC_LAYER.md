# Agentic Layer — tax-tracker

## v1 — No Agentic Actions
v1 is a pure human-driven CRUD tool. No automated actions run without direct user input.

## Risk Classification (for later sprints)

### Low Risk — Auto-execute
- Suggest a category when a transaction description is typed (rule-based keyword match)
- Calculate and display annual/monthly totals on load

### Medium Risk — Show draft, user confirms
- Pre-fill a new transaction from a previous similar entry ("repeat last transaction with this vendor?")
- Flag a duplicate reference number and suggest merging

### High Risk — Explicit approval required
- Bulk-recategorise all transactions matching a rule
- Import transactions from a CSV file (user must review before commit)

### Critical — Human only, never automated
- Delete a transaction or category
- Export data (user-initiated only)
- Any future bank credential handling

## Named Tools (later)
- `suggest_category(description: string) → category_id` — low risk, auto
- `flag_duplicate(reference_number: string) → transaction_id[]` — low risk, display only
- `bulk_recategorise(old_category_id, new_category_id) → count` — high risk, approval required

## Audit Log Fields (every meaningful action)
`action`, `table_name`, `record_id`, `old_value (jsonb)`, `new_value (jsonb)`, `performed_by`, `performed_at`

All agent actions inherit the user's RLS permission. No agent tool may call raw SQL or bypass RLS.
