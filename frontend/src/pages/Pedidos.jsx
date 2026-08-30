import { useState, useEffect } from "react";
import {
  listarProdutos,
  listarClientes,
  listarPedidos,
  criarPedido,
  confirmarPedido,
} from "../services/api";
import Layout from "../components/Layout";
import "./Pedidos.css";

function Pedidos() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aba, setAba] = useState("pendentes");
  const [confirmandoId, setConfirmandoId] = useState(null);

  const [clienteId, setClienteId] = useState("");
  const [itens, setItens] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [criando, setCriando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);

  async function carregarTudo() {
    try {
      setCarregando(true);
      const [dataProdutos, dataClientes, dataPedidos] = await Promise.all([
        listarProdutos(),
        listarClientes(),
        listarPedidos(),
      ]);
      setProdutos(dataProdutos.content || dataProdutos);
      setClientes(dataClientes.content || dataClientes);
      setHistorico(dataPedidos.content || dataPedidos);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  function adicionarItem() {
    if (!produtoSelecionado || quantidade < 1) return;
    const produto = produtos.find((p) => p.id === Number(produtoSelecionado));
    if (!produto) return;

    setItens([
      ...itens,
      { produtoId: produto.id, nome: produto.nome, quantidade: Number(quantidade), preco: produto.preco },
    ]);
    setProdutoSelecionado("");
    setQuantidade(1);
  }

  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index));
  }

  async function handleCriarPedido() {
    if (!clienteId || itens.length === 0) return;
    setCriando(true);
    setErro("");

    try {
      await criarPedido({
        clienteId: Number(clienteId),
        itens: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
      });
      setItens([]);
      setClienteId("");
      setMostrarForm(false);
      await carregarTudo();
    } catch (err) {
      setErro(err.message);
    } finally {
      setCriando(false);
    }
  }

  async function handleConfirmar(id) {
    setConfirmandoId(id);
    setErro("");

    try {
      await confirmarPedido(id);
      await carregarTudo();
    } catch (err) {
      setErro(err.message);
    } finally {
      setConfirmandoId(null);
    }
  }

  const totalCarrinho = itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0);

  const pendentes = historico.filter((p) => p.status === "PENDENTE").slice().reverse();
  const confirmados = historico.filter((p) => p.status === "CONFIRMADO").slice().reverse();
  const listaExibida = aba === "pendentes" ? pendentes : confirmados;

  return (
    <Layout>
      <div className="pedidos-header">
        <div>
          <h1 className="pedidos-title">Pedidos</h1>
          <p className="pedidos-subtitle">Gerencie pedidos pendentes e confirmados</p>
        </div>
        <button className="pedidos-btn-novo-topo" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? "Cancelar" : "+ Novo pedido"}
        </button>
      </div>

      {erro && <p className="pedidos-erro">{erro}</p>}

      {mostrarForm && (
        <div className="pedidos-form">
          <div className="pedidos-field">
            <label>Cliente</label>
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
              <option value="">Selecione um cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="pedidos-add-item">
            <div className="pedidos-field">
              <label>Produto</label>
              <select
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
              >
                <option value="">Selecione um produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — R$ {Number(p.preco).toFixed(2)} ({p.quantidadeEstoque} un)
                  </option>
                ))}
              </select>
            </div>

            <div className="pedidos-field pedidos-qtd">
              <label>Qtd</label>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>

            <button className="pedidos-btn-add" onClick={adicionarItem}>
              Adicionar
            </button>
          </div>

          {itens.length > 0 && (
            <div className="pedidos-carrinho">
              {itens.map((item, i) => (
                <div key={i} className="pedidos-carrinho-item">
                  <span>{item.quantidade}x {item.nome}</span>
                  <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  <button onClick={() => removerItem(i)}>×</button>
                </div>
              ))}
              <div className="pedidos-carrinho-total">
                <span>Total</span>
                <span>R$ {totalCarrinho.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            className="pedidos-btn-criar"
            onClick={handleCriarPedido}
            disabled={!clienteId || itens.length === 0 || criando}
          >
            {criando ? "Criando..." : "Criar pedido"}
          </button>
        </div>
      )}

      <div className="pedidos-abas">
        <button
          className={`pedidos-aba ${aba === "pendentes" ? "active" : ""}`}
          onClick={() => setAba("pendentes")}
        >
          Pendentes <span className="pedidos-aba-count">{pendentes.length}</span>
        </button>
        <button
          className={`pedidos-aba ${aba === "confirmados" ? "active" : ""}`}
          onClick={() => setAba("confirmados")}
        >
          Confirmados <span className="pedidos-aba-count">{confirmados.length}</span>
        </button>
      </div>

      {carregando && <p className="pedidos-msg">Carregando...</p>}

      {!carregando && listaExibida.length === 0 && (
        <p className="pedidos-msg">Nenhum pedido {aba === "pendentes" ? "pendente" : "confirmado"}.</p>
      )}

      {!carregando && listaExibida.length > 0 && (
        <div className="pedidos-historico-lista">
          {listaExibida.map((p) => (
            <div key={p.id} className="pedidos-historico-item">
              <div className="pedidos-historico-info">
                <span className="pedidos-historico-cliente">
                  #{p.id} — {p.clienteNome}
                </span>
                <span className="pedidos-historico-data">
                  {new Date(p.dataPedido + "Z").toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <span className="pedidos-historico-valor">
                R$ {Number(p.valorTotal).toFixed(2)}
              </span>
              {p.status === "PENDENTE" ? (
                <button
                  className="pedidos-btn-confirmar-mini"
                  onClick={() => handleConfirmar(p.id)}
                  disabled={confirmandoId === p.id}
                >
                  {confirmandoId === p.id ? "..." : "Confirmar"}
                </button>
              ) : (
                <span className="pedidos-status confirmado">CONFIRMADO</span>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Pedidos;