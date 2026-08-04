-- 프로젝트 생성 RLS 검증. 실패하면 예외로 중단된다.
-- 실행: PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f supabase/tests/rls_project_creation.sql
-- 모든 변경은 마지막에 롤백된다.

begin;

do $$
declare
  v_user uuid;
  v_new_id uuid;
begin
  select id into v_user from public.users where role = 'USER' limit 1;
  if v_user is null then
    raise exception 'FAIL: 검증용 USER 역할 계정이 없습니다 (supabase db reset으로 시드 적용)';
  end if;

  -- 일반 USER 세션으로 위장
  perform set_config('request.jwt.claims',
    json_build_object('sub', v_user::text, 'role', 'authenticated', 'user_role', 'USER')::text, true);
  perform set_config('role', 'authenticated', true);

  -- 1) USER가 본인 명의로 생성 + RETURNING까지 성공해야 한다
  insert into public.projects (name, status, start_date, owner_id)
  values ('RLS 검증용', 'PLANNED', current_date, v_user)
  returning id into v_new_id;
  raise notice 'PASS: USER 역할이 프로젝트를 생성하고 RETURNING까지 성공';

  -- 2) 타인 명의 생성은 여전히 차단되어야 한다
  begin
    insert into public.projects (name, status, start_date, owner_id)
    values ('타인 명의', 'PLANNED', current_date, '00000000-0000-0000-0000-000000000001');
    raise exception 'FAIL: 타인 명의 생성이 허용됨 — 소유권 통제가 깨졌다';
  exception
    when insufficient_privilege then
      raise notice 'PASS: 타인 명의 생성은 차단됨';
  end;
end $$;

rollback;
