import { jsonServer } from '../providers/json-server';
import { apiClient } from "../providers/api";

class ComponentService {
  async getAllComponents() {
    try {
      const response = await apiClient.get('/components');
      // Se a API responder 204 No Content, retornar array vazio para seguir o padrão REST
      if (response.status === 204 || !response.data) return [];
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar componentes:', error);
      throw error;
    }
  }
  async getComponentById(id) {
    try {
      const response = await apiClient.get(`/components/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar componente ${id}:`, error);
      throw error;
    }
  }

  async createComponent(componentData) {
    try {
      const response = await apiClient.post('/components', componentData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar componente:', error);
      throw error;
    }
  }

  async updateComponent(id, componentData) {
    try {
      const response = await apiClient.put(`/components/${id}`, componentData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar componente ${id}:`, error);
      throw error;
    }
  }
  async patchComponent(id, partialData) {
    try {
      const response = await jsonServer.patch(`/components/${id}`, partialData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar parcialmente componente ${id}:`, error);
      throw error;
    }
  }
  async deleteComponent(id) {
    try {
      await apiClient.delete(`/components/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar componente ${id}:`, error);
      throw error;
    }
  }

  async getComponentsByCategory(category) {
    try {
      const response = await apiClient.get(`/components/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar componentes por categoria ${category}:`, error);
      throw error;
    }
  }
}

export default new ComponentService();
