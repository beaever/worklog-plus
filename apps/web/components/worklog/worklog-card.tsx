'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, Badge, Button } from '@worklog/ui';
import { Calendar, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { Worklog } from '@worklog/types';

interface WorklogCardProps {
  worklog: Worklog;
  projectName: string;
  onEdit?: () => void;
  onDelete?: () => void;
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
  onEdit,
  onDelete,
}: WorklogCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    router.push(`/worklogs/${worklog.id}`);
  };

  return (
    <Card
      className='transition-shadow hover:shadow-md cursor-pointer'
      onClick={handleCardClick}
    >
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <h3 className='font-semibold leading-none'>{worklog.title}</h3>
            <Badge variant='secondary' className='text-xs'>
              {projectName}
            </Badge>
          </div>
          <div className='relative'>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreVertical className='h-4 w-4' />
            </Button>
            {showMenu && (
              <>
                <div
                  className='fixed inset-0 z-10'
                  onClick={() => setShowMenu(false)}
                />
                <div className='absolute right-0 top-full z-20 mt-1 w-32 rounded-md border bg-popover p-1 shadow-md'>
                  <button
                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent'
                    onClick={() => {
                      setShowMenu(false);
                      onEdit?.();
                    }}
                  >
                    <Edit className='h-4 w-4' />
                    수정
                  </button>
                  <button
                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent'
                    onClick={() => {
                      setShowMenu(false);
                      onDelete?.();
                    }}
                  >
                    <Trash2 className='h-4 w-4' />
                    삭제
                  </button>
                </div>
              </>
            )}
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
