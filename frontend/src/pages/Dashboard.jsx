import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { buscarFaturamento } from "../services/api";
import Layout from "../components/Layout";
import "./Dashboard.css";

function formatarData(date) {
  return date.toISOString().split("T")[0];
}

const IconRevenue = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M9.5 9.5c0-1.4 1.1-2 2.5-2s2.5.7 2.5 2c0 2.5-5 1.5-5 4 0 1.3 1.1 2 2.5 2s2.5-.6 2.5-2" />
  </svg>
);

const IconTicket = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
  </svg>
);

const IconOrders = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
  </svg>
);

const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

function CardSkeleton() {
  return (
    <div className="dash-skeleton dash-skeleton-card" />
  );
}

function Dashboard() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [periodo, setPeriodo] = useState("30");

  async function carregar(dias) {
    try {
      setCarregando(true);
      setErro("");

      const hoje = new Date();
      let inicio;

      if (dias === "ano") {
        inicio = new Date(hoje.getFullYear(), 0, 1);
      } else {
        inicio = new Date();
        inicio.setDate(hoje.getDate() - Number(dias));
      }

      const data = await buscarFaturamento(formatarData(inicio), formatarData(hoje));
      setDados(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar(periodo);
  }, [periodo]);

  const opcoesPeriodo = [
    { label: "7 dias", value: "7" },
    { label: "30 dias", value: "30" },
    { label: "90 dias", value: "90" },
    { label: "Este ano", value: "ano" },
  ];

  const chartData = dados
    ? dados.faturamentoPorDia.map((d) => ({
        data: new Date(d.data + "T00:00:00").toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        total: d.totalFaturado,
      }))
    : [];

  const mediaDiaria =
    chartData.length > 0
      ? chartData.reduce((acc, d) => acc + d.total, 0) / chartData.length
      : 0;

  const maxTopClientes =
    dados && dados.topClientes.length > 0
      ? Math.max(...dados.topClientes.map((c) => c.totalGasto))
      : 0;

  const maxTopProdutos =
    dados && dados.topProdutos.length > 0
      ? Math.max(...dados.topProdutos.map((p) => p.receitaGerada))
      : 0;

  return (
    <Layout>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Visão geral do faturamento e desempenho</p>
        </div>

        <div className="dash-periodo">
          {opcoesPeriodo.map((op) => (
            <button
              key={op.value}
              className={`dash-periodo-btn ${periodo === op.value ? "active" : ""}`}
              onClick={() => setPeriodo(op.value)}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {carregando && (
        <>
          <div className="dash-cards">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="dash-skeleton dash-skeleton-chart" />
        </>
      )}

      {erro && (
        <div className="dash-erro-box">
          <p>Não foi possível carregar os dados.</p>
          <span>{erro}</span>
        </div>
      )}

      {!carregando && !erro && dados && (
        <>
          <div className="dash-cards">
            <div className="dash-card">
              <div className="dash-card-icon verde">
                <IconRevenue />
              </div>
              <span className="dash-card-label">Faturamento total</span>
              <span className="dash-card-value verde">
                R$ {Number(dados.totalFaturado).toFixed(2)}
              </span>
            </div>

            <div className="dash-card">
              <div className="dash-card-icon laranja">
                <IconTicket />
              </div>
              <span className="dash-card-label">Ticket médio</span>
              <span className="dash-card-value">
                R$ {Number(dados.ticketMedio || 0).toFixed(2)}
              </span>
            </div>

            <div className="dash-card">
              <div className="dash-card-icon azul">
                <IconOrders />
              </div>
              <span className="dash-card-label">Pedidos confirmados</span>
              <span className="dash-card-value">{dados.quantidadePedidos}</span>
            </div>

            <div className="dash-card">
              <div className="dash-card-icon roxo">
                <IconStar />
              </div>
              <span className="dash-card-label">Produto mais vendido</span>
              <span className="dash-card-value pequeno">
                {dados.topProdutos[0]?.produtoNome || "—"}
              </span>
            </div>
          </div>

          <div className="dash-chart-box">
            <div className="dash-chart-header">
              <h2 className="dash-section-title">Faturamento por dia</h2>
              {chartData.length > 0 && (
                <span className="dash-chart-media">
                  Média: R$ {mediaDiaria.toFixed(2)}/dia
                </span>
              )}
            </div>

            {chartData.length === 0 ? (
              <div className="dash-vazio">
                <p>Sem pedidos confirmados nesse período.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="barGradiente" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f5a524" stopOpacity={1} />
                      <stop offset="100%" stopColor="#f5a524" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2b303a" vertical={false} />
                  <XAxis dataKey="data" stroke="#8a93a3" fontSize={12} tickLine={false} axisLine={{ stroke: "#2b303a" }} />
                  <YAxis stroke="#8a93a3" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(245, 165, 36, 0.06)" }}
                    contentStyle={{
                      background: "#1c2027",
                      border: "1px solid #2b303a",
                      borderRadius: 8,
                      color: "#e7e9ec",
                    }}
                    labelStyle={{ color: "#8a93a3" }}
                    formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Faturamento"]}
                  />
                  {mediaDiaria > 0 && (
                    <ReferenceLine
                      y={mediaDiaria}
                      stroke="#5b6472"
                      strokeDasharray="4 4"
                      label={{ value: "média", position: "insideTopRight", fill: "#8a93a3", fontSize: 11 }}
                    />
                  )}
                  <Bar dataKey="total" fill="url(#barGradiente)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="dash-columns">
            <div className="dash-list-box">
              <h2 className="dash-section-title">Top clientes</h2>
              {dados.topClientes.length === 0 && (
                <div className="dash-vazio pequeno">
                  <p>Nenhum dado no período.</p>
                </div>
              )}
              {dados.topClientes.map((c, i) => (
                <div key={c.clienteId} className="dash-list-item">
                  <span className="dash-list-rank">{i + 1}</span>
                  <div className="dash-list-info">
                    <span className="dash-list-name">{c.clienteNome}</span>
                    <span className="dash-list-sub">{c.quantidadePedidos} pedidos</span>
                    <div className="dash-list-bar-track">
                      <div
                        className="dash-list-bar-fill"
                        style={{
                          width: `${maxTopClientes > 0 ? (c.totalGasto / maxTopClientes) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="dash-list-value">R$ {Number(c.totalGasto).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="dash-list-box">
              <h2 className="dash-section-title">Top produtos</h2>
              {dados.topProdutos.length === 0 && (
                <div className="dash-vazio pequeno">
                  <p>Nenhum dado no período.</p>
                </div>
              )}
              {dados.topProdutos.map((p, i) => (
                <div key={p.produtoId} className="dash-list-item">
                  <span className="dash-list-rank">{i + 1}</span>
                  <div className="dash-list-info">
                    <span className="dash-list-name">{p.produtoNome}</span>
                    <span className="dash-list-sub">{p.quantidadeVendida} unidades</span>
                    <div className="dash-list-bar-track">
                      <div
                        className="dash-list-bar-fill laranja"
                        style={{
                          width: `${maxTopProdutos > 0 ? (p.receitaGerada / maxTopProdutos) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="dash-list-value">R$ {Number(p.receitaGerada).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default Dashboard;