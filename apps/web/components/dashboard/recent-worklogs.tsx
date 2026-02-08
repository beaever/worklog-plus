'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@worklog-plus/ui';
import { FileText, Clock } from 'lucide-react';

const recentWorklogs = [
  {
    id: '1',
    title: 'API 엔드포인트 개발',
    project: 'WorkLog+ 백엔드',
    hours: 3,
    date: '오늘',
  },
  {
    id: '2',
    title: '대시보드 UI 구현',
    project: 'WorkLog+ 프론트엔드',
    hours: 4,
    date: '오늘',
  },
  {
    id: '3',
    title: '데이터베이스 스키마 설계',
    project: 'WorkLog+ 백엔드',
    hours: 2,
    date: '어제',
  },
  {
    id: '4',
    title: '사용자 인증 기능 구현',
    project: 'WorkLog+ 백엔드',
    hours: 5,
    date: '어제',
  },
  {
    id: '5',
    title: '코드 리뷰 및 피드백',
    project: 'WorkLog+ 공통',
    hours: 1,
    date: '2일 전',
  },
];

export function RecentWorklogs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 업무일지</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {recentWorklogs.map((worklog) => (
            <div
              key={worklog.id}
              className='flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-accent'
            >
              <div className='rounded-md bg-primary/10 p-2'>
                <FileText className='h-4 w-4 text-primary' />
              </div>
              <div className='flex-1 space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  {worklog.title}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {worklog.project}
                </p>
              </div>
              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                <Clock className='h-3 w-3' />
                <span>{worklog.hours}h</span>
              </div>
              <span className='text-xs text-muted-foreground'>
                {worklog.date}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
