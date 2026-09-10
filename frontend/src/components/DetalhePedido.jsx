import "./DetalhePedido.css";

function DetalhePedido({ pedido, onClose }) {
  if (!pedido) return null;

  return (
    <div className="detalhe-overlay" onClick={onClose}>
      <div className="detalhe-modal" onClick={(e) => e.stopPropagation()}>
        <div className="detalhe-header">
          <div>
            <h2>Pedido #{pedido.id}</h2>
            <span className={`detalhe-status ${pedido.status.toLowerCase()}`}>
              {pedido.status}
            </span>
          </div>
          <button className="detalhe-fechar" onClick={onClose}>×</button>
        </div>

        <div className="detalhe-info">
          <div className="detalhe-info-linha">
            <span className="detalhe-label">Cliente</span>
            <span>{pedido.clienteNome}</span>
          </div>
          <div className="detalhe-info-linha">
            <span className="detalhe-label">Data</span>
            <span>
              {new Date(pedido.dataPedido + "Z").toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {pedido.enderecoEntrega && (
            <div className="detalhe-info-linha">
              <span className="detalhe-label">Endereço</span>
              <span>{pedido.enderecoEntrega}</span>
            </div>
          )}
        </div>

        <h3 className="detalhe-itens-titulo">Itens do pedido</h3>
        <div className="detalhe-itens">
          {pedido.itens.map((item) => (
            <div key={item.id} className="detalhe-item">
              <div className="detalhe-item-info">
                <span className="detalhe-item-nome">{item.produtoNome}</span>
                <span className="detalhe-item-qtd">
                  {item.quantidade}x R$ {Number(item.precoUnitario).toFixed(2)}
                </span>
              </div>
              <span className="detalhe-item-subtotal">
                R$ {Number(item.subtotal).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="detalhe-total">
          <span>Total</span>
          <span>R$ {Number(pedido.valorTotal).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default DetalhePedido;