import type { User, UserProfile } from "@worklog/types";
import { apiClient } from "./client";

export const usersApi = {
  getMe: () => apiClient.get<User>("/users/me"),

  getProfile: (id: string) => apiClient.get<UserProfile>(`/users/${id}/profile`),

  updateProfile: (data: Partial<UserProfile>) =>
    apiClient.patch<User>("/users/me", data),
};
