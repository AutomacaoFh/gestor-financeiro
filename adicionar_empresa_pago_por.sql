-- Execute uma vez no SQL Editor do Supabase antes de salvar uma despesa da Empresa.
-- Não apaga nem reescreve lançamentos. Mantém NULL, Felipe e Bruna; adiciona Empresa.
begin;

alter table public.lancamentos add column if not exists pago_por text;

-- O nome gerado pelo PostgreSQL pode ter sido alterado. Localiza somente o CHECK
-- de enumeração já usado pelo app, restrito à coluna pago_por.
do $$
declare
  restricao record;
  coluna smallint;
begin
  select attnum into coluna from pg_attribute
    where attrelid = 'public.lancamentos'::regclass and attname = 'pago_por';
  for restricao in
    select conname from pg_constraint
    where conrelid = 'public.lancamentos'::regclass
      and contype = 'c'
      and conkey = array[coluna]::smallint[]
      and pg_get_constraintdef(oid) like '%Felipe%'
      and pg_get_constraintdef(oid) like '%Bruna%'
  loop
    execute format('alter table public.lancamentos drop constraint %I', restricao.conname);
  end loop;
end $$;

alter table public.lancamentos
  add constraint lancamentos_pago_por_check
  check (pago_por in ('Felipe', 'Bruna', 'Empresa'));

commit;
