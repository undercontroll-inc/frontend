import { apiClient } from "../providers/api";

/**
 * Enums para filtros do dashboard
 */
export const PeriodFilter = {
  SEVEN_DAYS: "SEVEN_DAYS",
  THIRTY_DAYS: "THIRTY_DAYS",
  NINETY_DAYS: "NINETY_DAYS",
  YEAR: "YEAR",
  ALL: "ALL",
};

export const StatusFilter = {
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  DELIVERED: "DELIVERED",
  ALL: "ALL",
};

/**
 * Serviço para gerenciar as chamadas da API de Dashboard
 */
class DashboardService {
  /**
   * ========================================
   * MÉTRICAS
   * ========================================
   */

  /**
   * Retorna a receita total do período selecionado
   */
  async getMetrics(period = PeriodFilter.ALL, status = StatusFilter.ALL) {
    try {
      const response = await apiClient.get("/dashboard/metrics", {
        params: { period, status },
      });
      return response.data || { totalRevenue: 0 };
    } catch (error) {
      console.error("Error fetching metrics:", error);
      return { totalRevenue: 0 };
    }
  }

  /**
   * Retorna a margem de lucro do período selecionado
   */
  async getProfitMargin(period = PeriodFilter.ALL, status = StatusFilter.ALL) {
    try {
      const response = await apiClient.get("/dashboard/profit-margin", {
        params: { period, status },
      });
      return response.data || { totalRevenue: 0 };
    } catch (error) {
      console.error("Error fetching profit margin:", error);
      return { totalRevenue: 0 };
    }
  }

  /**
   * Retorna o valor médio dos pedidos
   */
  async getAverageOrderPrice(period = PeriodFilter.ALL, status = StatusFilter.ALL) {
    try {
      const response = await apiClient.get("/dashboard/average-order-price", {
        params: { period, status },
      });
      return response.data || { totalRevenue: 0 };
    } catch (error) {
      console.error("Error fetching average order price:", error);
      return { totalRevenue: 0 };
    }
  }

  /**
   * Retorna a quantidade de pedidos em andamento
   */
  async getOngoingOrders(period = PeriodFilter.ALL, status = StatusFilter.ALL) {
    try {
      const response = await apiClient.get("/dashboard/ongoing-orders", {
        params: { period, status },
      });
      return response.data || { totalRevenue: 0 };
    } catch (error) {
      console.error("Error fetching ongoing orders:", error);
      return { totalRevenue: 0 };
    }
  }

  /**
   * Retorna o tempo médio de reparo em dias
   */
  async getAverageRepairTime(period = PeriodFilter.ALL, status = StatusFilter.ALL) {
    try {
      const response = await apiClient.get("/dashboard/average-repair-time", {
        params: { period, status },
      });
      return response.data || { totalRevenue: 0 };
    } catch (error) {
      console.error("Error fetching average repair time:", error);
      return { totalRevenue: 0 };
    }
  }

  /**
   * ========================================
   * GRÁFICOS
   * ========================================
   */

  /**
   * Retorna a evolução da receita ao longo do tempo
   */
  async getRevenueEvolution(period = PeriodFilter.THIRTY_DAYS, status = StatusFilter.ALL) {
    try {
      const response = await apiClient.get("/dashboard/charts/revenue-evolution", {
        params: { period, status },
      });
      return response.data || { dataPoints: [] };
    } catch (error) {
      console.error("Error fetching revenue evolution:", error);
      return { dataPoints: [] };
    }
  }

  /**
   * Retorna a evolução entre clientes recorrentes e novos clientes
   */
  async getCustomerType(period = PeriodFilter.THIRTY_DAYS, status = StatusFilter.ALL) {
    try {
      const response = await apiClient.get("/dashboard/charts/customer-type", {
        params: { period, status },
      });
      return response.data || { dataPoints: [] };
    } catch (error) {
      console.error("Error fetching customer type:", error);
      return { dataPoints: [] };
    }
  }

  /**
   * Retorna a distribuição de pedidos por status
   */
  async getOrdersByStatus(period = PeriodFilter.ALL) {
    try {
      const response = await apiClient.get("/dashboard/charts/orders-by-status", {
        params: { period },
      });
      return response.data || { statusCounts: [] };
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      return { statusCounts: [] };
    }
  }

  /**
   * Retorna os aparelhos mais reparados
   */
  async getTopAppliances(period = PeriodFilter.ALL, status = StatusFilter.ALL) {
    try {
      const response = await apiClient.get("/dashboard/charts/top-appliances", {
        params: { period, status },
      });
      return response.data || { appliances: [] };
    } catch (error) {
      console.error("Error fetching top appliances:", error);
      return { appliances: [] };
    }
  }

  /**
   * Retorna os componentes mais utilizados nos reparos
   */
  async getTopComponents(period = PeriodFilter.ALL, status = StatusFilter.ALL) {
    try {
      const response = await apiClient.get("/dashboard/charts/top-components", {
        params: { period, status },
      });
      return response.data || { components: [] };
    } catch (error) {
      console.error("Error fetching top components:", error);
      return { components: [] };
    }
  }

  /**
   * ========================================
   * MÉTODOS AUXILIARES
   * ========================================
   */

  /**
   * Busca todos os dados do dashboard de uma vez
   */
  async getAllDashboardData(period = PeriodFilter.THIRTY_DAYS, status = StatusFilter.ALL) {
    try {
      const [
        metrics,
        profitMargin,
        averageOrderPrice,
        ongoingOrders,
        averageRepairTime,
        revenueEvolution,
        customerType,
        ordersByStatus,
        topAppliances,
        topComponents,
      ] = await Promise.all([
        this.getMetrics(period, status),
        this.getProfitMargin(period, status),
        this.getAverageOrderPrice(period, status),
        this.getOngoingOrders(period, status),
        this.getAverageRepairTime(period, status),
        this.getRevenueEvolution(period, status),
        this.getCustomerType(period, status),
        this.getOrdersByStatus(period),
        this.getTopAppliances(period, status),
        this.getTopComponents(period, status),
      ]);

      return {
        metrics,
        profitMargin,
        averageOrderPrice,
        ongoingOrders,
        averageRepairTime,
        revenueEvolution,
        customerType,
        ordersByStatus,
        topAppliances,
        topComponents,
      };
    } catch (error) {
      console.error("Error fetching all dashboard data:", error);
      throw error;
    }
  }

  /**
   * Converte o valor do filtro de período do frontend para o formato da API
   */
  convertPeriodToAPI(periodValue) {
    const periodMap = {
      "ultimos-7-dias": PeriodFilter.SEVEN_DAYS,
      "ultimos-30-dias": PeriodFilter.THIRTY_DAYS,
      "ultimos-90-dias": PeriodFilter.NINETY_DAYS,
      "este-ano": PeriodFilter.YEAR,
      "todos": PeriodFilter.ALL,
    };
    return periodMap[periodValue] || PeriodFilter.ALL;
  }

  /**
   * Converte o valor do filtro de status do frontend para o formato da API
   */
  convertStatusToAPI(statusValue) {
    const statusMap = {
      "em-andamento": StatusFilter.ONGOING,
      "finalizadas": StatusFilter.COMPLETED,
      "entregues": StatusFilter.DELIVERED,
      "todos": StatusFilter.ALL,
    };
    return statusMap[statusValue] || StatusFilter.ALL;
  }

  /**
   * Formata o tempo médio de reparo (recebe em horas como número)
   */
  formatAverageRepairTime(hours) {
    if (!hours || hours === 0) return "N/A";
    
    const totalHours = Math.round(hours);
    const days = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    
    if (days === 0) {
      return `${totalHours} hora${totalHours !== 1 ? 's' : ''}`;
    } else if (remainingHours === 0) {
      return `${days} dia${days !== 1 ? 's' : ''}`;
    } else {
      return `${days} dia${days !== 1 ? 's' : ''} e ${remainingHours} hora${remainingHours !== 1 ? 's' : ''}`;
    }
  }
}

export default new DashboardService();
