import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error';
import type { AddMemberInput, UpdateMemberAccessInput } from '../schemas/member.schema';

const requireOwnerOrAdmin = async (projectId: string, userId: string, userRole: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError(404, '프로젝트를 찾을 수 없습니다');

  const isAdmin = userRole === 'ADMIN' || userRole === 'SYSTEM_ADMIN';
  if (!isAdmin && project.ownerId !== userId) {
    throw new AppError(403, '멤버를 관리할 권한이 없습니다');
  }

  return project;
};

export const getMembers = async (projectId: string, userId: string) => {
  const isMember = await prisma.projectMember.findFirst({
    where: { projectId, userId },
  });

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError(404, '프로젝트를 찾을 수 없습니다');

  if (project.ownerId !== userId && !isMember) {
    throw new AppError(403, '프로젝트에 접근할 권한이 없습니다');
  }

  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true, role: true } },
    },
    orderBy: { joinedAt: 'asc' },
  });
};

export const addMember = async (
  projectId: string,
  requesterId: string,
  requesterRole: string,
  input: AddMemberInput,
) => {
  await requireOwnerOrAdmin(projectId, requesterId, requesterRole);

  const targetUser = await prisma.user.findUnique({ where: { id: input.userId } });
  if (!targetUser) throw new AppError(404, '추가할 사용자를 찾을 수 없습니다');

  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: input.userId } },
  });
  if (existing) throw new AppError(409, '이미 프로젝트 멤버입니다');

  return prisma.projectMember.create({
    data: { projectId, userId: input.userId, access: input.access },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
    },
  });
};

export const updateMemberAccess = async (
  projectId: string,
  targetUserId: string,
  requesterId: string,
  requesterRole: string,
  input: UpdateMemberAccessInput,
) => {
  const project = await requireOwnerOrAdmin(projectId, requesterId, requesterRole);

  if (project.ownerId === targetUserId) {
    throw new AppError(400, '프로젝트 소유자의 권한은 변경할 수 없습니다');
  }

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: targetUserId } },
  });
  if (!member) throw new AppError(404, '프로젝트 멤버를 찾을 수 없습니다');

  return prisma.projectMember.update({
    where: { projectId_userId: { projectId, userId: targetUserId } },
    data: { access: input.access },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
    },
  });
};

export const removeMember = async (
  projectId: string,
  targetUserId: string,
  requesterId: string,
  requesterRole: string,
) => {
  const project = await requireOwnerOrAdmin(projectId, requesterId, requesterRole);

  if (project.ownerId === targetUserId) {
    throw new AppError(400, '프로젝트 소유자는 멤버에서 제거할 수 없습니다');
  }

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: targetUserId } },
  });
  if (!member) throw new AppError(404, '프로젝트 멤버를 찾을 수 없습니다');

  await prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId: targetUserId } },
  });
};
