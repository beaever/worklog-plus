import type {
  Worklog,
  WorklogCreateInput,
  WorklogUpdateInput,
  PaginatedResponse,
} from "@worklog/types";
import { apiClient } from "./client";

export const worklogsApi = {
  getAll: (projectId?: string, page = 1, limit = 10) => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (projectId) {
      params.projectId = projectId;
    }
    return apiClient.get<PaginatedResponse<Worklog>>("/worklogs", params);
  },

  getById: (id: string) => apiClient.get<Worklog>(`/worklogs/${id}`),

  create: (data: WorklogCreateInput) =>
    apiClient.post<Worklog>("/worklogs", data),

  update: (data: WorklogUpdateInput) =>
    apiClient.patch<Worklog>(`/worklogs/${data.id}`, data),

  delete: (id: string) => apiClient.delete<void>(`/worklogs/${id}`),
};
