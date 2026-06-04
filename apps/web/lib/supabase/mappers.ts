import type { Database, Project, ProjectStatus, Worklog } from '@worklog-plus/types';

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

// 상태 기반 진행률(프로젝트 카드 표시용 — DB에 별도 진행률 컬럼이 없어 상태에서 파생)
export function progressFromStatus(status: string): number {
  if (status === 'DONE') return 100;
  if (status === 'ACTIVE') return 50;
  return 0;
}
