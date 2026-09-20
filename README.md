# Gestor do E-commerce

Sistema web com três módulos:

- gestor financeiro sincronizado com Supabase;
- precificador Amazon para DBA, FBA, FBA Onsite e logística própria;
- cadastro de fornecedores com contatos, produtos, condições de compra, avaliação e favoritos.

O site possui tema claro/escuro, opções avançadas recolhidas por padrão, comissão
zero promocional e tarifa fixa promocional do FBA configurável (R$ 6,00 por padrão).
Essas promoções devem ser desmarcadas quando deixarem de valer na conta Amazon.

O precificador oferece os modos **Encontrar preço ideal** e **Conferir preço atual**,
comparação visual entre modalidades e rateio de custos fixos mensais pelo volume de vendas.

## Ativação do precificador

1. Abra o SQL Editor do projeto no Supabase.
2. Copie todo o conteúdo de `criar_precificacoes.sql`.
3. Execute com **Run**. A mensagem esperada é `Success. No rows returned`.
4. Publique `index.html`, `precificador.css`, `precificador.js` e este SQL no GitHub.

O cálculo continua funcionando sem a nova tabela, mas salvar e reabrir produtos só
fica disponível depois da execução do SQL.

## Ativação dos fornecedores

1. Abra o **SQL Editor** do projeto no Supabase.
2. Crie uma nova consulta e cole todo o conteúdo de `criar_fornecedores.sql`.
3. Clique em **Run**. A mensagem esperada é `Success. No rows returned`.
4. Publique também `fornecedores.css` e `fornecedores.js` no GitHub.

Depois disso, a área **Fornecedores** permite cadastrar, editar, pesquisar e excluir
parceiros. É possível marcar os principais como preferenciais e abrir o WhatsApp ou
o site do fornecedor diretamente pelo cadastro.

Para repetir os testes automáticos dos cálculos, execute no terminal:

```bash
node testar_precificador.js
```

## Segurança e atualização de tarifas

As precificações e os fornecedores pertencem ao usuário autenticado e são protegidos
por RLS no Supabase. As tabelas do cálculo têm a data-base exibida na tela. Antes de
publicar um preço, confirme promoções, tarifas específicas da conta e a tributação vigente.
