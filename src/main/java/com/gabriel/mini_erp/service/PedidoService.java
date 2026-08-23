package com.gabriel.mini_erp.service;

import com.gabriel.mini_erp.dto.request.ItemPedidoRequestDTO;
import com.gabriel.mini_erp.dto.request.PedidoRequestDTO;
import com.gabriel.mini_erp.dto.response.ItemPedidoResponseDTO;
import com.gabriel.mini_erp.dto.response.PedidoResponseDTO;
import com.gabriel.mini_erp.entity.Cliente;
import com.gabriel.mini_erp.entity.ItemPedido;
import com.gabriel.mini_erp.entity.Pedido;
import com.gabriel.mini_erp.entity.Produto;
import com.gabriel.mini_erp.enums.StatusPedido;
import com.gabriel.mini_erp.exception.EstoqueInsuficienteException;
import com.gabriel.mini_erp.repository.ClienteRepository;
import com.gabriel.mini_erp.repository.PedidoRepository;
import com.gabriel.mini_erp.repository.ProdutoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         ClienteRepository clienteRepository,
                         ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public PedidoResponseDTO criar(PedidoRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new NoSuchElementException("Cliente não encontrado com id: " + dto.getClienteId()));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setStatus(StatusPedido.PENDENTE);

        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemPedidoRequestDTO itemDto : dto.getItens()) {
            Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new NoSuchElementException("Produto não encontrado com id: " + itemDto.getProdutoId()));

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(itemDto.getQuantidade());
            item.setPrecoUnitario(produto.getPreco());

            pedido.getItens().add(item);

            BigDecimal subtotal = produto.getPreco().multiply(BigDecimal.valueOf(itemDto.getQuantidade()));
            valorTotal = valorTotal.add(subtotal);
        }

        pedido.setValorTotal(valorTotal);

        Pedido salvo = pedidoRepository.save(pedido);
        return toResponseDTO(salvo);
    }

    public Page<PedidoResponseDTO> listar(Pageable pageable) {
        return pedidoRepository.findAll(pageable)
                .map(this::toResponseDTO);
    }

    public PedidoResponseDTO buscarPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com id: " + id));
        return toResponseDTO(pedido);
    }

    @Transactional
    public void cancelar(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com id: " + id));

        if (pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Apenas pedidos pendentes podem ser cancelados");
        }

        pedido.setStatus(StatusPedido.CANCELADO);
        pedidoRepository.save(pedido);
    }

    @Transactional
    public PedidoResponseDTO confirmar(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com id: " + id));

        if (pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Apenas pedidos pendentes podem ser confirmados");
        }

        for (ItemPedido item : pedido.getItens()) {
            Produto produto = produtoRepository.findById(item.getProduto().getId())
                    .orElseThrow(() -> new NoSuchElementException("Produto não encontrado"));

            if (produto.getQuantidadeEstoque() < item.getQuantidade()) {
                throw new EstoqueInsuficienteException(
                        "Estoque insuficiente para o produto: " + produto.getNome() +
                                ". Disponível: " + produto.getQuantidadeEstoque() +
                                ", solicitado: " + item.getQuantidade()
                );
            }

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - item.getQuantidade());
            produtoRepository.save(produto);
        }

        pedido.setStatus(StatusPedido.CONFIRMADO);
        Pedido confirmado = pedidoRepository.save(pedido);

        return toResponseDTO(confirmado);
    }

    private PedidoResponseDTO toResponseDTO(Pedido pedido) {
        PedidoResponseDTO dto = new PedidoResponseDTO();
        dto.setId(pedido.getId());
        dto.setClienteId(pedido.getCliente().getId());
        dto.setClienteNome(pedido.getCliente().getNome());
        dto.setDataPedido(pedido.getDataPedido());
        dto.setStatus(pedido.getStatus());
        dto.setValorTotal(pedido.getValorTotal());

        List<ItemPedidoResponseDTO> itensDto = pedido.getItens().stream()
                .map(this::toItemResponseDTO)
                .collect(Collectors.toList());
        dto.setItens(itensDto);

        return dto;
    }

    private ItemPedidoResponseDTO toItemResponseDTO(ItemPedido item) {
        ItemPedidoResponseDTO dto = new ItemPedidoResponseDTO();
        dto.setId(item.getId());
        dto.setProdutoId(item.getProduto().getId());
        dto.setProdutoNome(item.getProduto().getNome());
        dto.setQuantidade(item.getQuantidade());
        dto.setPrecoUnitario(item.getPrecoUnitario());
        dto.setSubtotal(item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())));
        return dto;
    }
}