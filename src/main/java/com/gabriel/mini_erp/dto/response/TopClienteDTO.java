package com.gabriel.mini_erp.dto.response;

import java.math.BigDecimal;

public class TopClienteDTO {

    private Long clienteId;
    private String clienteNome;
    private Long quantidadePedidos;
    private BigDecimal totalGasto;

    public TopClienteDTO() {
    }

    public TopClienteDTO(Long clienteId, String clienteNome, Long quantidadePedidos, BigDecimal totalGasto) {
        this.clienteId = clienteId;
        this.clienteNome = clienteNome;
        this.quantidadePedidos = quantidadePedidos;
        this.totalGasto = totalGasto;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public void setClienteNome(String clienteNome) {
        this.clienteNome = clienteNome;
    }

    public Long getQuantidadePedidos() {
        return quantidadePedidos;
    }

    public void setQuantidadePedidos(Long quantidadePedidos) {
        this.quantidadePedidos = quantidadePedidos;
    }

    public BigDecimal getTotalGasto() {
        return totalGasto;
    }

    public void setTotalGasto(BigDecimal totalGasto) {
        this.totalGasto = totalGasto;
    }
}