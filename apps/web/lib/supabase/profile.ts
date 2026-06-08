import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, User, UserRole, UserStatus } from '@worklog-plus/types';

type ProfileRow = Database['public']['Tables']['users']['Row'];

// public.users 행(snake_case)을 앱 도메인 User 타입(camelCase)으로 변환.
function mapProfile(row: ProfileRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role as UserRole,
    status: row.status as UserStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // exactOptionalPropertyTypes: 값이 있을 때만 옵셔널 필드 포함
    ...(row.avatar_url ? { avatarUrl: row.avatar_url } : {}),
    ...(row.last_login_at ? { lastLoginAt: row.last_login_at } : {}),
  };
}

// 주어진 사용자 id의 프로필을 조회.
export async function fetchProfileById(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapProfile(data);
}

// 현재 세션 사용자의 프로필을 조회.
export async function fetchCurrentUserProfile(
  supabase: SupabaseClient<Database>,
): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return fetchProfileById(supabase, user.id);
}
