import { create } from "zustand";
import type { Project, ProjectSummary, ProjectStatus } from "@worklog/types";

interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
}

interface ProjectState {
  currentProjectId: string | null;
  currentProject: Project | null;
  projects: ProjectSummary[];
  filters: ProjectFilters;
  isLoading: boolean;

  setCurrentProjectId: (id: string | null) => void;
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: ProjectSummary[]) => void;
  addProject: (project: ProjectSummary) => void;
  updateProject: (id: string, data: Partial<ProjectSummary>) => void;
  removeProject: (id: string) => void;
  setFilters: (filters: ProjectFilters) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentProjectId: null,
  currentProject: null,
  projects: [],
  filters: {},
  isLoading: false,
};

export const useProjectStore = create<ProjectState>((set) => ({
  ...initialState,

  setCurrentProjectId: (id) => set({ currentProjectId: id }),

  setCurrentProject: (project) => set({ currentProject: project }),

  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),

  updateProject: (id, data) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
      currentProject:
        state.currentProject?.id === id
          ? { ...state.currentProject, ...data }
          : state.currentProject,
    })),

  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),

  setFilters: (filters) => set({ filters }),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () => set(initialState),
}));
