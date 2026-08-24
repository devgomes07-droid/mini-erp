package com.gabriel.mini_erp.service;

import com.gabriel.mini_erp.entity.Cliente;
import com.gabriel.mini_erp.entity.ItemPedido;
import com.gabriel.mini_erp.entity.Pedido;
import com.gabriel.mini_erp.entity.Produto;
import com.gabriel.mini_erp.enums.StatusPedido;
import com.gabriel.mini_erp.exception.EstoqueInsuficienteException;
import com.gabriel.mini_erp.repository.ClienteRepository;
import com.gabriel.mini_erp.repository.PedidoRepository;
import com.gabriel.mini_erp.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private PedidoService pedidoService;

    private Produto produto;
    private Pedido pedido;
    private ItemPedido item;

    @BeforeEach
    void setUp() {
        produto = new Produto();
        produto.setId(1L);
        produto.setNome("Mouse Gamer");
        produto.setPreco(BigDecimal.valueOf(149.90));
        produto.setQuantidadeEstoque(10);

        item = new ItemPedido();
        item.setProduto(produto);
        item.setQuantidade(5);
        item.setPrecoUnitario(produto.getPreco());

        List<ItemPedido> itens = new ArrayList<>();
        itens.add(item);

        pedido = new Pedido();
        pedido.setId(1L);
        pedido.setStatus(StatusPedido.PENDENTE);
        pedido.setCliente(new Cliente());
        pedido.setItens(itens);
        pedido.setValorTotal(BigDecimal.valueOf(749.50));
    }

    @Test
    void deveConfirmarPedidoEBaixarEstoqueComSucesso() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedido);

        pedidoService.confirmar(1L);

        assertThat(produto.getQuantidadeEstoque()).isEqualTo(5);
        assertThat(pedido.getStatus()).isEqualTo(StatusPedido.CONFIRMADO);
        verify(produtoRepository, times(1)).save(produto);
    }

    @Test
    void deveLancarExcecaoQuandoEstoqueInsuficiente() {
        produto.setQuantidadeEstoque(2);

        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        assertThatThrownBy(() -> pedidoService.confirmar(1L))
                .isInstanceOf(EstoqueInsuficienteException.class)
                .hasMessageContaining("Estoque insuficiente");

        verify(produtoRepository, never()).save(any());
        assertThat(pedido.getStatus()).isEqualTo(StatusPedido.PENDENTE);
    }

    @Test
    void deveLancarExcecaoQuandoPedidoJaConfirmado() {
        pedido.setStatus(StatusPedido.CONFIRMADO);

        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        assertThatThrownBy(() -> pedidoService.confirmar(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Apenas pedidos pendentes podem ser confirmados");

        verify(produtoRepository, never()).findById(any());
    }
}
