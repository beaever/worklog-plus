import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error';
import { getPaginationParams, createPaginatedResponse } from '../utils/pagination';
import type { CreateProjectInput, UpdateProjectInput, ProjectQueryInput } from '../schemas/project.schema';

export const createProject = async (ownerId: string, input: CreateProjectInput) => {
  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.project.create({
      data: {
        name: input.name,
        status: input.status,
        startDate: new Date(input.startDate),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.endDate !== undefined && { endDate: new Date(input.endDate) }),
        ownerId,
      },
    });

    // 소유자를 WRITE 권한으로 멤버에 추가
    await tx.projectMember.create({
      data: { projectId: created.id, userId: ownerId, access: 'WRITE' },
    });

    return created;
  });

  return project;
};

export const getProjects = async (userId: string, query: ProjectQueryInput) => {
  const { skip, take, page, limit } = getPaginationParams(query.page, query.limit);

  const where = {
    OR: [
      { ownerId: userId },
      { members: { some: { userId, access: { in: ['READ', 'WRITE'] } } } },
    ],
    ...(query.status && { status: query.status }),
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { description: { contains: query.search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take,
      orderBy: { updatedAt: 'desc' },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { members: true, worklogs: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return createPaginatedResponse(projects, total, page, limit);
};

export const getProjectById = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
      },
      _count: { select: { worklogs: true } },
    },
  });

  if (!project) throw new AppError(404, '프로젝트를 찾을 수 없습니다');

  const isMember =
    project.ownerId === userId ||
    project.members.some((m) => m.userId === userId);

  if (!isMember) throw new AppError(403, '프로젝트에 접근할 권한이 없습니다');

  return project;
};

export const updateProject = async (
  projectId: string,
  userId: string,
  userRole: string,
  input: UpdateProjectInput,
) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError(404, '프로젝트를 찾을 수 없습니다');

  const isOwner = project.ownerId === userId;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SYSTEM_ADMIN';

  if (!isOwner && !isAdmin) {
    throw new AppError(403, '프로젝트를 수정할 권한이 없습니다');
  }

  const updateData: Prisma.ProjectUpdateInput = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.endDate !== undefined) updateData.endDate = input.endDate ? new Date(input.endDate) : null;

  return prisma.project.update({
    where: { id: projectId },
    data: updateData,
  });
};

export const deleteProject = async (
  projectId: string,
  userId: string,
  userRole: string,
) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError(404, '프로젝트를 찾을 수 없습니다');

  const isOwner = project.ownerId === userId;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SYSTEM_ADMIN';

  if (!isOwner && !isAdmin) {
    throw new AppError(403, '프로젝트를 삭제할 권한이 없습니다');
  }

  await prisma.project.delete({ where: { id: projectId } });
};
