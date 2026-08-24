package com.gabriel.mini_erp.repository;

import com.gabriel.mini_erp.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query("SELECT COALESCE(SUM(p.valorTotal), 0) FROM Pedido p " +
            "WHERE p.status = 'CONFIRMADO' AND p.dataPedido BETWEEN :inicio AND :fim")
    BigDecimal calcularTotalFaturado(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT COUNT(p) FROM Pedido p " +
            "WHERE p.status = 'CONFIRMADO' AND p.dataPedido BETWEEN :inicio AND :fim")
    Long contarPedidosConfirmados(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT FUNCTION('DATE', p.dataPedido), COALESCE(SUM(p.valorTotal), 0), COUNT(p) " +
            "FROM Pedido p " +
            "WHERE p.status = 'CONFIRMADO' AND p.dataPedido BETWEEN :inicio AND :fim " +
            "GROUP BY FUNCTION('DATE', p.dataPedido) " +
            "ORDER BY FUNCTION('DATE', p.dataPedido)")
    List<Object[]> buscarFaturamentoPorDia(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT ip.produto.id, ip.produto.nome, SUM(ip.quantidade), SUM(ip.precoUnitario * ip.quantidade) " +
            "FROM ItemPedido ip " +
            "WHERE ip.pedido.status = 'CONFIRMADO' AND ip.pedido.dataPedido BETWEEN :inicio AND :fim " +
            "GROUP BY ip.produto.id, ip.produto.nome " +
            "ORDER BY SUM(ip.quantidade) DESC")
    List<Object[]> buscarTopProdutos(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT p.cliente.id, p.cliente.nome, COUNT(p), SUM(p.valorTotal) " +
            "FROM Pedido p " +
            "WHERE p.status = 'CONFIRMADO' AND p.dataPedido BETWEEN :inicio AND :fim " +
            "GROUP BY p.cliente.id, p.cliente.nome " +
            "ORDER BY SUM(p.valorTotal) DESC")
    List<Object[]> buscarTopClientes(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
}