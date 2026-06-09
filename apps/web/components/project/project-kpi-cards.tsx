'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@worklog-plus/ui';
import { FileText, Clock, CalendarDays, Users } from 'lucide-react';
import type { ProjectKPI } from '@worklog-plus/types';

interface ProjectKPICardsProps {
  kpi: ProjectKPI;
}

const kpiConfig = [
  {
    key: 'totalWorklogs' as const,
    title: '전체 업무일지',
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    suffix: '',
  },
  {
    key: 'totalHours' as const,
    title: '총 작업시간',
    icon: Clock,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    suffix: 'h',
  },
  {
    key: 'thisWeekWorklogs' as const,
    title: '이번 주',
    icon: CalendarDays,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    suffix: '',
  },
  {
    key: 'memberCount' as const,
    title: '참여 멤버',
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    suffix: '명',
  },
];

export function ProjectKPICards({ kpi }: ProjectKPICardsProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {kpiConfig.map(({ key, title, icon: Icon, color, bgColor, suffix }) => (
        <Card key={key}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{title}</CardTitle>
            <div className={`rounded-md p-2 ${bgColor}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {kpi[key]}
              {suffix && (
                <span className='ml-1 text-base font-medium text-muted-foreground'>
                  {suffix}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
