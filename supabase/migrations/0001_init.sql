-- Finanças Pessoais App — schema inicial
-- Rode este script no SQL Editor do seu projeto Supabase (https://supabase.com/dashboard)

create type transaction_type as enum ('income', 'expense');

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount numeric(12,2) not null check (amount > 0),
  date date not null,
  type transaction_type not null,
  category text not null,
  created_at timestamptz not null default now()
);

create index transactions_user_id_date_idx on public.transactions (user_id, date desc);

alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);
