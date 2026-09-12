import { useNavigate } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext";
import "./CarrinhoFlutuante.css";

function CarrinhoFlutuante() {
  const { totalItens, totalValor } = useCarrinho();
  const navigate = useNavigate();

  if (totalItens === 0) return null;

  return (
    <button className="carrinho-flutuante" onClick={() => navigate("/pedidos")}>
      <span className="carrinho-flutuante-badge">{totalItens}</span>
      <span className="carrinho-flutuante-texto">Ver pedido</span>
      <span className="carrinho-flutuante-total">R$ {totalValor.toFixed(2)}</span>
    </button>
  );
}

export default CarrinhoFlutuante;
