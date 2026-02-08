'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@worklog-plus/ui';
import { ListTodo, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import type { ProjectKPI } from '@worklog-plus/types';

interface ProjectKPICardsProps {
  kpi: ProjectKPI;
}

const kpiConfig = [
  {
    key: 'totalTasks' as const,
    title: '전체 작업',
    icon: ListTodo,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    key: 'completedTasks' as const,
    title: '완료',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    key: 'inProgressTasks' as const,
    title: '진행중',
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    key: 'delayedTasks' as const,
    title: '지연',
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

export function ProjectKPICards({ kpi }: ProjectKPICardsProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {kpiConfig.map(({ key, title, icon: Icon, color, bgColor }) => (
        <Card key={key}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{title}</CardTitle>
            <div className={`rounded-md p-2 ${bgColor}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{kpi[key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
