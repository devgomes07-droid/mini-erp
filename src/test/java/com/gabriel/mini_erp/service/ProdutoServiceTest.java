package com.gabriel.mini_erp.service;

import com.gabriel.mini_erp.dto.request.ProdutoRequestDTO;
import com.gabriel.mini_erp.dto.response.ProdutoResponseDTO;
import com.gabriel.mini_erp.entity.Produto;
import com.gabriel.mini_erp.exception.RecursoNaoEncontrado;
import com.gabriel.mini_erp.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ProdutoService produtoService;

    private Produto produto;
    private ProdutoRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        produto = new Produto();
        produto.setId(1L);
        produto.setNome("Mouse Gamer");
        produto.setDescricao("RGB");
        produto.setPreco(BigDecimal.valueOf(149.90));
        produto.setQuantidadeEstoque(45);
        produto.setEstoqueMinimo(10);
        produto.setCategoria("Periféricos");

        requestDTO = new ProdutoRequestDTO();
        requestDTO.setNome("Mouse Gamer");
        requestDTO.setDescricao("RGB");
        requestDTO.setPreco(BigDecimal.valueOf(149.90));
        requestDTO.setQuantidadeEstoque(45);
        requestDTO.setEstoqueMinimo(10);
        requestDTO.setCategoria("Periféricos");
    }

    @Test
    void deveCriarProdutoComSucesso() {
        when(produtoRepository.save(any(Produto.class))).thenReturn(produto);

        ProdutoResponseDTO resultado = produtoService.criar(requestDTO);

        assertThat(resultado.getNome()).isEqualTo("Mouse Gamer");
        assertThat(resultado.getPreco()).isEqualByComparingTo(BigDecimal.valueOf(149.90));
        verify(produtoRepository, times(1)).save(any(Produto.class));
    }

    @Test
    void deveBuscarProdutoPorIdComSucesso() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        ProdutoResponseDTO resultado = produtoService.buscarPorId(1L);

        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNome()).isEqualTo("Mouse Gamer");
    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoEncontrado() {
        when(produtoRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> produtoService.buscarPorId(999L))
                .isInstanceOf(RecursoNaoEncontrado.class)
                .hasMessageContaining("Produto não encontrado com id: 999");
    }

    @Test
    void deveDeletarProdutoComSucesso() {
        when(produtoRepository.existsById(1L)).thenReturn(true);

        produtoService.deletar(1L);

        verify(produtoRepository, times(1)).deleteById(1L);
    }

    @Test
    void deveLancarExcecaoAoDeletarProdutoInexistente() {
        when(produtoRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> produtoService.deletar(999L))
                .isInstanceOf(RecursoNaoEncontrado.class);

        verify(produtoRepository, never()).deleteById(any());
    }
}