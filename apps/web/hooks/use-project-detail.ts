'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  Project,
  ProjectKPI,
  ProjectProgress,
  TimelineEvent,
  ActivityLog,
  UpdateProjectInput,
} from '@worklog/types';

// Mock data - API 연동 시 제거
const mockProject: Project = {
  id: '1',
  name: 'WorkLog+ 백엔드',
  description: 'WorkLog+ 서비스의 백엔드 API 개발 프로젝트',
  status: 'ACTIVE',
  startDate: '2024-01-15',
  endDate: '2024-06-30',
  ownerId: 'user-1',
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockKPI: ProjectKPI = {
  totalTasks: 48,
  completedTasks: 31,
  inProgressTasks: 12,
  delayedTasks: 5,
};

const mockProgress: ProjectProgress = {
  percentage: 65,
  status: 'MEDIUM',
};

const mockTimeline: TimelineEvent[] = [
  {
    id: 't1',
    type: 'TASK_DONE',
    description: 'API 인증 모듈 구현 완료',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 't2',
    type: 'TASK_ADDED',
    description: '데이터베이스 마이그레이션 작업 추가',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 't3',
    type: 'STATUS_CHANGED',
    description: "프로젝트 상태가 '진행중'으로 변경됨",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 't4',
    type: 'TASK_DONE',
    description: '프로젝트 초기 설정 완료',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 't5',
    type: 'CREATED',
    description: '프로젝트가 생성됨',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
];

const mockActivities: ActivityLog[] = [
  {
    id: 'a1',
    action: 'API 인증 모듈 구현을 완료했습니다',
    actor: { id: 'user-1', name: '김개발' },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'a2',
    action: '새 작업을 추가했습니다',
    actor: { id: 'user-2', name: '이기획' },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'a3',
    action: '프로젝트 설명을 수정했습니다',
    actor: { id: 'user-1', name: '김개발' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'a4',
    action: '프로젝트 상태를 변경했습니다',
    actor: { id: 'user-3', name: '박매니저' },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

interface UseProjectDetailOptions {
  projectId: string;
}

interface UseProjectDetailReturn {
  project: Project | null;
  kpi: ProjectKPI | null;
  progress: ProjectProgress | null;
  timeline: TimelineEvent[];
  activities: ActivityLog[];
  isLoading: boolean;
  error: Error | null;
  hasMoreActivities: boolean;
  updateProject: (data: UpdateProjectInput) => Promise<void>;
  deleteProject: () => Promise<void>;
  loadMoreActivities: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useProjectDetail({
  projectId,
}: UseProjectDetailOptions): UseProjectDetailReturn {
  const [project, setProject] = useState<Project | null>(null);
  const [kpi, setKpi] = useState<ProjectKPI | null>(null);
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMoreActivities, setHasMoreActivities] = useState(true);
  const [_activitiesPage, setActivitiesPage] = useState(1);

  const fetchProjectData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: API 연동 시 아래 주석 해제
      // const [projectRes, dashboardRes] = await Promise.all([
      //   projectsApi.getById(projectId),
      //   projectsApi.getDashboard(projectId),
      // ]);
      // if (projectRes.success) setProject(projectRes.data);
      // if (dashboardRes.success) {
      //   setKpi(dashboardRes.data.kpi);
      //   setProgress(dashboardRes.data.progress);
      //   setTimeline(dashboardRes.data.timeline);
      //   setActivities(dashboardRes.data.recentActivities);
      // }

      // Mock 데이터 사용
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProject(mockProject);
      setKpi(mockKPI);
      setProgress(mockProgress);
      setTimeline(mockTimeline);
      setActivities(mockActivities);
      setHasMoreActivities(true);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch project'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const updateProject = useCallback(
    async (data: UpdateProjectInput) => {
      // TODO: API 연동 시 아래 주석 해제
      // const response = await projectsApi.update(projectId, data);
      // if (response.success) {
      //   setProject(response.data);
      //   // 타임라인에 상태 변경 이벤트 추가
      //   if (data.status && project?.status !== data.status) {
      //     const newEvent: TimelineEvent = {
      //       id: `t-${Date.now()}`,
      //       type: 'STATUS_CHANGED',
      //       description: `프로젝트 상태가 '${data.status}'로 변경됨`,
      //       createdAt: new Date().toISOString(),
      //     };
      //     setTimeline((prev) => [newEvent, ...prev]);
      //   }
      // }

      // Mock 업데이트
      if (project) {
        const updatedProject = {
          ...project,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        setProject(updatedProject);

        // 상태 변경 시 타임라인 이벤트 추가
        if (data.status && project.status !== data.status) {
          const statusLabels: Record<string, string> = {
            PLANNED: '예정',
            ACTIVE: '진행중',
            DONE: '완료',
          };
          const newEvent: TimelineEvent = {
            id: `t-${Date.now()}`,
            type: 'STATUS_CHANGED',
            description: `프로젝트 상태가 '${statusLabels[data.status] ?? data.status}'로 변경됨`,
            createdAt: new Date().toISOString(),
          };
          setTimeline((prev) => [newEvent, ...prev]);
        }

        // 활동 로그 추가
        const newActivity: ActivityLog = {
          id: `a-${Date.now()}`,
          action: '프로젝트 정보를 수정했습니다',
          actor: { id: 'user-1', name: '나' },
          createdAt: new Date().toISOString(),
        };
        setActivities((prev) => [newActivity, ...prev]);
      }
    },
    [project],
  );

  const deleteProject = useCallback(async () => {
    // TODO: API 연동 시 아래 주석 해제
    // await projectsApi.delete(projectId);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }, []);

  const loadMoreActivities = useCallback(async () => {
    if (!hasMoreActivities) return;

    // TODO: API 연동 시 아래 주석 해제
    // const response = await projectsApi.getActivities(projectId, activitiesPage + 1);
    // if (response.success) {
    //   setActivities((prev) => [...prev, ...response.data.items]);
    //   setHasMoreActivities(response.data.hasMore);
    //   setActivitiesPage((prev) => prev + 1);
    // }

    // Mock: 더 이상 데이터 없음
    await new Promise((resolve) => setTimeout(resolve, 300));
    setHasMoreActivities(false);
  }, [hasMoreActivities]);

  const refetch = useCallback(async () => {
    setActivitiesPage(1);
    await fetchProjectData();
  }, [fetchProjectData]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  return {
    project,
    kpi,
    progress,
    timeline,
    activities,
    isLoading,
    error,
    hasMoreActivities,
    updateProject,
    deleteProject,
    loadMoreActivities,
    refetch,
  };
}
