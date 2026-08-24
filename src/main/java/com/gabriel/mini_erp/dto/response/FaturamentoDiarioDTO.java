package com.gabriel.mini_erp.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FaturamentoDiarioDTO {

    private LocalDate data;
    private BigDecimal totalFaturado;
    private Long quantidadePedidos;

    public FaturamentoDiarioDTO() {
    }

    public FaturamentoDiarioDTO(LocalDate data, BigDecimal totalFaturado, Long quantidadePedidos) {
        this.data = data;
        this.totalFaturado = totalFaturado;
        this.quantidadePedidos = quantidadePedidos;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public BigDecimal getTotalFaturado() {
        return totalFaturado;
    }

    public void setTotalFaturado(BigDecimal totalFaturado) {
        this.totalFaturado = totalFaturado;
    }

    public Long getQuantidadePedidos() {
        return quantidadePedidos;
    }

    public void setQuantidadePedidos(Long quantidadePedidos) {
        this.quantidadePedidos = quantidadePedidos;
    }
}