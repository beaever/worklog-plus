import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@worklog-plus/types';

type SB = SupabaseClient<Database>;

export interface NotificationItem {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  actorName: string | null;
}

// 알림은 별도 테이블 없이 activity_logs를 재활용한다. RLS로 접근 가능한 활동만 조회된다.
export async function getNotifications(supabase: SB): Promise<NotificationItem[]> {
  const { data } = await supabase
    .from('activity_logs')
    .select('id, action, description, created_at, users(name)')
    .order('created_at', { ascending: false })
    .limit(20);

  return (data ?? []).map((row) => {
    const actor = row.users as unknown as { name: string } | null;
    return {
      id: row.id as string,
      action: row.action as string,
      description: row.description as string,
      createdAt: row.created_at as string,
      actorName: actor?.name ?? null,
    };
  });
}
