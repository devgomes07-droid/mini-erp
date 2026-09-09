import { useState, useEffect } from "react";
import { listarProdutos } from "../services/api";
import Layout from "../components/Layout";
import "./Produtos.css";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

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

  const produtosFiltrados = produtos.filter((p) => {
    const termo = busca.toLowerCase();
    return (
      p.nome.toLowerCase().includes(termo) ||
      (p.categoria && p.categoria.toLowerCase().includes(termo))
    );
  });

  const estoqueBaixoCount = produtos.filter(
    (p) => p.quantidadeEstoque <= p.estoqueMinimo
  ).length;

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

      <div className="produtos-busca">
        <input
          type="text"
          placeholder="Buscar por nome ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando && <p className="produtos-msg">Carregando produtos...</p>}
      {erro && <p className="produtos-msg erro">{erro}</p>}

      {!carregando && produtosFiltrados.length === 0 && (
        <p className="produtos-msg">Nenhum produto encontrado.</p>
      )}

      {!carregando && !erro && (
        <div className="produtos-grid">
          {produtosFiltrados.map((p) => {
            const estoqueBaixo = p.quantidadeEstoque <= p.estoqueMinimo;
            return (
              <div key={p.id} className="produto-card">
                <div className="produto-card-top">
                  <span className="produto-categoria">{p.categoria}</span>
                  {estoqueBaixo && (
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
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}

export default Produtos;