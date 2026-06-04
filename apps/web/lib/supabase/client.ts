import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@worklog-plus/types';

// 브라우저(클라이언트 컴포넌트)용 Supabase 클라이언트.
// createBrowserClient는 내부적으로 동일 인스턴스를 재사용한다.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
