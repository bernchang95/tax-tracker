create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  lhdn_code text,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;
drop policy if exists "categories_v1_read" on categories;
create policy "categories_v1_read" on categories for select using (true);
drop policy if exists "categories_v1_write" on categories;
create policy "categories_v1_write" on categories for all using (true) with check (true);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  txn_date date not null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14,2) not null check (amount > 0),
  description text not null,
  category_id uuid references categories(id) on delete set null,
  customer_vendor text,
  payment_method text,
  reference_number text,
  notes text,
  receipt_url text,
  created_at timestamptz not null default now()
);

alter table transactions enable row level security;
drop policy if exists "transactions_v1_read" on transactions;
create policy "transactions_v1_read" on transactions for select using (true);
drop policy if exists "transactions_v1_write" on transactions;
create policy "transactions_v1_write" on transactions for all using (true) with check (true);

insert into categories (id, name, type, lhdn_code) values
  ('a1000000-0000-0000-0000-000000000001', 'Consulting Fees', 'income', 'B1'),
  ('a1000000-0000-0000-0000-000000000002', 'Service Revenue', 'income', 'B1'),
  ('a1000000-0000-0000-0000-000000000003', 'Commission', 'income', 'B2'),
  ('a1000000-0000-0000-0000-000000000004', 'Office & Stationery', 'expense', 'E1'),
  ('a1000000-0000-0000-0000-000000000005', 'Travel & Transport', 'expense', 'E2'),
  ('a1000000-0000-0000-0000-000000000006', 'Telecommunications', 'expense', 'E3'),
  ('a1000000-0000-0000-0000-000000000007', 'Professional Fees', 'expense', 'E4'),
  ('a1000000-0000-0000-0000-000000000008', 'Advertising & Marketing', 'expense', 'E5')
on conflict (id) do nothing;

insert into transactions (txn_date, type, amount, description, category_id, customer_vendor, payment_method, reference_number, notes) values
  ('2024-01-15', 'income', 5500.00, 'Website redesign project', 'a1000000-0000-0000-0000-000000000002', 'Ahmad Sdn Bhd', 'Bank Transfer', 'INV-2024-001', 'Phase 1 payment'),
  ('2024-02-03', 'income', 3200.00, 'Monthly retainer - Feb', 'a1000000-0000-0000-0000-000000000001', 'Tech Solutions MY', 'Bank Transfer', 'INV-2024-002', null),
  ('2024-02-10', 'expense', 420.00, 'Maxis postpaid bill', 'a1000000-0000-0000-0000-000000000006', 'Maxis Berhad', 'Online Banking', 'MAX-FEB24', null),
  ('2024-03-05', 'income', 8000.00, 'App development milestone 1', 'a1000000-0000-0000-0000-000000000002', 'Syarikat Maju Jaya', 'Bank Transfer', 'INV-2024-003', 'Balance due on delivery'),
  ('2024-03-18', 'expense', 1250.00, 'Facebook & Google Ads - Q1', 'a1000000-0000-0000-0000-000000000008', 'Meta / Google', 'Credit Card', 'ADS-Q1-2024', null),
  ('2024-04-01', 'expense', 600.00, 'Accountant review fee', 'a1000000-0000-0000-0000-000000000007', 'Chong & Partners', 'Bank Transfer', 'CP-2024-04', 'Q1 accounts review'),
  ('2024-04-20', 'income', 3200.00, 'Monthly retainer - Apr', 'a1000000-0000-0000-0000-000000000001', 'Tech Solutions MY', 'Bank Transfer', 'INV-2024-004', null),
  ('2024-05-12', 'expense', 310.00, 'Grab rides + toll - Apr/May', 'a1000000-0000-0000-0000-000000000005', 'Various', 'e-Wallet', 'TRVL-MAY24', null),
  ('2024-06-08', 'income', 2500.00, 'SEO consulting project', 'a1000000-0000-0000-0000-000000000001', 'Bumiputra Niaga', 'Bank Transfer', 'INV-2024-005', null),
  ('2024-06-25', 'expense', 185.00, 'Printer paper & ink cartridges', 'a1000000-0000-0000-0000-000000000004', 'Officeworks PJ', 'Cash', 'RCP-JUN24', null)
on conflict do nothing;