'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type {
  Worklog,
  WorklogCreateInput,
  WorklogUpdateInput,
  PaginationMeta,
  Database,
} from '@worklog-plus/types';
import { createClient } from '@/lib/supabase/client';
import { mapWorklog } from '@/lib/supabase/mappers';

interface UseWorklogsParams {
  projectId?: string;
  page?: number;
  limit?: number;
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

async function fetchWorklogs(
  projectId: string | undefined,
  page: number,
  limit: number,
): Promise<{ data: Worklog[]; meta: PaginationMeta }> {
  const supabase = createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('worklogs')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .range(from, to);

  if (projectId) query = query.eq('project_id', projectId);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  return {
    data: (data ?? []).map(mapWorklog),
    meta: buildMeta(count ?? 0, page, limit),
  };
}

// 업무일지 목록 (RLS: 접근 가능한 프로젝트의 업무일지만)
export function useWorklogs(params: UseWorklogsParams = {}) {
  const { projectId, page = 1, limit = 10 } = params;
  return useQuery({
    queryKey: ['worklogs', { projectId, page, limit }],
    queryFn: () => fetchWorklogs(projectId, page, limit),
    staleTime: 30 * 1000,
  });
}

// 업무일지 무한 스크롤
export function useInfiniteWorklogs(projectId?: string) {
  return useInfiniteQuery({
    queryKey: ['worklogs', 'infinite', projectId],
    queryFn: ({ pageParam = 1 }) => fetchWorklogs(projectId, pageParam, 10),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 30 * 1000,
  });
}

// 단일 업무일지
export function useWorklog(id: string) {
  return useQuery({
    queryKey: ['worklogs', id],
    queryFn: async (): Promise<Worklog> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('worklogs')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return mapWorklog(data);
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

// 업무일지 생성 (RLS: WRITE 권한 멤버가 본인 명의로만)
export function useCreateWorklog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: WorklogCreateInput): Promise<Worklog> => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다');

      const { data: created, error } = await supabase
        .from('worklogs')
        .insert({
          project_id: data.projectId,
          user_id: user.id,
          title: data.title,
          content: data.content,
          date: data.date,
          duration: data.duration,
        })
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      return mapWorklog(created);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['worklogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      if (data?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', data.projectId, 'dashboard'],
        });
      }
    },
  });
}

// 업무일지 수정 (RLS: 작성자/관리자)
export function useUpdateWorklog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: WorklogUpdateInput): Promise<Worklog> => {
      const supabase = createClient();
      const patch: Database['public']['Tables']['worklogs']['Update'] = {};
      if (data.title !== undefined) patch.title = data.title;
      if (data.content !== undefined) patch.content = data.content;
      if (data.date !== undefined) patch.date = data.date;
      if (data.duration !== undefined) patch.duration = data.duration;

      const { data: updated, error } = await supabase
        .from('worklogs')
        .update(patch)
        .eq('id', data.id)
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      return mapWorklog(updated);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['worklogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['worklogs', data.id] });
      }
    },
  });
}

// 업무일지 삭제 (RLS: 작성자/관리자)
export function useDeleteWorklog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const supabase = createClient();
      const { error } = await supabase.from('worklogs').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['worklogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.removeQueries({ queryKey: ['worklogs', id] });
    },
  });
}
