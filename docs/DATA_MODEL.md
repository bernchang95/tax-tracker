# Data Model — tax-tracker

## categories
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid | nullable; owner scope at lock-down |
| name | text | e.g. "Consulting Fees" |
| type | text | 'income' or 'expense' |
| lhdn_code | text | optional LHDN schedule ref |
| created_at | timestamptz | default now() |

## transactions
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid | nullable; owner scope at lock-down |
| txn_date | date | required |
| type | text | 'income' or 'expense' |
| amount | numeric(14,2) | positive, required |
| description | text | required |
| category_id | uuid FK | → categories.id, set null on delete |
| customer_vendor | text | customer (income) or vendor (expense) |
| payment_method | text | Bank Transfer, Cash, Credit Card, e-Wallet, etc. |
| reference_number | text | invoice or receipt ref |
| notes | text | free text |
| receipt_url | text | optional document link |
| created_at | timestamptz | default now() |

## Relationships
- `transactions.category_id` → `categories.id` (many-to-one)

## RLS Notes
- v1: permissive read+write policies (demo mode, no login)
- Lock-down sprint: replace with `auth.uid() = user_id` owner-scoped policies

## AI Fields
No AI-generated fields in v1. If auto-categorisation is added later, store: `suggested_category_id`, `category_source text`, `category_confidence numeric`, `category_review_status text default 'unreviewed'`.
