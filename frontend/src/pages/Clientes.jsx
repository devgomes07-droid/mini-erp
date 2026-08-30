import { useState, useEffect } from "react";
import { listarClientes, criarCliente } from "../services/api";
import Layout from "../components/Layout";
import "./Clientes.css";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    try {
      setCarregando(true);
      const data = await listarClientes();
      setClientes(data.content || data);
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
      await criarCliente({ nome, email, telefone, endereco });
      setNome("");
      setEmail("");
      setTelefone("");
      setEndereco("");
      setMostrarForm(false);
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Layout>
      <div className="clientes-header">
        <div>
          <h1 className="clientes-title">Clientes</h1>
          <p className="clientes-subtitle">
            {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"} cadastrados
          </p>
        </div>
        <button
          className="clientes-btn-novo"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? "Cancelar" : "+ Novo cliente"}
        </button>
      </div>

      {mostrarForm && (
        <form className="clientes-form" onSubmit={handleSubmit}>
          <div className="clientes-form-grid">
            <div className="clientes-field">
              <label>Nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="clientes-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="clientes-field">
              <label>Telefone</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>
            <div className="clientes-field">
              <label>Endereço</label>
              <input
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />
            </div>
          </div>

          {erro && <p className="clientes-erro">{erro}</p>}

          <button type="submit" className="clientes-btn-salvar" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar cliente"}
          </button>
        </form>
      )}

      {carregando && <p className="clientes-msg">Carregando clientes...</p>}
      {erro && !mostrarForm && <p className="clientes-msg erro">{erro}</p>}

      {!carregando && (
        <div className="clientes-grid">
          {clientes.map((c) => (
            <div key={c.id} className="cliente-card">
              <div className="cliente-avatar">
                {c.nome.charAt(0).toUpperCase()}
              </div>
              <div className="cliente-info">
                <h3>{c.nome}</h3>
                <p>{c.email}</p>
                <p className="cliente-tel">{c.telefone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Clientes;