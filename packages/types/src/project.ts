export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'DONE';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary extends Pick<
  Project,
  'id' | 'name' | 'status' | 'updatedAt' | 'ownerId'
> {
  progress: number;
  worklogCount: number;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  endDate?: string;
}

// Dashboard Types
export interface ProjectDashboard {
  projectId: string;
  kpi: ProjectKPI;
  progress: ProjectProgress;
  timeline: TimelineEvent[];
  recentActivities: ActivityLog[];
}

// 데이터 모델에 Task 개념이 없어 KPI는 업무일지(worklogs) 기반 지표로 정의한다.
export interface ProjectKPI {
  totalWorklogs: number;
  totalHours: number;
  thisWeekWorklogs: number;
  memberCount: number;
}

export interface ProjectProgress {
  percentage: number;
  status: 'LOW' | 'MEDIUM' | 'HIGH';
}

export type TimelineEventType =
  | 'CREATED'
  | 'STATUS_CHANGED'
  | 'TASK_ADDED'
  | 'TASK_DONE';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityLog {
  id: string;
  action: string;
  actor: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}
