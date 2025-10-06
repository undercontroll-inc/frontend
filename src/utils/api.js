import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor de resposta global para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Loga o erro no console de forma organizada
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

// Função para extrair mensagem de erro do backend
export function getAxiosErrorMessage(error) {
  // Erro com resposta do servidor
  if (error.response?.data) {
    const data = error.response.data;
    
    // Se for string, retorna diretamente
    if (typeof data === 'string') return data;
    
    // Tenta extrair mensagem de diferentes formatos comuns
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.msg) return data.msg;
    if (data.detail) return data.detail;
    
    // Se tiver array de erros (validação)
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map(err => err.message || err).join(', ');
    }
    
    // Fallback para JSON stringify
    return JSON.stringify(data);
  }
  
  // Erro de rede
  if (error.request) {
    return 'Erro de conexão. Verifique se o servidor está rodando.';
  }
  
  // Outro tipo de erro
  return error.message || 'Erro desconhecido';
}