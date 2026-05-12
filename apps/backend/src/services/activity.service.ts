import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error';
import { getPaginationParams, createPaginatedResponse } from '../utils/pagination';

export type ActivityAction =
  | 'created_project'
  | 'updated_project'
  | 'deleted_project'
  | 'created_worklog'
  | 'updated_worklog'
  | 'deleted_worklog'
  | 'added_member'
  | 'removed_member'
  | 'changed_member_access';

export const recordActivity = async ({
  projectId,
  userId,
  action,
  description,
  metadata,
}: {
  projectId?: string;
  userId: string;
  action: ActivityAction;
  description: string;
  metadata?: Record<string, unknown>;
}) => {
  const createData: Prisma.ActivityLogUncheckedCreateInput = { userId, action, description };
  if (projectId !== undefined) createData.projectId = projectId;
  if (metadata !== undefined) createData.metadata = metadata as Prisma.InputJsonValue;

  await prisma.activityLog.create({ data: createData });
};

export const getProjectActivities = async (
  projectId: string,
  userId: string,
  userRole: string,
  page: number,
  limit: number,
) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError(404, '프로젝트를 찾을 수 없습니다');

  const isAdmin = userRole === 'ADMIN' || userRole === 'SYSTEM_ADMIN';
  if (!isAdmin) {
    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId },
    });
    if (project.ownerId !== userId && !member) {
      throw new AppError(403, '프로젝트에 접근할 권한이 없습니다');
    }
  }

  const { skip, take } = getPaginationParams(page, limit);
  const where = { projectId };

  const [activities, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    }),
    prisma.activityLog.count({ where }),
  ]);

  return createPaginatedResponse(activities, total, page, limit);
};

export const getAuditLogs = async (page: number, limit: number) => {
  const { skip, take } = getPaginationParams(page, limit);

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.auditLog.count(),
  ]);

  return createPaginatedResponse(logs, total, page, limit);
};

export const recordAudit = async ({
  action,
  actorId,
  targetType,
  targetId,
  targetName,
  metadata,
}: {
  action: string;
  actorId: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, unknown>;
}) => {
  const createData: Prisma.AuditLogUncheckedCreateInput = { action, actorId };
  if (targetType !== undefined) createData.targetType = targetType;
  if (targetId !== undefined) createData.targetId = targetId;
  if (targetName !== undefined) createData.targetName = targetName;
  if (metadata !== undefined) createData.metadata = metadata as Prisma.InputJsonValue;

  await prisma.auditLog.create({ data: createData });
};
