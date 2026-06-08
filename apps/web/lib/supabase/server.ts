import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@worklog-plus/types';

// 서버(Server Component / Route Handler)용 Supabase 클라이언트.
// 사용자 세션 쿠키를 읽어 RLS가 적용된 상태로 동작한다.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Component에서 호출되면 set이 불가하므로 무시(미들웨어가 세션을 갱신).
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // noop
          }
        },
      },
    },
  );
}
