# Gestor do E-commerce — atualização v7

Um único site com Gestor Financeiro, Precificador Amazon e Fornecedores. A v7 parte dos arquivos atuais do repositório, mantém a conexão existente e preserva os cadastros.

## Instalar a atualização

1. Extraia o ZIP e copie os arquivos para a pasta atual `gestor-financeiro`, substituindo os arquivos com o mesmo nome. Copie também o novo `interface.css`.
2. No SQL Editor do Supabase, execute **somente** `adicionar_empresa_pago_por.sql`. É uma migração transacional e repetível que amplia o CHECK de `pago_por` para Felipe, Bruna e Empresa. Não apaga registros, não atualiza seus valores e não altera RLS.
3. No terminal aberto na pasta do repositório, execute:

```bash
git add .
git commit -m "Compactar precificador e fornecedores e adicionar Empresa"
git push origin main
```

4. Após a publicação do GitHub Pages, atualize a página com Ctrl + F5. No Android, recarregue a página; se aparecer a versão antiga, abra a mesma URL com `?v=7` no fim.

Não é necessário recriar as tabelas de precificações ou fornecedores. Os arquivos `criar_precificacoes.sql`, `criar_fornecedores.sql` e `adicionar_pago_por.sql` são mantidos apenas para instalações novas.

## O que muda

- **Financeiro:** Felipe, Bruna e Empresa no responsável pelo pagamento. No celular, histórico em cartões com todas as colunas e botões de edição/exclusão.
- **Fornecedores:** lista mais limpa, sem blocos de informações vazias. O formulário abre com Novo ou Editar. Condições, avaliações e observações ficam disponíveis em um detalhamento recolhido. O botão Novo respeita a largura do painel.
- **Precificador:** uma coluna de entradas e uma de resultados no computador; no celular, as áreas se empilham. Custos e comparação têm detalhamento recolhido. A origem DBA é Taubaté/SP, usando a tabela Interior do Sul/Sudeste.
- **Temas:** claro e escuro. Campos com teclado numérico no Android, alvos de toque maiores e adaptação à largura disponível.

## Despesas sem contagem duplicada

**Despesas por unidade** inclui embalagem, etiqueta/preparação, frete de compra e outros gastos com cada venda. Não inclua o custo do produto nem a tarifa logística Amazon nesse total: eles são calculados separadamente.

Ao abrir um cadastro antigo, o modo **detalhado** soma os quatro campos existentes e os apresenta no total. Valores antigos continuam preservados. Se você editar o total, passa a usar o modo **total**; o detalhamento antigo fica guardado e pode voltar ao cálculo com **Usar soma do detalhamento**. Nunca somamos o total e os componentes juntos. Editar um componente também ativa o modo detalhado.

**Custos mensais** mantém o rateio de contabilidade, sistemas e outros gastos fixos por todas as unidades estimadas no mês. Informe um volume conservador. A mensalidade do plano profissional Amazon é calculada à parte quando o plano pago está selecionado; não a inclua novamente no custo mensal. Impostos, Ads, cupons, devoluções e parcelamento permanecem no cálculo quando informados, mesmo com os blocos fechados.

## Tarifas e promoções — conferência de 12/10/2026

Fontes oficiais:

- Comissões, planos, parcelamento e FBA: https://venda.amazon.com.br/precos
- DBA: https://venda.amazon.com.br/cresca/dba
- Promoção FBA: https://venda.amazon.com.br/termos/experimente-fba
- Comissão zero e desconto DBA/Onsite: https://venda.amazon.com.br/termos/vender-com-amazon

As páginas públicas continuam indicando comissões-base de 20/01/2025 e logística FBA de 01/08/2025. Permanecem o plano individual de R$ 2 por item, o profissional de R$ 19/mês após o período gratuito e o parcelamento opcional de 1,5% para ASINs participantes a partir de R$ 40.

DBA abaixo de R$ 79: R$ 4,50 abaixo de R$ 30; R$ 6,50 de R$ 30 a R$ 49,99; R$ 6,75 de R$ 50 a R$ 78,99. Foi corrigido o adicional por quilo acima de 10 kg na faixa de R$ 150 a R$ 199,99: R$ 3,50. Peso e dimensões podem alterar as demais faixas.

**FBA promocional:** R$ 6 somente a partir de R$ 79, com a promoção confirmada na conta para o mês corrente. A manutenção depende dos requisitos de Ads da conta e da validação mensal; não é verificada automaticamente pelo site. Campanha pública até 31/01/2027. Abaixo de R$ 79 aplicamos a tabela normal. O benefício ativo zera a armazenagem estimada; outros custos FBA informados continuam incluídos. A tabela FBA sempre inclui os 20 g obrigatórios de embalagem. Uma tarifa individual diferente deve ser preenchida em tarifa logística manual, que representa o valor final.

**Comissão zero:** só aplica quando marcada e com uma data final ainda válida, nas modalidades Amazon. A campanha pública encerrou novas entradas em 30/09/2026, mas benefícios já iniciados podem continuar: 90 dias de base e até 60 dias extras condicionados à elegibilidade e limites, com término até 31/12/2026. A ferramenta não consulta o saldo do benefício na Amazon: confirme o limite disponível na Seller Central antes de marcar.

**Desconto logístico:** a campanha pública de 50% DBA/Onsite terminou em 30/09/2026. Cadastros antigos continuam guardando o percentual, mas ele só volta ao cálculo com uma validade ativa confirmada. Não acumulamos desconto percentual sobre uma tarifa manual final nem sobre a tarifa promocional FBA.

## Validação

```bash
node testar_precificador.js
```

Os testes cobrem a garrafa de R$ 6,99 vendida por R$ 19, rateio mensal, preservação de custos detalhados, mínimos de comissão, peso dimensional, faixas e limites de DBA/FBA, promoções e o menor preço em centavos confrontado com busca exaustiva.

Também foram verificados com dados sintéticos: abertura/edição de cadastros antigos, valores e campos desconhecidos no JSON, Empresa em gravação/leitura, e a migração SQL em PostgreSQL isolado. O layout passou em 36 combinações de módulos e temas nas larguras 360, 393, 412, 480, 820 e 1280 pixels, incluindo os formulários expandidos. É emulação local; não houve teste físico no Poco X7 Pro nem escrita nos dados reais do Supabase.
