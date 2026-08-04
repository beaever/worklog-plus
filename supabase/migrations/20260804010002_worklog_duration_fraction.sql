-- 업무일지 작업 시간을 30분 단위로 기록할 수 있게 한다.
-- 폼은 이미 step=0.5로 입력받고 UI도 "N시간 M분"으로 표시하는데,
-- 컬럼이 integer라 0.5가 조용히 1로 반올림돼 저장됐다(사용자는 알 수 없음).
-- numeric은 십진 연산이라 0.5/2.5 같은 값을 정확히 보존한다.

alter table public.worklogs
  alter column duration type numeric(4,2) using duration::numeric(4,2);

-- 폼 제약(min 0.5 / max 24)을 DB에서도 강제한다.
alter table public.worklogs
  add constraint worklogs_duration_range check (duration > 0 and duration <= 24);
