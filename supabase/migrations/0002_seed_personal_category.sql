insert into categories (id, name, type, lhdn_code) values
  ('a1000000-0000-0000-0000-000000000009', 'Personal / Non-claimable', 'expense', null)
on conflict (id) do nothing;
