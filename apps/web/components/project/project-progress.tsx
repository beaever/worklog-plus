'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@worklog-plus/ui';
import type { ProjectProgress as ProjectProgressType } from '@worklog-plus/types';

interface ProjectProgressProps {
  progress: ProjectProgressType;
}

function getProgressColor(status: ProjectProgressType['status']): string {
  switch (status) {
    case 'LOW':
      return 'bg-red-500';
    case 'MEDIUM':
      return 'bg-yellow-500';
    case 'HIGH':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

function getProgressLabel(status: ProjectProgressType['status']): string {
  switch (status) {
    case 'LOW':
      return '주의 필요';
    case 'MEDIUM':
      return '진행중';
    case 'HIGH':
      return '순조로움';
    default:
      return '';
  }
}

export function ProjectProgress({ progress }: ProjectProgressProps) {
  const color = getProgressColor(progress.status);
  const label = getProgressLabel(progress.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle>진행률</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-4xl font-bold'>{progress.percentage}%</span>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              progress.status === 'LOW'
                ? 'bg-red-100 text-red-700'
                : progress.status === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
            }`}
          >
            {label}
          </span>
        </div>
        <div className='h-3 w-full rounded-full bg-secondary'>
          <div
            className={`h-full rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <p className='text-sm text-muted-foreground'>
          완료된 작업 기준으로 계산됩니다
        </p>
      </CardContent>
    </Card>
  );
}
