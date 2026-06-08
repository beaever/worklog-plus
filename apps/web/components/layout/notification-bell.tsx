'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@worklog-plus/ui';
import { Bell, BellOff } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: notifications = [], isLoading, isError } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasItems = notifications.length > 0;

  return (
    <div className='relative' ref={menuRef}>
      <Button
        variant='ghost'
        size='icon'
        title='알림'
        onClick={() => setIsOpen((v) => !v)}
      >
        <Bell className='h-5 w-5' />
        {hasItems && (
          <span className='absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive' />
        )}
      </Button>

      {isOpen && (
        <div className='absolute right-0 top-full mt-2 w-80 rounded-md border bg-card shadow-lg'>
          <div className='border-b px-3 py-2'>
            <p className='text-sm font-medium'>알림</p>
          </div>

          {isLoading ? (
            <p className='px-3 py-8 text-center text-sm text-muted-foreground'>
              불러오는 중...
            </p>
          ) : isError ? (
            <p className='px-3 py-8 text-center text-sm text-destructive'>
              알림을 불러오지 못했습니다
            </p>
          ) : !hasItems ? (
            <div className='flex flex-col items-center gap-2 px-3 py-8 text-center'>
              <BellOff className='h-6 w-6 text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>알림이 없습니다</p>
            </div>
          ) : (
            <ul className='max-h-96 divide-y overflow-y-auto'>
              {notifications.map((n) => (
                <li key={n.id} className='px-3 py-2 hover:bg-accent'>
                  <p className='line-clamp-2 text-sm'>{n.description}</p>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    {n.actorName ? `${n.actorName} · ` : ''}
                    {formatRelativeTime(n.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
