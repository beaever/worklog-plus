'use client';

import * as React from 'react';
import { Card, CardHeader, CardContent, CardFooter, Badge } from '@worklog-plus/ui';
import { Calendar, Clock } from 'lucide-react';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return '오늘';
  if (date.toDateString() === yesterday.toDateString()) return '어제';

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
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

// 서브컴포넌트들

interface WorklogCardRootProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function WorklogCardRoot({ children, onClick, className }: WorklogCardRootProps) {
  return (
    <Card
      role='article'
      className={`cursor-pointer transition-shadow hover:shadow-md ${className ?? ''}`}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}

function WorklogCardHeader({ children }: { children?: React.ReactNode }) {
  return (
    <CardHeader className='pb-2'>
      <div className='flex items-start justify-between space-y-1'>{children}</div>
    </CardHeader>
  );
}

function WorklogCardTitle({ children }: { children?: React.ReactNode }) {
  return <h3 className='font-semibold leading-none'>{children}</h3>;
}

function WorklogCardProject({ name }: { name: string }) {
  return (
    <Badge variant='secondary' className='text-xs'>
      {name}
    </Badge>
  );
}

function WorklogCardContent({ children }: { children?: React.ReactNode }) {
  return (
    <CardContent>
      <p className='mb-3 text-sm text-muted-foreground line-clamp-2'>{children}</p>
    </CardContent>
  );
}

function WorklogCardMeta({ children }: { children?: React.ReactNode }) {
  return (
    <CardFooter className='pt-0'>
      <div className='flex items-center gap-4 text-xs text-muted-foreground'>{children}</div>
    </CardFooter>
  );
}

function WorklogCardDate({ date }: { date: string }) {
  return (
    <div className='flex items-center gap-1'>
      <Calendar className='h-3.5 w-3.5' />
      <span>{formatDate(date)}</span>
    </div>
  );
}

function WorklogCardDuration({ hours }: { hours: number }) {
  return (
    <div className='flex items-center gap-1'>
      <Clock className='h-3.5 w-3.5' />
      <span>{formatDuration(hours)}</span>
    </div>
  );
}

// 컴파운드 패턴 조합
export const WorklogCard = Object.assign(WorklogCardRoot, {
  Header: WorklogCardHeader,
  Title: WorklogCardTitle,
  Project: WorklogCardProject,
  Content: WorklogCardContent,
  Meta: WorklogCardMeta,
  Date: WorklogCardDate,
  Duration: WorklogCardDuration,
});
