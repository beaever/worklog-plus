'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@worklog-plus/ui';

const data = [
  { month: '1월', worklogs: 45, hours: 120 },
  { month: '2월', worklogs: 52, hours: 135 },
  { month: '3월', worklogs: 48, hours: 128 },
  { month: '4월', worklogs: 61, hours: 156 },
  { month: '5월', worklogs: 55, hours: 142 },
  { month: '6월', worklogs: 67, hours: 168 },
];

export function MonthlyTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>월별 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
              <XAxis
                dataKey='month'
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
              <Bar
                dataKey='worklogs'
                name='업무일지'
                fill='hsl(var(--primary))'
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey='hours'
                name='작업시간(h)'
                fill='hsl(var(--chart-2))'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
