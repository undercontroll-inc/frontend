import { apiClient, getAxiosErrorMessage } from "../utils/api";

const BASE_URI = '/users';

class UserService {

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async auth(email, senha) {
    try {
      const response = await apiClient.post(BASE_URI + "/auth", {
        email: email,
        password: senha,
      });
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (e) {
      return { 
        success: false, 
        error: getAxiosErrorMessage(e) 
      };
    }
  }

  async register(user) {
    try {
      let birthDate = user.birthdate;
      if (typeof birthDate === 'string' && birthDate.includes('/')) {
        const [day, month, year] = birthDate.split('/');
        birthDate = new Date(`${year}-${month}-${day}`).toISOString();
      }
      
      const response = await apiClient.post(BASE_URI, {
        name: user.name,
        email: user.email,
        phone: user.phone,
        lastName: user.lastname,
        password: user.password,
        address: user.address,
        cpf: user.cpf,
        birthDate: birthDate,
        userType: user.userType
      });
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (e) {
      return { 
        success: false, 
        error: getAxiosErrorMessage(e) 
      };
    }
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const userService = new UserService();