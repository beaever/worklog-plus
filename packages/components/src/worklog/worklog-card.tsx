'use client';

import { Card, CardHeader, CardContent, Badge } from '@worklog/ui';
import { Calendar, Clock } from 'lucide-react';
import type { Worklog } from '@worklog/types';

interface WorklogCardProps {
  worklog: Worklog;
  projectName: string;
  onClick?: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return '오늘';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return '어제';
  }

  return date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}분`;
  }
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) {
    return `${h}시간`;
  }
  return `${h}시간 ${m}분`;
}

export function WorklogCard({
  worklog,
  projectName,
  onClick,
}: WorklogCardProps) {
  return (
    <Card
      className='cursor-pointer transition-shadow hover:shadow-md'
      onClick={onClick}
    >
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <h3 className='font-semibold leading-none'>{worklog.title}</h3>
            <Badge variant='secondary' className='text-xs'>
              {projectName}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className='mb-3 text-sm text-muted-foreground line-clamp-2'>
          {worklog.content}
        </p>
        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <Calendar className='h-3.5 w-3.5' />
            <span>{formatDate(worklog.date)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='h-3.5 w-3.5' />
            <span>{formatDuration(worklog.duration)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
