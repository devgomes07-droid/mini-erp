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

function Dashboard() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const hoje = new Date();
        const inicio = new Date(hoje.getFullYear(), 0, 1).toISOString().split("T")[0];
        const fim = new Date(hoje.getFullYear(), 11, 31).toISOString().split("T")[0];

        const data = await buscarFaturamento(inicio, fim);
        setDados(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) {
    return (
      <Layout>
        <p className="dash-msg">Carregando dashboard...</p>
      </Layout>
    );
  }

  if (erro) {
    return (
      <Layout>
        <p className="dash-msg erro">{erro}</p>
      </Layout>
    );
  }

  const chartData = dados.faturamentoPorDia.map((d) => ({
    data: new Date(d.data + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    total: d.totalFaturado,
  }));

  return (
    <Layout>
      <div className="dash-header">
        <h1 className="dash-title">Dashboard</h1>
        <p className="dash-subtitle">
          Período: {new Date(dados.periodoInicio + "T00:00:00").toLocaleDateString("pt-BR")} até{" "}
          {new Date(dados.periodoFim + "T00:00:00").toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="dash-cards">
        <div className="dash-card">
          <span className="dash-card-label">Faturamento total</span>
          <span className="dash-card-value verde">
            R$ {Number(dados.totalFaturado).toFixed(2)}
          </span>
        </div>
        <div className="dash-card">
          <span className="dash-card-label">Ticket médio</span>
          <span className="dash-card-value">R$ {Number(dados.ticketMedio).toFixed(2)}</span>
        </div>
        <div className="dash-card">
          <span className="dash-card-label">Pedidos confirmados</span>
          <span className="dash-card-value">{dados.quantidadePedidos}</span>
        </div>
      </div>

      <div className="dash-chart-box">
        <h2 className="dash-section-title">Faturamento por dia</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
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
      </div>

      <div className="dash-columns">
        <div className="dash-list-box">
          <h2 className="dash-section-title">Top clientes</h2>
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
    </Layout>
  );
}

export default Dashboard;
