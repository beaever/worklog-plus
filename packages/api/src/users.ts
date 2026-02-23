import type { User, UserProfile } from '@worklog-plus/types';
import { apiClient } from './client';

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const usersApi = {
  getMe: () => apiClient.get<User>('/users/me'),

  getProfile: (id: string) =>
    apiClient.get<UserProfile>(`/users/${id}/profile`),

  updateProfile: (data: Partial<UserProfile>) =>
    apiClient.patch<User>('/users/me', data),

  changePassword: (data: ChangePasswordInput) =>
    apiClient.post<{ message: string }>('/users/me/password', data),
};
