import { jsonServer } from "../providers/json-server";
import { apiClient } from "../providers/api";

class ComponentService {
  async getAllComponents() {
    try {
      const response = await apiClient.get("/components");
      return response.data ?? [];
    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      throw error;
    }
  }
  async getComponentById(id) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await apiClient.get(`/components/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar componente ${id}:`, error);
      throw error;
    }
  }

  async createComponent(componentData) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await apiClient.post("/components", componentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar componente:", error);
      throw error;
    }
  }

  async updateComponent(id, componentData) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await apiClient.put(`/components/${id}`, componentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar componente ${id}:`, error);
      throw error;
    }
  }
  async patchComponent(id, partialData) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await jsonServer.patch(
        `/components/${id}`,
        partialData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar parcialmente componente ${id}:`, error);
      throw error;
    }
  }
  async deleteComponent(id) {
    const token = localStorage.getItem("authToken");

    try {
      await apiClient.delete(`/components/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Erro ao deletar componente ${id}:`, error);
      throw error;
    }
  }

  async getComponentsByCategory(category) {
    try {
      const response = await apiClient.get("/components", {
        params: { category },
      });
      if (!response.data) return [];
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar componentes por categoria ${category}:`,
        error
      );
      throw error;
    }
  }
}

export default new ComponentService();
