import { useState, useEffect } from "react";
import { listarProdutos } from "../services/api";
import { useCarrinho } from "../context/CarrinhoContext";
import Layout from "../components/Layout";
import ProdutoModal from "../components/ProdutoModal";
import CarrinhoFlutuante from "../components/CarrinhoFlutuante";
import Toast from "../components/Toast";
import "./Produtos.css";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [toast, setToast] = useState(null);

  const { itens: itensCarrinho, adicionarItem } = useCarrinho();

  useEffect(() => {
    async function carregar() {
      try {
        const data = await listarProdutos();
        setProdutos(data.content || data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const categorias = [...new Set(produtos.map((p) => p.categoria))].sort();

  const produtosFiltrados = produtos.filter((p) => {
    const termo = busca.toLowerCase();
    const bateBusca =
      p.nome.toLowerCase().includes(termo) ||
      (p.categoria && p.categoria.toLowerCase().includes(termo));
    const bateCategoria = !categoriaFiltro || p.categoria === categoriaFiltro;
    return bateBusca && bateCategoria;
  });

  const estoqueBaixoCount = produtos.filter(
    (p) => p.quantidadeEstoque <= p.estoqueMinimo
  ).length;

  function quantidadeNoCarrinho(produtoId) {
    const item = itensCarrinho.find((i) => i.produtoId === produtoId);
    return item ? item.quantidade : 0;
  }

  function handleAbrirProduto(produto) {
    if (produto.quantidadeEstoque <= 0) return;
    setProdutoSelecionado(produto);
  }

  function handleAdicionarAoCarrinho(produto, quantidade) {
    adicionarItem(produto, quantidade);
    setToast({ tipo: "sucesso", mensagem: `${quantidade}x ${produto.nome} adicionado ao pedido.` });
  }

  return (
    <Layout>
      <div className="produtos-header">
        <div>
          <h1 className="produtos-title">Produtos</h1>
          <p className="produtos-subtitle">
            {produtos.length} {produtos.length === 1 ? "item" : "itens"} no catálogo
            {estoqueBaixoCount > 0 && (
              <span className="produtos-alerta-count">
                {" "}• {estoqueBaixoCount} com estoque baixo
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="produtos-filtros">
        <input
          type="text"
          className="produtos-busca-input"
          placeholder="Buscar por nome ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          className="produtos-categoria-select"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {erro && <p className="produtos-msg erro">{erro}</p>}

      {carregando && (
        <div className="produtos-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="produto-skeleton" />
          ))}
        </div>
      )}

      {!carregando && produtosFiltrados.length === 0 && (
        <p className="produtos-msg">Nenhum produto encontrado.</p>
      )}

      {!carregando && !erro && (
        <div className="produtos-grid">
          {produtosFiltrados.map((p, index) => {
            const estoqueBaixo = p.quantidadeEstoque <= p.estoqueMinimo;
            const semEstoque = p.quantidadeEstoque <= 0;
            const qtdNoCarrinho = quantidadeNoCarrinho(p.id);

            return (
              <div
                key={p.id}
                className={`produto-card ${semEstoque ? "produto-card-desabilitado" : ""}`}
                onClick={() => handleAbrirProduto(p)}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="produto-card-top">
                  <span className="produto-categoria">{p.categoria}</span>
                  {semEstoque && (
                    <span className="produto-alerta-critico">Sem estoque</span>
                  )}
                  {!semEstoque && estoqueBaixo && (
                    <span className="produto-alerta">Estoque baixo</span>
                  )}
                </div>

                <h3 className="produto-nome">{p.nome}</h3>
                <p className="produto-desc">{p.descricao}</p>

                <div className="produto-card-bottom">
                  <span className="produto-preco">
                    R$ {Number(p.preco).toFixed(2)}
                  </span>
                  <span className="produto-estoque">
                    {p.quantidadeEstoque} un
                  </span>
                </div>

                {qtdNoCarrinho > 0 && (
                  <div className="produto-card-badge-carrinho">
                    {qtdNoCarrinho} no pedido
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ProdutoModal
        produto={produtoSelecionado}
        quantidadeNoCarrinho={
          produtoSelecionado ? quantidadeNoCarrinho(produtoSelecionado.id) : 0
        }
        onClose={() => setProdutoSelecionado(null)}
        onAdicionar={handleAdicionarAoCarrinho}
      />

      <CarrinhoFlutuante />

      {toast && (
        <Toast
          tipo={toast.tipo}
          mensagem={toast.mensagem}
          onFechar={() => setToast(null)}
        />
      )}
    </Layout>
  );
}

export default Produtos;