'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@worklog-plus/store';
import { createClient } from '@/lib/supabase/client';
import { fetchProfileById } from '@/lib/supabase/profile';

const PUBLIC_PATHS = ['/login', '/register', '/'];

interface AuthProviderProps {
  children: React.ReactNode;
}

function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register')
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);
  const setLoading = useUserStore((state) => state.setLoading);

  const [ready, setReady] = useState(false);

  // Supabase 세션 상태를 구독해 Zustand와 동기화.
  // INITIAL_SESSION 이벤트가 마운트 직후 발생하므로 초기 로드도 함께 처리된다.
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // onAuthStateChange 콜백 내부에서 supabase 호출을 await하면 락 교착이 생길 수 있어
      // 프로필 조회는 다음 틱으로 미룬다.
      setTimeout(async () => {
        if (!active) return;
        if (session?.user) {
          const profile = await fetchProfileById(supabase, session.user.id);
          if (!active) return;
          if (profile) login(profile);
          else logout();
        } else {
          logout();
        }
        setLoading(false);
        setReady(true);
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [login, logout, setLoading]);

  // SPA 네비게이션 보조 가드 (서버 미들웨어가 1차 방어)
  useEffect(() => {
    if (!ready) return;
    const publicPath = isPublicPath(pathname);

    if (!isAuthenticated && !publicPath) {
      router.replace('/login');
    }
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.replace('/dashboard');
    }
  }, [ready, isAuthenticated, pathname, router]);

  // 초기 세션 해석 전 / 미인증 상태에서 보호 라우트 → 스피너
  if (!ready) {
    return <AuthLoader />;
  }
  if (!isAuthenticated && !isPublicPath(pathname)) {
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
