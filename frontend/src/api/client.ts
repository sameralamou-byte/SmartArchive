import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const refreshClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const url = String(original?.url ?? "");
    const isAuthChallenge =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/reset-password") ||
      url.includes("/auth/change-password");
    const isRefresh = url.includes("/auth/refresh");
    if (error.response?.status === 401 && original && !isAuthChallenge && !isRefresh && !original._retry) {
      original._retry = true;
      try {
        const { data } = await refreshClient.post<{ access_token: string }>("/auth/refresh", {});
        useAuthStore.getState().setAccessToken(data.access_token);
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(original);
      } catch {
        useAuthStore.getState().clear();
      }
    } else if (error.response?.status === 401 && !isAuthChallenge) {
      useAuthStore.getState().clear();
    }
    return Promise.reject(error);
  },
);
