import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapProject } from '@/lib/supabase/mappers';
import type { CreateProjectInput } from '@worklog-plus/types';

const MANAGER_ROLES = ['MANAGER', 'ADMIN', 'SYSTEM_ADMIN'];

// 프로젝트 생성: 프로젝트 + 소유자(WRITE 멤버) + 활동로그를 함께 생성하는 트랜잭션.
// service role로 원자적 처리하고, 권한(MANAGER+)은 핸들러에서 검증한다.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  // 역할 검증 (MANAGER 이상)
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  if (!profile || !MANAGER_ROLES.includes(profile.role)) {
    return NextResponse.json(
      { error: '프로젝트를 생성할 권한이 없습니다' },
      { status: 403 },
    );
  }

  const input = (await request.json().catch(() => null)) as CreateProjectInput | null;
  if (!input?.name || !input?.startDate || !input?.status) {
    return NextResponse.json(
      { error: '필수 항목(name, startDate, status)이 누락되었습니다' },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: project, error: projectError } = await admin
    .from('projects')
    .insert({
      name: input.name,
      description: input.description ?? null,
      status: input.status,
      start_date: input.startDate,
      end_date: input.endDate ?? null,
      owner_id: user.id,
    })
    .select('*')
    .single();
  if (projectError || !project) {
    return NextResponse.json(
      { error: projectError?.message || '프로젝트 생성에 실패했습니다' },
      { status: 500 },
    );
  }

  // 소유자를 WRITE 멤버로 등록
  const { error: memberError } = await admin.from('project_members').insert({
    project_id: project.id,
    user_id: user.id,
    access: 'WRITE',
  });
  if (memberError) {
    // 롤백: 멤버 등록 실패 시 프로젝트 제거
    await admin.from('projects').delete().eq('id', project.id);
    return NextResponse.json(
      { error: '프로젝트 멤버 등록에 실패했습니다' },
      { status: 500 },
    );
  }

  // 활동 로그 기록 (실패해도 생성 자체는 성공 처리)
  await admin.from('activity_logs').insert({
    project_id: project.id,
    user_id: user.id,
    action: 'created_project',
    description: `프로젝트 "${project.name}"을(를) 생성했습니다.`,
    metadata: { projectName: project.name },
  });

  return NextResponse.json(mapProject(project), { status: 201 });
}
