import { apiClient } from './client';
import type { ApiResponse } from '@worklog-plus/types';

/** 대시보드 통계 데이터 타입 */
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  weeklyWorklogs: number;
  weeklyWorklogsChange: number;
  totalHours: string;
  totalHoursChange: number;
  completedProjects: number;
}

/** 주간 활동 데이터 타입 */
export interface WeeklyActivity {
  day: string;
  worklogs: number;
  hours: number;
}

/** 프로젝트 분포 데이터 타입 */
export interface ProjectDistribution {
  name: string;
  value: number;
}

/** 월별 추이 데이터 타입 */
export interface MonthlyTrend {
  month: string;
  worklogs: number;
  hours: number;
}

/** 최근 업무일지 데이터 타입 */
export interface RecentWorklog {
  id: string;
  title: string;
  projectName: string;
  date: string;
  duration: number;
}

/**
 * 대시보드 API 클라이언트
 */
export const dashboardApi = {
  /**
   * 대시보드 통계 조회
   */
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  },

  /**
   * 주간 활동 데이터 조회
   */
  getWeeklyActivity: async (): Promise<ApiResponse<WeeklyActivity[]>> => {
    return apiClient.get<WeeklyActivity[]>('/dashboard/weekly-activity');
  },

  /**
   * 프로젝트 분포 데이터 조회
   */
  getProjectDistribution: async (): Promise<
    ApiResponse<ProjectDistribution[]>
  > => {
    return apiClient.get<ProjectDistribution[]>(
      '/dashboard/project-distribution',
    );
  },

  /**
   * 월별 추이 데이터 조회
   */
  getMonthlyTrend: async (): Promise<ApiResponse<MonthlyTrend[]>> => {
    return apiClient.get<MonthlyTrend[]>('/dashboard/monthly-trend');
  },

  /**
   * 최근 업무일지 조회
   */
  getRecentWorklogs: async (): Promise<ApiResponse<RecentWorklog[]>> => {
    return apiClient.get<RecentWorklog[]>('/dashboard/recent-worklogs');
  },
};
