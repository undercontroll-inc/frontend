import axios from "axios";
import { clearAuth, getRefreshToken, getToken, saveTokens } from "../utils/auth";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/v1/api";

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
});

const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
});

let refreshPromise = null;

function isPublicAuthRequest(url = "") {
  const path = String(url).split("?")[0];
  return /\/auth$/.test(path) || /\/auth\/refresh$/.test(path);
}

apiClient.interceptors.request.use((config) => {
  if (!isPublicAuthRequest(config.url)) {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.error(`[API Error ${error.response.status}]:`, getAxiosErrorMessage(error));
    } else if (error.request) {
      console.error("[Network Error]: Sem resposta do servidor");
    } else {
      console.error("[Request Error]:", error.message);
    }

    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isPublicAuthRequest(original.url)
    ) {
      original._retry = true;
      try {
        await refreshAccessToken();
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${getToken()}`;
        return apiClient(original);
      } catch {
        clearAuth();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function doRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("Refresh token not present");
  }
  const response = await refreshClient.post("/auth/refresh", { refreshToken });
  const { accessToken, refreshToken: nextRefresh } = response.data || {};
  if (!accessToken || !nextRefresh) {
    throw new Error("Invalid refresh payload");
  }
  saveTokens(accessToken, nextRefresh);
}

export function getAxiosErrorMessage(error) {
  if (error.response?.data) {
    const data = error.response.data;

    if (typeof data === "string") return data;

    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.msg) return data.msg;
    if (data.detail) return data.detail;

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map((err) => err.message || err).join(", ");
    }

    return JSON.stringify(data);
  }

  if (error.request) {
    return "Erro de conexão. Verifique se o servidor está rodando.";
  }

  return error.message || "Erro desconhecido";
}
