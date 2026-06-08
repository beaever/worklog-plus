'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserProfile, Database } from '@worklog-plus/types';
import { createClient } from '@/lib/supabase/client';

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// 프로필 수정 — public.users의 name/avatar_url 갱신 (RLS: 본인만, role/status는 트리거로 보호)
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다');

      const patch: Database['public']['Tables']['users']['Update'] = {};
      if (data.name !== undefined) patch.name = data.name;
      if (data.avatarUrl !== undefined) patch.avatar_url = data.avatarUrl;

      const { data: updated, error } = await supabase
        .from('users')
        .update(patch)
        .eq('id', user.id)
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

// 비밀번호 변경 — Supabase Auth가 세션 기반으로 처리(현재 비밀번호 재확인 불필요)
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      if (error) throw new Error(error.message || '비밀번호 변경에 실패했습니다');
      return { message: '비밀번호가 변경되었습니다' };
    },
  });
}
