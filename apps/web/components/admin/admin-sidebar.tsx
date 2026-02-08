'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Shield, Settings, FileText, ArrowLeft } from 'lucide-react';
import { cn } from '@worklog/ui';
import { useUserStore } from '@worklog/store';
import type { UserRole } from '@worklog/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navigation: NavItem[] = [
  {
    href: '/admin/users',
    label: '사용자 관리',
    icon: Users,
    roles: ['SYSTEM_ADMIN', 'ADMIN'],
  },
  {
    href: '/admin/roles',
    label: '권한 & 역할',
    icon: Shield,
    roles: ['SYSTEM_ADMIN'],
  },
  {
    href: '/admin/settings',
    label: '시스템 설정',
    icon: Settings,
    roles: ['SYSTEM_ADMIN'],
  },
  {
    href: '/admin/audit-logs',
    label: 'Audit Logs',
    icon: FileText,
    roles: ['SYSTEM_ADMIN', 'ADMIN'],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUserStore();

  const filteredNavigation = navigation.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <aside className='hidden w-64 flex-col border-r bg-card lg:flex'>
      <div className='flex h-16 items-center border-b px-6'>
        <Link href='/admin' className='text-lg font-bold'>
          Admin
        </Link>
      </div>
      <nav className='flex-1 space-y-1 p-4'>
        {filteredNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className='h-4 w-4' />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className='border-t p-4'>
        <Link
          href='/dashboard'
          className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
        >
          <ArrowLeft className='h-4 w-4' />
          대시보드로 돌아가기
        </Link>
      </div>
    </aside>
  );
}
