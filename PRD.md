# Finanças Pessoais App — PRD

## 1. Problema Identificado

### Qual dor real estamos resolvendo?

Pessoas físicas têm dificuldade em controlar suas finanças pessoais de forma simples e visual. As informações ficam dispersas entre extratos bancários, planilhas manuais e anotações avulsas. Não há uma visão consolidada de receitas, despesas e saldo, o que leva a descontrole financeiro, gastos desnecessários e falta de planejamento.

## 2. Solução

### O que vamos construir

Um web app de gestão financeira pessoal que permite ao usuário registrar receitas e despesas, categorizá-las, e visualizar um dashboard com resumo mensal (total de receitas, total de despesas e saldo). A aplicação é responsiva, com autenticação via Supabase Auth e dados persistidos no Supabase (PostgreSQL).

### Diferenciais

Interface moderna e minimalista com shadcn/ui, dashboard visual com gráficos de categorias, filtros por período e categoria, e deploy instantâneo na Vercel. Todo o desenvolvimento foi guiado pelo Claude Code como agente de codificação.

## 3. Funcionalidades Principais

- Login e Autenticação
- Dashboard
- Busca e Filtros
- CRUD de Transações
- Categorias
- Gráficos (Recharts)
- Responsivo (Mobile)
- Landing Page
- Exportar CSV

### Detalhamento das features

- **Login e Autenticação**: Supabase Auth com e-mail/senha. Proteção de rotas autenticadas.
- **Dashboard**: Visão consolidada com cards de Receita Total, Despesa Total e Saldo. Gráfico de pizza por categoria (Recharts).
- **CRUD de Transações**: Criar, editar e excluir receitas e despesas. Campos: descrição, valor, data, tipo (receita/despesa), categoria.
- **Categorias**: Categorias pré-definidas (Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Salário, Freelance, Outros).
- **Filtros**: Filtrar transações por mês/ano e por categoria. Busca por descrição.
- **Exportar CSV**: Botão para exportar as transações filtradas em formato .csv.
- **Responsivo**: Layout adaptável para desktop e mobile com Tailwind CSS.

## 4. Persona e Tipos de Usuários

### Usuário Final

Pessoa física que deseja organizar suas finanças. Cadastra transações, acompanha o dashboard e exporta relatórios.

Para este projeto (escopo de aula), há apenas um tipo de usuário autenticado. Cada usuário só visualiza e gerencia suas próprias transações (Row Level Security no Supabase).

## 5. Stack Tecnológica

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Supabase Auth
- PostgreSQL
- Vercel
- Claude Code
- Recharts
- Git / GitHub

### Detalhes da stack

- **Frontend**: Next.js (App Router) com TypeScript, Tailwind CSS e shadcn/ui para componentes de UI. Gráficos com Recharts.
- **Backend/BaaS**: Supabase (PostgreSQL + Auth + Row Level Security). Sem backend separado.
- **Deploy**: Vercel (integração contínua via GitHub).
- **Desenvolvimento**: Claude Code como agente de codificação. Versionamento com Git/GitHub.

## 6. Referências de Design

### Inspirações visuais

- **Mobills / Organizze**: Apps brasileiros de finanças pessoais com UX limpa, cards de resumo e gráficos simples.
- **shadcn/ui Dashboard Template**: Referência para layout de dashboard moderno, minimalista e responsivo.
- **Estilo geral**: Interface clara, fontes sem serifa, cards com bordas suaves, paleta neutra com acentos em azul/verde.
