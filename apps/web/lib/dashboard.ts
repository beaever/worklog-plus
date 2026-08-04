import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@worklog-plus/types';

// 대시보드 집계 로직 (Route Handler에서 서버 측 TS로 실행, RLS 적용).
// 개인 통계는 user_id = 본인으로 필터한다. 기존 Express dashboard.service 로직을 이관.

type SB = SupabaseClient<Database>;
type DurationRow = { date: string; duration: number };

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function sumDuration(rows: DurationRow[]): number {
  return rows.reduce((acc, r) => acc + (r.duration ?? 0), 0);
}

export interface StatsResult {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  weeklyWorklogs: number;
  weeklyWorklogsChange: number;
  totalHours: string;
  totalHoursChange: number;
}

export async function getStats(supabase: SB, userId: string): Promise<StatsResult> {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const monthStart = new Date(Date.UTC(y, m, 1));
  const monthEnd = new Date(Date.UTC(y, m + 1, 0));
  const dow = now.getUTCDay();
  const weekStart = new Date(Date.UTC(y, m, now.getUTCDate() - dow));
  const prevWeekStart = new Date(Date.UTC(y, m, now.getUTCDate() - dow - 7));

  const [total, active, done, monthW, weekW, prevW] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'DONE'),
    supabase.from('worklogs').select('date, duration').eq('user_id', userId).gte('date', ymd(monthStart)).lte('date', ymd(monthEnd)),
    supabase.from('worklogs').select('date, duration').eq('user_id', userId).gte('date', ymd(weekStart)).lte('date', ymd(now)),
    supabase.from('worklogs').select('date, duration').eq('user_id', userId).gte('date', ymd(prevWeekStart)).lt('date', ymd(weekStart)),
  ]);

  const weekRows = (weekW.data ?? []) as DurationRow[];
  const prevRows = (prevW.data ?? []) as DurationRow[];
  const monthRows = (monthW.data ?? []) as DurationRow[];

  return {
    totalProjects: total.count ?? 0,
    activeProjects: active.count ?? 0,
    completedProjects: done.count ?? 0,
    weeklyWorklogs: weekRows.length,
    weeklyWorklogsChange: weekRows.length - prevRows.length,
    totalHours: `${sumDuration(monthRows)}h`,
    totalHoursChange: sumDuration(weekRows) - sumDuration(prevRows),
  };
}

export interface WeeklyActivityEntry {
  day: string;
  worklogs: number;
  hours: number;
}

// 집계는 worklog_daily_stats RPC(단일 GROUP BY, 빈 날짜 0으로 채움)에 맡긴다.
// RPC는 auth.uid() 기준이라 세션 사용자의 통계만 반환한다.
export async function getWeeklyActivity(supabase: SB): Promise<WeeklyActivityEntry[]> {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6));
  const { data } = await supabase.rpc('worklog_daily_stats', {
    p_from: ymd(start),
    p_to: ymd(now),
  });

  return (data ?? []).map((row) => ({
    // day는 'YYYY-MM-DD' 문자열 → 로컬 타임존 해석을 피하려고 UTC로 파싱한다.
    day: WEEKDAY_KO[new Date(`${row.day}T00:00:00Z`).getUTCDay()] ?? '',
    worklogs: row.worklog_count,
    hours: row.duration_hours,
  }));
}

export interface MonthlyTrendEntry {
  month: string;
  worklogs: number;
  hours: number;
}

export async function getMonthlyTrend(supabase: SB): Promise<MonthlyTrendEntry[]> {
  const now = new Date();
  const startMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
  const { data } = await supabase.rpc('worklog_monthly_stats', {
    p_from: ymd(startMonth),
    p_to: ymd(now),
  });

  return (data ?? []).map((row) => ({
    month: `${new Date(`${row.month_start}T00:00:00Z`).getUTCMonth() + 1}월`,
    worklogs: row.worklog_count,
    hours: row.duration_hours,
  }));
}

export interface ProjectDistributionEntry {
  name: string;
  value: number;
}

export async function getProjectDistribution(supabase: SB): Promise<ProjectDistributionEntry[]> {
  const { data } = await supabase.rpc('project_worklog_distribution', { p_limit: 5 });
  return (data ?? []).map((row) => ({ name: row.name, value: row.value }));
}

export interface RecentWorklogEntry {
  id: string;
  title: string;
  projectName: string;
  date: string;
  duration: number;
}

export async function getRecentWorklogs(supabase: SB, userId: string): Promise<RecentWorklogEntry[]> {
  const { data } = await supabase
    .from('worklogs')
    .select('id, title, date, duration, projects(name)')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(5);
  return (data ?? []).map((w) => {
    const project = w.projects as unknown as { name: string } | null;
    return {
      id: w.id as string,
      title: w.title as string,
      projectName: project?.name ?? '',
      date: w.date as string,
      duration: w.duration as number,
    };
  });
}
