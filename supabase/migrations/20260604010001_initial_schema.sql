-- WorkLog+ 초기 스키마 (Supabase 전환)
-- 기존 Prisma 스키마를 이관하되, users.id를 auth.users(id)에 연결하고
-- refresh_tokens 테이블은 제거(Supabase Auth가 세션/리프레시를 관리).

-- ============================================
-- 공통: updated_at 자동 갱신 함수
-- ============================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ============================================
-- 사용자 프로필 (auth.users와 1:1)
-- ============================================
create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  name          text not null,
  role          text not null default 'USER' check (role in ('USER','MANAGER','ADMIN','SYSTEM_ADMIN')),
  status        text not null default 'ACTIVE' check (status in ('ACTIVE','SUSPENDED')),
  avatar_url    text,
  last_login_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index users_role_idx on public.users(role);
create index users_status_idx on public.users(status);
create trigger users_set_updated_at before update on public.users
  for each row execute function public.set_updated_at();

-- ============================================
-- 프로젝트
-- ============================================
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  status      text not null default 'PLANNED' check (status in ('PLANNED','ACTIVE','DONE')),
  start_date  date not null,
  end_date    date,
  owner_id    uuid not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index projects_owner_id_idx on public.projects(owner_id);
create index projects_status_idx on public.projects(status);
create index projects_start_date_end_date_idx on public.projects(start_date, end_date);
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================
-- 업무일지
-- ============================================
create table public.worklogs (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  title      text not null,
  content    text not null,
  date       date not null,
  duration   integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index worklogs_project_id_idx on public.worklogs(project_id);
create index worklogs_user_id_idx on public.worklogs(user_id);
create index worklogs_date_idx on public.worklogs(date);
create trigger worklogs_set_updated_at before update on public.worklogs
  for each row execute function public.set_updated_at();

-- ============================================
-- 프로젝트 멤버
-- ============================================
create table public.project_members (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  access     text not null default 'READ' check (access in ('NONE','READ','WRITE')),
  joined_at  timestamptz not null default now(),
  unique (project_id, user_id)
);
create index project_members_project_id_idx on public.project_members(project_id);
create index project_members_user_id_idx on public.project_members(user_id);

-- ============================================
-- 활동 로그 (프로젝트 단위)
-- ============================================
create table public.activity_logs (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references public.projects(id) on delete cascade,
  user_id     uuid references public.users(id) on delete set null,
  action      text not null,
  description text not null,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);
create index activity_logs_project_id_idx on public.activity_logs(project_id);
create index activity_logs_user_id_idx on public.activity_logs(user_id);
create index activity_logs_created_at_idx on public.activity_logs(created_at);

-- ============================================
-- 감사 로그 (시스템 단위, 관리자용)
-- ============================================
create table public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  action      text not null,
  actor_id    uuid references public.users(id) on delete set null,
  target_type text,
  target_id   text,
  target_name text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);
create index audit_logs_actor_id_idx on public.audit_logs(actor_id);
create index audit_logs_action_idx on public.audit_logs(action);
create index audit_logs_created_at_idx on public.audit_logs(created_at);
