'use client';

import * as React from 'react';
import { Card, CardHeader, CardContent } from '@worklog-plus/ui';
import type { LucideIcon } from 'lucide-react';

// 서브컴포넌트들

function StatCardRoot({ children }: { children?: React.ReactNode }) {
  return (
    <Card className='transition-all duration-200 hover:border-primary/30 hover:shadow-md'>
      {children}
    </Card>
  );
}

function StatCardHeader({ children }: { children?: React.ReactNode }) {
  return (
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      {children}
    </CardHeader>
  );
}

function StatCardIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className='h-4 w-4 text-muted-foreground' />;
}

function StatCardLabel({ children }: { children?: React.ReactNode }) {
  return <h3 className='text-sm font-medium text-muted-foreground'>{children}</h3>;
}

function StatCardValue({ children }: { children?: React.ReactNode }) {
  return (
    <CardContent>
      <div className='text-2xl font-bold'>{children}</div>
    </CardContent>
  );
}

function StatCardTrend({ value }: { value: number }) {
  const isPositive = value > 0;
  const isZero = value === 0;

  const colorClass = isZero
    ? 'text-muted-foreground'
    : isPositive
      ? 'text-green-600'
      : 'text-red-600';

  const display = isPositive ? `+${value}%` : isZero ? '0%' : `${value}%`;

  return (
    <p className='text-xs text-muted-foreground'>
      <span className={colorClass}>{display}</span>
    </p>
  );
}

// 컴파운드 패턴 조합
export const StatCard = Object.assign(StatCardRoot, {
  Header: StatCardHeader,
  Icon: StatCardIcon,
  Label: StatCardLabel,
  Value: StatCardValue,
  Trend: StatCardTrend,
});
