'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@worklog/store';

const PUBLIC_PATHS = ['/login', '/register', '/'];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isLoading, setLoading } = useUserStore();

  useEffect(() => {
    // 모의 인증: localStorage에서 상태 복원 후 로딩 완료
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = PUBLIC_PATHS.some(
      (path) =>
        pathname === path ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/register'),
    );

    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
    }

    if (
      isAuthenticated &&
      (pathname === '/login' || pathname === '/register')
    ) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    );
  }

  return <>{children}</>;
}
