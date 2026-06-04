-- WorkLog+ 대시보드 집계 RPC
-- 기존 dashboard.service.ts의 루프 쿼리(getWeeklyActivity/getMonthlyTrend 등)를
-- 단일 GROUP BY로 대체. SECURITY INVOKER(기본)라 RLS가 그대로 적용된다.
-- 개인 통계는 user_id = auth.uid()로 필터한다.

-- 일자별 업무일지 통계 (주간 활동 차트용). 빈 날짜는 0으로 채운다.
create or replace function public.worklog_daily_stats(p_from date, p_to date)
returns table(day date, worklog_count integer, duration_hours integer)
language sql stable as $$
  select d::date as day,
         count(w.id)::int as worklog_count,
         coalesce(sum(w.duration), 0)::int as duration_hours
  from generate_series(p_from, p_to, interval '1 day') d
  left join public.worklogs w
    on w.user_id = auth.uid() and w.date = d::date
  group by d
  order by d;
$$;

-- 월별 업무일지 통계 (월별 트렌드 차트용). 빈 달은 0으로 채운다.
create or replace function public.worklog_monthly_stats(p_from date, p_to date)
returns table(month_start date, worklog_count integer, duration_hours integer)
language sql stable as $$
  select m::date as month_start,
         count(w.id)::int as worklog_count,
         coalesce(sum(w.duration), 0)::int as duration_hours
  from generate_series(
         date_trunc('month', p_from::timestamp),
         date_trunc('month', p_to::timestamp),
         interval '1 month'
       ) m
  left join public.worklogs w
    on w.user_id = auth.uid()
   and date_trunc('month', w.date::timestamp) = m
  group by m
  order by m;
$$;

-- 프로젝트별 업무일지 분포 (상위 N). 접근 가능한 프로젝트의 전체 업무일지 수.
create or replace function public.project_worklog_distribution(p_limit integer default 5)
returns table(project_id uuid, name text, value integer)
language sql stable as $$
  select p.id, p.name, count(w.id)::int as value
  from public.projects p
  left join public.worklogs w on w.project_id = p.id
  where public.has_project_access(p.id)
  group by p.id, p.name
  order by value desc
  limit greatest(p_limit, 0);
$$;

-- RPC 실행 권한: 인증 사용자만
revoke execute on function public.worklog_daily_stats(date, date) from anon;
revoke execute on function public.worklog_monthly_stats(date, date) from anon;
revoke execute on function public.project_worklog_distribution(integer) from anon;
grant execute on function public.worklog_daily_stats(date, date) to authenticated;
grant execute on function public.worklog_monthly_stats(date, date) to authenticated;
grant execute on function public.project_worklog_distribution(integer) to authenticated;
