'use client';

import { Card, CardHeader, CardContent, Badge } from '@worklog-plus/ui';
import { FolderOpen, Clock } from 'lucide-react';
import type { ProjectSummary, ProjectStatus } from '@worklog-plus/types';

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  PLANNED: { label: '예정', variant: 'secondary' },
  ACTIVE: { label: '진행중', variant: 'default' },
  DONE: { label: '완료', variant: 'outline' },
};

interface ProjectCardProps {
  project: ProjectSummary;
  onClick?: () => void;
}

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

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { label, variant } = statusConfig[project.status];

  return (
    <Card
      className='cursor-pointer transition-shadow hover:shadow-md'
      onClick={onClick}
    >
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-2'>
            <FolderOpen className='h-5 w-5 text-primary' />
            <h3 className='font-semibold'>{project.name}</h3>
          </div>
          <Badge variant={variant}>{label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          <div className='space-y-1'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>진행률</span>
              <span className='font-medium'>{project.progress}%</span>
            </div>
            <div className='h-2 w-full rounded-full bg-secondary'>
              <div
                className='h-full rounded-full bg-primary transition-all'
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>업무일지 {project.worklogCount}개</span>
            <span className='flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              {formatRelativeTime(project.updatedAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
