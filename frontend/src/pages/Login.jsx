import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      const data = await login(email, senha);
      localStorage.setItem("token", data.token);
      navigate("/produtos");
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
          <div className="auth-ledger-eyebrow">Sistema em operação</div>
          <h1 className="auth-ledger-title">
            Estoque e vendas sob controle, em tempo real.
          </h1>
          <p className="auth-ledger-desc">
            Cada confirmação de pedido dá baixa automática no estoque,
            com proteção contra concorrência entre vendas simultâneas.
          </p>
        </div>

        <div className="auth-ledger-rows">
          <div className="auth-ledger-row">
            <span>Controle de estoque</span>
            <span className="tag">Em tempo real</span>
          </div>
          <div className="auth-ledger-row">
            <span>Confirmação de pedidos</span>
            <span className="tag">Automática</span>
          </div>
          <div className="auth-ledger-row">
            <span>Concorrência</span>
            <span className="tag warn">Protegida</span>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2 className="auth-title">Entrar</h2>
          <p className="auth-subtitle">Acesse sua conta do Mini ERP</p>

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
              Entrar
            </button>
          </form>

          <p className="auth-footer">
            Não tem conta?{" "}
            <a href="/cadastro" className="auth-link">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;