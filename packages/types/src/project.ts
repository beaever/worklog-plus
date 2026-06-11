export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'DONE';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  estimatedHours?: number;
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
  estimatedHours?: number;
  status: ProjectStatus;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  endDate?: string;
  estimatedHours?: number;
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

// 일정 대비 진척 건강도. DONE=완료, AHEAD=앞섬, ON_TRACK=정상, BEHIND=지연,
// UNKNOWN=판단불가(예상 공수 또는 마감일 미설정)
export type ProjectHealth =
  | 'DONE'
  | 'AHEAD'
  | 'ON_TRACK'
  | 'BEHIND'
  | 'UNKNOWN';

export interface ProjectProgress {
  // 메인 진행률: 누적 업무일지 시간 / 예상 공수. 예상 공수 미설정 시 null.
  percentage: number | null;
  // 진행률 막대 색상 구간
  status: 'LOW' | 'MEDIUM' | 'HIGH';
  loggedHours: number;
  estimatedHours: number | null;
  // 일정 경과율((오늘-시작)/(마감-시작)). 마감일 미설정 시 null.
  scheduleElapsed: number | null;
  health: ProjectHealth;
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
