-- WorkLog+ RLS 정책
-- 권한 규칙(기존 Express authorize/checkOwnership/서비스 로직)을 RLS로 이관.
-- 모든 정책은 SECURITY DEFINER 헬퍼를 경유해 무한재귀를 회피한다.

-- ============================================
-- users
-- ============================================
alter table public.users enable row level security;

-- Custom Access Token Hook(supabase_auth_admin)이 역할을 읽을 수 있도록 허용
create policy users_auth_admin_read on public.users
  for select to supabase_auth_admin using (true);

-- 본인 또는 관리자만 조회
create policy users_select on public.users
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- 본인 프로필 수정 (role/status 변경은 아래 트리거가 차단)
create policy users_update_self on public.users
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- 관리자는 모든 사용자 수정 (role/status 변경 포함)
create policy users_update_admin on public.users
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 권한 상승 차단: 인증된 비관리자는 role/status를 바꿀 수 없음(OLD 값 유지).
-- service role(auth.uid() is null)은 통과 → 관리자용 Route Handler에서만 변경.
create or replace function public.prevent_privilege_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.status := old.status;
  end if;
  return new;
end;
$$;

create trigger users_prevent_privilege_escalation
  before update on public.users
  for each row execute function public.prevent_privilege_escalation();

-- ============================================
-- projects
-- ============================================
alter table public.projects enable row level security;

create policy projects_select on public.projects
  for select to authenticated
  using (public.has_project_access(id) or public.is_admin());

-- 생성: 본인을 소유자로, MANAGER 이상만
create policy projects_insert on public.projects
  for insert to authenticated
  with check (
    owner_id = auth.uid()
    and coalesce(auth.jwt()->>'user_role','USER') in ('MANAGER','ADMIN','SYSTEM_ADMIN')
  );

create policy projects_update on public.projects
  for update to authenticated
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

create policy projects_delete on public.projects
  for delete to authenticated
  using (owner_id = auth.uid() or public.is_admin());

-- ============================================
-- worklogs
-- ============================================
alter table public.worklogs enable row level security;

create policy worklogs_select on public.worklogs
  for select to authenticated
  using (public.has_project_access(project_id) or public.is_admin());

-- 생성: WRITE 권한 멤버(또는 소유자)가 본인 명의로만
create policy worklogs_insert on public.worklogs
  for insert to authenticated
  with check (user_id = auth.uid() and public.has_write_access(project_id));

create policy worklogs_update on public.worklogs
  for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy worklogs_delete on public.worklogs
  for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ============================================
-- project_members
-- ============================================
alter table public.project_members enable row level security;

create policy pm_select on public.project_members
  for select to authenticated
  using (public.has_project_access(project_id) or public.is_admin());

create policy pm_insert on public.project_members
  for insert to authenticated
  with check (public.is_project_owner(project_id) or public.is_admin());

create policy pm_update on public.project_members
  for update to authenticated
  using (public.is_project_owner(project_id) or public.is_admin())
  with check (public.is_project_owner(project_id) or public.is_admin());

create policy pm_delete on public.project_members
  for delete to authenticated
  using (public.is_project_owner(project_id) or public.is_admin());

-- ============================================
-- activity_logs (INSERT는 service role 전용 → authenticated 정책 없음)
-- ============================================
alter table public.activity_logs enable row level security;

create policy activity_select on public.activity_logs
  for select to authenticated
  using (
    (project_id is not null and public.has_project_access(project_id))
    or user_id = auth.uid()
    or public.is_admin()
  );

-- ============================================
-- audit_logs (관리자만 조회, INSERT는 service role 전용)
-- ============================================
alter table public.audit_logs enable row level security;

create policy audit_select on public.audit_logs
  for select to authenticated
  using (public.is_admin());
