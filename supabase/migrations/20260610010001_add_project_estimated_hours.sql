-- 진행률을 '예상 공수(시간) 대비 누적 업무일지 시간'으로 산정하기 위한 컬럼.
-- nullable: 미설정 시 진행률은 '미설정'으로 표시한다.
alter table public.projects
  add column estimated_hours integer check (estimated_hours is null or estimated_hours > 0);
