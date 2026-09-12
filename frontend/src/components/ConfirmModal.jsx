import "./ConfirmModal.css";

function ConfirmModal({ titulo, mensagem, onConfirmar, onCancelar, confirmando }) {
  return (
    <div className="confirm-overlay" onClick={onCancelar}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-titulo">{titulo}</h3>
        <p className="confirm-mensagem">{mensagem}</p>
        <div className="confirm-acoes">
          <button
            className="confirm-btn-cancelar"
            onClick={onCancelar}
            disabled={confirmando}
          >
            Cancelar
          </button>
          <button
            className="confirm-btn-confirmar"
            onClick={onConfirmar}
            disabled={confirmando}
          >
            {confirmando ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;