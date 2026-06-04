export * from './user';
export * from './project';
export * from './worklog';
export * from './common';
export * from './auth';
export * from './admin';
export * from './validation';
export * from './database.types';

// WorklogWithRelations: 목록 응답에 포함되는 확장 타입
export interface WorklogWithRelations {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string };
  user?: { id: string; name: string; avatarUrl?: string };
}

// ProjectWithRelations: 상세 응답에 포함되는 확장 타입
export interface ProjectWithRelations {
  id: string;
  name: string;
  description?: string;
  status: import('./project').ProjectStatus;
  startDate: string;
  endDate?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: { id: string; name: string; avatarUrl?: string };
  memberCount?: number;
  worklogCount?: number;
}
