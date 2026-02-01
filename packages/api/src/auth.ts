import type { LoginRequest, RegisterRequest, AuthResponse, User } from "@worklog/types";
import { apiClient } from "./client";

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  logout: () => apiClient.post<void>("/auth/logout", {}),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>("/auth/refresh", { refreshToken }),

  me: () => apiClient.get<User>("/auth/me"),
};
