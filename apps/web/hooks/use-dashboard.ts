'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@worklog-plus/api';
import type {
  DashboardStats,
  WeeklyActivity,
  ProjectDistribution,
  MonthlyTrend,
  RecentWorklog,
} from '@worklog-plus/api';

/**
 * 대시보드 통계 조회 query 훅
 *
 * @description
 * - 대시보드 메인 통계 데이터를 조회 (총 프로젝트, 주간 업무일지, 작업 시간 등)
 * - 60초간 캐시 유지
 *
 * @returns 대시보드 통계 쿼리 결과
 *
 * @example
 * const { data: stats, isLoading } = useDashboardStats();
 */
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await dashboardApi.getStats();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch dashboard stats');
      }
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * 주간 활동 데이터 조회 query 훅
 *
 * @description
 * - 요일별 업무일지 수와 작업 시간을 조회
 * - 차트 컴포넌트에서 사용
 * - 60초간 캐시 유지
 *
 * @returns 주간 활동 데이터 쿼리 결과
 *
 * @example
 * const { data: weeklyActivity } = useWeeklyActivity();
 */
export function useWeeklyActivity() {
  return useQuery<WeeklyActivity[]>({
    queryKey: ['dashboard', 'weekly-activity'],
    queryFn: async () => {
      const response = await dashboardApi.getWeeklyActivity();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch weekly activity');
      }
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * 프로젝트 분포 데이터 조회 query 훅
 *
 * @description
 * - 프로젝트별 업무일지 분포를 조회
 * - 파이 차트 컴포넌트에서 사용
 * - 60초간 캐시 유지
 *
 * @returns 프로젝트 분포 데이터 쿼리 결과
 *
 * @example
 * const { data: distribution } = useProjectDistribution();
 */
export function useProjectDistribution() {
  return useQuery<ProjectDistribution[]>({
    queryKey: ['dashboard', 'project-distribution'],
    queryFn: async () => {
      const response = await dashboardApi.getProjectDistribution();
      if (!response.success || !response.data) {
        throw new Error(
          response.error || 'Failed to fetch project distribution',
        );
      }
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * 월별 추이 데이터 조회 query 훅
 *
 * @description
 * - 최근 6개월간의 업무일지 수와 작업 시간 추이를 조회
 * - 막대 차트 컴포넌트에서 사용
 * - 60초간 캐시 유지
 *
 * @returns 월별 추이 데이터 쿼리 결과
 *
 * @example
 * const { data: trend } = useMonthlyTrend();
 */
export function useMonthlyTrend() {
  return useQuery<MonthlyTrend[]>({
    queryKey: ['dashboard', 'monthly-trend'],
    queryFn: async () => {
      const response = await dashboardApi.getMonthlyTrend();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch monthly trend');
      }
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * 최근 업무일지 조회 query 훅
 *
 * @description
 * - 최근 작성된 업무일지 목록을 조회 (최대 5개)
 * - 대시보드 하단에 표시
 * - 30초간 캐시 유지
 *
 * @returns 최근 업무일지 쿼리 결과
 *
 * @example
 * const { data: recentWorklogs } = useRecentWorklogs();
 */
export function useRecentWorklogs() {
  return useQuery<RecentWorklog[]>({
    queryKey: ['dashboard', 'recent-worklogs'],
    queryFn: async () => {
      const response = await dashboardApi.getRecentWorklogs();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch recent worklogs');
      }
      return response.data;
    },
    staleTime: 30 * 1000,
  });
}
