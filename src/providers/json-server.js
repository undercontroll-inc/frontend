import axios from "axios";

// Provider do json server para testes
export const jsonServer = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para tratar erros
jsonServer.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[JSON Server Error ${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error('[Network Error]: Sem resposta do json-server');
    } else {
      console.error('[Request Error]:', error.message);
    }
    return Promise.reject(error);
  }
);