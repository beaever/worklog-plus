'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@worklog-plus/store';
import type { LoginRequest, RegisterRequest } from '@worklog-plus/types';
import { track } from '@vercel/analytics';
import { createClient } from '@/lib/supabase/client';
import { fetchProfileById, fetchCurrentUserProfile } from '@/lib/supabase/profile';

export function useLogin(options?: { redirectTo?: string }) {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const supabase = createClient();
      const { data: result, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error || !result.user) {
        throw new Error(
          error?.message
            ? '이메일 또는 비밀번호가 올바르지 않습니다'
            : '로그인에 실패했습니다',
        );
      }
      const profile = await fetchProfileById(supabase, result.user.id);
      if (!profile) throw new Error('사용자 프로필을 찾을 수 없습니다');
      return profile;
    },
    onSuccess: (user) => {
      login(user);
      // replace로 히스토리에 로그인 화면을 남기지 않고, refresh로 서버 컴포넌트/미들웨어가
      // 새 세션 쿠키를 반영하도록 강제 갱신한다(없으면 미인증 RSC가 캐시돼 로그인 화면에 잔류).
      router.replace(options?.redirectTo ?? '/dashboard');
      router.refresh();
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const supabase = createClient();
      const { data: result, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { name: data.name } },
      });
      if (error) throw new Error(error.message || '회원가입에 실패했습니다');

      // 이메일 확인이 필요한 설정이면 세션이 없을 수 있다.
      if (!result.session || !result.user) {
        throw new Error('가입이 완료되었습니다. 이메일을 확인한 뒤 로그인해 주세요.');
      }
      const profile = await fetchProfileById(supabase, result.user.id);
      if (!profile) throw new Error('사용자 프로필 생성에 실패했습니다');
      return profile;
    },
    onSuccess: (user) => {
      track('signup');
      login(user);
      router.replace('/dashboard');
      router.refresh();
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const queryClient = useQueryClient();

  const cleanup = () => {
    logout();
    queryClient.clear();
    router.replace('/login');
    router.refresh();
  };

  return useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message || '로그아웃에 실패했습니다');
    },
    onSuccess: cleanup,
    onError: cleanup, // 서버 오류 시에도 클라이언트 상태는 정리
  });
}

export function useCurrentUser() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const supabase = createClient();
      const profile = await fetchCurrentUserProfile(supabase);
      if (!profile) throw new Error('사용자 정보를 가져올 수 없습니다');
      // 기존 소비처 호환: { user } 형태로 반환
      return { user: profile };
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  });
}
