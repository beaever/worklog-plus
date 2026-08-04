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
  ProjectDashboard,
  ActivityLog,
  PaginationMeta,
  Database,
} from '@worklog-plus/types';
import { createClient } from '@/lib/supabase/client';
import {
  mapProject,
  computeProjectProgress,
  timelineTypeFromAction,
} from '@/lib/supabase/mappers';

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

// PostgREST or() 필터는 콤마로 조건을, 점으로 연산자를 구분한다. 사용자 입력을 그대로 넣으면
// 콤마·괄호로 조건을 덧붙여 필터를 조작할 수 있어, 값을 큰따옴표로 감싸고 내부의 " 와 \ 만 이스케이프한다.
export function quoteFilterValue(value: string): string {
  return `"${value.replace(/["\\]/g, '\\$&')}"`;
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
        .select(
          'id, name, status, updated_at, owner_id, start_date, end_date, estimated_hours, worklogs(duration)',
          { count: 'exact' },
        )
        .order('updated_at', { ascending: false })
        .range(from, to);

      if (status) query = query.eq('status', status);
      if (search) {
        const pattern = quoteFilterValue(`%${search}%`);
        query = query.or(`name.ilike.${pattern},description.ilike.${pattern}`);
      }

      const { data, count, error } = await query;
      if (error) throw new Error(error.message);

      const items: ProjectSummary[] = (data ?? []).map((row) => {
        const worklogs = row.worklogs as unknown as Array<{ duration: number }>;
        const loggedHours = worklogs.reduce((acc, w) => acc + (w.duration ?? 0), 0);
        const progress = computeProjectProgress({
          status: row.status,
          startDate: row.start_date,
          endDate: row.end_date,
          estimatedHours: row.estimated_hours,
          loggedHours,
        });
        return {
          id: row.id,
          name: row.name,
          status: row.status as ProjectStatus,
          updatedAt: row.updated_at,
          ownerId: row.owner_id,
          // 카드 막대는 단일 수치만 표시 → 예상 공수 미설정 시 0%
          progress: progress.percentage ?? 0,
          worklogCount: worklogs.length,
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

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// 프로젝트 대시보드 — KPI/진행률을 업무일지(worklogs) 기반 실데이터로 산출한다.
// (진행률=예상 공수 대비 누적 시간 + 일정 건강도, 타임라인은 activity_logs. 모두 RLS 범위 내 조회)
export function useProjectDashboard(id: string) {
  return useQuery({
    queryKey: ['projects', id, 'dashboard'],
    queryFn: async (): Promise<ProjectDashboard> => {
      const supabase = createClient();
      const [projectRes, worklogsRes, memberRes, logsRes] = await Promise.all([
        supabase
          .from('projects')
          .select('status, start_date, end_date, estimated_hours')
          .eq('id', id)
          .single(),
        supabase.from('worklogs').select('date, duration').eq('project_id', id),
        supabase
          .from('project_members')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', id),
        supabase
          .from('activity_logs')
          .select('id, action, description, created_at')
          .eq('project_id', id)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      const worklogs = (worklogsRes.data ?? []) as Array<{
        date: string;
        duration: number;
      }>;
      const weekAgo = new Date(Date.now() - WEEK_MS).toISOString().slice(0, 10);
      const totalHours = worklogs.reduce((acc, w) => acc + (w.duration ?? 0), 0);

      const project = projectRes.data;
      const progress = computeProjectProgress({
        status: project?.status ?? 'PLANNED',
        startDate: project?.start_date ?? new Date().toISOString().slice(0, 10),
        endDate: project?.end_date ?? null,
        estimatedHours: project?.estimated_hours ?? null,
        loggedHours: totalHours,
      });

      return {
        projectId: id,
        kpi: {
          totalWorklogs: worklogs.length,
          totalHours,
          thisWeekWorklogs: worklogs.filter((w) => w.date >= weekAgo).length,
          memberCount: memberRes.count ?? 0,
        },
        progress,
        timeline: (logsRes.data ?? []).map((row) => ({
          id: row.id as string,
          type: timelineTypeFromAction(row.action as string),
          description: row.description as string,
          createdAt: row.created_at as string,
        })),
        recentActivities: [],
      };
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

const ACTIVITIES_PAGE_SIZE = 20;

// 프로젝트 활동 로그 — activity_logs를 페이지네이션으로 조회(RLS 적용).
export function useProjectActivities(id: string) {
  return useInfiniteQuery({
    queryKey: ['projects', id, 'activities'],
    queryFn: async ({ pageParam }) => {
      const supabase = createClient();
      const from = (pageParam - 1) * ACTIVITIES_PAGE_SIZE;
      const to = from + ACTIVITIES_PAGE_SIZE - 1;

      const { data, count, error } = await supabase
        .from('activity_logs')
        .select('id, description, created_at, user_id, users(name)', {
          count: 'exact',
        })
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .range(from, to);
      if (error) throw new Error(error.message);

      const items: ActivityLog[] = (data ?? []).map((row) => {
        const actor = row.users as unknown as { name: string } | null;
        return {
          id: row.id as string,
          // ProjectActivityLog가 "{이름}님이 {action}" 형태로 렌더 → 사람이 읽는 설명을 넣는다.
          action: row.description as string,
          actor: {
            id: (row.user_id as string | null) ?? '',
            name: actor?.name ?? '알 수 없음',
          },
          createdAt: row.created_at as string,
        };
      });

      return {
        data: items,
        meta: buildMeta(count ?? items.length, pageParam, ACTIVITIES_PAGE_SIZE),
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined,
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
      if (data.estimatedHours !== undefined) {
        patch.estimated_hours = data.estimatedHours;
      }

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
