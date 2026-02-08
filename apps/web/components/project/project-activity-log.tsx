'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from '@worklog-plus/ui';
import { User } from 'lucide-react';
import type { ActivityLog } from '@worklog-plus/types';

interface ProjectActivityLogProps {
  activities: ActivityLog[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ProjectActivityLog({
  activities,
  hasMore = false,
  onLoadMore,
  isLoading = false,
}: ProjectActivityLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>활동 로그</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {activities.map((activity) => (
            <div
              key={activity.id}
              className='flex items-start gap-3 rounded-lg border p-3'
            >
              {/* Avatar */}
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
                {activity.actor.avatar ? (
                  <img
                    src={activity.actor.avatar}
                    alt={activity.actor.name}
                    className='h-8 w-8 rounded-full'
                  />
                ) : (
                  <User className='h-4 w-4 text-muted-foreground' />
                )}
              </div>

              {/* Content */}
              <div className='flex-1 space-y-1'>
                <p className='text-sm'>
                  <span className='font-medium'>{activity.actor.name}</span>
                  <span className='text-muted-foreground'>님이 </span>
                  {activity.action}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {formatRelativeTime(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <p className='text-center text-sm text-muted-foreground py-4'>
              아직 활동 내역이 없습니다
            </p>
          )}

          {hasMore && onLoadMore && (
            <div className='flex justify-center pt-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={onLoadMore}
                disabled={isLoading}
              >
                {isLoading ? '로딩 중...' : '더 보기'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
