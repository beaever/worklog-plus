'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@worklog-plus/store';
import { authApi } from '@worklog-plus/api';

const PUBLIC_PATHS = ['/login', '/register', '/'];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isLoading, setLoading, login, logout } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await authApi.me();
      if (response.success && response.data?.user) {
        login(response.data.user);
      } else {
        logout();
      }
      setLoading(false);
    };

    checkAuth();
  }, [login, logout, setLoading]);

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

    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
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
