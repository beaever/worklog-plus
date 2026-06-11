'use client';

import { StatCard as StatCardCompound } from '@worklog-plus/components';
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

export function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <StatCardCompound>
      <StatCardCompound.Header>
        <StatCardCompound.Label>{title}</StatCardCompound.Label>
        <StatCardCompound.Icon icon={icon} />
      </StatCardCompound.Header>
      <StatCardCompound.Value>{value}</StatCardCompound.Value>
      <StatCardCompound.Footer
        trend={trend ? (trend.isPositive ? trend.value : -trend.value) : undefined}
        description={description}
      />
    </StatCardCompound>
  );
}
