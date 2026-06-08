'use client';

import { useQuery } from '@tanstack/react-query';
import type { NotificationItem } from '@/lib/notifications';

async function fetchNotifications(): Promise<NotificationItem[]> {
  const response = await fetch('/api/notifications');
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error || '알림을 불러오지 못했습니다',
    );
  }
  return (await response.json()) as NotificationItem[];
}

export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 30 * 1000,
  });
}
