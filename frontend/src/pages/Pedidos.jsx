import { useState, useEffect } from "react";
import {
  listarProdutos,
  listarClientes,
  criarPedido,
  confirmarPedido,
} from "../services/api";
import Layout from "../components/Layout";
import "./Pedidos.css";

function Pedidos() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [clienteId, setClienteId] = useState("");
  const [itens, setItens] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [pedidoAtual, setPedidoAtual] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [criando, setCriando] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const [dataProdutos, dataClientes] = await Promise.all([
          listarProdutos(),
          listarClientes(),
        ]);
        setProdutos(dataProdutos.content || dataProdutos);
        setClientes(dataClientes.content || dataClientes);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
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
      const pedido = await criarPedido({
        clienteId: Number(clienteId),
        itens: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
      });
      setPedidoAtual(pedido);
      setItens([]);
      setClienteId("");
    } catch (err) {
      setErro(err.message);
    } finally {
      setCriando(false);
    }
  }

  async function handleConfirmar() {
    if (!pedidoAtual) return;
    setConfirmando(true);
    setErro("");

    try {
      const atualizado = await confirmarPedido(pedidoAtual.id);
      setPedidoAtual(atualizado);
    } catch (err) {
      setErro(err.message);
    } finally {
      setConfirmando(false);
    }
  }

  const totalCarrinho = itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0);

  return (
    <Layout>
      <div className="pedidos-header">
        <h1 className="pedidos-title">Novo Pedido</h1>
        <p className="pedidos-subtitle">Monte o pedido e confirme para dar baixa no estoque</p>
      </div>

      {carregando && <p className="pedidos-msg">Carregando...</p>}
      {erro && <p className="pedidos-erro">{erro}</p>}

      {!carregando && !pedidoAtual && (
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

      {pedidoAtual && (
        <div className="pedidos-resultado">
          <div className="pedidos-resultado-header">
            <div>
              <h2>Pedido #{pedidoAtual.id}</h2>
              <p>{pedidoAtual.clienteNome}</p>
            </div>
            <span className={`pedidos-status ${pedidoAtual.status.toLowerCase()}`}>
              {pedidoAtual.status}
            </span>
          </div>

          <div className="pedidos-resultado-itens">
            {pedidoAtual.itens.map((item) => (
              <div key={item.id} className="pedidos-resultado-item">
                <span>{item.quantidade}x {item.produtoNome}</span>
                <span>R$ {Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pedidos-resultado-total">
            <span>Total</span>
            <span>R$ {Number(pedidoAtual.valorTotal).toFixed(2)}</span>
          </div>

          {pedidoAtual.status === "PENDENTE" && (
            <button
              className="pedidos-btn-confirmar"
              onClick={handleConfirmar}
              disabled={confirmando}
            >
              {confirmando ? "Confirmando..." : "Confirmar pedido"}
            </button>
          )}

          {pedidoAtual.status === "CONFIRMADO" && (
            <>
              <p className="pedidos-sucesso">✓ Estoque atualizado com sucesso</p>
              <button className="pedidos-btn-novo" onClick={() => setPedidoAtual(null)}>
                Criar outro pedido
              </button>
            </>
          )}
        </div>
      )}
    </Layout>
  );
}

export default Pedidos;