import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Clock, Package, Filter } from "lucide-react";
import PageContainer from "../shared/PageContainer";
import SideBar from "../shared/SideBar";
import Card from "../shared/Card";
import Select from "../shared/Select";
import Button from "../shared/Button";
import Loading from "../shared/Loading";
import Alert from "../shared/Alert";
import DashboardService from "../../services/DashboardService";
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
  Cell,
} from 'recharts';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("ultimos-30-dias");
  const [status, setStatus] = useState("todos");
  const [alert, setAlert] = useState(null);
  
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    profitMargin: 0,
    averageOrderPrice: 0,
    ongoingOrders: 0,
    averageRepairTime: 0,
  });

  const [evolutionData, setEvolutionData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [ordersStatusData, setOrdersStatusData] = useState([]);
  const [topItemsData, setTopItemsData] = useState([]);
  const [topAppliancesData, setTopAppliancesData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [period, status]);

  useEffect(() => {
    console.log('Metrics updated:', metrics);
  }, [metrics]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setAlert(null);

      // Converter os valores dos filtros para o formato da API
      const apiPeriod = DashboardService.convertPeriodToAPI(period);
      const apiStatus = DashboardService.convertStatusToAPI(status);

      console.log('Loading dashboard data with:', { period: apiPeriod, status: apiStatus });

      // Buscar todas as métricas em paralelo com tratamento individual de erros
      const results = await Promise.allSettled([
        DashboardService.getMetrics(apiPeriod, apiStatus),
        DashboardService.getProfitMargin(apiPeriod, apiStatus),
        DashboardService.getAverageOrderPrice(apiPeriod, apiStatus),
        DashboardService.getOngoingOrders(apiPeriod, apiStatus),
        DashboardService.getAverageRepairTime(apiPeriod, apiStatus),
        DashboardService.getRevenueEvolution(apiPeriod, apiStatus),
        DashboardService.getCustomerType(apiPeriod, apiStatus),
        DashboardService.getOrdersByStatus(apiPeriod),
        DashboardService.getTopAppliances(apiPeriod, apiStatus),
        DashboardService.getTopComponents(apiPeriod, apiStatus),
      ]);

      // Extrair dados ou usar valores padrão
      const [
        metricsData,
        profitMarginData,
        averageOrderPriceData,
        ongoingOrdersData,
        averageRepairTimeData,
        revenueEvolutionData,
        customerTypeData,
        ordersByStatusData,
        topAppliancesData,
        topComponentsData,
      ] = results.map((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Dashboard API call ${index} failed:`, result.reason);
          return {};
        }
        return result.value || {};
      });

      console.log('Dashboard data loaded:', {
        metricsData,
        profitMarginData,
        averageOrderPriceData,
        ongoingOrdersData,
        averageRepairTimeData,
        revenueEvolutionData,
        customerTypeData,
        ordersByStatusData,
        topAppliancesData,
        topComponentsData,
      });

      // Atualizar métricas
      console.log('Setting metrics:', {
        totalRevenue: metricsData?.totalRevenue,
        profitMargin: profitMarginData?.totalRevenue,
        averageOrderPrice: averageOrderPriceData?.totalRevenue,
        ongoingOrders: ongoingOrdersData?.totalRevenue,
        averageRepairTime: averageRepairTimeData?.totalRevenue,
      });

      setMetrics({
        totalRevenue: metricsData?.totalRevenue ?? 0,
        profitMargin: profitMarginData?.totalRevenue ?? 0,
        averageOrderPrice: averageOrderPriceData?.totalRevenue ?? 0,
        ongoingOrders: ongoingOrdersData?.totalRevenue ?? 0,
        averageRepairTime: averageRepairTimeData?.totalRevenue ?? 0,
      });

      // Processar dados de evolução de receita
      if (revenueEvolutionData?.dataPoints && Array.isArray(revenueEvolutionData.dataPoints)) {
        console.log('Revenue Evolution Data Points:', revenueEvolutionData.dataPoints.length, revenueEvolutionData.dataPoints);
        const formattedEvolution = revenueEvolutionData.dataPoints.map((point) => ({
          mes: formatDateToMonth(point.date),
          data_completa: point.date,
          faturamento: point.revenue || 0,
          lucro: point.profit || 0,
          ordensServico: point.orderCount || 0,
        }));
        console.log('Formatted Evolution:', formattedEvolution);
        setEvolutionData(formattedEvolution);
      } else {
        console.log('No revenue evolution data');
        setEvolutionData([]);
      }

      // Processar dados de tipo de cliente
      if (customerTypeData?.dataPoints && Array.isArray(customerTypeData.dataPoints)) {
        console.log('Customer Type Data Points:', customerTypeData.dataPoints.length, customerTypeData.dataPoints);
        const formattedClients = customerTypeData.dataPoints.map((point) => ({
          mes: formatDateToMonth(point.date),
          data_completa: point.date,
          novos: point.newCustomers || 0,
          recorrentes: point.recurrentCustomers || 0,
        }));
        console.log('Formatted Clients:', formattedClients);
        setClientsData(formattedClients);
      } else {
        console.log('No customer type data');
        setClientsData([]);
      }

      // Processar dados de pedidos por status
      if (ordersByStatusData?.statusCounts && Array.isArray(ordersByStatusData.statusCounts)) {
        const formattedStatus = ordersByStatusData.statusCounts.map((statusItem) => ({
          status: translateStatus(statusItem.status),
          quantidade: statusItem.count || 0,
          cor: getStatusColor(statusItem.status),
        }));
        setOrdersStatusData(formattedStatus);
      } else {
        setOrdersStatusData([]);
      }

      // Processar top aparelhos
      if (topAppliancesData?.appliances && Array.isArray(topAppliancesData.appliances)) {
        const formattedAppliances = topAppliancesData.appliances.map((appliance) => ({
          nome: `${appliance.type || ''} ${appliance.brand || ''}`.trim(),
          quantidade: appliance.count || 0,
        }));
        setTopAppliancesData(formattedAppliances);
      } else {
        setTopAppliancesData([]);
      }

      // Processar top componentes
      if (topComponentsData?.components && Array.isArray(topComponentsData.components)) {
        const formattedComponents = topComponentsData.components.map((component) => ({
          item: `${component.name || ''} - ${component.brand || ''}`.trim(),
          quantidade: component.totalQuantityUsed || 0,
        }));
        setTopItemsData(formattedComponents);
      } else {
        setTopItemsData([]);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showAlert("error", "Erro ao carregar dados do dashboard. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateLabel = (dateString, periodType) => {
    try {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const monthName = months[date.getMonth()];
      
      // Para períodos curtos, mostrar dia/mês
      if (periodType === "ultimos-7-dias") {
        return `${day}/${month}`;
      }
      
      // Para períodos médios, mostrar dia + nome do mês abreviado
      if (periodType === "ultimos-30-dias" || periodType === "ultimos-90-dias") {
        return `${day} ${monthName}`;
      }
      
      // Para períodos longos, mostrar apenas mês/ano
      return `${monthName}/${date.getFullYear().toString().slice(-2)}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const formatDateToMonth = (dateString) => {
    return formatDateLabel(dateString, period);
  };

  const translateStatus = (status) => {
    const statusMap = {
      PENDING: "Pendente",
      IN_ANALYSIS: "Em Análise",
      COMPLETED: "Concluído",
      DELIVERED: "Entregue",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      PENDING: "#f59e0b",
      IN_ANALYSIS: "#3b82f6",
      COMPLETED: "#10b981",
      DELIVERED: "#059669",
    };
    return colorMap[status] || "#6b7280";
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleResetFilters = () => {
    setPeriod("ultimos-30-dias");
    setStatus("todos");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            {data.data_completa ? new Date(data.data_completa).toLocaleDateString('pt-BR') : label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.name !== 'Ordens de Serviço' 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
            <option value="entregues">Entregues</option>
          </Select>

          <Button variant="outline" onClick={handleResetFilters}>
            <Filter className="w-4 h-4 mr-2" />
            Redefinir Filtros
          </Button>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Faturamento Total
            </h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100" title={`Valor: ${metrics.totalRevenue}`}>
            {formatCurrency(metrics.totalRevenue)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Raw: {metrics.totalRevenue}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Margem de Lucro
            </h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100" title={`Valor: ${metrics.profitMargin}`}>
            {formatCurrency(metrics.profitMargin)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Raw: {metrics.profitMargin}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ticket Médio
            </h3>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100" title={`Valor: ${metrics.averageOrderPrice}`}>
            {formatCurrency(metrics.averageOrderPrice)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Raw: {metrics.averageOrderPrice}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ordens de Serviço em Andamento
            </h3>
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100" title={`Valor: ${metrics.ongoingOrders}`}>
            {Math.round(metrics.ongoingOrders)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Raw: {metrics.ongoingOrders}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tempo Médio de Reparo
            </h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100" title={`Valor: ${metrics.averageRepairTime} horas`}>
            {DashboardService.formatAverageRepairTime(metrics.averageRepairTime)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Raw: {metrics.averageRepairTime}h</p>
        </Card>
      </div>

      {/* Gráfico Principal - Evolução */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          📊 Evolução: Faturamento x Lucro x Ordens de Serviço
        </h3>
        {evolutionData.length > 0 ? (
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
              <XAxis 
                dataKey="mes" 
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
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
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            Nenhum dado disponível para o período selecionado
          </div>
        )}
      </Card>

      {/* Grid com 2 gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Clientes Recorrentes vs Novos */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📈 Clientes Recorrentes x Novos
          </h3>
          {clientsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={clientsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="mes" 
                  stroke="#6b7280"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
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
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </Card>

        {/* Ordens de Serviço por Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📋 Ordens de Serviço por Status
          </h3>
          {ordersStatusData.length > 0 ? (
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
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </Card>
      </div>

      {/* Grid com 2 gráficos de barras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eletrodomésticos Mais Consertados */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            🔧 Aparelhos Mais Reparados
          </h3>
          {topAppliancesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topAppliancesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="nome" stroke="#6b7280" angle={-20} textAnchor="end" height={80} />
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
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </Card>

        {/* Top 10 Peças/Acessórios */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            🔩 Top 10 Componentes Mais Utilizados
          </h3>
          {topItemsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItemsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="item" stroke="#6b7280" angle={-20} textAnchor="end" height={100} />
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
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </Card>
      </div>
      </PageContainer>
    </>
  );
};

export default AnalyticsDashboard;
