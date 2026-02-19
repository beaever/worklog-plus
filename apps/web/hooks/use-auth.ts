'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@worklog-plus/api';
import { useUserStore } from '@worklog-plus/store';
import type { LoginRequest, RegisterRequest } from '@worklog-plus/types';
import { setCookie, deleteCookie } from '@/lib/cookies';

/**
 * 로그인 mutation 훅
 *
 * @description
 * - 사용자 로그인을 처리하는 TanStack Query mutation 훅
 * - 성공 시 토큰을 localStorage에 저장하고 Zustand store를 업데이트
 * - 자동으로 대시보드 페이지로 리다이렉트
 *
 * @example
 * const loginMutation = useLogin();
 * loginMutation.mutate({ email: 'user@example.com', password: '1234' });
 */
export function useLogin() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await authApi.login(data);
      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // 로그인 성공 시 토큰과 사용자 정보 저장
      if (data?.user && data?.accessToken && data?.refreshToken) {
        // localStorage에 토큰 저장
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // 쿠키에도 토큰 저장 (미들웨어에서 인증 상태 확인용)
        setCookie('accessToken', data.accessToken, { days: 7 });
        setCookie('refreshToken', data.refreshToken, { days: 30 });

        // Zustand store 업데이트
        login(data.user, {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        router.push('/dashboard');
      }
    },
  });
}

/**
 * 회원가입 mutation 훅
 *
 * @description
 * - 신규 사용자 등록을 처리하는 TanStack Query mutation 훅
 * - 성공 시 자동으로 로그인 처리 (토큰 저장 및 리다이렉트)
 *
 * @example
 * const registerMutation = useRegister();
 * registerMutation.mutate({ email: 'user@example.com', password: '1234', name: 'User' });
 */
export function useRegister() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await authApi.register(data);
      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // 회원가입 성공 시 자동 로그인 처리
      if (data?.user && data?.accessToken && data?.refreshToken) {
        // localStorage에 토큰 저장
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // 쿠키에도 토큰 저장 (미들웨어에서 인증 상태 확인용)
        setCookie('accessToken', data.accessToken, { days: 7 });
        setCookie('refreshToken', data.refreshToken, { days: 30 });

        // Zustand store 업데이트
        login(data.user, {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        router.push('/dashboard');
      }
    },
  });
}

/**
 * 로그아웃 mutation 훅
 *
 * @description
 * - 사용자 로그아웃을 처리하는 TanStack Query mutation 훅
 * - 서버에 로그아웃 요청 후 로컬 상태 정리
 * - 모든 쿼리 캐시 초기화 및 로그인 페이지로 리다이렉트
 *
 * @example
 * const logoutMutation = useLogout();
 * logoutMutation.mutate();
 */
export function useLogout() {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await authApi.logout();
      if (!response.success) {
        throw new Error(response.error || 'Logout failed');
      }
    },
    onSuccess: () => {
      // 로그아웃 성공 시 모든 인증 정보 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // 쿠키에서도 토큰 삭제
      deleteCookie('accessToken');
      deleteCookie('refreshToken');

      // Zustand store 초기화
      logout();

      // 모든 쿼리 캐시 초기화
      queryClient.clear();

      router.push('/login');
    },
  });
}

/**
 * 현재 사용자 정보 조회 query 훅
 *
 * @description
 * - 현재 로그인한 사용자의 정보를 가져오는 TanStack Query 훅
 * - 5분간 캐시 유지 (staleTime)
 * - 실패 시 재시도하지 않음 (인증 실패는 즉시 처리)
 *
 * @returns 사용자 정보 쿼리 결과
 *
 * @example
 * const { data: user, isLoading } = useCurrentUser();
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authApi.me();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch user');
      }
      return response.data;
    },
    retry: false, // 인증 실패 시 재시도하지 않음
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    enabled:
      typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  });
}
