-- Owner-only access on all tables. Every row is scoped by user_id; auth.uid()
-- comes from the JWT and must match. WITH CHECK on insert/update prevents
-- a signed-in user from creating rows in someone else's name.

alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.preferences enable row level security;

create policy "categories_owner_select" on public.categories
  for select using (auth.uid() = user_id);
create policy "categories_owner_insert" on public.categories
  for insert with check (auth.uid() = user_id);
create policy "categories_owner_update" on public.categories
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "categories_owner_delete" on public.categories
  for delete using (auth.uid() = user_id);

create policy "transactions_owner_select" on public.transactions
  for select using (auth.uid() = user_id);
create policy "transactions_owner_insert" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "transactions_owner_update" on public.transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions_owner_delete" on public.transactions
  for delete using (auth.uid() = user_id);

create policy "preferences_owner_select" on public.preferences
  for select using (auth.uid() = user_id);
create policy "preferences_owner_insert" on public.preferences
  for insert with check (auth.uid() = user_id);
create policy "preferences_owner_update" on public.preferences
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
