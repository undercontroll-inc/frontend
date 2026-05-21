import { apiClient } from "../providers/api";

class AnnouncementService {
  async requestUploadUrl(file) {
    const response = await apiClient.post("/files/upload-url", {
      file_name: file.name,
      file_type: file.type,
    });

    return response.data;
  }

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

  buildPublicImageUrl(presignedUrl, fileKey) {
    const baseUrl = import.meta.env.VITE_UPLOAD_PUBLIC_BASE_URL;

    if (baseUrl && fileKey) {
      return `${baseUrl.replace(/\/$/, "")}/${fileKey}`;
    }

    if (presignedUrl) {
      return presignedUrl.split("?")[0];
    }

    return fileKey || "";
  }

  async uploadAnnouncementImage(imageFile) {
    const uploadData = await this.requestUploadUrl(imageFile);
    const presignedUrl = uploadData.presigned_url || uploadData.presignedUrl;
    const fileKey = uploadData.file_key || uploadData.fileKey;

    if (!presignedUrl) {
      throw new Error("URL de upload nao fornecida pelo backend");
    }

    await this.uploadFileToPresignedUrl(presignedUrl, imageFile);

    return this.buildPublicImageUrl(presignedUrl, fileKey);
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
      const imageUrl = imageFile
        ? await this.uploadAnnouncementImage(imageFile)
        : undefined;

      const response = await apiClient.post("/announcements", {
        title,
        description: content,
        imageUrl,
        type,
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

      const data = response?.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.announcements)) {
        return data.announcements;
      }

      if (Array.isArray(data?.content)) {
        return data.content;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      return [];
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
    imageFile,
    removeImage,
  ) {
    try {
      let imageUrl;

      if (imageFile) {
        imageUrl = await this.uploadAnnouncementImage(imageFile);
      } else if (removeImage) {
        imageUrl = "";
      }

      const payload = {
        title,
        content,
        type,
      };

      if (imageUrl !== undefined) {
        payload.imageUrl = imageUrl;
      }

      const response = await apiClient.put(`/announcements/${id}`, payload);

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
