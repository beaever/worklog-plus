'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  Project,
  ProjectStatus,
  ProjectSummary,
  PaginationMeta,
  Database,
} from '@worklog-plus/types';
import { createClient } from '@/lib/supabase/client';
import { mapProject, progressFromStatus } from '@/lib/supabase/mappers';

export interface ProjectListParams {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  search?: string;
}

function buildMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// 프로젝트 목록 (RLS가 접근 가능한 프로젝트만 반환). 카드 표시에 맞춰 ProjectSummary로 매핑.
export function useProjects(params: ProjectListParams = {}) {
  const { page = 1, limit = 10, status, search } = params;

  return useQuery({
    queryKey: ['projects', params],
    queryFn: async (): Promise<{ data: ProjectSummary[]; meta: PaginationMeta }> => {
      const supabase = createClient();
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('projects')
        .select('id, name, status, updated_at, owner_id, worklogs(count)', {
          count: 'exact',
        })
        .order('updated_at', { ascending: false })
        .range(from, to);

      if (status) query = query.eq('status', status);
      if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

      const { data, count, error } = await query;
      if (error) throw new Error(error.message);

      const items: ProjectSummary[] = (data ?? []).map((row) => {
        const worklogs = row.worklogs as unknown as Array<{ count: number }>;
        return {
          id: row.id,
          name: row.name,
          status: row.status as ProjectStatus,
          updatedAt: row.updated_at,
          ownerId: row.owner_id,
          progress: progressFromStatus(row.status),
          worklogCount: worklogs?.[0]?.count ?? 0,
        };
      });

      return { data: items, meta: buildMeta(count ?? items.length, page, limit) };
    },
    staleTime: 30 * 1000,
  });
}

// 단일 프로젝트 상세
export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async (): Promise<Project> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return mapProject(data);
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

// 프로젝트 대시보드 — 현재 데이터 모델에 'task' 개념이 없어 KPI는 비워 둔다.
// (기존에도 백엔드 미구현으로 빈 상태였음. 페이지는 kpi/progress가 falsy면 해당 섹션을 렌더하지 않음)
export function useProjectDashboard(id: string) {
  return useQuery({
    queryKey: ['projects', id, 'dashboard'],
    queryFn: async () => ({
      projectId: id,
      kpi: null,
      progress: null,
      timeline: [],
      recentActivities: [],
    }),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

// 프로젝트 활동 로그 — 활동 피드는 후속 단계에서 제공(현재 빈 목록 유지).
export function useProjectActivities(id: string) {
  return useInfiniteQuery({
    queryKey: ['projects', id, 'activities'],
    queryFn: async () => ({ data: [], meta: buildMeta(0, 1, 20) }),
    getNextPageParam: () => undefined,
    initialPageParam: 1,
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

// 프로젝트 생성 — 프로젝트+소유자 멤버+활동로그를 함께 생성하는 트랜잭션이라 Route Handler에서 처리.
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectInput): Promise<Project> => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body?.error || '프로젝트 생성에 실패했습니다');
      }
      return body as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// 프로젝트 수정 (RLS: 소유자/관리자만)
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProjectInput;
    }): Promise<Project> => {
      const supabase = createClient();
      const patch: Database['public']['Tables']['projects']['Update'] = {};
      if (data.name !== undefined) patch.name = data.name;
      if (data.description !== undefined) patch.description = data.description;
      if (data.status !== undefined) patch.status = data.status;
      if (data.endDate !== undefined) patch.end_date = data.endDate;

      const { data: updated, error } = await supabase
        .from('projects')
        .update(patch)
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      return mapProject(updated);
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

// 프로젝트 삭제 (RLS: 소유자/관리자만)
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const supabase = createClient();
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.removeQueries({ queryKey: ['projects', id] });
    },
  });
}
