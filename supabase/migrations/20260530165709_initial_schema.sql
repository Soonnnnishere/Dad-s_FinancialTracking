-- Plan 1 scope: categories, transactions, preferences (no budgets/recurring yet — Plan 3/4).
create extension if not exists "uuid-ossp";

create table public.categories (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  i18n_key     text,
  kind         text not null check (kind in ('income','expense')),
  icon         text,
  color        text,
  is_archived  boolean not null default false,
  created_at   timestamptz not null default now()
);
create index categories_user_idx on public.categories(user_id);

create table public.transactions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  category_id  uuid not null references public.categories(id) on delete restrict,
  kind         text not null check (kind in ('income','expense')),
  amount       numeric(12,2) not null check (amount > 0),
  currency     text not null default 'MYR',
  occurred_on  date not null default current_date,
  note         text,
  created_at   timestamptz not null default now()
);
create index transactions_user_date_idx on public.transactions(user_id, occurred_on desc);
create index transactions_user_category_idx on public.transactions(user_id, category_id);

create table public.preferences (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  currency     text not null default 'MYR',
  locale       text not null default 'zh-CN' check (locale in ('zh-CN','en')),
  default_view text not null default 'today',
  created_at   timestamptz not null default now()
);
