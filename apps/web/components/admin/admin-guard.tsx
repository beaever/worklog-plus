'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@worklog/store';
import type { UserRole } from '@worklog/types';

const ADMIN_ROLES: UserRole[] = ['ADMIN', 'SYSTEM_ADMIN'];

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export function AdminGuard({ children, requiredRoles = ADMIN_ROLES }: AdminGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useUserStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && user && !requiredRoles.includes(user.role)) {
      router.push('/403');
    }
  }, [isLoading, isAuthenticated, user, requiredRoles, router]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    );
  }

  if (!isAuthenticated || !user || !requiredRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
