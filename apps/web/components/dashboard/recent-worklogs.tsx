'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@worklog-plus/ui';
import { FileText, Clock } from 'lucide-react';
import { useRecentWorklogs } from '@/hooks/use-dashboard';

export function RecentWorklogs() {
  const { data: recentWorklogs, isLoading } = useRecentWorklogs();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>최근 업무일지</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-16 animate-pulse rounded-lg bg-muted' />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recentWorklogs || recentWorklogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>최근 업무일지</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-32 items-center justify-center text-sm text-muted-foreground'>
            최근 업무일지가 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 업무일지</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {(recentWorklogs || []).map((worklog) => (
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
                  {worklog.projectName}
                </p>
              </div>
              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                <Clock className='h-3 w-3' />
                <span>{worklog.duration}h</span>
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
