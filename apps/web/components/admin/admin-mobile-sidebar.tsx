'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Users, Shield, Settings, FileText, ArrowLeft } from 'lucide-react';
import { Button, cn } from '@worklog-plus/ui';
import { useUserStore } from '@worklog-plus/store';
import type { UserRole } from '@worklog-plus/types';

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export function AdminMobileSidebar({
  isOpen,
  onClose,
}: AdminMobileSidebarProps) {
  const pathname = usePathname();
  const { user } = useUserStore();

  const filteredNavigation = navigation.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false,
  );

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 lg:hidden'>
      <div className='fixed inset-0 bg-black/50' onClick={onClose} />
      <div className='fixed inset-y-0 left-0 w-64 bg-card'>
        <div className='flex h-16 items-center justify-between border-b px-6'>
          <span className='text-lg font-bold'>Admin</span>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='h-5 w-5' />
          </Button>
        </div>
        <nav className='flex-1 space-y-1 p-4'>
          {filteredNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
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
            onClick={onClose}
            className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
          >
            <ArrowLeft className='h-4 w-4' />
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
