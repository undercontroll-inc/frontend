import { jsonServer } from "../providers/json-server";
import { apiClient } from "../providers/api";

class RepairService {
  async getAllRepairs(page = 0, size = 10) {
    try {
      const response = await apiClient.get("/orders", {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar repairs:", error);
      throw error;
    }
  }

  async getRepairById(id) {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error(`Erro ao buscar repair ${id}:`, error);
      throw error;
    }
  }

  async createRepair(repairData) {
    try {
      const response = await apiClient.post("/orders", repairData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar repair:", error);
      throw error;
    }
  }

  async updateRepair(id, repairData) {
    try {
      const response = await apiClient.patch(`/repairs/${id}`, repairData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar repair ${id}:`, error);
      throw error;
    }
  }

  async patchRepair(id, partialData) {
    try {
      const response = await apiClient.patch(`/orders/${id}`, partialData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar parcialmente repair ${id}:`, error);
      throw error;
    }
  }

  async deleteRepair(id) {
    try {
      await jsonServer.delete(`/repairs/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar repair ${id}:`, error);
      throw error;
    }
  }

  async deleteOrderItem(orderId, id) {
    try {
      await apiClient.delete(`/orders/${orderId}/items/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar order-item ${id}:`, error);
      throw error;
    }
  }

  async getRepairsByStatus(status) {
    try {
      const response = await jsonServer.get(`/repairs?status=${status}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar repairs por status ${status}:`, error);
      throw error;
    }
  }

  async getUserRepairs(userId) {
    try {
      const response = await apiClient.get("/orders", {
        params: { userId },
      });
      return response.data?.data ?? [];
    } catch (error) {
      console.error(`Erro ao buscar repairs do usuário ${userId}:`, error);
      throw error;
    }
  }

  async exportOrder(id) {
    try {
      const response = await apiClient.get(`/orders/${id}/export`, {
        responseType: "blob",
      });

      return {
        success: response.status === 200,
        data: response.data,
      };
    } catch (error) {
      console.error("Erro ao exportar orders:", error);
      throw error;
    }
  }
}

export default new RepairService();
