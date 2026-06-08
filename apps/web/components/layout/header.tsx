'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@worklog-plus/ui';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { useUserStore } from '@worklog-plus/store';
import { useLogout } from '@/hooks/use-auth';
import { MobileSidebar } from './mobile-sidebar';
import { NotificationBell } from './notification-bell';

export function Header() {
  const user = useUserStore((state) => state.user);
  const logoutMutation = useLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logoutMutation.mutate();
  };

  return (
    <>
      <header className='flex h-16 items-center justify-between border-b px-6'>
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden'
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className='h-5 w-5' />
        </Button>
        <div className='flex-1' />
        <div className='flex items-center gap-2'>
          <NotificationBell />

          <div className='relative' ref={userMenuRef}>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title='사용자 메뉴'
            >
              <User className='h-5 w-5' />
            </Button>

            {isUserMenuOpen && (
              <div className='absolute right-0 top-full mt-2 w-56 rounded-md border bg-card shadow-lg'>
                {user && (
                  <div className='border-b p-3'>
                    <p className='font-medium'>{user.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {user.email}
                    </p>
                  </div>
                )}
                <div className='p-1'>
                  <Link
                    href='/settings'
                    className='flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent'
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className='h-4 w-4' />
                    설정
                  </Link>
                  <button
                    type='button'
                    className='flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-accent disabled:opacity-50'
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className='h-4 w-4' />
                    {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}
