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

function trendDisplay(value: number): { text: string; colorClass: string } {
  const isPositive = value > 0;
  const isZero = value === 0;
  return {
    text: isPositive ? `+${value}%` : isZero ? '0%' : `${value}%`,
    colorClass: isZero
      ? 'text-muted-foreground'
      : isPositive
        ? 'text-green-600'
        : 'text-red-600',
  };
}

function StatCardTrend({ value }: { value: number }) {
  const { text, colorClass } = trendDisplay(value);
  return (
    <p className='text-xs text-muted-foreground'>
      <span className={colorClass}>{text}</span>
    </p>
  );
}

// 모든 카드가 동일한 높이를 갖도록 trend 유무와 무관하게 항상 렌더되는 푸터 행.
// trend가 있으면 변화율을, description이 있으면 설명을 한 줄에 함께 표시한다.
function StatCardFooter({
  trend,
  description,
}: {
  trend?: number | undefined;
  description?: string | undefined;
}) {
  const trendInfo = trend !== undefined ? trendDisplay(trend) : null;
  return (
    <CardContent className='pt-0'>
      <div className='flex min-h-5 items-center gap-1.5 text-xs text-muted-foreground'>
        {trendInfo && <span className={trendInfo.colorClass}>{trendInfo.text}</span>}
        {description && <span>{description}</span>}
      </div>
    </CardContent>
  );
}

// 컴파운드 패턴 조합
export const StatCard = Object.assign(StatCardRoot, {
  Header: StatCardHeader,
  Icon: StatCardIcon,
  Label: StatCardLabel,
  Value: StatCardValue,
  Trend: StatCardTrend,
  Footer: StatCardFooter,
});
