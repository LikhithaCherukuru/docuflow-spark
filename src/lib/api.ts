import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { mockAdapter } from "@/services/mockAdapter";

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "";
export const USE_MOCK = !BASE_URL;

export const TOKEN_KEY = "ahms_token";
export const USER_KEY = "ahms_user";

export const api = axios.create({
  baseURL: BASE_URL || "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

if (USE_MOCK) {
  api.defaults.adapter = mockAdapter as any;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message =
      (error.response?.data as any)?.message || error.message || "Something went wrong";

    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        if (!window.location.pathname.startsWith("/login")) {
          toast.error("Session expired. Please sign in again.");
          window.location.href = "/login";
        }
      }
    } else if (status === 403) {
      toast.error("You do not have permission to do that.");
    } else if (status && status >= 500) {
      toast.error("Server error. Please try again later.");
    }
    return Promise.reject({ ...error, message });
  },
);

export type ApiError = { message: string; status?: number };
