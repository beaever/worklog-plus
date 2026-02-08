'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@worklog/ui';
import { useUserStore } from '@worklog/store';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
  Users,
  Activity,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { name: '프로젝트', href: '/projects', icon: FolderOpen },
  { name: '업무일지', href: '/worklogs', icon: FileText },
  { name: '설정', href: '/settings', icon: Settings },
];

const adminNavigation: NavItem[] = [
  { name: '사용자 관리', href: '/admin/users', icon: Users },
  { name: '활동 로그', href: '/admin/audit-logs', icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUserStore();

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SYSTEM_ADMIN';

  return (
    <aside className='hidden w-64 border-r bg-card lg:block'>
      <div className='flex h-16 items-center border-b px-6'>
        <Link href='/dashboard' className='text-xl font-bold'>
          WorkLog+
        </Link>
      </div>
      <nav className='flex-1 space-y-1 p-4'>
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <item.icon className='h-4 w-4' />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {isAdmin && (
        <div className='border-t p-4'>
          <p className='mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground'>
            관리
          </p>
          <div className='space-y-1'>
            {adminNavigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <item.icon className='h-4 w-4' />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
