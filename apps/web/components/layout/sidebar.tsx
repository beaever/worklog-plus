'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@worklog-plus/ui';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { name: '프로젝트', href: '/projects', icon: FolderOpen },
  { name: '업무일지', href: '/worklogs', icon: FileText },
  { name: '설정', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

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
    </aside>
  );
}
