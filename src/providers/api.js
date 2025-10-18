import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/v1/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[API Error ${error.response.status}]:`, getAxiosErrorMessage(error));
    } else if (error.request) {
      console.error('[Network Error]: Sem resposta do servidor');
    } else {
      console.error('[Request Error]:', error.message);
    }
    return Promise.reject(error);
  }
);

export function getAxiosErrorMessage(error) {
  if (error.response?.data) {
    const data = error.response.data;
    
    if (typeof data === 'string') return data;
    
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.msg) return data.msg;
    if (data.detail) return data.detail;
    
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map(err => err.message || err).join(', ');
    }
    
    return JSON.stringify(data);
  }
  
  if (error.request) {
    return 'Erro de conexão. Verifique se o servidor está rodando.';
  }
  
  return error.message || 'Erro desconhecido';
}