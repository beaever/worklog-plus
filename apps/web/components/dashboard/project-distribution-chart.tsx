'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@worklog-plus/ui';

const data = [
  { name: '진행중', value: 8, color: 'hsl(var(--primary))' },
  { name: '완료', value: 4, color: 'hsl(var(--chart-2))' },
  { name: '대기', value: 3, color: 'hsl(var(--chart-3))' },
  { name: '보류', value: 1, color: 'hsl(var(--chart-4))' },
];

export function ProjectDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로젝트 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey='value'
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: 'hsl(var(--foreground))' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
