'use client';

import { useQuery } from '@tanstack/react-query';
import type {
  DashboardStats,
  WeeklyActivity,
  ProjectDistribution,
  MonthlyTrend,
  RecentWorklog,
} from '@worklog-plus/api';

// 대시보드 데이터는 서버 Route Handler(/api/dashboard/*)에서 집계해 제공한다.
async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || '데이터를 불러오지 못했습니다');
  }
  return (await response.json()) as T;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => fetchJson<DashboardStats>('/api/dashboard/stats'),
    staleTime: 60 * 1000,
  });
}

export function useWeeklyActivity() {
  return useQuery<WeeklyActivity[]>({
    queryKey: ['dashboard', 'weekly-activity'],
    queryFn: () => fetchJson<WeeklyActivity[]>('/api/dashboard/weekly-activity'),
    staleTime: 60 * 1000,
  });
}

export function useProjectDistribution() {
  return useQuery<ProjectDistribution[]>({
    queryKey: ['dashboard', 'project-distribution'],
    queryFn: () =>
      fetchJson<ProjectDistribution[]>('/api/dashboard/project-distribution'),
    staleTime: 60 * 1000,
  });
}

export function useMonthlyTrend() {
  return useQuery<MonthlyTrend[]>({
    queryKey: ['dashboard', 'monthly-trend'],
    queryFn: () => fetchJson<MonthlyTrend[]>('/api/dashboard/monthly-trend'),
    staleTime: 60 * 1000,
  });
}

export function useRecentWorklogs() {
  return useQuery<RecentWorklog[]>({
    queryKey: ['dashboard', 'recent-worklogs'],
    queryFn: () => fetchJson<RecentWorklog[]>('/api/dashboard/recent-worklogs'),
    staleTime: 30 * 1000,
  });
}
