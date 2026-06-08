-- WorkLog+ 함수: Auth 통합 + 역할 claim Hook + RLS용 권한 판정 헬퍼

-- ============================================
-- 1. 신규 가입 시 public.users 프로필 자동 생성
--    (role은 항상 USER로 강제 — 가입 메타데이터로 권한 상승 방지)
-- ============================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, name, role, status)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1)),
    'USER',
    'ACTIVE'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 2. Custom Access Token Hook
--    발급되는 JWT의 claims에 user_role을 주입 → RLS에서 DB 조회 없이 역할 판정
-- ============================================
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql stable as $$
declare
  claims jsonb;
  v_role text;
begin
  select role into v_role from public.users where id = (event->>'user_id')::uuid;
  claims := coalesce(event->'claims', '{}'::jsonb);
  claims := jsonb_set(claims, '{user_role}', to_jsonb(coalesce(v_role, 'USER')));
  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

-- Hook은 supabase_auth_admin 역할로 실행된다. 해당 역할에 실행/조회 권한 부여.
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;
grant select on table public.users to supabase_auth_admin;

-- ============================================
-- 3. RLS용 권한 판정 헬퍼
--    projects ↔ project_members 정책 상호참조로 인한 무한재귀를 막기 위해
--    SECURITY DEFINER로 RLS를 우회하여 조회한다.
-- ============================================

-- 역할 claim 기반 관리자 판정 (DB 조회 없음)
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(auth.jwt()->>'user_role', 'USER') in ('ADMIN','SYSTEM_ADMIN');
$$;

-- 현재 사용자 역할 (claim staleness 우회가 필요할 때 DB에서 직접 조회)
create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.users where id = auth.uid();
$$;

-- 프로젝트 소유자 여부
create or replace function public.is_project_owner(p_project_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.projects
    where id = p_project_id and owner_id = auth.uid()
  );
$$;

-- 프로젝트 접근권(소유자 또는 READ/WRITE 멤버)
create or replace function public.has_project_access(p_project_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.projects
    where id = p_project_id and owner_id = auth.uid()
  ) or exists (
    select 1 from public.project_members
    where project_id = p_project_id and user_id = auth.uid()
      and access in ('READ','WRITE')
  );
$$;

-- 프로젝트 쓰기권(소유자 또는 WRITE 멤버)
create or replace function public.has_write_access(p_project_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.projects
    where id = p_project_id and owner_id = auth.uid()
  ) or exists (
    select 1 from public.project_members
    where project_id = p_project_id and user_id = auth.uid()
      and access = 'WRITE'
  );
$$;
