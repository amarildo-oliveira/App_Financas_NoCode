# Finanças Pessoais

App de controle financeiro pessoal construído com Next.js, Supabase (auth + Postgres com RLS) e Base UI.

## Rodando localmente

1. Instale as dependências:

```bash
npm install
```

2. Copie `.env.example` para `.env.local` e preencha com as credenciais do seu projeto Supabase (Project Settings → API):

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

> A chave `anon` é pública por design do Supabase — o acesso aos dados é protegido por Row Level Security (RLS), não pelo sigilo dessa chave. Nunca coloque a `service_role key` no frontend nem em variáveis `NEXT_PUBLIC_*`; este projeto não a utiliza.

3. Rode as migrations em `supabase/migrations/` no SQL Editor do seu projeto Supabase (cria a tabela `transactions` e as policies de RLS).

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

1. Importe o repositório no [Vercel](https://vercel.com/new).
2. Em **Project Settings → Environment Variables**, cadastre as mesmas variáveis do `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Nunca commite `.env.local` (já está no `.gitignore`) — as credenciais reais só devem existir no painel da Vercel e no seu ambiente local.
4. Rode as migrations em `supabase/migrations/` no projeto Supabase de produção antes do primeiro deploy.

## Scripts

- `npm run dev` — desenvolvimento com Turbopack
- `npm run build` — build de produção
- `npm run start` — serve o build de produção
- `npm run lint` — ESLint
