'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@worklog-plus/store';
import { authApi } from '@worklog-plus/api';

const PUBLIC_PATHS = ['/login', '/register', '/'];

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 현재 경로가 공개 라우트인지 판별
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) =>
      pathname === path ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register'),
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const hasHydrated = useUserStore((state) => state._hasHydrated);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);
  const setLoading = useUserStore((state) => state.setLoading);

  // 서버 인증 상태를 react-query로 가져와 캐시 공유
  // - persist 하이드레이션이 완료된 후에만 실행
  // - 한 번만 실행하고 staleTime 동안 재호출 방지
  const {
    data: meData,
    isError: meIsError,
    isSuccess: meIsSuccess,
    error: meError,
    isFetched: meIsFetched,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authApi.me();
      if (!response.success || !response.data?.user) {
        // 명시적 인증 실패만 에러로 처리 (네트워크 오류 등은 retry로 흡수)
        throw new Error(response.error || '인증 정보를 가져올 수 없습니다');
      }
      return response.data.user;
    },
    enabled: hasHydrated,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // 서버 응답에 따라 zustand 동기화
  useEffect(() => {
    if (!hasHydrated) return;

    if (meIsSuccess && meData) {
      login(meData);
      return;
    }

    if (meIsError) {
      // 명시적 인증 실패 → 클라이언트 상태도 비움
      logout();
    }
  }, [hasHydrated, meIsSuccess, meIsError, meData, login, logout]);

  // 로딩 플래그는 첫 페치 완료 시 해제
  useEffect(() => {
    if (hasHydrated && meIsFetched) {
      setLoading(false);
    }
  }, [hasHydrated, meIsFetched, setLoading]);

  // 라우팅 가드: 페치 완료 후에만 동작 (persist 값을 활용해 깜빡임 최소화)
  useEffect(() => {
    if (!hasHydrated || !meIsFetched) return;

    const publicPath = isPublicPath(pathname);

    if (!isAuthenticated && !publicPath) {
      router.push('/login');
    }

    if (
      isAuthenticated &&
      (pathname === '/login' || pathname === '/register')
    ) {
      router.push('/dashboard');
    }
  }, [hasHydrated, meIsFetched, isAuthenticated, pathname, router]);

  // 초기 게이트: persist 하이드레이션도 안 끝났거나
  // 비인증 + 보호 라우트 + 첫 페치 미완 → 스피너
  // 인증 캐시가 있으면 (낙관적) 즉시 children 렌더
  if (!hasHydrated) {
    return <AuthLoader />;
  }

  if (!meIsFetched && !isAuthenticated && !isPublicPath(pathname)) {
    return <AuthLoader />;
  }

  // 명시적 인증 실패 + 보호 라우트면 리다이렉트 진행 중 스피너
  if (meIsError && !isPublicPath(pathname)) {
    // 에러 메시지는 dev 환경에서만 노출
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AuthProvider] me() failed:', meError);
    }
    return <AuthLoader />;
  }

  return <>{children}</>;
}

function AuthLoader() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
    </div>
  );
}
