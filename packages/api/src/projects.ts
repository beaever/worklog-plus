import type { Project, ProjectSummary, PaginatedResponse } from "@worklog/types";
import { apiClient } from "./client";

export const projectsApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<PaginatedResponse<ProjectSummary>>("/projects", {
      page: String(page),
      limit: String(limit),
    }),

  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  create: (data: Omit<Project, "id" | "createdAt" | "updatedAt" | "ownerId">) =>
    apiClient.post<Project>("/projects", data),

  update: (id: string, data: Partial<Project>) =>
    apiClient.patch<Project>(`/projects/${id}`, data),

  delete: (id: string) => apiClient.delete<void>(`/projects/${id}`),
};
