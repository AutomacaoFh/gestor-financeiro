-- Adiciona o responsável pelo pagamento sem alterar ou apagar lançamentos existentes.
-- Valores antigos permanecem NULL e aparecem como "Não informado" na aplicação.
alter table public.lancamentos
  add column if not exists pago_por text
  check (pago_por in ('Felipe', 'Bruna', 'Empresa'));

