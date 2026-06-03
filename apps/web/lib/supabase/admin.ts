import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@worklog-plus/types';

// service role 키를 사용하는 관리자 클라이언트. RLS를 우회하므로
// Route Handler 내부(서버)에서만 사용한다. 절대 클라이언트로 노출 금지.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
