(() => {
  "use strict";

  const VERSAO_TARIFAS = "Amazon Brasil: comissões 20/01/2025; logística 01/08/2025; conferido 20/09/2026";
  const TAXA_PARCELAMENTO = 0.015;

  const CATEGORIAS = [
    { id: "acessorios-eletronicos", nome: "Acessórios para eletrônicos", taxa: .15, minimo: 2, faixa: [100, .15, .10] },
    { id: "alimentos-bebidas", nome: "Alimentos e bebidas", taxa: .10, minimo: 1 },
    { id: "bebes", nome: "Produtos para bebês", taxa: .12, minimo: 2 },
    { id: "automotivo", nome: "Peças e acessórios automotivos", taxa: .12, minimo: 2 },
    { id: "bebidas-alcoolicas", nome: "Bebidas alcoólicas", taxa: .11, minimo: 1 },
    { id: "beleza", nome: "Beleza", taxa: .13, minimo: 2 },
    { id: "brinquedos", nome: "Brinquedos e jogos", taxa: .12, minimo: 2 },
    { id: "calcados-bolsas", nome: "Calçados, bolsas e óculos", taxa: .14, minimo: 2 },
    { id: "casa", nome: "Casa", taxa: .12, minimo: 2 },
    { id: "celulares", nome: "Celulares", taxa: .11, minimo: 2 },
    { id: "pc", nome: "PC", taxa: .12, minimo: 2 },
    { id: "cozinha", nome: "Cozinha", taxa: .12, minimo: 2 },
    { id: "dispositivos-amazon", nome: "Dispositivos Amazon e acessórios", taxa: .14, minimo: 2 },
    { id: "linha-branca", nome: "Eletrodomésticos de linha branca", taxa: .11, minimo: 1 },
    { id: "eletroportateis-cuidados", nome: "Eletroportáteis de cuidado pessoal", taxa: .12, minimo: 2 },
    { id: "eletronicos-portateis", nome: "Eletrônicos portáteis", taxa: .13, minimo: 2 },
    { id: "tv-audio", nome: "TV, áudio e cinema em casa", taxa: .10, minimo: 2 },
    { id: "camera", nome: "Câmera e fotografia", taxa: .11, minimo: 2 },
    { id: "esportes", nome: "Esportes, aventura e lazer", taxa: .12, minimo: 2 },
    { id: "ferramentas", nome: "Ferramentas e construção", taxa: .11, minimo: 2 },
    { id: "industria", nome: "Indústria e ciência", taxa: .12, minimo: 1 },
    { id: "jardim", nome: "Jardim e piscina", taxa: .12, minimo: 2 },
    { id: "livros", nome: "Livros", taxa: .15, minimo: 2 },
    { id: "malas", nome: "Malas e acessórios de viagem", taxa: .14, minimo: 2 },
    { id: "moveis", nome: "Móveis", taxa: .15, minimo: 2, faixa: [200, .15, .10] },
    { id: "video-dvd", nome: "Vídeo e DVD", taxa: .15, minimo: 2 },
    { id: "musica", nome: "Música (CDs, LPs etc.)", taxa: .15, minimo: 2 },
    { id: "instrumentos", nome: "Instrumentos musicais e acessórios", taxa: .12, minimo: 2 },
    { id: "papelaria", nome: "Papelaria e escritório", taxa: .13, minimo: 2 },
    { id: "pneus", nome: "Pneus e rodas", taxa: .10, minimo: 1 },
    { id: "pet", nome: "Produtos para animais de estimação", taxa: .12, minimo: 2 },
    { id: "roupas", nome: "Roupas e acessórios", taxa: .14, minimo: 2 },
    { id: "beleza-luxo", nome: "Beleza de luxo", taxa: .14, minimo: 2 },
    { id: "relogios", nome: "Relógios", taxa: .13, minimo: 2 },
    { id: "joias", nome: "Joias", taxa: .14, minimo: 2 },
    { id: "saude", nome: "Saúde e cuidados pessoais", taxa: .12, minimo: 1 },
    { id: "video-games", nome: "Videogames e consoles", taxa: .11, minimo: 2 },
    { id: "outros", nome: "Outra categoria (confirme a taxa)", taxa: .15, minimo: 2 }
  ];

  const LIMITES_DBA = [.25, .5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const DBA_79_199 = {
    79: [11.95, 12.85, 13.45, 14, 14.95, 16.15, 17, 25, 26, 27, 28, 39.5],
    100: [13.95, 15, 15.7, 16.35, 17.45, 18.85, 19.9, 30, 31, 32, 33, 46],
    120: [15.95, 17.15, 17.95, 18.75, 19.95, 21.55, 22.75, 34, 35, 36, 37, 52.75],
    150: [17.95, 19.3, 20.2, 21.1, 22.4, 24.2, 25.6, 38, 39, 40, 41, 59]
  };
  const DBA_200 = {
    "sp-capital": [19.95, 20.45, 21.45, 22.95, 23.95, 25.95, 27.95, 36.95, 39.45, 40.45, 45.45, 59.95],
    "capitais-sul-sudeste": [19.95, 20.45, 21.45, 22.95, 23.95, 25.95, 27.95, 36.95, 34.45, 40.45, 46.95, 61.45],
    "interior-sul-sudeste": [20.45, 20.95, 21.95, 23.45, 24.45, 25.95, 27.95, 36.95, 39.45, 40.45, 46.95, 65.95],
    "demais-regioes": [20.45, 20.95, 21.95, 23.45, 24.45, 25.95, 27.95, 36.95, 39.45, 40.45, 46.95, 65.95]
  };
  const FBA_ATE_1 = {
    ".1": [10.05, 12.05, 14.05, 15.05, 15.55],
    ".2": [10.45, 12.45, 14.45, 15.45, 16.05],
    ".3": [10.95, 12.95, 14.95, 15.95, 16.55],
    ".4": [11.45, 13.45, 15.45, 16.95, 17.15],
    ".5": [11.95, 13.95, 15.95, 17.05, 17.85],
    ".75": [12.05, 14.05, 16.05, 18.45, 18.55],
    "1": [12.45, 14.45, 16.45, 19.05, 19.25]
  };
  const FBA_ACIMA_1 = [
    { ate: 1.5, v: [5.65, 5.85, 6.05, 12.95, 14.95, 16.95, 19.45, 20.35] },
    { ate: 2, v: [13.05, 15.05, 17.05, 19.95, 21.35] },
    { ate: 3, v: [14.05, 16.05, 18.05, 20.05, 22.35] },
    { ate: 4, v: [15.05, 17.05, 19.05, 21.95, 23.35] },
    { ate: 5, v: [16.05, 18.05, 20.05, 22.95, 24.35] },
    { ate: 6, v: [24.05, 27.05, 29.05, 30.05, 30.35] },
    { ate: 7, v: [25.05, 28.05, 30.05, 31.05, 33.35] },
    { ate: 8, v: [26.05, 29.05, 31.05, 32.05, 35.35] },
    { ate: 9, v: [27.05, 30.05, 32.05, 33.05, 37.35] },
    { ate: 10, v: [35.05, 40.05, 46.05, 51.05, 51.35] }
  ];

  const numero = (valor, padrao = 0) => Number.isFinite(Number(valor)) ? Number(valor) : padrao;
  const limitar = (valor, min, max) => Math.min(max, Math.max(min, numero(valor)));
  const categoriaPorId = (id) => CATEGORIAS.find((c) => c.id === id) || CATEGORIAS.at(-1);

  function calcularComissao(preco, categoriaOuId, comissaoZero = false, freteCobrado = 0, logistica = "dba", taxaManual = null) {
    if (comissaoZero || preco <= 0) return 0;
    const categoria = typeof categoriaOuId === "string" ? categoriaPorId(categoriaOuId) : categoriaOuId;
    const base = Math.max(0, preco + (logistica === "propria" ? numero(freteCobrado) : 0));
    const temTaxaManual = taxaManual !== "" && taxaManual !== null && taxaManual !== undefined;
    const valor = temTaxaManual
      ? base * limitar(taxaManual, 0, 100) / 100
      : categoria.faixa
      ? Math.min(base, categoria.faixa[0]) * categoria.faixa[1] + Math.max(0, base - categoria.faixa[0]) * categoria.faixa[2]
      : base * categoria.taxa;
    return Math.max(categoria.minimo, valor);
  }

  const indicePeso = (peso, limites) => {
    const i = limites.findIndex((limite) => peso <= limite + 1e-9);
    return i < 0 ? limites.length : i;
  };

  const faixaOito = (p) => p < 30 ? 0 : p < 50 ? 1 : p < 79 ? 2 : p < 100 ? 3 : p < 120 ? 4 : p < 150 ? 5 : p < 200 ? 6 : 7;
  const TARIFAS_FBA_PRECOS_BAIXOS = [5.65, 5.85, 6.05];

  function calcularTarifaDba(preco, pesoKg, regiao = "interior-sul-sudeste") {
    const p = Math.max(0, numero(preco));
    const peso = Math.max(0, numero(pesoKg));
    if (peso > 30) return null;
    if (p < 30) return 4.5;
    if (p < 50) return 6.5;
    if (p < 79) return 6.75;
    const i = indicePeso(peso, LIMITES_DBA);
    const tabela = p < 200
      ? (p < 100 ? DBA_79_199[79] : p < 120 ? DBA_79_199[100] : p < 150 ? DBA_79_199[120] : DBA_79_199[150])
      : (DBA_200[regiao] || DBA_200["interior-sul-sudeste"]);
    const adicional = p < 200 ? 3.05 : 4;
    return i < tabela.length ? tabela[i] : tabela.at(-1) + Math.ceil(peso - 10) * adicional;
  }

  function calcularTarifaFba(preco, pesoKg) {
    const p = Math.max(0, numero(preco));
    const peso = Math.max(0, numero(pesoKg));
    if (peso >= 22) return null;
    if (peso <= 1) {
      const limite = [.1, .2, .3, .4, .5, .75, 1].find((x) => peso <= x + 1e-9) || 1;
      const faixa = faixaOito(p);
      return faixa < 3 ? TARIFAS_FBA_PRECOS_BAIXOS[faixa] : FBA_ATE_1[String(limite).replace(/^0/, "")][faixa - 3];
    }
    const linha = FBA_ACIMA_1.find((x) => peso <= x.ate + 1e-9);
    if (linha) {
      const faixa = faixaOito(p);
      return linha.v.length === 8 ? linha.v[faixa] : (faixa < 3 ? TARIFAS_FBA_PRECOS_BAIXOS[faixa] : linha.v[faixa - 3]);
    }
    const adicional = p < 79 ? null : p < 150 ? 3.05 : 3.5;
    if (adicional === null) return null;
    return FBA_ACIMA_1.at(-1).v[faixaOito(p) - 3] + Math.ceil(peso - 10) * adicional;
  }

  function obterPesoTarifavel(d) {
    const embalagem = Math.max(0, numero(d.pesoEmbalagem)) / 1000;
    const real = Math.max(0, numero(d.peso)) / 1000 + embalagem;
    const dimensoes = numero(d.comprimento) > 0 && numero(d.largura) > 0 && numero(d.altura) > 0;
    const dimensional = dimensoes ? numero(d.comprimento) * numero(d.largura) * numero(d.altura) / 6000 + embalagem : 0;
    return { real, dimensional, tarifavel: Math.max(real, dimensional), tipo: dimensional > real ? "Peso dimensional" : "Peso real" };
  }

  function armazenagemFba(d) {
    const volume = Math.max(0, numero(d.comprimento) * numero(d.largura) * numero(d.altura));
    if (!volume || numero(d.mesesEstoque) <= 0) return 0;
    return volume / 1000000 * (volume < 10000 ? 75 : 37.5) * numero(d.mesesEstoque);
  }

  function tarifaPlano(d) {
    if (d.plano === "individual") return 2;
    if (d.plano === "profissional") return 19 / Math.max(1, numero(d.unidadesMes, 1));
    return 0;
  }

  function calcularLogistica(d, preco, modalidade = d.logistica, ignorarManual = false) {
    const temManual = d.tarifaManual !== "" && d.tarifaManual != null;
    let base;
    let origem = "Tabela automática";
    if (temManual && !ignorarManual && modalidade === d.logistica) {
      base = Math.max(0, numero(d.tarifaManual));
      origem = "Tarifa manual";
    } else if (modalidade === "dba") base = calcularTarifaDba(preco, obterPesoTarifavel(d).tarifavel, d.regiao);
    else if (modalidade === "fba") {
      const dimensoesInvalidas = numero(d.comprimento) > 105 || numero(d.largura) > 105 || numero(d.altura) > 105 || numero(d.comprimento) + numero(d.largura) + numero(d.altura) > 200;
      const pesoInvalido = obterPesoTarifavel(d).tarifavel >= 22;
      if (dimensoesInvalidas || pesoInvalido) {
        base = null;
      } else if (d.fbaPromocional) {
        base = Math.max(0, numero(d.tarifaFbaPromocional, 6));
        origem = "Tarifa promocional FBA";
      } else {
        base = calcularTarifaFba(preco, obterPesoTarifavel(d).tarifavel);
      }
    }
    else if (modalidade === "onsite") {
      base = numero(d.tarifaOnsite) > 0 ? numero(d.tarifaOnsite) : null;
      origem = "Tarifa informada";
    } else {
      base = Math.max(0, numero(d.freteProprio));
      origem = "Custo informado";
    }
    if (base === null) return { base: null, liquida: null, desconto: 0, origem };
    const tarifaFbaJaPromocional = modalidade === "fba" && d.fbaPromocional && origem === "Tarifa promocional FBA";
    const desconto = ["dba", "fba", "onsite"].includes(modalidade) && !tarifaFbaJaPromocional
      ? base * limitar(d.descontoLogistica, 0, 100) / 100
      : 0;
    return { base, liquida: Math.max(0, base - desconto), desconto, origem };
  }

  function calcularCenario(d, preco, modalidade = d.logistica, ignorarManual = false) {
    const valorProduto = Math.max(0, numero(preco));
    const freteRecebido = modalidade === "propria" ? Math.max(0, numero(d.freteCobrado)) : 0;
    const receita = valorProduto + freteRecebido;
    const logistica = calcularLogistica(d, valorProduto, modalidade, ignorarManual);
    if (logistica.liquida === null) return { valido: false, motivo: "Tarifa logística indisponível para esta combinação." };
    const custoProduto = Math.max(0, numero(d.custoProduto));
    const custosOperacionais = custoProduto + Math.max(0, numero(d.freteCompra)) + Math.max(0, numero(d.embalagem)) + Math.max(0, numero(d.preparacao)) + Math.max(0, numero(d.outrosFixos));
    const custosFixosRateados = Math.max(0, numero(d.custosFixosMensais)) / Math.max(1, numero(d.unidadesMes, 1));
    const custosFixos = custosOperacionais + custosFixosRateados;
    const comissao = calcularComissao(valorProduto, d.categoria, d.comissaoZero, freteRecebido, modalidade, d.comissaoManual);
    const imposto = receita * limitar(d.imposto, 0, 100) / 100;
    const ads = receita * limitar(d.ads, 0, 100) / 100;
    const devolucoes = receita * limitar(d.reservaDevolucao, 0, 100) / 100;
    const cupom = receita * limitar(d.cupom, 0, 100) / 100;
    const parcelamento = d.parcelamento && valorProduto >= 40 ? valorProduto * TAXA_PARCELAMENTO : 0;
    const plano = tarifaPlano(d);
    const armazenagem = modalidade === "fba" ? armazenagemFba(d) : 0;
    const fbaExtra = modalidade === "fba" ? Math.max(0, numero(d.custoFbaExtra)) : 0;
    const totalCustos = custosFixos + comissao + logistica.liquida + imposto + ads + devolucoes + cupom + parcelamento + plano + armazenagem + fbaExtra;
    const lucro = receita - totalCustos;
    return { valido: true, preco: valorProduto, receita, freteRecebido, custoProduto, custosOperacionais, custosFixosRateados, custosFixos, comissao, logistica, imposto, ads, devolucoes, cupom, parcelamento, plano, armazenagem, fbaExtra, totalCustos, lucro, margem: receita > 0 ? lucro / receita * 100 : 0 };
  }

  function buscarPreco(d, margemAlvo = 0, modalidade = d.logistica, ignorarManual = false) {
    const alvo = limitar(margemAlvo, 0, 95) / 100;
    const atende = (p) => {
      const c = calcularCenario(d, p, modalidade, ignorarManual);
      return c.valido && c.receita > 0 && c.lucro / c.receita >= alvo - 1e-10;
    };
    const categoria = categoriaPorId(d.categoria);
    const pontos = [0.01, 30, 40, 50, 79, 100, 120, 150, 200];
    if (categoria.faixa) pontos.push(categoria.faixa[0]);
    const inicios = [...new Set(pontos)].sort((a, b) => a - b);

    for (let faixa = 0; faixa < inicios.length; faixa += 1) {
      let baixo = inicios[faixa];
      const proximo = inicios[faixa + 1];
      let alto = proximo === undefined ? Math.max(400, baixo * 2) : proximo - .01;
      if (atende(baixo)) return Math.ceil(baixo * 100) / 100;
      if (proximo === undefined) {
        while (alto <= 1000000 && !atende(alto)) alto *= 2;
        if (alto > 1000000 || !atende(alto)) return null;
      } else if (!atende(alto)) continue;

      for (let i = 0; i < 80; i += 1) {
        const meio = (baixo + alto) / 2;
        if (atende(meio)) alto = meio;
        else baixo = meio;
      }
      const candidato = Math.ceil(alto * 100) / 100;
      if ((proximo === undefined || candidato < proximo) && atende(candidato)) return candidato;
    }
    return null;
  }

  const API = { CATEGORIAS, calcularComissao, calcularTarifaDba, calcularTarifaFba, obterPesoTarifavel, calcularCenario, buscarPreco };
  if (typeof window !== "undefined") window.PrecificadorAmazon = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (typeof document === "undefined") return;

  const app = window.gestorApp;
  const $ = (id) => document.getElementById(id);
  const campos = {
    id: $("precoId"), nome: $("precoNome"), sku: $("precoSku"), categoria: $("precoCategoria"),
    logistica: $("precoLogistica"), plano: $("precoPlano"), precoAtual: $("precoAtual"),
    custoProduto: $("precoCustoProduto"), freteCompra: $("precoFreteCompra"), embalagem: $("precoEmbalagem"),
    preparacao: $("precoPreparacao"), outrosFixos: $("precoOutrosFixos"), custosFixosMensais: $("precoCustosFixosMensais"), unidadesMes: $("precoUnidadesMes"),
    margemDesejada: $("precoMargemDesejada"), imposto: $("precoImposto"), comissaoManual: $("precoComissaoManual"), ads: $("precoAds"),
    reservaDevolucao: $("precoReservaDevolucao"), cupom: $("precoCupom"), descontoLogistica: $("precoDescontoLogistica"),
    parcelamento: $("precoParcelamento"), comissaoZero: $("precoComissaoZero"), peso: $("precoPeso"),
    comprimento: $("precoComprimento"), largura: $("precoLargura"), altura: $("precoAltura"),
    pesoEmbalagem: $("precoPesoEmbalagem"), regiao: $("precoRegiao"), mesesEstoque: $("precoMesesEstoque"),
    fbaPromocional: $("precoFbaPromocional"), tarifaFbaPromocional: $("precoTarifaFbaPromocional"),
    tarifaManual: $("precoTarifaManual"), tarifaOnsite: $("precoTarifaOnsite"), freteProprio: $("precoFreteProprio"),
    freteCobrado: $("precoFreteCobrado"), custoFbaExtra: $("precoCustoFbaExtra")
  };
  if (!campos.nome) return;

  const ui = {
    form: $("formPrecificador"), financeiro: $("moduloFinanceiro"), precificador: $("moduloPrecificador"),
    fornecedores: $("moduloFornecedores"),
    recomendado: $("resultadoPrecoRecomendado"), meta: $("resultadoMeta"), equilibrio: $("resultadoEquilibrio"),
    lucroRecomendado: $("resultadoLucroRecomendado"), comissaoRecomendada: $("resultadoComissaoRecomendada"),
    logisticaRecomendada: $("resultadoLogisticaRecomendada"),
    lucro: $("resultadoLucroAtual"), margem: $("resultadoMargemAtual"), peso: $("resultadoPesoTarifavel"),
    tipoPeso: $("resultadoTipoPeso"), alertas: $("resultadoAlertas"), composicao: $("resultadoComposicao"),
    comparacao: $("tabelaComparacaoLogistica"), salvar: $("botaoSalvarPrecificacao"), limpar: $("botaoLimparPrecificador"),
    copiar: $("botaoCopiarResumo"), filtro: $("filtroPrecificacoes"), tabela: $("tabelaPrecificacoes"),
    vazio: $("estadoVazioPrecificacoes"), avancado: $("botaoOpcoesAvancadas"),
    campoFbaPromocao: $("campoFbaPromocao"), rateioCustosFixos: $("precoRateioCustosFixos"),
    tituloPrincipal: $("resultadoTituloPrincipal"), rotuloLucro: $("resultadoRotuloLucro"),
    tituloComposicao: $("resultadoTituloComposicao"), modos: [...document.querySelectorAll("[data-preco-modo]")]
  };
  let ultimoResultado;
  let precificacoes = [];
  let tabelaAusenteAvisada = false;
  let modoCalculo = "precificar";

  const moeda = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numero(v));
  const percentual = (v) => `${numero(v).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`;
  const nomeLogistica = (t) => ({ dba: "DBA", fba: "FBA", onsite: "FBA Onsite", propria: "Logística própria" }[t] || t);
  const escapar = (t) => String(t ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const avisar = (m) => app?.mostrarToast ? app.mostrarToast(m) : console.info(m);

  function obterDados() {
    const d = {};
    Object.entries(campos).forEach(([chave, el]) => {
      if (["id", "nome", "sku", "categoria", "logistica", "plano", "regiao"].includes(chave)) d[chave] = el.value;
      else if (["parcelamento", "comissaoZero", "fbaPromocional"].includes(chave)) d[chave] = el.checked;
      else if (["tarifaManual", "comissaoManual"].includes(chave)) d[chave] = el.value.trim() === "" ? "" : numero(el.value);
      else d[chave] = numero(el.value);
    });
    return d;
  }

  function preencherDados(d) {
    if (!("fbaPromocional" in d)) campos.fbaPromocional.checked = false;
    if (!("custosFixosMensais" in d)) campos.custosFixosMensais.value = 0;
    Object.entries(campos).forEach(([chave, el]) => {
      if (!(chave in d)) return;
      if (["parcelamento", "comissaoZero", "fbaPromocional"].includes(chave)) el.checked = Boolean(d[chave]);
      else el.value = d[chave] ?? "";
    });
    const usaAvancado = [d.preparacao, d.outrosFixos, d.ads, d.reservaDevolucao, d.cupom, d.descontoLogistica, d.custoFbaExtra].some((valor) => numero(valor) > 0) || d.parcelamento || d.comissaoManual !== "" && d.comissaoManual != null || d.tarifaManual !== "" && d.tarifaManual != null;
    definirAvancado(usaAvancado);
    atualizarCamposLogistica();
    calcularEExibir();
  }

  function criarAlertas(d, atual, recomendado, peso) {
    const a = [];
    if (d.custoProduto <= 0) a.push(["aviso", "Informe o custo real do produto antes de decidir o preço."]);
    if (d.imposto <= 0) a.push(["aviso", "O imposto está em 0%. Confirme a alíquota efetiva com sua contabilidade."]);
    if (d.logistica === "onsite" && d.tarifaManual === "" && d.tarifaOnsite <= 0) a.push(["erro", "Informe a tarifa do FBA Onsite exibida na sua conta Amazon."]);
    if (d.comissaoZero) a.push(["aviso", "Comissão zero aplicada. Confirme se a promoção está ativa para este ASIN e período."]);
    if (d.logistica === "fba" && d.fbaPromocional) a.push(["aviso", `Tarifa promocional FBA de ${moeda(d.tarifaFbaPromocional)} aplicada. Desmarque a opção assim que a campanha terminar.`]);
    if (d.descontoLogistica > 0 && d.logistica === "fba" && d.fbaPromocional) a.push(["aviso", "O desconto percentual não foi acumulado com a tarifa fixa FBA, evitando contar a mesma promoção duas vezes."]);
    else if (d.descontoLogistica > 0) a.push(["aviso", `Desconto logístico de ${percentual(d.descontoLogistica)} aplicado. Confirme a elegibilidade na Seller Central.`]);
    if (peso.tarifavel > 30 && d.logistica === "dba") a.push(["erro", "O peso tarifável ultrapassa 30 kg; a tarifa DBA não foi calculada."]);
    if (peso.tarifavel >= 22 && d.logistica === "fba") a.push(["erro", "A tabela FBA consultada só se aplica a produtos com peso inferior a 22 kg."]);
    if (d.logistica === "fba" && (d.comprimento > 105 || d.largura > 105 || d.altura > 105 || d.comprimento + d.largura + d.altura > 200)) a.push(["erro", "As dimensões ultrapassam o limite FBA de 105 cm por lado e 200 cm na soma."]);
    if (!atual.valido) a.push(["erro", atual.motivo]);
    else if (d.precoAtual > 0 && atual.lucro < 0) a.push(["erro", `No preço atual, a perda estimada é de ${moeda(Math.abs(atual.lucro))} por unidade.`]);
    else if (d.precoAtual > 0 && atual.margem < d.margemDesejada) a.push(["aviso", `O preço atual não alcança a margem desejada de ${percentual(d.margemDesejada)}.`]);
    if (recomendado === null) a.push(["erro", "Não foi possível encontrar um preço com essa margem. Revise percentuais e tarifas."]);
    if (d.categoria === "outros") a.push(["aviso", "A categoria genérica usa 15%. Selecione a categoria exata antes de publicar o preço."]);
    return a;
  }

  function renderizarComposicao(c) {
    if (!c?.valido) {
      ui.composicao.innerHTML = '<div class="resultado-indisponivel">Cálculo indisponível.</div>';
      return;
    }
    const linhas = [
      ["Receita da venda", c.receita, "positivo", true],
      ["Produto, frete e preparação", c.custosOperacionais, "", true],
      ["Custos fixos rateados", c.custosFixosRateados],
      ["Comissão Amazon", c.comissao, "", true],
      [`Logística (${c.logistica.origem})`, c.logistica.liquida, "", true],
      ["Desconto logístico", -c.logistica.desconto, "positivo"],
      ["Impostos", c.imposto], ["Amazon Ads", c.ads], ["Devoluções e perdas", c.devolucoes],
      ["Cupons e promoções", c.cupom], ["Parcelamento", c.parcelamento], ["Plano rateado", c.plano],
      ["Armazenagem FBA", c.armazenagem], ["Outros custos FBA", c.fbaExtra],
      ["Lucro líquido estimado", c.lucro, c.lucro >= 0 ? "positivo" : "negativo", true]
    ].filter(([, valor, , sempre]) => sempre || Math.abs(valor) > .0001);
    ui.composicao.innerHTML = linhas.map(([nome, valor, classe = ""]) => `<div class="resultado-linha ${classe}"><dt>${escapar(nome)}</dt><dd>${moeda(valor)}</dd></div>`).join("");
  }

  function renderizarComparacao(d) {
    ui.comparacao.innerHTML = ["dba", "fba", "onsite", "propria"].map((tipo) => {
      const ignorar = tipo !== d.logistica;
      const recomendado = buscarPreco(d, d.margemDesejada, tipo, ignorar);
      const cenarioRecomendado = recomendado === null ? null : calcularCenario(d, recomendado, tipo, ignorar);
      const cenarioAtual = d.precoAtual > 0 ? calcularCenario(d, d.precoAtual, tipo, ignorar) : null;
      const cenario = modoCalculo === "analisar" ? cenarioAtual : cenarioRecomendado;
      const precoBase = modoCalculo === "analisar" ? d.precoAtual : recomendado;
      const taxa = calcularLogistica(d, precoBase || 0, tipo, ignorar);
      const indisponivel = !cenario?.valido || precoBase === null || precoBase <= 0;
      const selecionada = tipo === d.logistica;
      return `<article class="comparacao-card ${selecionada ? "selecionada" : ""}">
        <div class="comparacao-card-topo"><strong>${nomeLogistica(tipo)}</strong>${selecionada ? "<span>Selecionada</span>" : ""}</div>
        <dl>
          <div><dt>Tarifa logística</dt><dd>${taxa.liquida === null ? "Informe a tarifa" : moeda(taxa.liquida)}</dd></div>
          <div><dt>${modoCalculo === "analisar" ? "Preço analisado" : "Preço sugerido"}</dt><dd>${indisponivel ? "—" : moeda(precoBase)}</dd></div>
          <div><dt>Lucro por unidade</dt><dd class="${!indisponivel && cenario.lucro < 0 ? "negativo" : "positivo"}">${indisponivel ? "—" : moeda(cenario.lucro)}</dd></div>
          <div><dt>Margem líquida</dt><dd>${indisponivel ? "—" : percentual(cenario.margem)}</dd></div>
        </dl>
        ${selecionada ? "" : `<button type="button" data-logistica="${tipo}">Usar esta modalidade</button>`}
      </article>`;
    }).join("");
  }

  function calcularEExibir() {
    const d = obterDados();
    const peso = obterPesoTarifavel(d);
    const equilibrio = buscarPreco(d, 0);
    const recomendado = buscarPreco(d, d.margemDesejada);
    const atual = calcularCenario(d, d.precoAtual > 0 ? d.precoAtual : recomendado || 0);
    const cenarioRecomendado = recomendado === null ? null : calcularCenario(d, recomendado);
    const analisandoAtual = modoCalculo === "analisar";
    const cenarioPrincipal = analisandoAtual && d.precoAtual > 0 ? atual : cenarioRecomendado;
    ultimoResultado = { dados: d, peso, equilibrio, recomendado, atual, cenarioRecomendado, cenarioPrincipal };
    ui.tituloPrincipal.textContent = analisandoAtual ? "Preço analisado" : "Preço recomendado";
    ui.rotuloLucro.textContent = analisandoAtual ? "Lucro real estimado" : "Lucro por unidade";
    ui.tituloComposicao.textContent = analisandoAtual ? "Composição do preço atual" : "Composição do preço recomendado";
    ui.recomendado.textContent = analisandoAtual
      ? (d.precoAtual > 0 ? moeda(d.precoAtual) : "Informe o preço")
      : (recomendado === null ? "Indisponível" : moeda(recomendado));
    ui.meta.textContent = analisandoAtual
      ? (d.precoAtual <= 0 ? "Preencha o preço atual para conferir lucro e margem." : atual.valido ? `${atual.lucro >= 0 ? "Lucro" : "Prejuízo"} de ${moeda(Math.abs(atual.lucro))} por unidade · margem de ${percentual(atual.margem)}.` : "Revise os campos indicados nos alertas.")
      : (recomendado === null ? "Revise os campos indicados nos alertas." : `Para obter ${percentual(d.margemDesejada)} de margem líquida em ${nomeLogistica(d.logistica)}.`);
    ui.lucroRecomendado.textContent = cenarioPrincipal?.valido ? moeda(cenarioPrincipal.lucro) : "—";
    ui.comissaoRecomendada.textContent = cenarioPrincipal?.valido ? moeda(cenarioPrincipal.comissao) : "—";
    ui.logisticaRecomendada.textContent = cenarioPrincipal?.valido ? moeda(cenarioPrincipal.logistica.liquida) : "—";
    ui.equilibrio.textContent = equilibrio === null ? "—" : moeda(equilibrio);
    ui.lucro.textContent = d.precoAtual <= 0 ? "—" : atual.valido ? moeda(atual.lucro) : "—";
    ui.lucro.classList.toggle("negativo", Boolean(d.precoAtual > 0 && atual.valido && atual.lucro < 0));
    ui.margem.textContent = d.precoAtual <= 0 ? "Informe o preço atual" : atual.valido ? `Margem de ${percentual(atual.margem)}` : "Não calculada";
    ui.peso.textContent = peso.tarifavel < 1 ? `${Math.round(peso.tarifavel * 1000)} g` : `${peso.tarifavel.toLocaleString("pt-BR", { maximumFractionDigits: 3 })} kg`;
    ui.tipoPeso.textContent = peso.tipo;
    const rateio = Math.max(0, numero(d.custosFixosMensais)) / Math.max(1, numero(d.unidadesMes, 1));
    ui.rateioCustosFixos.textContent = rateio > 0 ? `${moeda(rateio)} incluídos em cada unidade.` : "Nenhum custo fixo rateado.";
    ui.rateioCustosFixos.classList.toggle("rateio-ativo", rateio > 0);
    ui.alertas.innerHTML = criarAlertas(d, atual, recomendado, peso).map(([tipo, texto]) => `<div class="resultado-alerta ${tipo}">${escapar(texto)}</div>`).join("");
    renderizarComposicao(cenarioPrincipal);
    renderizarComparacao(d);
    return ultimoResultado;
  }

  function atualizarCamposLogistica() {
    const tipo = campos.logistica.value;
    const contextuais = [campos.regiao, campos.tarifaOnsite, campos.freteProprio, campos.freteCobrado, campos.mesesEstoque, campos.custoFbaExtra];
    contextuais.forEach((el) => el.closest(".preco-campo").classList.add("campo-contextual-inativo"));
    ui.campoFbaPromocao.classList.toggle("oculto", tipo !== "fba");
    if (tipo === "dba") campos.regiao.closest(".preco-campo").classList.remove("campo-contextual-inativo");
    if (tipo === "onsite") campos.tarifaOnsite.closest(".preco-campo").classList.remove("campo-contextual-inativo");
    if (tipo === "propria") [campos.freteProprio, campos.freteCobrado].forEach((el) => el.closest(".preco-campo").classList.remove("campo-contextual-inativo"));
    if (tipo === "fba") [campos.mesesEstoque, campos.custoFbaExtra].forEach((el) => el.closest(".preco-campo").classList.remove("campo-contextual-inativo"));
    campos.tarifaFbaPromocional.disabled = !campos.fbaPromocional.checked;
  }

  function definirAvancado(aberto) {
    ui.form.classList.toggle("mostrar-avancado", aberto);
    ui.avancado.setAttribute("aria-expanded", String(aberto));
    ui.avancado.innerHTML = aberto
      ? '<span aria-hidden="true">−</span> Ocultar opções avançadas'
      : '<span aria-hidden="true">＋</span> Mostrar opções avançadas';
  }

  function limparFormulario() {
    ui.form.reset();
    campos.id.value = "";
    Object.assign(campos.precoAtual, { value: 0 });
    campos.custoProduto.value = 0;
    campos.peso.value = 200;
    campos.pesoEmbalagem.value = 20;
    campos.unidadesMes.value = 30;
    campos.custosFixosMensais.value = 0;
    campos.margemDesejada.value = 20;
    campos.mesesEstoque.value = 1;
    campos.tarifaFbaPromocional.value = 6;
    definirAvancado(false);
    atualizarCamposLogistica();
    calcularEExibir();
    campos.nome.focus();
  }

  async function carregarPrecificacoes() {
    const supabase = app?.obterSupabase?.();
    const usuario = app?.obterUsuario?.();
    if (!supabase || !usuario) return;
    const { data, error } = await supabase.from("precificacoes").select("id,nome,sku,dados,criado_em,atualizado_em").eq("user_id", usuario.id).order("atualizado_em", { ascending: false });
    if (error) {
      if (!tabelaAusenteAvisada) {
        tabelaAusenteAvisada = true;
        avisar("Execute criar_precificacoes.sql no Supabase para ativar os produtos salvos.");
      }
      return;
    }
    precificacoes = data || [];
    renderizarSalvos();
  }

  function renderizarSalvos() {
    const busca = ui.filtro.value.trim().toLowerCase();
    const lista = precificacoes.filter((item) => `${item.nome} ${item.sku || ""}`.toLowerCase().includes(busca));
    ui.vazio.classList.toggle("oculto", lista.length > 0);
    ui.tabela.innerHTML = lista.map((item) => {
      const d = item.dados || {};
      return `<tr><td><strong>${escapar(item.nome)}</strong><small>${escapar(item.sku || "Sem SKU")}</small></td><td>${escapar(nomeLogistica(d.logistica))}</td><td>${moeda(d.custoProduto)}</td><td>${moeda(d.precoRecomendado)}</td><td>${percentual(d.margemDesejada)}</td><td><div class="acoes-tabela"><button type="button" data-acao="abrir" data-id="${item.id}">Abrir</button><button type="button" data-acao="excluir" data-id="${item.id}">Excluir</button></div></td></tr>`;
    }).join("");
  }

  async function salvarPrecificacao() {
    const r = calcularEExibir();
    if (!r.dados.nome.trim()) {
      avisar("Informe o nome do produto para salvar.");
      campos.nome.focus();
      return;
    }
    if (r.recomendado === null) {
      avisar("Corrija os alertas antes de salvar.");
      return;
    }
    const supabase = app?.obterSupabase?.();
    const usuario = app?.obterUsuario?.();
    if (!supabase || !usuario) {
      avisar("Entre na conta para salvar o produto.");
      return;
    }
    const dados = { ...r.dados, precoRecomendado: r.recomendado, precoEquilibrio: r.equilibrio, versaoTarifas: VERSAO_TARIFAS };
    const registro = { user_id: usuario.id, nome: r.dados.nome.trim(), sku: r.dados.sku.trim() || null, dados, atualizado_em: new Date().toISOString() };
    const resposta = campos.id.value
      ? await supabase.from("precificacoes").update(registro).eq("id", campos.id.value).eq("user_id", usuario.id).select("id").single()
      : await supabase.from("precificacoes").insert(registro).select("id").single();
    if (resposta.error) {
      avisar("Não foi possível salvar. Execute a configuração do Supabase e tente de novo.");
      return;
    }
    campos.id.value = resposta.data.id;
    avisar("Precificação salva.");
    await carregarPrecificacoes();
  }

  async function excluirPrecificacao(id) {
    const item = precificacoes.find((p) => p.id === id);
    if (!item || !confirm(`Excluir a precificação de “${item.nome}”?`)) return;
    const supabase = app?.obterSupabase?.();
    const usuario = app?.obterUsuario?.();
    if (!supabase || !usuario) return;
    const { error } = await supabase.from("precificacoes").delete().eq("id", id).eq("user_id", usuario.id);
    if (error) avisar("Não foi possível excluir.");
    else {
      avisar("Precificação excluída.");
      await carregarPrecificacoes();
    }
  }

  function abrirPrecificacao(id) {
    const item = precificacoes.find((p) => p.id === id);
    if (!item) return;
    preencherDados({ ...item.dados, id: item.id, nome: item.nome, sku: item.sku || "" });
    ui.form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function copiarResumo() {
    const r = calcularEExibir();
    const analisandoAtual = modoCalculo === "analisar" && r.dados.precoAtual > 0;
    const c = analisandoAtual ? r.atual : r.cenarioRecomendado;
    if (!c?.valido || (!analisandoAtual && r.recomendado === null)) return;
    const texto = [
      `PRECIFICAÇÃO — ${r.dados.nome || "Produto"}`,
      `Modalidade: ${nomeLogistica(r.dados.logistica)}`,
      ...(analisandoAtual ? [`Preço analisado: ${moeda(r.dados.precoAtual)}`] : []),
      `Preço recomendado: ${moeda(r.recomendado)}`,
      `Preço de equilíbrio: ${moeda(r.equilibrio)}`,
      `Lucro estimado: ${moeda(c.lucro)} (${percentual(c.margem)})`,
      `Comissão: ${moeda(c.comissao)} | Logística: ${moeda(c.logistica.liquida)}`,
      `Base: ${VERSAO_TARIFAS}`
    ].join("\n");
    try {
      await navigator.clipboard.writeText(texto);
      avisar("Resumo copiado.");
    } catch (_) {
      avisar("Não foi possível copiar automaticamente.");
    }
  }

  CATEGORIAS.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria.id;
    option.textContent = `${categoria.nome} — ${Math.round(categoria.taxa * 100)}%`;
    campos.categoria.appendChild(option);
  });
  campos.categoria.value = "casa";

  document.querySelectorAll("[data-modulo]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const modulo = botao.dataset.modulo;
      ui.financeiro.classList.toggle("oculto", modulo !== "financeiro");
      ui.precificador.classList.toggle("oculto", modulo !== "precificador");
      ui.fornecedores?.classList.toggle("oculto", modulo !== "fornecedores");
      document.querySelectorAll("[data-modulo]").forEach((item) => item.classList.toggle("ativo", item === botao));
      if (modulo === "precificador") {
        calcularEExibir();
        carregarPrecificacoes();
      }
      document.dispatchEvent(new CustomEvent("moduloalterado", { detail: { modulo } }));
    });
  });

  ui.form.addEventListener("submit", (e) => { e.preventDefault(); calcularEExibir(); });
  ui.form.addEventListener("input", calcularEExibir);
  ui.form.addEventListener("change", (e) => {
    if (e.target === campos.logistica || e.target === campos.fbaPromocional) atualizarCamposLogistica();
    calcularEExibir();
  });
  ui.avancado.addEventListener("click", () => definirAvancado(!ui.form.classList.contains("mostrar-avancado")));
  ui.modos.forEach((botao) => botao.addEventListener("click", () => {
    modoCalculo = botao.dataset.precoModo === "analisar" ? "analisar" : "precificar";
    ui.modos.forEach((item) => {
      const ativo = item === botao;
      item.classList.toggle("ativo", ativo);
      item.setAttribute("aria-pressed", String(ativo));
    });
    ui.form.dataset.modo = modoCalculo;
    calcularEExibir();
    if (modoCalculo === "analisar" && campos.precoAtual.value <= 0) campos.precoAtual.focus();
  }));
  ui.salvar.addEventListener("click", salvarPrecificacao);
  ui.limpar.addEventListener("click", limparFormulario);
  ui.copiar.addEventListener("click", copiarResumo);
  ui.filtro.addEventListener("input", renderizarSalvos);
  ui.comparacao.addEventListener("click", (e) => {
    const botao = e.target.closest("button[data-logistica]");
    if (!botao) return;
    campos.logistica.value = botao.dataset.logistica;
    atualizarCamposLogistica();
    calcularEExibir();
  });
  ui.tabela.addEventListener("click", (e) => {
    const botao = e.target.closest("button[data-acao]");
    if (!botao) return;
    if (botao.dataset.acao === "abrir") abrirPrecificacao(botao.dataset.id);
    if (botao.dataset.acao === "excluir") excluirPrecificacao(botao.dataset.id);
  });

  definirAvancado(false);
  ui.form.dataset.modo = modoCalculo;
  atualizarCamposLogistica();
  calcularEExibir();
  setTimeout(carregarPrecificacoes, 1200);
})();
