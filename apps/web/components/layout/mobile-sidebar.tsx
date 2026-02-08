'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, Button } from '@worklog-plus/ui';
import {
  X,
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
  Users,
  Activity,
  LogOut,
} from 'lucide-react';
import { useUserStore } from '@worklog-plus/store';

const navigation = [
  { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { name: '프로젝트', href: '/projects', icon: FolderOpen },
  { name: '업무일지', href: '/worklogs', icon: FileText },
  { name: '설정', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: '사용자 관리', href: '/admin/users', icon: Users },
  { name: '활동 로그', href: '/admin/audit-logs', icon: Activity },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useUserStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [pathname]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-40 bg-black/50 lg:hidden'
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className='fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-xl lg:hidden'>
        <div className='flex h-16 items-center justify-between border-b px-6'>
          <Link href='/' className='text-xl font-bold' onClick={onClose}>
            WorkLog+
          </Link>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='h-5 w-5' />
          </Button>
        </div>

        {user && (
          <div className='border-b p-4'>
            <p className='font-medium'>{user.name}</p>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
          </div>
        )}

        <nav className='space-y-1 p-4'>
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <item.icon className='h-5 w-5' />
                {item.name}
              </Link>
            );
          })}

          {(user?.role === 'ADMIN' || user?.role === 'SYSTEM_ADMIN') && (
            <>
              <div className='my-2 border-t pt-2'>
                <p className='mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground'>
                  관리
                </p>
              </div>
              {adminNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <item.icon className='h-5 w-5' />
                    {item.name}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {user && (
          <div className='absolute bottom-0 left-0 right-0 border-t p-4'>
            <Button
              variant='ghost'
              className='w-full justify-start gap-3 text-muted-foreground hover:text-destructive'
              onClick={handleLogout}
            >
              <LogOut className='h-5 w-5' />
              로그아웃
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
