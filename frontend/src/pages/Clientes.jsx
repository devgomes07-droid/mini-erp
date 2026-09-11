import { useState, useEffect } from "react";
import {
  listarClientes,
  criarCliente,
  atualizarCliente,
  deletarCliente,
} from "../services/api";
import Layout from "../components/Layout";
import "./Clientes.css";

const CORES_AVATAR = ["#f5a524", "#4ade80", "#818cf8", "#f472b6", "#38bdf8", "#fb923c"];

function corPorNome(nome) {
  const index = nome.charCodeAt(0) % CORES_AVATAR.length;
  return CORES_AVATAR[index];
}

function formatarNome(nome) {
  return nome
    .toLowerCase()
    .split(" ")
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");
}

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busca, setBusca] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);

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

  function limparFormulario() {
    setNome("");
    setEmail("");
    setTelefone("");
    setEndereco("");
    setEditandoId(null);
    setMostrarForm(false);
  }

  function iniciarEdicao(cliente) {
    setNome(cliente.nome);
    setEmail(cliente.email);
    setTelefone(cliente.telefone);
    setEndereco(cliente.endereco || "");
    setEditandoId(cliente.id);
    setMostrarForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);
    setErro("");

    try {
      if (editandoId) {
        await atualizarCliente(editandoId, { nome, email, telefone, endereco });
      } else {
        await criarCliente({ nome, email, telefone, endereco });
      }
      limparFormulario();
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este cliente? Essa ação não pode ser desfeita."
    );
    if (!confirmar) return;

    setExcluindoId(id);
    setErro("");

    try {
      await deletarCliente(id);
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setExcluindoId(null);
    }
  }

  const clientesFiltrados = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.nome.toLowerCase().includes(termo) ||
      c.email.toLowerCase().includes(termo)
    );
  });

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
          onClick={() => {
            if (mostrarForm) {
              limparFormulario();
            } else {
              setMostrarForm(true);
            }
          }}
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
                placeholder="Nome completo"
                required
              />
            </div>
            <div className="clientes-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div className="clientes-field">
              <label>Telefone</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
            <div className="clientes-field">
              <label>Endereço</label>
              <input
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, número - Bairro, Cidade"
                required
              />
            </div>
          </div>

          {erro && <p className="clientes-erro">{erro}</p>}

          <button type="submit" className="clientes-btn-salvar" disabled={salvando}>
            {salvando
              ? "Salvando..."
              : editandoId
              ? "Salvar alterações"
              : "Salvar cliente"}
          </button>
        </form>
      )}

      {!mostrarForm && clientes.length > 0 && (
        <div className="clientes-filtros">
          <input
            type="text"
            className="clientes-busca-input"
            placeholder="Buscar por nome ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      )}

      {carregando && <p className="clientes-msg">Carregando clientes...</p>}
      {erro && !mostrarForm && <p className="clientes-msg erro">{erro}</p>}

      {!carregando && clientesFiltrados.length === 0 && (
        <p className="clientes-msg">Nenhum cliente encontrado.</p>
      )}

      {!carregando && clientesFiltrados.length > 0 && (
        <div className="clientes-grid">
          {clientesFiltrados.map((c) => (
            <div key={c.id} className="cliente-card">
              <div
                className="cliente-avatar"
                style={{ background: corPorNome(c.nome) }}
              >
                {c.nome.charAt(0).toUpperCase()}
              </div>
              <div className="cliente-info">
                <h3>{formatarNome(c.nome)}</h3>
                <div className="cliente-detalhe">
                  <span className="cliente-icone">✉</span>
                  <span>{c.email}</span>
                </div>
                <div className="cliente-detalhe">
                  <span className="cliente-icone">☎</span>
                  <span>{c.telefone}</span>
                </div>
                {c.endereco && (
                  <div className="cliente-detalhe">
                    <span className="cliente-icone">📍</span>
                    <span>{c.endereco}</span>
                  </div>
                )}
              </div>
              <div className="cliente-acoes">
                <button
                  className="cliente-btn-editar"
                  onClick={() => iniciarEdicao(c)}
                >
                  Editar
                </button>
                <button
                  className="cliente-btn-excluir"
                  onClick={() => handleExcluir(c.id)}
                  disabled={excluindoId === c.id}
                >
                  {excluindoId === c.id ? "..." : "Excluir"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Clientes;