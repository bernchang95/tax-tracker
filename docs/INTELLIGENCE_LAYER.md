# Intelligence Layer — tax-tracker

## v1 — Rule-Based Only (no AI)
All intelligence is deterministic SQL:
- Annual income = `SUM(amount) WHERE type='income' AND year=?`
- Expenses by category = `SUM(amount) GROUP BY category_id WHERE type='expense' AND year=?`
- Monthly breakdown = `SUM(amount) GROUP BY month WHERE year=?`
- Net profit = gross income − total expenses

No AI is required. The core is fully correct without it.

## Structured Output (Annual Summary)
```json
{
  "year": 2024,
  "gross_income": 22400.00,
  "total_expenses": 2765.00,
  "net_profit": 19635.00,
  "expenses_by_category": [
    { "category": "Advertising & Marketing", "total": 1250.00 },
    { "category": "Professional Fees", "total": 600.00 },
    { "category": "Telecommunications", "total": 420.00 },
    { "category": "Travel & Transport", "total": 310.00 },
    { "category": "Office & Stationery", "total": 185.00 }
  ],
  "monthly_totals": [
    { "month": "2024-01", "income": 5500.00, "expenses": 0.00 },
    { "month": "2024-02", "income": 3200.00, "expenses": 420.00 }
  ]
}
```

## Events to Track (for future scoring)
- Transaction created / edited / deleted
- Category changed on a transaction
- Annual summary viewed / exported

## Later — Smart Features
- Auto-suggest category from description (rule keywords first, embedding model later)
- Flag unusually large transactions vs. category average (z-score rule)
- Store any AI output with: `source`, `confidence`, `review_status = 'unreviewed'`
