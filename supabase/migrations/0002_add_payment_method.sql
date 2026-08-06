create type payment_method as enum ('pix', 'debito', 'credito', 'outros');

alter table public.transactions
  add column payment_method payment_method not null default 'outros';
