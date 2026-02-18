'use client';

import { useQuery } from '@tanstack/react-query';

/** 대시보드 통계 데이터 타입 */
interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  weeklyWorklogs: number;
  weeklyWorklogsChange: number;
  totalHours: string;
  totalHoursChange: number;
  completedProjects: number;
}

/** 주간 활동 데이터 타입 */
interface WeeklyActivity {
  day: string;
  worklogs: number;
  hours: number;
}

/** 프로젝트 분포 데이터 타입 */
interface ProjectDistribution {
  name: string;
  value: number;
}

/** 월별 추이 데이터 타입 */
interface MonthlyTrend {
  month: string;
  worklogs: number;
  hours: number;
}

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
      return {
        totalProjects: 12,
        activeProjects: 8,
        weeklyWorklogs: 24,
        weeklyWorklogsChange: 12,
        totalHours: '156h',
        totalHoursChange: 8,
        completedProjects: 4,
      };
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
      const days = ['월', '화', '수', '목', '금', '토', '일'];
      return days.map((day) => ({
        day,
        worklogs: Math.floor(Math.random() * 10) + 1,
        hours: Math.floor(Math.random() * 8) + 1,
      }));
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
      return [
        { name: 'WorkLog+ 백엔드', value: 35 },
        { name: 'WorkLog+ 프론트엔드', value: 28 },
        { name: '모바일 앱', value: 18 },
        { name: 'API 문서화', value: 12 },
        { name: '기타', value: 7 },
      ];
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
      const months = ['1월', '2월', '3월', '4월', '5월', '6월'];
      return months.map((month) => ({
        month,
        worklogs: Math.floor(Math.random() * 50) + 20,
        hours: Math.floor(Math.random() * 100) + 50,
      }));
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
  return useQuery({
    queryKey: ['dashboard', 'recent-worklogs'],
    queryFn: async () => {
      return [
        {
          id: '1',
          title: 'API 인증 모듈 구현',
          projectName: 'WorkLog+ 백엔드',
          date: new Date().toISOString().slice(0, 10),
          duration: 4,
        },
        {
          id: '2',
          title: '데이터베이스 스키마 설계',
          projectName: 'WorkLog+ 백엔드',
          date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
          duration: 3,
        },
        {
          id: '3',
          title: '프론트엔드 컴포넌트 개발',
          projectName: 'WorkLog+ 프론트엔드',
          date: new Date(Date.now() - 172800000).toISOString().slice(0, 10),
          duration: 5,
        },
      ];
    },
    staleTime: 30 * 1000,
  });
}
