import "./Toast.css";

function Toast({ tipo, mensagem, onFechar }) {
  return (
    <div className={`toast ${tipo === "sucesso" ? "toast-sucesso" : "toast-erro"}`}>
      <span className="toast-icone">{tipo === "sucesso" ? "✓" : "⚠"}</span>
      <span className="toast-texto">{mensagem}</span>
      <button className="toast-fechar" onClick={onFechar}>×</button>
    </div>
  );
}

export default Toast;