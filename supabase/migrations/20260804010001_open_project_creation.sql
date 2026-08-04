-- 프로젝트 생성을 모든 인증 사용자에게 개방.
-- 가입자는 handle_new_user()가 role='USER'로 만드는데 기존 정책은 MANAGER 이상을 요구해,
-- 신규 가입자가 첫 프로젝트조차 만들 수 없었다(가입 직후 빈 화면).
-- 소유권 통제(owner_id = auth.uid())는 그대로 유지하고 역할 게이트만 제거한다.

drop policy if exists projects_insert on public.projects;

create policy projects_insert on public.projects
  for insert to authenticated
  with check (owner_id = auth.uid());

-- SELECT 정책에 소유자 직접 비교를 추가한다.
-- has_project_access()는 STABLE이라 문(statement) 시작 시점 스냅샷을 보기 때문에
-- 방금 INSERT한 행을 찾지 못한다 → `insert ... returning`(= supabase .insert().select())이
-- RLS 위반으로 실패했다. owner_id는 새 행의 컬럼을 직접 읽으므로 스냅샷 영향을 받지 않는다.
-- 소유자 단락 평가가 먼저라 함수 호출도 줄어든다.
drop policy if exists projects_select on public.projects;

create policy projects_select on public.projects
  for select to authenticated
  using (
    owner_id = auth.uid()
    or public.has_project_access(id)
    or public.is_admin()
  );
