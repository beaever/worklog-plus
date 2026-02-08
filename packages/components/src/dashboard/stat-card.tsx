'use client';

import { Card, CardHeader, CardContent } from '@worklog-plus/ui';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {(description || trend) && (
          <p className='text-xs text-muted-foreground'>
            {trend && (
              <span
                className={trend.isPositive ? 'text-green-600' : 'text-red-600'}
              >
                {trend.isPositive ? '+' : '-'}
                {trend.value}%{' '}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
