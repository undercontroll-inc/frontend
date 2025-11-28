import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Clock, Package, Filter } from "lucide-react";
import PageContainer from "../shared/PageContainer";
import SideBar from "../shared/SideBar";
import Card from "../shared/Card";
import Select from "../shared/Select";
import Button from "../shared/Button";
import Loading from "../shared/Loading";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("ultimos-7-dias");
  const [status, setStatus] = useState("todos");
  
  // Dados mockados para demonstração
  const [metrics, setMetrics] = useState({
    faturamentoTotal: 29000.00,
    margemLucro: 28,
    ticketMedio: 250.50,
    ordensAndamento: 7,
    ordensFinalizadas: 12,
    tempoMedioReparo: "4 dias a 7 horas"
  });

  // Dados do gráfico de evolução
  const evolutionData = [
    { mes: "Jun", faturamento: 25000, lucro: 6500, ordensServico: 45 },
    { mes: "Jul", faturamento: 28000, lucro: 7200, ordensServico: 52 },
    { mes: "Ago", faturamento: 22000, lucro: 5800, ordensServico: 38 },
    { mes: "Set", faturamento: 31000, lucro: 8500, ordensServico: 58 },
    { mes: "Out", faturamento: 35000, lucro: 9800, ordensServico: 62 },
    { mes: "Nov", faturamento: 29000, lucro: 8100, ordensServico: 54 },
  ];

  // Dados de clientes novos vs recorrentes
  const clientsData = [
    { mes: "Jun", novos: 12, recorrentes: 33 },
    { mes: "Jul", novos: 18, recorrentes: 34 },
    { mes: "Ago", novos: 8, recorrentes: 30 },
    { mes: "Set", novos: 22, recorrentes: 36 },
    { mes: "Out", novos: 15, recorrentes: 47 },
    { mes: "Nov", novos: 10, recorrentes: 44 },
  ];

  // Dados de ordens por status
  const ordersStatusData = [
    { status: "Em andamento", quantidade: 25, cor: "#3b82f6" },
    { status: "Aguardando peças", quantidade: 18, cor: "#8b5cf6" },
    { status: "Finalizadas", quantidade: 65, cor: "#10b981" },
    { status: "Canceladas", quantidade: 5, cor: "#ef4444" },
  ];

  // Top 10 peças/acessórios mais utilizados
  const topItemsData = [
    { item: "Processador", quantidade: 85 },
    { item: "Memória RAM", quantidade: 78 },
    { item: "HD/SSD", quantidade: 72 },
    { item: "Placa Mãe", quantidade: 65 },
    { item: "Fonte", quantidade: 58 },
    { item: "Tela", quantidade: 52 },
    { item: "Teclado", quantidade: 48 },
    { item: "Bateria", quantidade: 45 },
    { item: "Cooler", quantidade: 38 },
    { item: "Cabo", quantidade: 32 },
  ];

  // Eletrodomésticos mais consertados
  const topAppliancesData = [
    { nome: "Notebook", quantidade: 45 },
    { nome: "Desktop", quantidade: 38 },
    { nome: "Smartphone", quantidade: 32 },
    { nome: "Tablet", quantidade: 28 },
    { nome: "Monitor", quantidade: 25 },
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [period, status]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return <Loading text="Carregando dashboard..." />;
  }

  return (
    <>
      <SideBar active="analytics" />
      <PageContainer>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Dashboard
          </h1>
          
          {/* Filtros */}
        <div className="flex flex-wrap gap-4 mt-4">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-48"
          >
            <option value="ultimos-7-dias">Últimos 7 dias</option>
            <option value="ultimos-30-dias">Últimos 30 dias</option>
            <option value="ultimos-90-dias">Últimos 90 dias</option>
            <option value="este-ano">Este ano</option>
          </Select>

          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-48"
          >
            <option value="todos">Status: Todos</option>
            <option value="em-andamento">Em andamento</option>
            <option value="finalizadas">Finalizadas</option>
            <option value="canceladas">Canceladas</option>
          </Select>

          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Redefinir Filtros
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Faturamento Total
            </h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(metrics.faturamentoTotal)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Margem de Lucro
            </h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(metrics.faturamentoTotal * (metrics.margemLucro / 100))} ({metrics.margemLucro}%)
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ticket Médio
            </h3>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(metrics.ticketMedio)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ordens de Serviço em Andamento
            </h3>
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {metrics.ordensAndamento}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ordens de Serviço Finalizadas
            </h3>
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {metrics.ordensFinalizadas}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tempo Médio de Reparo
            </h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {metrics.tempoMedioReparo}
          </p>
        </Card>
      </div>

      {/* Gráfico Principal - Evolução */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          📊 Evolução: Faturamento x Lucro x Ordens de Serviço
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={evolutionData}>
            <defs>
              <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOrdens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="faturamento"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFaturamento)"
              name="Faturamento"
            />
            <Area
              type="monotone"
              dataKey="lucro"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLucro)"
              name="Lucro"
            />
            <Area
              type="monotone"
              dataKey="ordensServico"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOrdens)"
              name="Ordens de Serviço"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Grid com 2 gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Clientes Recorrentes vs Novos */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📈 Clientes Recorrentes x Novos
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={clientsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="recorrentes"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Recorrentes"
                dot={{ fill: "#3b82f6", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="novos"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Novos"
                dot={{ fill: "#8b5cf6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Ordens de Serviço por Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📋 Ordens de Serviço por Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ordersStatusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="status" type="category" stroke="#6b7280" width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="quantidade" radius={[0, 8, 8, 0]}>
                {ordersStatusData.map((entry, index) => (
                  <Bar key={`bar-${index}`} dataKey="quantidade" fill={entry.cor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Grid com 2 gráficos de barras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eletrodomésticos Mais Consertados */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            🔧 Eletrodomésticos Mais Consertados
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topAppliancesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="nome" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="quantidade" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top 10 Peças/Acessórios */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            🔩 Top 10 Peças/Acessórios Mais Utilizadas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topItemsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="item" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="quantidade" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      </PageContainer>
    </>
  );
};

export default AnalyticsDashboard;
