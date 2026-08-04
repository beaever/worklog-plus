-- 집계 RPC의 duration_hours를 numeric으로 바꾼다.
-- duration이 numeric(4,2)가 된 뒤에도 RPC가 ::int로 캐스팅해 0.5시간이 반올림됐다.
-- 반환 타입 변경이라 create or replace로는 안 되고 drop 후 재생성해야 한다.

drop function if exists public.worklog_daily_stats(date, date);
drop function if exists public.worklog_monthly_stats(date, date);

-- 일자별 업무일지 통계 (주간 활동 차트용). 빈 날짜는 0으로 채운다.
create function public.worklog_daily_stats(p_from date, p_to date)
returns table(day date, worklog_count integer, duration_hours numeric)
language sql stable as $$
  select d::date as day,
         count(w.id)::int as worklog_count,
         coalesce(sum(w.duration), 0)::numeric as duration_hours
  from generate_series(p_from, p_to, interval '1 day') d
  left join public.worklogs w
    on w.user_id = auth.uid() and w.date = d::date
  group by d
  order by d;
$$;

-- 월별 업무일지 통계 (월별 트렌드 차트용). 빈 달은 0으로 채운다.
create function public.worklog_monthly_stats(p_from date, p_to date)
returns table(month_start date, worklog_count integer, duration_hours numeric)
language sql stable as $$
  select m::date as month_start,
         count(w.id)::int as worklog_count,
         coalesce(sum(w.duration), 0)::numeric as duration_hours
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

revoke execute on function public.worklog_daily_stats(date, date) from anon;
revoke execute on function public.worklog_monthly_stats(date, date) from anon;
grant execute on function public.worklog_daily_stats(date, date) to authenticated;
grant execute on function public.worklog_monthly_stats(date, date) to authenticated;
