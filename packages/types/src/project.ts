export type ProjectStatus = "ACTIVE" | "DONE" | "ARCHIVED";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary extends Pick<Project, "id" | "name" | "status"> {
  worklogCount: number;
}
