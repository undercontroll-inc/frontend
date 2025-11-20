import { jsonServer } from '../providers/json-server';
import { apiClient } from '../providers/api'; 

class ClientService {
  async getAllClients() {
    try {
      const response = await apiClient.get('/users/customers');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  async getClientById(id) {
    try {
      const response = await apiClient.get(`/users/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cliente ${id}:`, error);
      throw error;
    }
  }

  async getClientRepairs(userId) {
    try {
      const response = await jsonServer.get(`/repairs?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar repairs do cliente ${userId}:`, error);
      throw error;
    }
  }

  async createClient(clientData) {
    try {
      const response = await apiClient.post('/users', {
        ...clientData,
        inFirstLogin: true,
        userType: 'CUSTOMER'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  async updateClient(id, clientData) {
    try {
      const response = await jsonServer.put(`/user/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cliente ${id}:`, error);
      throw error;
    }
  }

  async deleteClient(id) {
    try {
      await jsonServer.delete(`/user/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar cliente ${id}:`, error);
      throw error;
    }
  }
}

export default new ClientService();
