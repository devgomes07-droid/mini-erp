import { useState, useEffect } from "react";
import {
  listarProdutos,
  listarClientes,
  listarPedidos,
  criarPedido,
  confirmarPedido,
  cancelarPedido,
} from "../services/api";
import { useCarrinho } from "../context/CarrinhoContext";
import Layout from "../components/Layout";
import DetalhePedido from "../components/DetalhePedido";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import "./Pedidos.css";

function Pedidos() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aba, setAba] = useState("pendentes");
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [cancelandoId, setCancelandoId] = useState(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [toast, setToast] = useState(null);
  const [pedidoParaCancelar, setPedidoParaCancelar] = useState(null);

  const [clienteId, setClienteId] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [itens, setItens] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [criando, setCriando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);

  const { itens: itensCarrinho, removerItem: removerDoCarrinho, limparCarrinho } = useCarrinho();

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

  useEffect(() => {
    if (itensCarrinho.length > 0) {
      setItens(itensCarrinho);
      setMostrarForm(true);
    }
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
    const item = itens[index];
    setItens(itens.filter((_, i) => i !== index));
    removerDoCarrinho(item.produtoId);
  }

  async function handleCriarPedido() {
    if (!clienteId || itens.length === 0) return;
    setCriando(true);
    setErro("");

    try {
      await criarPedido({
        clienteId: Number(clienteId),
        itens: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
        enderecoEntrega: enderecoEntrega,
      });
      setItens([]);
      setClienteId("");
      setEnderecoEntrega("");
      setMostrarForm(false);
      limparCarrinho();
      setToast({ tipo: "sucesso", mensagem: "Pedido criado com sucesso." });
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
      setToast({ tipo: "sucesso", mensagem: "Pedido confirmado." });
      await carregarTudo();
    } catch (err) {
      setToast({ tipo: "erro", mensagem: err.message });
    } finally {
      setConfirmandoId(null);
    }
  }

  function pedirConfirmacaoCancelamento(id) {
    setPedidoParaCancelar(id);
  }

  async function confirmarCancelamento() {
    const id = pedidoParaCancelar;
    setCancelandoId(id);

    try {
      await cancelarPedido(id);
      setToast({ tipo: "sucesso", mensagem: "Pedido cancelado." });
      await carregarTudo();
    } catch (err) {
      setToast({ tipo: "erro", mensagem: err.message });
    } finally {
      setCancelandoId(null);
      setPedidoParaCancelar(null);
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
        <div className="pedidos-form pedidos-form-anim">
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

          <div className="pedidos-field">
            <label>Endereço de entrega</label>
            <input
              type="text"
              value={enderecoEntrega}
              onChange={(e) => setEnderecoEntrega(e.target.value)}
              placeholder="Rua, número - Bairro, Cidade"
            />
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
                <div key={i} className="pedidos-carrinho-item pedidos-carrinho-item-anim">
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

      {carregando && (
        <div className="pedidos-historico-lista">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="pedido-skeleton" />
          ))}
        </div>
      )}

      {!carregando && listaExibida.length === 0 && (
        <div className="pedidos-vazio">
          <span className="pedidos-vazio-icone">📦</span>
          <p className="pedidos-msg">
            Nenhum pedido {aba === "pendentes" ? "pendente" : "confirmado"}.
          </p>
        </div>
      )}

      {!carregando && listaExibida.length > 0 && (
        <div className="pedidos-historico-lista">
          {listaExibida.map((p, index) => (
            <div
              key={p.id}
              className="pedidos-historico-item"
              onClick={() => setPedidoSelecionado(p)}
              style={{ animationDelay: `${index * 40}ms` }}
            >
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
                {p.enderecoEntrega && (
                  <span className="pedidos-historico-endereco">📍 {p.enderecoEntrega}</span>
                )}
              </div>
              <span className="pedidos-historico-valor">
                R$ {Number(p.valorTotal).toFixed(2)}
              </span>

              <div className="pedidos-historico-acoes" onClick={(e) => e.stopPropagation()}>
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

                <button
                  className="pedidos-btn-cancelar-mini"
                  onClick={() => pedirConfirmacaoCancelamento(p.id)}
                  disabled={cancelandoId === p.id}
                >
                  {cancelandoId === p.id ? "..." : "Cancelar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DetalhePedido
        pedido={pedidoSelecionado}
        onClose={() => setPedidoSelecionado(null)}
      />

      {toast && (
        <Toast
          tipo={toast.tipo}
          mensagem={toast.mensagem}
          onFechar={() => setToast(null)}
        />
      )}

      {pedidoParaCancelar && (
        <ConfirmModal
          titulo="Cancelar pedido"
          mensagem="Tem certeza que deseja cancelar este pedido? Se já estiver confirmado, o estoque será devolvido."
          onConfirmar={confirmarCancelamento}
          onCancelar={() => setPedidoParaCancelar(null)}
          confirmando={cancelandoId === pedidoParaCancelar}
        />
      )}
    </Layout>
  );
}

export default Pedidos;