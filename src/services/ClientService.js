import { jsonServer } from "../providers/json-server";
import { apiClient } from "../providers/api";

class ClientService {
  async getAllClients() {
    const token = localStorage.getItem("authToken");

    try {
      const response = await apiClient.get("/users/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  }

  async getClientById(id) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await apiClient.get(`/users/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cliente ${id}:`, error);
      throw error;
    }
  }

  async getClientRepairs(userId) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await jsonServer.get(`/repairs?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar repairs do cliente ${userId}:`, error);
      throw error;
    }
  }

  async createClient(clientData) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await apiClient.post(
        "/users",
        {
          ...clientData,
          inFirstLogin: true,
          userType: "CUSTOMER",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  }

  async updateClient(id, clientData) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await jsonServer.put(`/user/${id}`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cliente ${id}:`, error);
      throw error;
    }
  }

  async deleteClient(id) {
    const token = localStorage.getItem("authToken");

    try {
      await jsonServer.delete(`/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Erro ao deletar cliente ${id}:`, error);
      throw error;
    }
  }
}

export default new ClientService();
