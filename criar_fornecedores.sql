-- Execute este arquivo uma única vez no SQL Editor do Supabase.
-- Cada usuário autenticado só consegue acessar os próprios fornecedores.

create extension if not exists pgcrypto;

create table if not exists public.fornecedores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null check (char_length(trim(nome)) between 1 and 120),
  status text not null default 'ativo' check (status in ('ativo', 'teste', 'pausado')),
  preferencial boolean not null default false,
  contato text,
  whatsapp text,
  site text,
  cidade text,
  estado text,
  produtos text,
  pedido_minimo numeric(12, 2) not null default 0 check (pedido_minimo >= 0),
  prazo text,
  frete text,
  pagamento text,
  ultima_compra date,
  avaliacao smallint not null default 0 check (avaliacao between 0 and 5),
  observacoes text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists fornecedores_usuario_idx
  on public.fornecedores (user_id);

create index if not exists fornecedores_usuario_status_idx
  on public.fornecedores (user_id, status);

create index if not exists fornecedores_usuario_preferencial_idx
  on public.fornecedores (user_id, preferencial desc, atualizado_em desc);

alter table public.fornecedores enable row level security;

drop policy if exists "fornecedores_selecionar_proprios" on public.fornecedores;
create policy "fornecedores_selecionar_proprios"
  on public.fornecedores for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "fornecedores_inserir_proprios" on public.fornecedores;
create policy "fornecedores_inserir_proprios"
  on public.fornecedores for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "fornecedores_atualizar_proprios" on public.fornecedores;
create policy "fornecedores_atualizar_proprios"
  on public.fornecedores for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "fornecedores_excluir_proprios" on public.fornecedores;
create policy "fornecedores_excluir_proprios"
  on public.fornecedores for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.fornecedores to authenticated;

