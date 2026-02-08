'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@worklog-plus/ui';
import { Plus, RefreshCw, CheckCircle, FolderPlus } from 'lucide-react';
import type { TimelineEvent, TimelineEventType } from '@worklog-plus/types';

interface ProjectTimelineProps {
  events: TimelineEvent[];
}

const eventConfig: Record<
  TimelineEventType,
  { icon: typeof Plus; color: string; bgColor: string }
> = {
  CREATED: {
    icon: FolderPlus,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
  },
  STATUS_CHANGED: {
    icon: RefreshCw,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
  },
  TASK_ADDED: {
    icon: Plus,
    color: 'text-green-500',
    bgColor: 'bg-green-500',
  },
  TASK_DONE: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
  },
};

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
  });
}

export function ProjectTimeline({ events }: ProjectTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>타임라인</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='relative space-y-4'>
          {/* Vertical line */}
          <div className='absolute left-[11px] top-2 h-[calc(100%-16px)] w-0.5 bg-border' />

          {events.map((event) => {
            const config = eventConfig[event.type];
            const Icon = config.icon;

            return (
              <div key={event.id} className='relative flex gap-4 pl-8'>
                {/* Icon */}
                <div
                  className={`absolute left-0 flex h-6 w-6 items-center justify-center rounded-full ${config.bgColor}`}
                >
                  <Icon className='h-3 w-3 text-white' />
                </div>

                {/* Content */}
                <div className='flex-1 space-y-1'>
                  <p className='text-sm'>{event.description}</p>
                  <p className='text-xs text-muted-foreground'>
                    {formatRelativeTime(event.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}

          {events.length === 0 && (
            <p className='text-center text-sm text-muted-foreground py-4'>
              아직 활동 내역이 없습니다
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
