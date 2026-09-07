import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { buscarFaturamento } from "../services/api";
import Layout from "../components/Layout";
import "./Dashboard.css";

function formatarData(date) {
  return date.toISOString().split("T")[0];
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

      {carregando && <p className="dash-msg">Carregando...</p>}
      {erro && <p className="dash-msg erro">{erro}</p>}

      {!carregando && !erro && dados && (
        <>
          <div className="dash-cards">
            <div className="dash-card">
              <span className="dash-card-label">Faturamento total</span>
              <span className="dash-card-value verde">
                R$ {Number(dados.totalFaturado).toFixed(2)}
              </span>
            </div>
            <div className="dash-card">
              <span className="dash-card-label">Ticket médio</span>
              <span className="dash-card-value">
                R$ {Number(dados.ticketMedio || 0).toFixed(2)}
              </span>
            </div>
            <div className="dash-card">
              <span className="dash-card-label">Pedidos confirmados</span>
              <span className="dash-card-value">{dados.quantidadePedidos}</span>
            </div>
            <div className="dash-card">
              <span className="dash-card-label">Produto mais vendido</span>
              <span className="dash-card-value pequeno">
                {dados.topProdutos[0]?.produtoNome || "—"}
              </span>
            </div>
          </div>

          <div className="dash-chart-box">
            <h2 className="dash-section-title">Faturamento por dia</h2>
            {dados.faturamentoPorDia.length === 0 ? (
              <p className="dash-msg">Sem pedidos confirmados nesse período.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={dados.faturamentoPorDia.map((d) => ({
                    data: new Date(d.data + "T00:00:00").toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                    }),
                    total: d.totalFaturado,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2b303a" />
                  <XAxis dataKey="data" stroke="#8a93a3" fontSize={12} />
                  <YAxis stroke="#8a93a3" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "#1c2027",
                      border: "1px solid #2b303a",
                      borderRadius: 8,
                      color: "#e7e9ec",
                    }}
                    formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Faturamento"]}
                  />
                  <Bar dataKey="total" fill="#f5a524" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="dash-columns">
            <div className="dash-list-box">
              <h2 className="dash-section-title">Top clientes</h2>
              {dados.topClientes.length === 0 && (
                <p className="dash-msg">Nenhum dado no período.</p>
              )}
              {dados.topClientes.map((c, i) => (
                <div key={c.clienteId} className="dash-list-item">
                  <span className="dash-list-rank">{i + 1}</span>
                  <div className="dash-list-info">
                    <span className="dash-list-name">{c.clienteNome}</span>
                    <span className="dash-list-sub">{c.quantidadePedidos} pedidos</span>
                  </div>
                  <span className="dash-list-value">R$ {Number(c.totalGasto).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="dash-list-box">
              <h2 className="dash-section-title">Top produtos</h2>
              {dados.topProdutos.length === 0 && (
                <p className="dash-msg">Nenhum dado no período.</p>
              )}
              {dados.topProdutos.map((p, i) => (
                <div key={p.produtoId} className="dash-list-item">
                  <span className="dash-list-rank">{i + 1}</span>
                  <div className="dash-list-info">
                    <span className="dash-list-name">{p.produtoNome}</span>
                    <span className="dash-list-sub">{p.quantidadeVendida} unidades</span>
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