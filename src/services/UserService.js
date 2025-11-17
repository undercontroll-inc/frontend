import { apiClient, getAxiosErrorMessage } from "../providers/api";

const BASE_URI = "/users";

class UserService {
  async auth(email, senha) {
    try {
      const response = await apiClient.post(BASE_URI + "/auth", {
        email: email,
        password: senha,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (e) {
      return {
        success: false,
        error: getAxiosErrorMessage(e),
      };
    }
  }

  async googleAuth(email, token) {
    try {
      const response = await apiClient.post(BASE_URI + "/auth/google", {
        email: email,
        token: token,
      });

      console.log(response);

      return {
        success: true,
        data: response.data,
      };
    } catch (e) {
      return {
        success: false,
        error: getAxiosErrorMessage(e),
        statusCode: e.response?.status,
      };
    }
  }

  async register(user) {
    try {
      // Remove caracteres não numéricos do CEP e CPF
      const cleanCEP = user.CEP ? user.CEP.replace(/\D/g, "") : user.CEP;
      const cleanCPF = user.cpf ? user.cpf.replace(/\D/g, "") : user.cpf;

      const response = await apiClient.post(BASE_URI, {
        name: user.name,
        email: user.email,
        phone: user.phone,
        lastName: user.lastname,
        password: user.password,
        address: user.address,
        CEP: cleanCEP,
        cpf: cleanCPF,
        userType: user.userType,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (e) {
      return {
        success: false,
        error: getAxiosErrorMessage(e),
      };
    }
  }

  async getAllUsers() {
    try {
      const response = await apiClient.get(BASE_URI);
      return {
        success: true,
        data: response.data,
      };
    } catch (e) {
      return {
        success: false,
        error: getAxiosErrorMessage(e),
      };
    }
  }

  async getUserById(id) {
    try {
      const response = await apiClient.get(`${BASE_URI}/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (e) {
      return {
        success: false,
        error: getAxiosErrorMessage(e),
      };
    }
  }

  async updateUser(id, userData) {
    try {
      // Remove caracteres não numéricos do CEP (hífen, pontos, etc)
      const cleanCEP = userData.CEP
        ? userData.CEP.replace(/\D/g, "")
        : userData.CEP;

      const response = await apiClient.put(`${BASE_URI}/${id}`, {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        lastName: userData.lastName,
        address: userData.address,
        CEP: cleanCEP,
        addressNumber: userData.addressNumber,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (e) {
      return {
        success: false,
        error: getAxiosErrorMessage(e),
      };
    }
  }
}

export const userService = new UserService();
