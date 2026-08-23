package com.gabriel.mini_erp.service;

import com.gabriel.mini_erp.dto.request.ProdutoRequestDTO;
import com.gabriel.mini_erp.dto.response.ProdutoResponseDTO;
import com.gabriel.mini_erp.entity.Produto;
import com.gabriel.mini_erp.exception.RecursoNaoEncontrado;
import com.gabriel.mini_erp.repository.ProdutoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public ProdutoResponseDTO criar(ProdutoRequestDTO dto) {
        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        produto.setEstoqueMinimo(dto.getEstoqueMinimo());
        produto.setCategoria(dto.getCategoria());

        Produto salvo = produtoRepository.save(produto);
        return toResponseDTO(salvo);
    }

    public Page<ProdutoResponseDTO> listar(Pageable pageable) {
        return produtoRepository.findAll(pageable)
                .map(this::toResponseDTO);
    }

    public ProdutoResponseDTO buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontrado("Produto não encontrado com id: " + id));
        return toResponseDTO(produto);
    }

    public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontrado("Produto não encontrado com id: " + id));

        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        produto.setEstoqueMinimo(dto.getEstoqueMinimo());
        produto.setCategoria(dto.getCategoria());

        Produto atualizado = produtoRepository.save(produto);
        return toResponseDTO(atualizado);
    }

    public void deletar(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RecursoNaoEncontrado("Produto não encontrado com id: " + id);
        }
        produtoRepository.deleteById(id);
    }

    private ProdutoResponseDTO toResponseDTO(Produto produto) {
        ProdutoResponseDTO dto = new ProdutoResponseDTO();
        dto.setId(produto.getId());
        dto.setNome(produto.getNome());
        dto.setDescricao(produto.getDescricao());
        dto.setPreco(produto.getPreco());
        dto.setQuantidadeEstoque(produto.getQuantidadeEstoque());
        dto.setEstoqueMinimo(produto.getEstoqueMinimo());
        dto.setCategoria(produto.getCategoria());
        return dto;
    }
}