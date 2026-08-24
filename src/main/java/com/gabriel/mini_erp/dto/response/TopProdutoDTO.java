package com.gabriel.mini_erp.dto.response;

import java.math.BigDecimal;

public class TopProdutoDTO {

    private Long produtoId;
    private String produtoNome;
    private Long quantidadeVendida;
    private BigDecimal receitaGerada;

    public TopProdutoDTO() {
    }

    public TopProdutoDTO(Long produtoId, String produtoNome, Long quantidadeVendida, BigDecimal receitaGerada) {
        this.produtoId = produtoId;
        this.produtoNome = produtoNome;
        this.quantidadeVendida = quantidadeVendida;
        this.receitaGerada = receitaGerada;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public String getProdutoNome() {
        return produtoNome;
    }

    public void setProdutoNome(String produtoNome) {
        this.produtoNome = produtoNome;
    }

    public Long getQuantidadeVendida() {
        return quantidadeVendida;
    }

    public void setQuantidadeVendida(Long quantidadeVendida) {
        this.quantidadeVendida = quantidadeVendida;
    }

    public BigDecimal getReceitaGerada() {
        return receitaGerada;
    }

    public void setReceitaGerada(BigDecimal receitaGerada) {
        this.receitaGerada = receitaGerada;
    }
}