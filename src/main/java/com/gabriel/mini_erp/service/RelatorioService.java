package com.gabriel.mini_erp.service;

import com.gabriel.mini_erp.dto.response.FaturamentoDiarioDTO;
import com.gabriel.mini_erp.dto.response.RelatorioFaturamentoDTO;
import com.gabriel.mini_erp.dto.response.TopClienteDTO;
import com.gabriel.mini_erp.dto.response.TopProdutoDTO;
import com.gabriel.mini_erp.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RelatorioService {

    private final PedidoRepository pedidoRepository;

    public RelatorioService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public RelatorioFaturamentoDTO gerarRelatorioFaturamento(LocalDate periodoInicio, LocalDate periodoFim) {
        LocalDateTime inicio = periodoInicio.atStartOfDay();
        LocalDateTime fim = periodoFim.atTime(LocalTime.MAX);

        BigDecimal totalFaturado = pedidoRepository.calcularTotalFaturado(inicio, fim);
        Long quantidadePedidos = pedidoRepository.contarPedidosConfirmados(inicio, fim);

        BigDecimal ticketMedio = quantidadePedidos > 0
                ? totalFaturado.divide(BigDecimal.valueOf(quantidadePedidos), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        List<FaturamentoDiarioDTO> faturamentoPorDia = pedidoRepository.buscarFaturamentoPorDia(inicio, fim)
                .stream()
                .map(row -> new FaturamentoDiarioDTO(
                        ((Date) row[0]).toLocalDate(),
                        (BigDecimal) row[1],
                        (Long) row[2]
                ))
                .collect(Collectors.toList());

        List<TopProdutoDTO> topProdutos = pedidoRepository.buscarTopProdutos(inicio, fim)
                .stream()
                .map(row -> new TopProdutoDTO(
                        (Long) row[0],
                        (String) row[1],
                        (Long) row[2],
                        (BigDecimal) row[3]
                ))
                .collect(Collectors.toList());

        List<TopClienteDTO> topClientes = pedidoRepository.buscarTopClientes(inicio, fim)
                .stream()
                .map(row -> new TopClienteDTO(
                        (Long) row[0],
                        (String) row[1],
                        (Long) row[2],
                        (BigDecimal) row[3]
                ))
                .collect(Collectors.toList());

        RelatorioFaturamentoDTO relatorio = new RelatorioFaturamentoDTO();
        relatorio.setPeriodoInicio(periodoInicio);
        relatorio.setPeriodoFim(periodoFim);
        relatorio.setTotalFaturado(totalFaturado);
        relatorio.setQuantidadePedidos(quantidadePedidos);
        relatorio.setTicketMedio(ticketMedio);
        relatorio.setFaturamentoPorDia(faturamentoPorDia);
        relatorio.setTopProdutos(topProdutos);
        relatorio.setTopClientes(topClientes);

        return relatorio;
    }
}