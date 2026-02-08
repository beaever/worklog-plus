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

const data = [
  { day: '월', worklogs: 4, hours: 8 },
  { day: '화', worklogs: 6, hours: 9 },
  { day: '수', worklogs: 5, hours: 7 },
  { day: '목', worklogs: 8, hours: 10 },
  { day: '금', worklogs: 7, hours: 8 },
  { day: '토', worklogs: 2, hours: 3 },
  { day: '일', worklogs: 1, hours: 2 },
];

export function WeeklyActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>주간 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data}>
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
