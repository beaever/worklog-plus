'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@worklog-plus/ui';
import type {
  ProjectHealth,
  ProjectProgress as ProjectProgressType,
} from '@worklog-plus/types';

interface ProjectProgressProps {
  progress: ProjectProgressType;
}

// 진행률 막대 색상(공수 실적률 구간 기준)
function getBarColor(status: ProjectProgressType['status']): string {
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

// 일정 대비 건강도 배지 표현
const healthBadge: Record<ProjectHealth, { label: string; className: string }> = {
  DONE: { label: '완료', className: 'bg-green-100 text-green-700' },
  AHEAD: { label: '앞섬', className: 'bg-blue-100 text-blue-700' },
  ON_TRACK: { label: '정상', className: 'bg-green-100 text-green-700' },
  BEHIND: { label: '지연', className: 'bg-red-100 text-red-700' },
  UNKNOWN: { label: '판단 불가', className: 'bg-gray-100 text-gray-600' },
};

export function ProjectProgress({ progress }: ProjectProgressProps) {
  const {
    percentage,
    status,
    loggedHours,
    estimatedHours,
    scheduleElapsed,
    health,
  } = progress;
  const hasEstimate = percentage !== null;
  const badge = healthBadge[health];

  return (
    <Card>
      <CardHeader>
        <CardTitle>진행률</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          {hasEstimate ? (
            <span className='text-4xl font-bold'>{percentage}%</span>
          ) : (
            <span className='text-lg font-medium text-muted-foreground'>
              예상 공수 미설정
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>

        <div className='h-3 w-full rounded-full bg-secondary'>
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(status)}`}
            style={{ width: `${percentage ?? 0}%` }}
          />
        </div>

        {hasEstimate ? (
          <div className='space-y-1 text-sm text-muted-foreground'>
            <p>
              누적 {loggedHours}h
              {estimatedHours != null && <> / 목표 {estimatedHours}h</>}
            </p>
            {scheduleElapsed !== null && (
              <p>일정 경과 {scheduleElapsed}% 대비 산정한 진척도입니다</p>
            )}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>
            프로젝트 수정에서 예상 공수(시간)를 입력하면 진행률이 계산됩니다 (현재 누적 {loggedHours}h)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
