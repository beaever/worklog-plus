'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, type ChangePasswordInput } from '@worklog-plus/api';
import type { UserProfile } from '@worklog-plus/types';

/**
 * 프로필 업데이트 mutation 훅
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await usersApi.updateProfile(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update profile');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

/**
 * 비밀번호 변경 mutation 훅
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      const response = await usersApi.changePassword(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to change password');
      }
      return response.data;
    },
  });
}
