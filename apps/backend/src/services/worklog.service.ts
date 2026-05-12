import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error';
import { getPaginationParams, createPaginatedResponse } from '../utils/pagination';
import type { CreateWorklogInput, UpdateWorklogInput, WorklogQueryInput } from '../schemas/worklog.schema';

const checkProjectAccess = async (projectId: string, userId: string, needWrite = false) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });

  if (!member) throw new AppError(403, '프로젝트에 접근할 권한이 없습니다');
  if (needWrite && member.access !== 'WRITE') throw new AppError(403, '업무일지를 작성할 권한이 없습니다');
};

export const createWorklog = async (userId: string, input: CreateWorklogInput) => {
  await checkProjectAccess(input.projectId, userId, true);

  return prisma.worklog.create({
    data: {
      ...input,
      date: new Date(input.date),
      userId,
    },
    include: {
      project: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
};

export const getWorklogs = async (userId: string, userRole: string, query: WorklogQueryInput) => {
  const { skip, take, page, limit } = getPaginationParams(query.page, query.limit);

  const isAdmin = userRole === 'ADMIN' || userRole === 'SYSTEM_ADMIN';

  // 일반 사용자는 자신이 멤버인 프로젝트의 업무일지만 조회
  const where = {
    ...(query.projectId && { projectId: query.projectId }),
    ...(query.userId && { userId: query.userId }),
    ...(query.dateFrom && { date: { gte: new Date(query.dateFrom) } }),
    ...(query.dateTo && { date: { lte: new Date(query.dateTo) } }),
    ...(!isAdmin && {
      project: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId, access: { in: ['READ', 'WRITE'] } } } },
        ],
      },
    }),
  };

  const [worklogs, total] = await Promise.all([
    prisma.worklog.findMany({
      where,
      skip,
      take,
      orderBy: { date: 'desc' },
      include: {
        project: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    }),
    prisma.worklog.count({ where }),
  ]);

  return createPaginatedResponse(worklogs, total, page, limit);
};

export const getWorklogById = async (worklogId: string, userId: string, userRole: string) => {
  const worklog = await prisma.worklog.findUnique({
    where: { id: worklogId },
    include: {
      project: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  if (!worklog) throw new AppError(404, '업무일지를 찾을 수 없습니다');

  const isAdmin = userRole === 'ADMIN' || userRole === 'SYSTEM_ADMIN';
  if (!isAdmin) {
    await checkProjectAccess(worklog.projectId, userId);
  }

  return worklog;
};

export const updateWorklog = async (
  worklogId: string,
  userId: string,
  userRole: string,
  input: UpdateWorklogInput,
) => {
  const worklog = await prisma.worklog.findUnique({ where: { id: worklogId } });
  if (!worklog) throw new AppError(404, '업무일지를 찾을 수 없습니다');

  const isAdmin = userRole === 'ADMIN' || userRole === 'SYSTEM_ADMIN';
  if (!isAdmin && worklog.userId !== userId) {
    throw new AppError(403, '본인의 업무일지만 수정할 수 있습니다');
  }

  const updateData: Prisma.WorklogUpdateInput = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.content !== undefined) updateData.content = input.content;
  if (input.duration !== undefined) updateData.duration = input.duration;
  if (input.date !== undefined) updateData.date = new Date(input.date);

  return prisma.worklog.update({
    where: { id: worklogId },
    data: updateData,
    include: {
      project: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
};

export const deleteWorklog = async (worklogId: string, userId: string, userRole: string) => {
  const worklog = await prisma.worklog.findUnique({ where: { id: worklogId } });
  if (!worklog) throw new AppError(404, '업무일지를 찾을 수 없습니다');

  const isAdmin = userRole === 'ADMIN' || userRole === 'SYSTEM_ADMIN';
  if (!isAdmin && worklog.userId !== userId) {
    throw new AppError(403, '본인의 업무일지만 삭제할 수 있습니다');
  }

  await prisma.worklog.delete({ where: { id: worklogId } });
};
