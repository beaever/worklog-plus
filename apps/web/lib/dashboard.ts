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

export async function getWeeklyActivity(supabase: SB, userId: string): Promise<WeeklyActivityEntry[]> {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6));
  const { data } = await supabase
    .from('worklogs')
    .select('date, duration')
    .eq('user_id', userId)
    .gte('date', ymd(start))
    .lte('date', ymd(now));
  const rows = (data ?? []) as DurationRow[];

  const result: WeeklyActivityEntry[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    const key = ymd(d);
    const dayRows = rows.filter((r) => r.date === key);
    result.push({
      day: WEEKDAY_KO[d.getUTCDay()] ?? '',
      worklogs: dayRows.length,
      hours: sumDuration(dayRows),
    });
  }
  return result;
}

export interface MonthlyTrendEntry {
  month: string;
  worklogs: number;
  hours: number;
}

export async function getMonthlyTrend(supabase: SB, userId: string): Promise<MonthlyTrendEntry[]> {
  const now = new Date();
  const startMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
  const { data } = await supabase
    .from('worklogs')
    .select('date, duration')
    .eq('user_id', userId)
    .gte('date', ymd(startMonth));
  const rows = (data ?? []) as DurationRow[];

  const result: MonthlyTrendEntry[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const ym = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    const monthRows = rows.filter((r) => r.date.slice(0, 7) === ym);
    result.push({
      month: `${d.getUTCMonth() + 1}월`,
      worklogs: monthRows.length,
      hours: sumDuration(monthRows),
    });
  }
  return result;
}

export interface ProjectDistributionEntry {
  name: string;
  value: number;
}

export async function getProjectDistribution(supabase: SB): Promise<ProjectDistributionEntry[]> {
  const { data } = await supabase.from('projects').select('name, worklogs(count)');
  const items = (data ?? []).map((p) => {
    const worklogs = p.worklogs as unknown as Array<{ count: number }>;
    return { name: p.name as string, value: worklogs?.[0]?.count ?? 0 };
  });
  return items.sort((a, b) => b.value - a.value).slice(0, 5);
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
