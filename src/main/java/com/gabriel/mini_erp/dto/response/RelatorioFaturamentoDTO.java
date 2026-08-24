package com.gabriel.mini_erp.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class RelatorioFaturamentoDTO {

    private LocalDate periodoInicio;
    private LocalDate periodoFim;
    private BigDecimal totalFaturado;
    private Long quantidadePedidos;
    private BigDecimal ticketMedio;
    private List<FaturamentoDiarioDTO> faturamentoPorDia;
    private List<TopProdutoDTO> topProdutos;
    private List<TopClienteDTO> topClientes;

    public LocalDate getPeriodoInicio() {
        return periodoInicio;
    }

    public void setPeriodoInicio(LocalDate periodoInicio) {
        this.periodoInicio = periodoInicio;
    }

    public LocalDate getPeriodoFim() {
        return periodoFim;
    }

    public void setPeriodoFim(LocalDate periodoFim) {
        this.periodoFim = periodoFim;
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

    public BigDecimal getTicketMedio() {
        return ticketMedio;
    }

    public void setTicketMedio(BigDecimal ticketMedio) {
        this.ticketMedio = ticketMedio;
    }

    public List<FaturamentoDiarioDTO> getFaturamentoPorDia() {
        return faturamentoPorDia;
    }

    public void setFaturamentoPorDia(List<FaturamentoDiarioDTO> faturamentoPorDia) {
        this.faturamentoPorDia = faturamentoPorDia;
    }

    public List<TopProdutoDTO> getTopProdutos() {
        return topProdutos;
    }

    public void setTopProdutos(List<TopProdutoDTO> topProdutos) {
        this.topProdutos = topProdutos;
    }

    public List<TopClienteDTO> getTopClientes() {
        return topClientes;
    }

    public void setTopClientes(List<TopClienteDTO> topClientes) {
        this.topClientes = topClientes;
    }
}
