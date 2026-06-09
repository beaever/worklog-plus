'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@worklog-plus/ui';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';

// 알림은 별도 테이블 없이 activity_logs를 재활용하므로 읽음 상태는 클라이언트 localStorage로 관리한다.
const STORAGE_KEY = 'worklog:read-notifications';

function loadReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

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
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: notifications = [], isLoading, isError } = useNotifications();

  useEffect(() => {
    setReadIds(loadReadIds());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const persist = (ids: Set<string>) => {
    setReadIds(new Set(ids));
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    } catch {
      // localStorage 접근 실패 시 메모리 상태만 유지한다.
    }
  };

  const markRead = (id: string) => {
    if (readIds.has(id)) return;
    const next = new Set(readIds);
    next.add(id);
    persist(next);
  };

  const markAllRead = () => {
    const next = new Set(readIds);
    notifications.forEach((n) => next.add(n.id));
    persist(next);
  };

  const hasItems = notifications.length > 0;
  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  return (
    <div className='relative' ref={menuRef}>
      <Button
        variant='ghost'
        size='icon'
        title='알림'
        onClick={() => setIsOpen((v) => !v)}
      >
        <Bell className='h-5 w-5' />
        {unreadCount > 0 && (
          <span className='absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-destructive-foreground'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className='absolute right-0 top-full z-50 mt-2 w-80 origin-top-right animate-scale-in rounded-md border bg-card shadow-lg'>
          <div className='flex items-center justify-between border-b px-3 py-2'>
            <p className='text-sm font-medium'>알림</p>
            {unreadCount > 0 && (
              <button
                type='button'
                onClick={markAllRead}
                className='flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground'
              >
                <CheckCheck className='h-3.5 w-3.5' />
                모두 읽음
              </button>
            )}
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
              {notifications.map((n) => {
                const isRead = readIds.has(n.id);
                return (
                  <li key={n.id}>
                    <button
                      type='button'
                      onClick={() => markRead(n.id)}
                      className='flex w-full items-start gap-2 px-3 py-2 text-left transition-colors hover:bg-accent'
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          isRead ? 'bg-transparent' : 'bg-primary'
                        }`}
                        aria-hidden
                      />
                      <span className='min-w-0 flex-1'>
                        <span
                          className={`line-clamp-2 block text-sm ${
                            isRead
                              ? 'text-muted-foreground'
                              : 'font-medium text-foreground'
                          }`}
                        >
                          {n.description}
                        </span>
                        <span className='mt-0.5 block text-xs text-muted-foreground'>
                          {n.actorName ? `${n.actorName} · ` : ''}
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
