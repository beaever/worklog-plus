-- WorkLog+ 시드 데이터
-- auth.users를 생성하면 on_auth_user_created 트리거가 public.users 프로필을 만든다.
-- 이후 역할(role)만 보정하고 데모 프로젝트/멤버/업무일지/로그를 생성한다.
-- 로컬(supabase db reset)에서 자동 실행되며, 원격에는 적용하지 않는다.

create extension if not exists pgcrypto with schema extensions;

-- ============================================
-- 1. 사용자 (auth.users + auth.identities)
-- ============================================
do $$
declare
  v record;
begin
  for v in
    select * from (values
      ('00000000-0000-0000-0000-000000000001'::uuid, 'admin@worklog.com',   'admin123!@#',   '시스템 관리자',   'SYSTEM_ADMIN'),
      ('00000000-0000-0000-0000-000000000002'::uuid, 'manager@worklog.com', 'manager123!@#', '프로젝트 매니저', 'MANAGER'),
      ('00000000-0000-0000-0000-000000000003'::uuid, 'user1@worklog.com',   'user123!@#',    '홍길동',          'USER'),
      ('00000000-0000-0000-0000-000000000004'::uuid, 'user2@worklog.com',   'user123!@#',    '김철수',          'USER')
    ) as t(id, email, password, name, role)
  loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', v.id, 'authenticated', 'authenticated', v.email,
      extensions.crypt(v.password, extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', v.name), false,
      '', '', '', ''
    );
    insert into auth.identities (
      provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      v.id::text, v.id,
      jsonb_build_object('sub', v.id::text, 'email', v.email),
      'email', now(), now(), now()
    );
    -- 트리거가 생성한 프로필의 역할 보정 (트리거는 항상 USER로 생성)
    update public.users set role = v.role where id = v.id;
  end loop;
end $$;

-- ============================================
-- 2. 프로젝트
-- ============================================
insert into public.projects (id, name, description, status, start_date, end_date, owner_id) values
  ('10000000-0000-0000-0000-000000000001', 'WorkLog+ 백엔드 개발',   'Supabase 기반 백엔드(Auth/RLS/RPC) 구축',        'ACTIVE',  '2026-01-01', '2026-06-30', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000002', 'WorkLog+ 프론트엔드 개발', 'Next.js 15 기반 웹 애플리케이션 개발',            'ACTIVE',  '2026-01-15', '2026-07-15', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000003', '모바일 앱 개발',          'React Native + Expo 기반 모바일 애플리케이션',    'PLANNED', '2026-03-01', null,         '00000000-0000-0000-0000-000000000003');

-- ============================================
-- 3. 프로젝트 멤버
-- ============================================
insert into public.project_members (project_id, user_id, access) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'WRITE'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'READ'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'WRITE');

-- ============================================
-- 4. 업무일지
-- ============================================
insert into public.worklogs (project_id, user_id, title, content, date, duration) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Supabase 스키마 설계 및 마이그레이션', '7개 테이블을 Supabase로 이관하고 RLS 정책을 설계했습니다.', current_date,     4),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Supabase Auth 연동',                   'Supabase Auth로 인증을 전환하고 트리거로 프로필을 자동 생성했습니다.', current_date - 1, 5),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Next.js 프로젝트 초기 설정',           'App Router 기반 초기화, Tailwind/shadcn 설정, 기본 레이아웃 구성.', current_date - 2, 3),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'RLS 정책 문서화',                      'RLS 정책과 권한 시나리오를 정리했습니다.', current_date - 1, 2);

-- ============================================
-- 5. 활동 로그
-- ============================================
insert into public.activity_logs (project_id, user_id, action, description, metadata) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'created_project', '프로젝트 "WorkLog+ 백엔드 개발"을 생성했습니다.', '{"projectName":"WorkLog+ 백엔드 개발"}'::jsonb),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'created_worklog', '업무일지 "Supabase 스키마 설계 및 마이그레이션"을 작성했습니다.', null);

-- ============================================
-- 6. 감사 로그
-- ============================================
insert into public.audit_logs (action, actor_id, target_type, target_id, target_name, metadata) values
  ('USER_CREATED',    '00000000-0000-0000-0000-000000000001', 'USER',    '00000000-0000-0000-0000-000000000003', '홍길동',                '{"email":"user1@worklog.com","role":"USER"}'::jsonb),
  ('PROJECT_CREATED', '00000000-0000-0000-0000-000000000002', 'PROJECT', '10000000-0000-0000-0000-000000000001', 'WorkLog+ 백엔드 개발', null);
