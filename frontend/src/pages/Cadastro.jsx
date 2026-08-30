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
      <div className="auth-card">
        <h2 className="auth-title">Mini ERP</h2>
        <p className="auth-subtitle">Crie sua conta</p>

        {sucesso ? (
          <p className="auth-sucesso">Cadastro realizado! Redirecionando...</p>
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

            {erro && <p className="auth-erro">{erro}</p>}

            <button type="submit" className="auth-button auth-button-cadastro">
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
  );
}

export default Cadastro;