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
      <div className="auth-card">
        <h2 className="auth-title">Mini ERP</h2>
        <p className="auth-subtitle">Entre na sua conta</p>

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

          <button type="submit" className="auth-button auth-button-login">
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
  );
}

export default Login;