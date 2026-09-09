import { useState, useEffect } from "react";
import { listarProdutos, criarProduto } from "../services/api";
import Layout from "../components/Layout";
import "./Produtos.css";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [categoria, setCategoria] = useState("");

  async function carregar() {
    try {
      setCarregando(true);
      const data = await listarProdutos();
      setProdutos(data.content || data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);
    setErro("");

    try {
      await criarProduto({
        nome,
        descricao,
        preco: Number(preco),
        quantidadeEstoque: Number(quantidadeEstoque),
        estoqueMinimo: Number(estoqueMinimo),
        categoria,
      });
      setNome("");
      setDescricao("");
      setPreco("");
      setQuantidadeEstoque("");
      setEstoqueMinimo("");
      setCategoria("");
      setMostrarForm(false);
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

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
        <button className="produtos-btn-novo" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? "Cancelar" : "+ Novo produto"}
        </button>
      </div>

      {mostrarForm && (
        <form className="produtos-form" onSubmit={handleSubmit}>
          <div className="produtos-form-grid">
            <div className="produtos-field">
              <label>Nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="produtos-field">
              <label>Categoria</label>
              <input value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
            </div>
            <div className="produtos-field">
              <label>Preço</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>
            <div className="produtos-field">
              <label>Estoque inicial</label>
              <input
                type="number"
                min="0"
                value={quantidadeEstoque}
                onChange={(e) => setQuantidadeEstoque(e.target.value)}
                required
              />
            </div>
            <div className="produtos-field">
              <label>Estoque mínimo</label>
              <input
                type="number"
                min="0"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                required
              />
            </div>
            <div className="produtos-field produtos-field-full">
              <label>Descrição</label>
              <input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>
          </div>

          {erro && <p className="produtos-erro">{erro}</p>}

          <button type="submit" className="produtos-btn-salvar" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar produto"}
          </button>
        </form>
      )}

      <div className="produtos-busca">
        <input
          type="text"
          placeholder="Buscar por nome ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando && <p className="produtos-msg">Carregando produtos...</p>}
      {erro && !mostrarForm && <p className="produtos-msg erro">{erro}</p>}

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