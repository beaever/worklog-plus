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
  'id' | 'name' | 'status' | 'updatedAt'
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

export interface ProjectKPI {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  delayedTasks: number;
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
