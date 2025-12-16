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

  async publishAnnouncement(
    title,
    content,
    type,

  ) {
    try {
      const token = localStorage.getItem("authToken");

      const response = await apiClient.post("/announcements", {
        title,
        content,
        type,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      console.error("Erro ao publicar anúncio:", err);

      throw err;
    }
  }

  async getAllAnnouncements(
    page,
    size,
  ) {
    try {
      const url = `/announcements?page=${Number(page)}&size=${Number(size)}`;
      console.log(url);

      const response = await apiClient.get(url);

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);

      if (error.response.status === 404) {
        return [];
      }

      throw error;
    }
  }

  async updateAnnouncement(
    id,
    title,
    content,
    type,
  ) {
    try {
      const token = localStorage.getItem("authToken");

      const response = await apiClient.put(`/announcements/${id}`, {
        title,
        content,
        type,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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