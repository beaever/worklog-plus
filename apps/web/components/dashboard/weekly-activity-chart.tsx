'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@worklog-plus/ui';
import { useWeeklyActivity } from '@/hooks/use-dashboard';

export function WeeklyActivityChart() {
  const { data, isLoading } = useWeeklyActivity();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>주간 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px] animate-pulse rounded-lg bg-muted' />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>주간 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-[300px] items-center justify-center text-sm text-muted-foreground'>
            데이터가 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>주간 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data || []}>
              <defs>
                <linearGradient id='colorWorklogs' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='hsl(var(--primary))'
                    stopOpacity={0.3}
                  />
                  <stop
                    offset='95%'
                    stopColor='hsl(var(--primary))'
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id='colorHours' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='hsl(var(--chart-2))'
                    stopOpacity={0.3}
                  />
                  <stop
                    offset='95%'
                    stopColor='hsl(var(--chart-2))'
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
              <XAxis
                dataKey='day'
                className='text-xs'
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className='text-xs'
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type='monotone'
                dataKey='worklogs'
                name='업무일지'
                stroke='hsl(var(--primary))'
                fillOpacity={1}
                fill='url(#colorWorklogs)'
              />
              <Area
                type='monotone'
                dataKey='hours'
                name='작업시간(h)'
                stroke='hsl(var(--chart-2))'
                fillOpacity={1}
                fill='url(#colorHours)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
