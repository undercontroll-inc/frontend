import { apiClient } from "../providers/api";

class AnnouncementService {
  async uploadFileToPresignedUrl(presignedUrl, file) {
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("Falha ao enviar imagem para o storage");
    }
  }

  buildImageUpload(file) {
    return {
      originalName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    };
  }

  async uploadAnnouncementImage(imageUpload, imageFile) {
    if (!imageUpload || !imageFile) return;

    const presignedUrl = imageUpload.presigned_url || imageUpload.presignedUrl;

    if (!presignedUrl) {
      throw new Error("URL de upload nao fornecida pelo backend");
    }

    await this.uploadFileToPresignedUrl(presignedUrl, imageFile);
  }

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
    imageFile,
  ) {
    try {
      const response = await apiClient.post("/announcements", {
        title,
        description: content,
        imageUpload: imageFile ? this.buildImageUpload(imageFile) : null,
        type,
      });

      await this.uploadAnnouncementImage(response.data?.imageUpload, imageFile);

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

      const data = response?.data;

      if (Array.isArray(data)) {
        return {
          announcements: data,
          totalElements: data.length,
          totalPages: 1,
          page: Number(page),
          size: Number(size),
        };
      }

      if (Array.isArray(data?.announcements)) {
        return {
          announcements: data.announcements,
          totalElements: data.totalElements ?? data.announcements.length,
          totalPages: data.totalPages ?? 1,
          page: data.page ?? Number(page),
          size: data.size ?? Number(size),
        };
      }

      if (Array.isArray(data?.content)) {
        return {
          announcements: data.content,
          totalElements: data.totalElements ?? data.content.length,
          totalPages: data.totalPages ?? 1,
          page: data.page ?? Number(page),
          size: data.size ?? Number(size),
        };
      }

      if (Array.isArray(data?.data)) {
        return {
          announcements: data.data,
          totalElements: data.totalElements ?? data.data.length,
          totalPages: data.totalPages ?? 1,
          page: data.page ?? Number(page),
          size: data.size ?? Number(size),
        };
      }

      return {
        announcements: [],
        totalElements: 0,
        totalPages: 0,
        page: Number(page),
        size: Number(size),
      };
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);

      if (error.response?.status === 404 || error.response?.status === 204) {
        return { announcements: [], totalElements: 0, totalPages: 0, page: Number(page), size: Number(size) };
      }

      throw error;
    }
  }

  async updateAnnouncement(
    id,
    title,
    content,
    type,
    imageFile,
    removeImage,
  ) {
    try {
      const payload = {
        title,
        content,
        imageUpload: imageFile ? this.buildImageUpload(imageFile) : null,
        removeImage,
        type,
      };

      const response = await apiClient.put(`/announcements/${id}`, payload);

      await this.uploadAnnouncementImage(response.data?.imageUpload, imageFile);

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
