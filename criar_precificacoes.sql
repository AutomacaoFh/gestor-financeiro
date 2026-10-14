-- Execute este arquivo uma única vez no SQL Editor do Supabase.
-- Ele cria o armazenamento dos produtos precificados sem alterar lançamentos existentes.

create extension if not exists pgcrypto;

create table if not exists public.precificacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null check (char_length(trim(nome)) between 1 and 120),
  sku text,
  dados jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists precificacoes_user_id_atualizado_idx
  on public.precificacoes (user_id, atualizado_em desc);

alter table public.precificacoes enable row level security;

drop policy if exists "Usuario consulta proprias precificacoes" on public.precificacoes;
drop policy if exists "Usuario cria proprias precificacoes" on public.precificacoes;
drop policy if exists "Usuario atualiza proprias precificacoes" on public.precificacoes;
drop policy if exists "Usuario exclui proprias precificacoes" on public.precificacoes;

create policy "Usuario consulta proprias precificacoes"
  on public.precificacoes for select
  using ((select auth.uid()) = user_id);

create policy "Usuario cria proprias precificacoes"
  on public.precificacoes for insert
  with check ((select auth.uid()) = user_id);

create policy "Usuario atualiza proprias precificacoes"
  on public.precificacoes for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Usuario exclui proprias precificacoes"
  on public.precificacoes for delete
  using ((select auth.uid()) = user_id);

comment on table public.precificacoes is
  'Cenarios de precificacao Amazon salvos por cada usuario do gestor.';

