# Product Requirements — tax-tracker

## Problem
A Malaysian sole proprietor managing their own books has no structured tool to record income and expenses, correct mistakes, and produce the annual summary required for LHDN e-B filing. Manual spreadsheets are error-prone and time-consuming.

## Target User
One person: a solo Malaysian sole proprietor doing their own bookkeeping.

## Core Objects
- **Transaction** — every income or expense event
- **Category** — income types and expense categories (LHDN-aligned)

## MVP Must-Haves
- [ ] Add a transaction: date, type (income/expense), amount, description, category, customer/vendor, payment method, reference number, notes, receipt URL
- [ ] Edit any field on an existing transaction
- [ ] Delete a transaction (with confirmation)
- [ ] Filter transaction list by year, month, type, and category
- [ ] Totals bar: gross income, total expenses, net profit — reactive to current filter
- [ ] Annual summary page: income total, expenses by category, monthly breakdown, net profit
- [ ] Category management: add/edit/delete categories
- [ ] CSV export of transaction list and annual summary
- [ ] App loads with demo data, no login required

## Non-Goals (v1)
Receipt OCR, bank import, AI categorisation, tax advice, e-B auto-submission, multi-user, invoicing, foreign currency, inventory, payroll, mobile app, WhatsApp/Telegram integration.

## Success Criteria
User opens the app, enters 12 months of real transactions, corrects two mistakes by editing, deletes one duplicate, filters to the current year, and reads an annual summary showing correct gross income, expenses by category, monthly totals, and net profit — ready to transcribe into the LHDN e-B form.
