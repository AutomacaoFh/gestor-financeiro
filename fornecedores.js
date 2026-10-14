(() => {
  "use strict";

  if (typeof document === "undefined") return;

  const app = window.gestorApp;
  const $ = (id) => document.getElementById(id);
  const ui = {
    modulo: $("moduloFornecedores"),
    form: $("formFornecedor"),
    id: $("fornecedorId"),
    nome: $("fornecedorNome"),
    status: $("fornecedorStatus"),
    preferencial: $("fornecedorPreferencial"),
    contato: $("fornecedorContato"),
    whatsapp: $("fornecedorWhatsapp"),
    site: $("fornecedorSite"),
    cidade: $("fornecedorCidade"),
    estado: $("fornecedorEstado"),
    produtos: $("fornecedorProdutos"),
    pedidoMinimo: $("fornecedorPedidoMinimo"),
    prazo: $("fornecedorPrazo"),
    frete: $("fornecedorFrete"),
    pagamento: $("fornecedorPagamento"),
    ultimaCompra: $("fornecedorUltimaCompra"),
    avaliacao: $("fornecedorAvaliacao"),
    observacoes: $("fornecedorObservacoes"),
    tituloForm: $("tituloFormFornecedor"),
    salvar: $("botaoSalvarFornecedor"),
    cancelar: $("botaoCancelarFornecedor"),
    novoTopo: $("botaoNovoFornecedorTopo"),
    busca: $("buscaFornecedor"),
    filtroStatus: $("filtroStatusFornecedor"),
    lista: $("listaFornecedores"),
    vazio: $("estadoVazioFornecedores"),
    totalAtivos: $("totalFornecedoresAtivos"),
    totalPreferenciais: $("totalFornecedoresPreferenciais"),
    totalTeste: $("totalFornecedoresTeste")
  };

  if (!ui.form) return;

  let fornecedores = [];
  let usuarioCarregadoId = null;
  let tabelaAusenteAvisada = false;

  const avisar = (mensagem) => app?.mostrarToast ? app.mostrarToast(mensagem) : console.info(mensagem);
  const escapar = (texto) => String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const moeda = (valor) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(valor) || 0);

  function formatarData(dataIso) {
    if (!dataIso) return "Não informada";
    const [ano, mes, dia] = String(dataIso).slice(0, 10).split("-");
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : "Não informada";
  }

  function textoOuPadrao(valor, padrao = "Não informado") {
    return String(valor ?? "").trim() || padrao;
  }

  function urlSegura(valor) {
    const texto = String(valor ?? "").trim();
    if (!texto) return "";
    const candidata = /^https?:\/\//i.test(texto) ? texto : `https://${texto}`;
    try {
      const url = new URL(candidata);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch (_) {
      return "";
    }
  }

  function urlWhatsapp(valor) {
    let numero = String(valor ?? "").replace(/\D/g, "");
    if (!numero) return "";
    if (numero.length === 10 || numero.length === 11) numero = `55${numero}`;
    return numero.length >= 12 ? `https://wa.me/${numero}` : "";
  }

  function obterDadosFormulario() {
    return {
      nome: ui.nome.value.trim(),
      status: ui.status.value,
      preferencial: ui.preferencial.checked,
      contato: ui.contato.value.trim() || null,
      whatsapp: ui.whatsapp.value.trim() || null,
      site: ui.site.value.trim() || null,
      cidade: ui.cidade.value.trim() || null,
      estado: ui.estado.value || null,
      produtos: ui.produtos.value.trim() || null,
      pedido_minimo: Math.max(0, Number(ui.pedidoMinimo.value) || 0),
      prazo: ui.prazo.value.trim() || null,
      frete: ui.frete.value.trim() || null,
      pagamento: ui.pagamento.value.trim() || null,
      ultima_compra: ui.ultimaCompra.value || null,
      avaliacao: Math.min(5, Math.max(0, Number(ui.avaliacao.value) || 0)),
      observacoes: ui.observacoes.value.trim() || null
    };
  }

  function limparFormulario(focar = false) {
    ui.form.reset();
    ui.id.value = "";
    ui.estado.value = "SP";
    ui.pedidoMinimo.value = "0";
    ui.avaliacao.value = "0";
    ui.status.value = "ativo";
    ui.tituloForm.textContent = "Novo fornecedor";
    ui.salvar.textContent = "Salvar fornecedor";
    ui.cancelar.classList.remove("oculto");
    $("detalhesFornecedor").open = false;
    if (focar) {
      abrirFormulario();
      ui.form.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => ui.nome.focus(), 250);
    }
  }

  function abrirFormulario() {
    ui.form.classList.remove("oculto");
    $("gradeFornecedores").classList.add("editando");
    ui.novoTopo.setAttribute("aria-expanded", "true");
  }

  function fecharFormulario() {
    ui.form.classList.add("oculto");
    $("gradeFornecedores").classList.remove("editando");
    ui.novoTopo.setAttribute("aria-expanded", "false");
  }

  function atualizarResumo() {
    ui.totalAtivos.textContent = fornecedores.filter((item) => item.status === "ativo").length;
    ui.totalPreferenciais.textContent = fornecedores.filter((item) => item.preferencial).length;
    ui.totalTeste.textContent = fornecedores.filter((item) => item.status === "teste").length;
  }

  function nomeStatus(status) {
    return ({ ativo: "Ativo", teste: "Em avaliação", pausado: "Pausado" })[status] || "Ativo";
  }

  function detalheHtml(rotulo, valor) {
    return `<div class="fornecedor-detalhe"><span>${escapar(rotulo)}</span><strong>${escapar(valor)}</strong></div>`;
  }

  function renderizar() {
    atualizarResumo();
    const busca = ui.busca.value.trim().toLocaleLowerCase("pt-BR");
    const filtro = ui.filtroStatus.value;
    const filtrados = fornecedores.filter((item) => {
      const texto = [item.nome, item.contato, item.produtos, item.cidade, item.estado]
        .filter(Boolean).join(" ").toLocaleLowerCase("pt-BR");
      const correspondeBusca = !busca || texto.includes(busca);
      const correspondeStatus = filtro === "todos"
        || filtro === "preferenciais" && item.preferencial
        || item.status === filtro;
      return correspondeBusca && correspondeStatus;
    });

    ui.vazio.classList.toggle("oculto", filtrados.length > 0);
    ui.lista.innerHTML = filtrados.map((item) => {
      const site = urlSegura(item.site);
      const whatsapp = urlWhatsapp(item.whatsapp);
      const estrelas = item.avaliacao > 0
        ? `${"★".repeat(item.avaliacao)}${"☆".repeat(5 - item.avaliacao)}`
        : "Sem avaliação";
      const local = [item.cidade, item.estado].filter(Boolean).join(" / ") || "Não informado";
      const pedido = Number(item.pedido_minimo) > 0 ? moeda(item.pedido_minimo) : "Sem mínimo informado";
      const contato = [item.contato, item.whatsapp].filter(Boolean).join(" · ") || "Não informado";
      const acoesContato = [
        whatsapp ? `<a href="${escapar(whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp</a>` : "",
        site ? `<a href="${escapar(site)}" target="_blank" rel="noopener noreferrer">Abrir site</a>` : ""
      ].join("");

      const detalhes = [
        item.contato && detalheHtml("Contato", item.contato),
        item.whatsapp && detalheHtml("Telefone", item.whatsapp),
        Number(item.pedido_minimo) > 0 && detalheHtml("Pedido mínimo", pedido),
        item.ultima_compra && detalheHtml("Última compra", formatarData(item.ultima_compra)),
        item.prazo && detalheHtml("Entrega", item.prazo),
        item.pagamento && detalheHtml("Pagamento", item.pagamento),
        item.frete && detalheHtml("Frete", item.frete)
      ].filter(Boolean).join("");
      return `<article class="fornecedor-card ${item.preferencial ? "preferencial" : ""}">
        <div class="fornecedor-card-topo">
          <div class="fornecedor-card-identidade">
            ${item.preferencial ? '<span class="fornecedor-estrela" title="Preferencial" aria-label="Fornecedor preferencial">★</span>' : ""}
            <h4>${escapar(item.nome)}</h4>
            <span class="fornecedor-status ${escapar(item.status)}">${escapar(nomeStatus(item.status))}</span>
          </div>
          ${item.avaliacao > 0 ? `<span class="fornecedor-avaliacao" aria-label="Avaliação: ${escapar(estrelas)}">${escapar(estrelas)}</span>` : ""}
        </div>
        ${item.cidade || item.estado ? `<p class="fornecedor-local">${escapar(local)}</p>` : ""}
        ${item.produtos ? `<p class="fornecedor-produtos">${escapar(item.produtos)}</p>` : ""}
        ${detalhes || item.observacoes ? `<details class="fornecedor-mais"><summary>Ver condições e observações</summary><div class="fornecedor-card-detalhes">${detalhes}</div>${item.observacoes ? `<p class="fornecedor-observacoes">${escapar(item.observacoes)}</p>` : ""}</details>` : ""}
        <div class="fornecedor-card-acoes">
          ${acoesContato}
          <button type="button" data-acao-fornecedor="editar" data-id="${escapar(item.id)}">Editar</button>
          <button class="fornecedor-excluir" type="button" data-acao-fornecedor="excluir" data-id="${escapar(item.id)}">Excluir</button>
        </div>
      </article>`;
    }).join("");
  }

  async function carregarFornecedores(forcar = false) {
    const supabase = app?.obterSupabase?.();
    const usuario = app?.obterUsuario?.();
    if (!supabase || !usuario) return;
    if (!forcar && usuarioCarregadoId === usuario.id) return;

    const { data, error } = await supabase
      .from("fornecedores")
      .select("id,nome,status,preferencial,contato,whatsapp,site,cidade,estado,produtos,pedido_minimo,prazo,frete,pagamento,ultima_compra,avaliacao,observacoes,criado_em,atualizado_em")
      .eq("user_id", usuario.id)
      .order("preferencial", { ascending: false })
      .order("atualizado_em", { ascending: false });

    if (error) {
      console.error("Erro ao carregar fornecedores:", error);
      if (!tabelaAusenteAvisada) {
        tabelaAusenteAvisada = true;
        avisar("Execute criar_fornecedores.sql no Supabase para ativar os fornecedores.");
      }
      return;
    }

    fornecedores = data || [];
    usuarioCarregadoId = usuario.id;
    renderizar();
  }

  async function salvarFornecedor(evento) {
    evento.preventDefault();
    const supabase = app?.obterSupabase?.();
    const usuario = app?.obterUsuario?.();
    if (!supabase || !usuario) {
      avisar("Entre na sua conta antes de salvar.");
      return;
    }

    const dados = obterDadosFormulario();
    if (!dados.nome) {
      avisar("Informe o nome do fornecedor.");
      ui.nome.focus();
      return;
    }

    ui.salvar.disabled = true;
    ui.salvar.textContent = "Salvando...";
    let consulta;
    if (ui.id.value) {
      consulta = supabase.from("fornecedores")
        .update({ ...dados, atualizado_em: new Date().toISOString() })
        .eq("id", ui.id.value)
        .eq("user_id", usuario.id);
    } else {
      consulta = supabase.from("fornecedores")
        .insert({ ...dados, user_id: usuario.id });
    }
    let error;
    try { ({ error } = await consulta); }
    catch (erro) { error = erro; }
    finally { ui.salvar.disabled = false; }

    if (error) {
      console.error("Erro ao salvar fornecedor:", error);
      ui.salvar.textContent = ui.id.value ? "Salvar alterações" : "Salvar fornecedor";
      avisar("Não foi possível salvar. Os campos foram mantidos; confira a conexão e tente novamente.");
      return;
    }

    const estavaEditando = Boolean(ui.id.value);
    limparFormulario();
    fecharFormulario();
    usuarioCarregadoId = null;
    await carregarFornecedores(true);
    avisar(estavaEditando ? "Fornecedor atualizado." : "Fornecedor cadastrado.");
  }

  function editarFornecedor(id) {
    const item = fornecedores.find((fornecedor) => fornecedor.id === id);
    if (!item) return;
    abrirFormulario();
    ui.id.value = item.id;
    ui.nome.value = item.nome || "";
    ui.status.value = item.status || "ativo";
    ui.preferencial.checked = Boolean(item.preferencial);
    ui.contato.value = item.contato || "";
    ui.whatsapp.value = item.whatsapp || "";
    ui.site.value = item.site || "";
    ui.cidade.value = item.cidade || "";
    ui.estado.value = item.estado || "";
    ui.produtos.value = item.produtos || "";
    ui.pedidoMinimo.value = Number(item.pedido_minimo) || 0;
    ui.prazo.value = item.prazo || "";
    ui.frete.value = item.frete || "";
    ui.pagamento.value = item.pagamento || "";
    ui.ultimaCompra.value = item.ultima_compra || "";
    ui.avaliacao.value = Number(item.avaliacao) || 0;
    ui.observacoes.value = item.observacoes || "";
    ui.tituloForm.textContent = "Editar fornecedor";
    ui.salvar.textContent = "Salvar alterações";
    ui.cancelar.classList.remove("oculto");
    $("detalhesFornecedor").open = false;
    ui.form.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => ui.nome.focus(), 250);
  }

  async function excluirFornecedor(id) {
    const item = fornecedores.find((fornecedor) => fornecedor.id === id);
    if (!item || !confirm(`Excluir o fornecedor “${item.nome}”?`)) return;
    const supabase = app?.obterSupabase?.();
    const usuario = app?.obterUsuario?.();
    if (!supabase || !usuario) return;
    const { error } = await supabase.from("fornecedores")
      .delete().eq("id", id).eq("user_id", usuario.id);
    if (error) {
      console.error("Erro ao excluir fornecedor:", error);
      avisar("Não foi possível excluir o fornecedor.");
      return;
    }
    if (ui.id.value === id) limparFormulario();
    usuarioCarregadoId = null;
    await carregarFornecedores(true);
    avisar("Fornecedor excluído.");
  }

  const reportarErro = (erro) => { console.error("Erro na operação de fornecedores:", erro); avisar("Não foi possível concluir. Confira sua conexão; seus campos foram mantidos."); };
  ui.form.addEventListener("submit", (e) => salvarFornecedor(e).catch(reportarErro));
  ui.cancelar.addEventListener("click", () => { fecharFormulario(); ui.novoTopo.focus(); });
  ui.novoTopo.addEventListener("click", () => limparFormulario(true));
  ui.busca.addEventListener("input", renderizar);
  ui.filtroStatus.addEventListener("change", renderizar);
  ui.lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-acao-fornecedor]");
    if (!botao) return;
    if (botao.dataset.acaoFornecedor === "editar") editarFornecedor(botao.dataset.id);
    if (botao.dataset.acaoFornecedor === "excluir") excluirFornecedor(botao.dataset.id).catch(reportarErro);
  });
  document.addEventListener("moduloalterado", (evento) => {
    if (evento.detail?.modulo === "fornecedores") carregarFornecedores(true).catch(reportarErro);
  });

  limparFormulario();
  renderizar();
  ui.novoTopo.setAttribute("aria-controls", "formFornecedor");
  fecharFormulario();
  setTimeout(() => carregarFornecedores().catch(reportarErro), 1400);
})();

