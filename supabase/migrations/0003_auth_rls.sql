-- Drop v1 permissive (public) policies
drop policy if exists "categories_v1_read"  on categories;
drop policy if exists "categories_v1_write" on categories;
drop policy if exists "transactions_v1_read"  on transactions;
drop policy if exists "transactions_v1_write" on transactions;

-- Categories: global seed rows (user_id IS NULL) stay visible to all
-- authenticated users; user-created rows are owner-scoped.
-- Writes always require auth.uid() = user_id.
create policy "categories_select" on categories
  for select using (auth.uid() = user_id or user_id is null);

create policy "categories_insert" on categories
  for insert with check (auth.uid() = user_id);

create policy "categories_update" on categories
  for update using (auth.uid() = user_id);

create policy "categories_delete" on categories
  for delete using (auth.uid() = user_id);

-- Transactions: strict per-user isolation on every operation
create policy "transactions_select" on transactions
  for select using (auth.uid() = user_id);

create policy "transactions_insert" on transactions
  for insert with check (auth.uid() = user_id);

create policy "transactions_update" on transactions
  for update using (auth.uid() = user_id);

create policy "transactions_delete" on transactions
  for delete using (auth.uid() = user_id);
