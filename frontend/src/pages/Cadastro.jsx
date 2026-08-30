import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrar } from "../services/api";
import "./Auth.css";

function Cadastro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      await registrar(email, senha);
      setSucesso(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-ledger">
        <div className="auth-ledger-brand">
          <div className="auth-ledger-mark">M</div>
          <span className="auth-ledger-brandname">Mini ERP</span>
        </div>

        <div className="auth-ledger-main">
          <div className="auth-ledger-eyebrow">Nova conta</div>
          <h1 className="auth-ledger-title">
            Comece a organizar seu estoque hoje.
          </h1>
          <p className="auth-ledger-desc">
            Cadastro gratuito. Controle produtos, clientes e pedidos
            em um painel só.
          </p>
        </div>

        <div className="auth-ledger-rows">
          <div className="auth-ledger-row">
            <span>Produtos cadastrados</span>
            <span className="tag">1</span>
          </div>
          <div className="auth-ledger-row">
            <span>Clientes ativos</span>
            <span className="tag">1</span>
          </div>
          <div className="auth-ledger-row">
            <span>Ambiente</span>
            <span className="tag warn">Produção</span>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2 className="auth-title">Criar conta</h2>
          <p className="auth-subtitle">Comece a usar o Mini ERP</p>

          {sucesso ? (
            <p className="auth-sucesso">✓ Cadastro realizado! Redirecionando...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              {erro && <p className="auth-erro">⚠ {erro}</p>}

              <button type="submit" className="auth-button">
                Cadastrar
              </button>
            </form>
          )}

          <p className="auth-footer">
            Já tem conta?{" "}
            <a href="/" className="auth-link">
              Fazer login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;