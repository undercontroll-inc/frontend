import { apiClient } from "../providers/api";

class AnnouncementService {
  async getLastAnnouncement() {
    try {
      const response = await apiClient.get("/announcements/last");

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);

      if (error.response.status === 404) {
        return null;
      }

      throw error;
    }
  }

  async publishAnnouncement(title, content, type) {
    try {
      const token = localStorage.getItem("authToken");

      const response = await apiClient.post(
        "/announcements",
        {
          title,
          description: content,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (err) {
      console.error("Erro ao publicar anúncio:", err);

      throw err;
    }
  }

  async getAllAnnouncements(page = 0, size = 10, type = null) {
    try {
      const params = new URLSearchParams({ page: Number(page), size: Number(size) });
      if (type && type !== "Todos") {
        params.append("type", type);
      }

      const response = await apiClient.get(`/announcements?${params}`);

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);

      if (error.response?.status === 404 || error.response?.status === 204) {
        return { announcements: [], totalElements: 0, totalPages: 0, page: Number(page), size: Number(size) };
      }

      throw error;
    }
  }

  async updateAnnouncement(id, title, content, type) {
    try {
      const token = localStorage.getItem("authToken");

      const response = await apiClient.put(
        `/announcements/${id}`,
        {
          title,
          content,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (err) {
      console.error("Erro ao atualizar anúncio:", err);

      throw err;
    }
  }

  async deleteAnnouncement(id) {
    try {
      const token = localStorage.getItem("authToken");

      const response = await apiClient.delete(`/announcements/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      console.error("Erro ao deletar anúncio:", err);

      throw err;
    }
  }
}

export const announcementService = new AnnouncementService();
