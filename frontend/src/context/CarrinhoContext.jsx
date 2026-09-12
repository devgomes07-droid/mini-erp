import { createContext, useContext, useState } from "react";

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionarItem(produto, quantidade) {
    setItens((atual) => {
      const existente = atual.find((i) => i.produtoId === produto.id);
      if (existente) {
        return atual.map((i) =>
          i.produtoId === produto.id
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i
        );
      }
      return [
        ...atual,
        {
          produtoId: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade,
        },
      ];
    });
  }

  function removerItem(produtoId) {
    setItens((atual) => atual.filter((i) => i.produtoId !== produtoId));
  }

  function limparCarrinho() {
    setItens([]);
  }

  const totalItens = itens.reduce((sum, i) => sum + i.quantidade, 0);
  const totalValor = itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{ itens, adicionarItem, removerItem, limparCarrinho, totalItens, totalValor }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho precisa estar dentro de um CarrinhoProvider");
  }
  return context;
}