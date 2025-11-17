import { apiClient } from "../providers/api";

class AvatarService {
  /**
   * Faz upload de uma imagem de avatar para o servidor
   * @param {File} file - Arquivo de imagem
   * @param {string} userId - ID do usuário
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  async uploadAvatar(file, userId) {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", userId);

      // Ajuste a rota conforme seu backend
      const response = await apiClient.post("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        url: response.data.avatarUrl || response.data.url,
      };
    } catch (error) {
      console.error("Erro ao fazer upload do avatar:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao fazer upload da imagem",
      };
    }
  }

  /**
   * Remove o avatar do usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async removeAvatar(userId) {
    try {
      await apiClient.delete(`/users/${userId}/avatar`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Erro ao remover avatar:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao remover avatar",
      };
    }
  }

  /**
   * Converte arquivo para base64 (útil para preview)
   * @param {File} file - Arquivo de imagem
   * @returns {Promise<string>}
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Valida se o arquivo é uma imagem válida
   * @param {File} file - Arquivo para validar
   * @param {number} maxSizeMB - Tamanho máximo em MB (padrão: 5)
   * @returns {{valid: boolean, error?: string}}
   */
  validateImageFile(file, maxSizeMB = 5) {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Por favor, selecione uma imagem válida (JPG, PNG, GIF ou WebP)",
      };
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `A imagem deve ter no máximo ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  }
}

export const avatarService = new AvatarService();
