import { jsonServer } from "../providers/json-server";
import { apiClient } from "../providers/api";

export class StorageService {
  static async getAll() {
    const token = localStorage.getItem("authToken");

    try {
      const response = await apiClient.get("/components", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching storage items:", error);
      throw error;
    }
  }

  static async getById(id) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await jsonServer.get(`/storage/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching storage item:", error);
      throw error;
    }
  }

  static async create(itemData) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await apiClient.post("/components", itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating storage item:", error);
      throw error;
    }
  }

  static async update(id, itemData) {
    const token = localStorage.getItem("authToken");

    try {
      if (!id) {
        throw new Error("ID do item não fornecido para atualização");
      }
      console.log("Atualizando item ID:", id, "com dados:", itemData);
      const response = await jsonServer.patch(`/storage/${id}`, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating storage item:", error);
      console.error("ID:", id, "Data:", itemData);
      throw error;
    }
  }

  static async delete(id) {
    const token = localStorage.getItem("authToken");

    try {
      await jsonServer.delete(`/storage/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      console.error("Error deleting storage item:", error);
      throw error;
    }
  }
}
