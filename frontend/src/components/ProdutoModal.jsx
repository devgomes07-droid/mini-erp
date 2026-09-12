import { useState } from "react";
import "./ProdutoModal.css";

function ProdutoModal({ produto, quantidadeNoCarrinho = 0, onClose, onAdicionar }) {
  const [quantidade, setQuantidade] = useState(1);

  if (!produto) return null;

  const estoqueBaixo = produto.quantidadeEstoque <= produto.estoqueMinimo;
  const semEstoque = produto.quantidadeEstoque <= 0;
  const maxDisponivel = produto.quantidadeEstoque - quantidadeNoCarrinho;

  function aumentar() {
    if (quantidade < maxDisponivel) setQuantidade(quantidade + 1);
  }

  function diminuir() {
    if (quantidade > 1) setQuantidade(quantidade - 1);
  }

  function handleAdicionar() {
    onAdicionar(produto, quantidade);
    setQuantidade(1);
    onClose();
  }

  return (
    <div className="produto-modal-overlay" onClick={onClose}>
      <div className="produto-modal" onClick={(e) => e.stopPropagation()}>
        <button className="produto-modal-fechar" onClick={onClose}>×</button>

        <span className="produto-modal-categoria">{produto.categoria}</span>
        <h2 className="produto-modal-nome">{produto.nome}</h2>
        <p className="produto-modal-desc">{produto.descricao}</p>

        <div className="produto-modal-info">
          <span className="produto-modal-preco">
            R$ {Number(produto.preco).toFixed(2)}
          </span>
          {estoqueBaixo && !semEstoque && (
            <span className="produto-modal-alerta">Estoque baixo</span>
          )}
          {semEstoque && (
            <span className="produto-modal-alerta-critico">Sem estoque</span>
          )}
        </div>

        {quantidadeNoCarrinho > 0 && (
          <p className="produto-modal-ja-no-carrinho">
            Já no pedido: <strong>{quantidadeNoCarrinho}</strong>
          </p>
        )}

        {!semEstoque && maxDisponivel > 0 && (
          <>
            <div className="produto-modal-quantidade">
              <label>Quantidade</label>
              <div className="produto-modal-stepper">
                <button onClick={diminuir} disabled={quantidade <= 1}>−</button>
                <span>{quantidade}</span>
                <button onClick={aumentar} disabled={quantidade >= maxDisponivel}>+</button>
              </div>
            </div>

            <button className="produto-modal-btn-add" onClick={handleAdicionar}>
              Adicionar ao pedido — R$ {(produto.preco * quantidade).toFixed(2)}
            </button>
          </>
        )}

        {!semEstoque && maxDisponivel <= 0 && (
          <p className="produto-modal-limite">
            Você já adicionou todo o estoque disponível deste produto ao pedido.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProdutoModal;