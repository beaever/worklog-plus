import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRecentWorklogs } from '@/lib/dashboard';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }
  return NextResponse.json(await getRecentWorklogs(supabase, user.id));
}
