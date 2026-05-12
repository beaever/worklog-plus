'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@worklog-plus/api';
import { useUserStore } from '@worklog-plus/store';
import type { LoginRequest, RegisterRequest } from '@worklog-plus/types';

export function useLogin() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await authApi.login(data);
      if (!response.success) {
        throw new Error(response.error || '로그인에 실패했습니다');
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.user) {
        login(data.user);
        router.push('/dashboard');
      }
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await authApi.register(data);
      if (!response.success) {
        throw new Error(response.error || '회원가입에 실패했습니다');
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.user) {
        login(data.user);
        router.push('/dashboard');
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await authApi.logout();
      if (!response.success) {
        throw new Error(response.error || '로그아웃에 실패했습니다');
      }
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      router.push('/login');
    },
    onError: () => {
      // 서버 오류 시에도 클라이언트 상태는 정리
      logout();
      queryClient.clear();
      router.push('/login');
    },
  });
}

export function useCurrentUser() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authApi.me();
      if (!response.success) {
        throw new Error(response.error || '사용자 정보를 가져올 수 없습니다');
      }
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  });
}
