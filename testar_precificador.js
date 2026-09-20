"use strict";

const assert = require("assert");
const precificador = require("./precificador.js");

function igual(valor, esperado) {
  assert(Math.abs(valor - esperado) < 1e-8, `${valor} deveria ser ${esperado}`);
}

// Comissões normais, mínimas e progressivas.
igual(precificador.calcularComissao(100, "cozinha"), 12);
igual(precificador.calcularComissao(5, "alimentos-bebidas"), 1);
igual(precificador.calcularComissao(100, "linha-branca"), 11);
igual(precificador.calcularComissao(100, "ferramentas"), 11);
igual(precificador.calcularComissao(150, "acessorios-eletronicos"), 20);
igual(precificador.calcularComissao(300, "moveis"), 40);

// Pontos de mudança das tarifas DBA.
igual(precificador.calcularTarifaDba(29, 0.3), 4.5);
igual(precificador.calcularTarifaDba(30, 0.3), 6.5);
igual(precificador.calcularTarifaDba(50, 0.3), 6.75);
igual(precificador.calcularTarifaDba(79, 0.3), 12.85);
igual(precificador.calcularTarifaDba(100, 0.3), 15);
igual(precificador.calcularTarifaDba(250, 0.3, "interior-sul-sudeste"), 20.95);

// Pontos de mudança e peso adicional no FBA.
igual(precificador.calcularTarifaFba(25, 0.05), 5.65);
igual(precificador.calcularTarifaFba(45, 0.05), 5.85);
igual(precificador.calcularTarifaFba(70, 0.05), 6.05);
igual(precificador.calcularTarifaFba(80, 0.05), 10.05);
igual(precificador.calcularTarifaFba(110, 0.05), 12.05);
igual(precificador.calcularTarifaFba(130, 1.2), 16.95);
igual(precificador.calcularTarifaFba(170, 11), 54.55);
assert.strictEqual(precificador.calcularTarifaFba(200, 22), null);

const promocaoFba = {
  logistica: "fba",
  categoria: "casa",
  comissaoManual: "",
  comissaoZero: true,
  tarifaManual: "",
  fbaPromocional: true,
  tarifaFbaPromocional: 6,
  peso: 200,
  pesoEmbalagem: 20,
  comprimento: 20,
  largura: 15,
  altura: 10,
  descontoLogistica: 0,
  custoProduto: 10,
  freteCompra: 0,
  embalagem: 0,
  preparacao: 0,
  outrosFixos: 0,
  custosFixosMensais: 0,
  imposto: 0,
  ads: 0,
  reservaDevolucao: 0,
  cupom: 0,
  parcelamento: false,
  plano: "profissional-gratis",
  unidadesMes: 30,
  mesesEstoque: 0,
  custoFbaExtra: 0,
  freteCobrado: 0,
  freteProprio: 0,
  tarifaOnsite: 0
};
const resultadoPromocaoFba = precificador.calcularCenario(promocaoFba, 30);
igual(resultadoPromocaoFba.logistica.liquida, 6);
igual(resultadoPromocaoFba.comissao, 0);
igual(precificador.buscarPreco(promocaoFba, 20), 20);
igual(precificador.calcularCenario({ ...promocaoFba, descontoLogistica: 50 }, 30).logistica.liquida, 6);
igual(precificador.calcularCenario({ ...promocaoFba, tarifaManual: 8 }, 30).logistica.liquida, 8);

// Peso dimensional deve prevalecer quando for maior.
const peso = precificador.obterPesoTarifavel({
  peso: 500,
  pesoEmbalagem: 20,
  comprimento: 60,
  largura: 40,
  altura: 30
});
igual(peso.real, 0.52);
igual(peso.dimensional, 12.02);

const base = {
  logistica: "dba",
  categoria: "casa",
  comissaoManual: "",
  comissaoZero: false,
  tarifaManual: "",
  peso: 200,
  pesoEmbalagem: 20,
  comprimento: 0,
  largura: 0,
  altura: 0,
  regiao: "interior-sul-sudeste",
  descontoLogistica: 0,
  custoProduto: 10,
  freteCompra: 0,
  embalagem: 0,
  preparacao: 0,
  outrosFixos: 0,
  custosFixosMensais: 0,
  imposto: 0,
  ads: 0,
  reservaDevolucao: 0,
  cupom: 0,
  parcelamento: false,
  plano: "profissional-gratis",
  unidadesMes: 30,
  mesesEstoque: 0,
  custoFbaExtra: 0,
  freteCobrado: 0,
  freteProprio: 0,
  tarifaOnsite: 0
};

const cenarios = [
  base,
  { ...base, custoProduto: 20, imposto: 7, ads: 5, reservaDevolucao: 2, cupom: 1, parcelamento: true },
  { ...base, custoProduto: 23, logistica: "fba", peso: 90 },
  { ...base, custoProduto: 20, freteCompra: 5, logistica: "propria", freteProprio: 12, freteCobrado: 8 }
];

// Caso real: garrafa a R$ 19, custo de R$ 6,99, DBA de R$ 4,50 e comissão promocional zerada.
const garrafa = {
  ...base,
  custoProduto: 6.99,
  comissaoZero: true,
  peso: 200,
  precoAtual: 19
};
const resultadoGarrafa = precificador.calcularCenario(garrafa, 19);
igual(resultadoGarrafa.logistica.liquida, 4.5);
igual(resultadoGarrafa.lucro, 7.51);
igual(resultadoGarrafa.margem, 7.51 / 19 * 100);

const garrafaSemPromocao = precificador.calcularCenario({ ...garrafa, comissaoZero: false }, 19);
igual(garrafaSemPromocao.comissao, 2.28);
igual(garrafaSemPromocao.lucro, 5.23);

// Contabilidade e outros custos mensais devem ser rateados pelo volume informado.
const garrafaComRateio = precificador.calcularCenario({
  ...garrafa,
  custosFixosMensais: 200,
  unidadesMes: 100
}, 19);
igual(garrafaComRateio.custosFixosRateados, 2);
igual(garrafaComRateio.lucro, 5.51);

// Cenário completo com imposto, embalagem, frete de compra e custos fixos.
const garrafaCompleta = precificador.calcularCenario({
  ...garrafa,
  imposto: 4,
  embalagem: 1,
  freteCompra: .5,
  custosFixosMensais: 200,
  unidadesMes: 100
}, 19);
igual(garrafaCompleta.lucro, 3.25);
igual(garrafaCompleta.margem, 3.25 / 19 * 100);

for (const cenario of cenarios) {
  for (const margemAlvo of [0, 10, 20, 35]) {
    const preco = precificador.buscarPreco(cenario, margemAlvo);
    assert(preco !== null, "O preço deveria existir");
    const resultado = precificador.calcularCenario(cenario, preco);
    assert(resultado.margem + 1e-7 >= margemAlvo, "O preço não atingiu a margem");
    if (preco > 0.01) {
      const centavoAnterior = Math.round((preco - 0.01) * 100) / 100;
      const anterior = precificador.calcularCenario(cenario, centavoAnterior);
      assert(!anterior.valido || anterior.margem < margemAlvo + 1e-6, "O preço encontrado não é o menor possível");
    }
  }
}

console.log("Todos os testes do precificador passaram.");
