'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { worklogsApi } from '@worklog-plus/api';
import type {
  WorklogCreateInput,
  WorklogUpdateInput,
} from '@worklog-plus/types';

interface UseWorklogsParams {
  projectId?: string;
  page?: number;
  limit?: number;
}

/**
 * 업무일지 목록 조회 query 훅
 *
 * @description
 * - 업무일지 목록을 페이지네이션으로 조회
 * - 프로젝트별 필터링 지원 (projectId)
 * - 30초간 캐시 유지
 *
 * @param params - 조회 파라미터 (projectId, page, limit)
 * @returns 업무일지 목록 쿼리 결과
 *
 * @example
 * const { data, isLoading } = useWorklogs({ projectId: 'project-id', page: 1, limit: 10 });
 */
export function useWorklogs(params: UseWorklogsParams = {}) {
  const { projectId, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ['worklogs', { projectId, page, limit }],
    queryFn: async () => {
      const response = await worklogsApi.getAll(projectId, page, limit);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch worklogs');
      }
      return response.data;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * 업무일지 무한 스크롤 query 훅
 *
 * @description
 * - 업무일지를 무한 스크롤로 조회
 * - useInfiniteQuery를 사용하여 페이지 단위로 데이터 로드
 * - 프로젝트별 필터링 지원
 *
 * @param projectId - 프로젝트 ID (선택사항)
 * @returns 무한 스크롤 쿼리 결과 (pages, fetchNextPage, hasNextPage)
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useInfiniteWorklogs('project-id');
 */
export function useInfiniteWorklogs(projectId?: string) {
  return useInfiniteQuery({
    queryKey: ['worklogs', 'infinite', projectId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await worklogsApi.getAll(projectId, pageParam, 10);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch worklogs');
      }
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const hasMore = lastPage.page < lastPage.totalPages;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 30 * 1000,
  });
}

/**
 * 단일 업무일지 상세 정보 조회 query 훅
 *
 * @description
 * - 특정 업무일지의 상세 정보를 조회
 * - ID가 있을 때만 쿼리 실행 (enabled)
 * - 60초간 캐시 유지
 *
 * @param id - 업무일지 ID
 * @returns 업무일지 상세 정보 쿼리 결과
 *
 * @example
 * const { data: worklog, isLoading } = useWorklog('worklog-id');
 */
export function useWorklog(id: string) {
  return useQuery({
    queryKey: ['worklogs', id],
    queryFn: async () => {
      const response = await worklogsApi.getById(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch worklog');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

/**
 * 업무일지 생성 mutation 훅
 *
 * @description
 * - 새 업무일지를 생성하는 mutation 훅
 * - 성공 시 업무일지 목록 쿼리를 무효화하여 자동 갱신
 *
 * @returns 업무일지 생성 mutation 객체
 *
 * @example
 * const createWorklog = useCreateWorklog();
 * createWorklog.mutate({ title: '제목', content: '내용', projectId: 'project-id', date: '2024-01-01', duration: 4 });
 */
export function useCreateWorklog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorklogCreateInput) => {
      const response = await worklogsApi.create(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create worklog');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['worklogs'] });
      if (data?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', data.projectId, 'dashboard'],
        });
      }
    },
  });
}

/**
 * 업무일지 수정 mutation 훅
 *
 * @description
 * - 기존 업무일지를 수정하는 mutation 훅
 * - 성공 시 해당 업무일지와 목록 쿼리를 무효화하여 자동 갱신
 *
 * @returns 업무일지 수정 mutation 객체
 *
 * @example
 * const updateWorklog = useUpdateWorklog();
 * updateWorklog.mutate({ id: 'worklog-id', data: { title: '수정된 제목' } });
 */
export function useUpdateWorklog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorklogUpdateInput) => {
      const response = await worklogsApi.update(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update worklog');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['worklogs'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['worklogs', data.id] });
      }
      if (data?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', data.projectId, 'dashboard'],
        });
      }
    },
  });
}

/**
 * 업무일지 삭제 mutation 훅
 *
 * @description
 * - 업무일지를 삭제하는 mutation 훅
 * - 성공 시 업무일지 목록 쿼리를 무효화하여 자동 갱신
 *
 * @returns 업무일지 삭제 mutation 객체
 *
 * @example
 * const deleteWorklog = useDeleteWorklog();
 * deleteWorklog.mutate('worklog-id');
 */
export function useDeleteWorklog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await worklogsApi.delete(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete worklog');
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['worklogs'] });
      queryClient.removeQueries({ queryKey: ['worklogs', id] });
    },
  });
}
