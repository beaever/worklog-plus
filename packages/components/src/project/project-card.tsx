'use client';

import * as React from 'react';
import { Card, CardHeader, CardContent, CardFooter, Badge } from '@worklog-plus/ui';
import { FolderOpen, Clock } from 'lucide-react';
import type { ProjectStatus } from '@worklog-plus/types';

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  PLANNED: { label: '예정', variant: 'secondary' },
  ACTIVE: { label: '진행중', variant: 'default' },
  DONE: { label: '완료', variant: 'outline' },
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  return `${Math.floor(diffDays / 30)}개월 전`;
}

// 서브컴포넌트들

interface ProjectCardRootProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function ProjectCardRoot({ children, onClick, className }: ProjectCardRootProps) {
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

function ProjectCardHeader({ children }: { children?: React.ReactNode }) {
  return (
    <CardHeader className='pb-2'>
      <div className='flex items-start justify-between gap-2'>{children}</div>
    </CardHeader>
  );
}

function ProjectCardIcon() {
  return <FolderOpen className='h-5 w-5 text-primary' />;
}

function ProjectCardTitle({ children }: { children?: React.ReactNode }) {
  return <h3 className='break-words font-semibold'>{children}</h3>;
}

function ProjectCardStatus({ status }: { status: ProjectStatus }) {
  const { label, variant } = statusConfig[status];
  // 제목이 여러 줄로 늘어나도 배지 크기가 변하지 않도록 축소/줄바꿈을 막는다.
  return (
    <Badge variant={variant} className='shrink-0 whitespace-nowrap'>
      {label}
    </Badge>
  );
}

function ProjectCardProgress({ value }: { value: number }) {
  return (
    <CardContent>
      <div className='space-y-1'>
        <div className='flex justify-between text-sm'>
          <span className='text-muted-foreground'>진행률</span>
          <span className='font-medium'>{value}%</span>
        </div>
        <div className='h-2 w-full rounded-full bg-secondary'>
          <div
            className='h-full rounded-full bg-primary transition-all'
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </CardContent>
  );
}

function ProjectCardFooter({ children }: { children?: React.ReactNode }) {
  return (
    <CardFooter className='pt-0'>
      <div className='flex items-center justify-between w-full text-xs text-muted-foreground'>
        {children}
      </div>
    </CardFooter>
  );
}

function ProjectCardCount({ count }: { count: number }) {
  return <span>업무일지 {count}개</span>;
}

function ProjectCardUpdatedAt({ date }: { date: string }) {
  return (
    <span className='flex items-center gap-1'>
      <Clock className='h-3 w-3' />
      {formatRelativeTime(date)}
    </span>
  );
}

// 컴파운드 패턴 조합 (Object.assign)
export const ProjectCard = Object.assign(ProjectCardRoot, {
  Header: ProjectCardHeader,
  Icon: ProjectCardIcon,
  Title: ProjectCardTitle,
  Status: ProjectCardStatus,
  Progress: ProjectCardProgress,
  Footer: ProjectCardFooter,
  Count: ProjectCardCount,
  UpdatedAt: ProjectCardUpdatedAt,
});
