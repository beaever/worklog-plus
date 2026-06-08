// 대시보드 집계 응답 타입. /api/dashboard/* Route Handler가 반환한다.

// 대시보드 통계 카드
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  weeklyWorklogs: number;
  weeklyWorklogsChange: number;
  totalHours: string;
  totalHoursChange: number;
  completedProjects: number;
}

// 요일별 활동량
export interface WeeklyActivity {
  day: string;
  worklogs: number;
  hours: number;
}

// 프로젝트 상태 분포(파이 차트용)
export interface ProjectDistribution {
  name: string;
  value: number;
}

// 월별 추이
export interface MonthlyTrend {
  month: string;
  worklogs: number;
  hours: number;
}

// 최근 업무일지 목록 항목
export interface RecentWorklog {
  id: string;
  title: string;
  projectName: string;
  date: string;
  duration: number;
}
