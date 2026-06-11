import type {
  Database,
  Project,
  ProjectHealth,
  ProjectProgress,
  ProjectStatus,
  TimelineEventType,
  Worklog,
} from '@worklog-plus/types';

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type WorklogRow = Database['public']['Tables']['worklogs']['Row'];

// projects 행(snake_case) → Project(camelCase)
export function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    status: row.status as ProjectStatus,
    startDate: row.start_date,
    ownerId: row.owner_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(row.description ? { description: row.description } : {}),
    ...(row.end_date ? { endDate: row.end_date } : {}),
    ...(row.estimated_hours != null
      ? { estimatedHours: row.estimated_hours }
      : {}),
  };
}

// worklogs 행 → Worklog
export function mapWorklog(row: WorklogRow): Worklog {
  return {
    id: row.id,
    projectId: row.project_id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    date: row.date,
    duration: row.duration,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

// 일정 경과율: (오늘 - 시작일) / (마감일 - 시작일). 마감일이 없거나 기간이 0이면 null.
function scheduleElapsedPercent(
  startDate: string,
  endDate: string | null,
): number | null {
  if (!endDate) return null;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return null;
  }
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return clampPercent(((now - start) / (end - start)) * 100);
}

// 일정 대비 ±이 값(%p) 이상 차이나면 앞섬/지연으로 본다.
const HEALTH_THRESHOLD = 10;

function projectHealth(
  status: string,
  percentage: number | null,
  scheduleElapsed: number | null,
): ProjectHealth {
  if (status === 'DONE') return 'DONE';
  if (percentage === null || scheduleElapsed === null) return 'UNKNOWN';
  const diff = percentage - scheduleElapsed;
  if (diff >= HEALTH_THRESHOLD) return 'AHEAD';
  if (diff <= -HEALTH_THRESHOLD) return 'BEHIND';
  return 'ON_TRACK';
}

export interface ProgressInput {
  status: string;
  startDate: string;
  endDate: string | null;
  estimatedHours: number | null;
  loggedHours: number;
}

// 진행률 산정: 메인은 '누적 업무일지 시간 / 예상 공수', 건강도는 일정 경과율과 비교.
// 예상 공수 미설정 시 percentage는 null(완료 상태는 100%로 간주).
export function computeProjectProgress(input: ProgressInput): ProjectProgress {
  const { status, startDate, endDate, estimatedHours, loggedHours } = input;

  let percentage: number | null = null;
  if (status === 'DONE') {
    percentage = 100;
  } else if (estimatedHours && estimatedHours > 0) {
    percentage = clampPercent((loggedHours / estimatedHours) * 100);
  }

  const scheduleElapsed = scheduleElapsedPercent(startDate, endDate);
  const health = projectHealth(status, percentage, scheduleElapsed);

  const value = percentage ?? 0;
  const barStatus = value >= 67 ? 'HIGH' : value >= 34 ? 'MEDIUM' : 'LOW';

  return {
    percentage,
    status: barStatus,
    loggedHours,
    estimatedHours: estimatedHours ?? null,
    scheduleElapsed,
    health,
  };
}

// activity_logs.action(머신용 문자열) → 타임라인 이벤트 타입
export function timelineTypeFromAction(action: string): TimelineEventType {
  if (action.includes('created')) return 'CREATED';
  if (action.includes('status') || action.includes('updated')) {
    return 'STATUS_CHANGED';
  }
  if (action.includes('done') || action.includes('completed')) return 'TASK_DONE';
  return 'TASK_ADDED';
}
