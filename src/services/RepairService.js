import { jsonServer } from '../providers/json-server';

class RepairService {
  async getAllRepairs(userId = null) {
    try {
      const url = userId ? `/repairs?userId=${userId}` : '/repairs';
      const response = await jsonServer.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar repairs:', error);
      throw error;
    }
  }

  async getRepairById(id) {
    try {
      const response = await jsonServer.get(`/repairs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar repair ${id}:`, error);
      throw error;
    }
  }

  async createRepair(repairData) {
    try {
      const response = await jsonServer.post('/repairs', repairData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar repair:', error);
      throw error;
    }
  }

  async updateRepair(id, repairData) {
    try {
      const response = await jsonServer.put(`/repairs/${id}`, repairData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar repair ${id}:`, error);
      throw error;
    }
  }

  async patchRepair(id, partialData) {
    try {
      const response = await jsonServer.patch(`/repairs/${id}`, partialData);
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

  async getRepairsByStatus(status) {
    try {
      const response = await jsonServer.get(`/repairs?status=${status}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar repairs por status ${status}:`, error);
      throw error;
    }
  }
}

export default new RepairService();