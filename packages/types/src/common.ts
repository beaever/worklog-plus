export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// API 클라이언트가 반환하는 기본 응답 타입 (하위 호환 유지)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 엄격한 discriminated union (내부 사용)
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export type MemberAccess = 'NONE' | 'READ' | 'WRITE';

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  access: MemberAccess;
  joinedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface ActivityLogEntry {
  id: string;
  projectId?: string;
  userId?: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface PeriodStats {
  period: 'week' | 'month' | 'year';
  entries: Array<{
    label: string;
    worklogCount: number;
    durationHours: number;
  }>;
}
