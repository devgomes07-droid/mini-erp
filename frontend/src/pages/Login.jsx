import { useState } from "react";
import { login } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      const data = await login(email, senha);
      localStorage.setItem("token", data.token);
      alert("Login realizado com sucesso!");
      console.log("Token:", data.token);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>Mini ERP — Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;