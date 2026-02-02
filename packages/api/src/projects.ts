import type {
  Project,
  ProjectSummary,
  ProjectDashboard,
  ActivityLog,
  CreateProjectInput,
  UpdateProjectInput,
  PaginatedResponse,
  ProjectStatus,
} from '@worklog/types';
import { apiClient } from './client';

export interface ProjectListParams {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  search?: string;
}

export const projectsApi = {
  getAll: (params: ProjectListParams = {}) => {
    const { page = 1, limit = 10, status, search } = params;
    const queryParams: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (status) queryParams.status = status;
    if (search) queryParams.search = search;

    return apiClient.get<PaginatedResponse<ProjectSummary>>(
      '/projects',
      queryParams,
    );
  },

  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  create: (data: CreateProjectInput) =>
    apiClient.post<Project>('/projects', data),

  update: (id: string, data: UpdateProjectInput) =>
    apiClient.patch<Project>(`/projects/${id}`, data),

  delete: (id: string) => apiClient.delete<void>(`/projects/${id}`),

  getDashboard: (id: string) =>
    apiClient.get<ProjectDashboard>(`/projects/${id}/dashboard`),

  getActivities: (id: string, page = 1, limit = 20) =>
    apiClient.get<PaginatedResponse<ActivityLog>>(
      `/projects/${id}/activities`,
      {
        page: String(page),
        limit: String(limit),
      },
    ),
};
