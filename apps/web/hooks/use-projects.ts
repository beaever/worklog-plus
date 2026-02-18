'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { projectsApi, type ProjectListParams } from '@worklog-plus/api';
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from '@worklog-plus/types';

/**
 * 프로젝트 목록 조회 query 훅
 *
 * @description
 * - 프로젝트 목록을 페이지네이션과 필터링 옵션으로 조회
 * - 30초간 캐시 유지
 *
 * @param params - 페이지네이션 및 필터링 파라미터 (page, limit, status, search)
 * @returns 프로젝트 목록 쿼리 결과
 *
 * @example
 * const { data, isLoading } = useProjects({ page: 1, limit: 10, status: 'ACTIVE' });
 */
export function useProjects(params: ProjectListParams = {}) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const response = await projectsApi.getAll(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch projects');
      }
      return response.data;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * 단일 프로젝트 상세 정보 조회 query 훅
 *
 * @description
 * - 특정 프로젝트의 상세 정보를 조회
 * - ID가 있을 때만 쿼리 실행 (enabled)
 * - 60초간 캐시 유지
 *
 * @param id - 프로젝트 ID
 * @returns 프로젝트 상세 정보 쿼리 결과
 *
 * @example
 * const { data: project, isLoading } = useProject('project-id');
 */
export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const response = await projectsApi.getById(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch project');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

/**
 * 프로젝트 대시보드 데이터 조회 query 훅
 *
 * @description
 * - 프로젝트의 KPI, 진행률, 타임라인 등 대시보드 데이터 조회
 * - ID가 있을 때만 쿼리 실행
 * - 60초간 캐시 유지
 *
 * @param id - 프로젝트 ID
 * @returns 대시보드 데이터 쿼리 결과 (kpi, progress, timeline)
 *
 * @example
 * const { data: dashboard } = useProjectDashboard('project-id');
 */
export function useProjectDashboard(id: string) {
  return useQuery({
    queryKey: ['projects', id, 'dashboard'],
    queryFn: async () => {
      const response = await projectsApi.getDashboard(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch project dashboard');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

/**
 * 프로젝트 활동 로그 무한 스크롤 query 훅
 *
 * @description
 * - 프로젝트의 활동 로그를 무한 스크롤로 조회
 * - useInfiniteQuery를 사용하여 페이지 단위로 데이터 로드
 * - 다음 페이지가 있으면 자동으로 페이지 번호 증가
 *
 * @param id - 프로젝트 ID
 * @returns 무한 스크롤 쿼리 결과 (pages, fetchNextPage, hasNextPage)
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useProjectActivities('project-id');
 */
export function useProjectActivities(id: string) {
  return useInfiniteQuery({
    queryKey: ['projects', id, 'activities'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await projectsApi.getActivities(id, pageParam, 20);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch activities');
      }
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const hasMore = lastPage.page < lastPage.totalPages;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

/**
 * 프로젝트 생성 mutation 훅
 *
 * @description
 * - 새 프로젝트를 생성하는 mutation 훅
 * - 성공 시 프로젝트 목록 쿼리를 무효화하여 자동 갱신
 *
 * @returns 프로젝트 생성 mutation 객체
 *
 * @example
 * const createProject = useCreateProject();
 * createProject.mutate({ name: '새 프로젝트', status: 'ACTIVE' });
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const response = await projectsApi.create(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create project');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

/**
 * 프로젝트 수정 mutation 훅
 *
 * @description
 * - 기존 프로젝트를 수정하는 mutation 훅
 * - 성공 시 해당 프로젝트와 목록 쿼리를 무효화하여 자동 갱신
 *
 * @returns 프로젝트 수정 mutation 객체
 *
 * @example
 * const updateProject = useUpdateProject();
 * updateProject.mutate({ id: 'project-id', data: { name: '수정된 이름' } });
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProjectInput;
    }) => {
      const response = await projectsApi.update(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update project');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['projects', data.id] });
        queryClient.invalidateQueries({
          queryKey: ['projects', data.id, 'dashboard'],
        });
      }
    },
  });
}

/**
 * 프로젝트 삭제 mutation 훅
 *
 * @description
 * - 프로젝트를 삭제하는 mutation 훅
 * - 성공 시 프로젝트 목록 쿼리를 무효화하여 자동 갱신
 *
 * @returns 프로젝트 삭제 mutation 객체
 *
 * @example
 * const deleteProject = useDeleteProject();
 * deleteProject.mutate('project-id');
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await projectsApi.delete(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete project');
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.removeQueries({ queryKey: ['projects', id] });
    },
  });
}
