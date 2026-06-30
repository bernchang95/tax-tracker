# Test Plan — tax-tracker

## v1 Success Scenario (manual walkthrough)

1. **Open app** at `/` — transaction list loads with demo rows, no login prompt.
2. **Add income:** click "Add Transaction" → fill date=2024-07-01, type=Income, amount=4500, description="Training workshop", category=Consulting Fees, customer=Universiti Malaya, payment method=Bank Transfer, reference=INV-2024-099 → Save. Row appears in list.
3. **Verify totals bar** updates: Gross Income increases by RM 4,500.
4. **Edit transaction:** click edit on the row just added → change amount to 4800 → Save. List shows RM 4,800. Totals bar updates.
5. **Delete a transaction:** click delete on a demo row → confirm → row disappears. Totals bar decreases correctly.
6. **Filter by year:** select 2024 → only 2024 rows shown, totals reflect filtered set.
7. **Filter by type:** select Expense → only expense rows visible. Totals show RM 0 income.
8. **Clear filters** → all rows return.
9. **Open Annual Summary** at `/summary` → select year 2024 → gross income, total expenses, net profit all match manual sum of seed data. Monthly table shows correct month-by-month split. Expenses-by-category table is correct.
10. **Export CSV** → download transaction list CSV → open in Excel → all columns present, amounts correct.
11. **Export summary CSV** → download → net profit figure matches summary page.

## Empty State Tests
- Filter to a year with no transactions (e.g. 2020) → list shows "No transactions for this period", all totals show RM 0.00.
- Delete all transactions → list shows empty state message.

## Error / Edge Case Tests
- Submit Add Transaction form with amount left blank → inline validation error, no DB write.
- Submit with amount = 0 or negative → validation rejects.
- Enter a very large amount (RM 9,999,999.99) → saves and displays correctly.
- Rapid double-click on Save → only one row inserted (disable button on submit).
- Category deleted while transactions reference it → transactions remain, category field shows "Uncategorised".

## Category Management Tests
- Add a new expense category "Software Subscriptions" → appears in transaction form dropdown.
- Rename a category → existing transactions reflect new name.
- Delete a category that has transactions → transactions remain, `category_id` is null, displayed as "Uncategorised".
