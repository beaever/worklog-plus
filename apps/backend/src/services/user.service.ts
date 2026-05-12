import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error';
import { hashPassword, verifyPassword } from '../utils/password';
import { getPaginationParams, createPaginatedResponse } from '../utils/pagination';
import type {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
  UserQueryInput,
} from '../schemas/user.schema';

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
  avatarUrl: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });

  if (!user) throw new AppError(404, '사용자를 찾을 수 없습니다');
  return user;
};

export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
  const updateData: Prisma.UserUpdateInput = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl;

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: USER_SELECT,
  });
};

export const changePassword = async (userId: string, input: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, '사용자를 찾을 수 없습니다');

  const isValid = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!isValid) throw new AppError(400, '현재 비밀번호가 올바르지 않습니다');

  const newHash = await hashPassword(input.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });
};

export const getUsers = async (query: UserQueryInput) => {
  const { skip, take, page, limit } = getPaginationParams(query.page, query.limit);

  const where = {
    ...(query.role && { role: query.role }),
    ...(query.status && { status: query.status }),
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { email: { contains: query.search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: USER_SELECT,
    }),
    prisma.user.count({ where }),
  ]);

  return createPaginatedResponse(users, total, page, limit);
};

export const updateUserRole = async (targetUserId: string, input: UpdateUserRoleInput) => {
  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) throw new AppError(404, '사용자를 찾을 수 없습니다');

  return prisma.user.update({
    where: { id: targetUserId },
    data: { role: input.role },
    select: USER_SELECT,
  });
};

export const updateUserStatus = async (targetUserId: string, input: UpdateUserStatusInput) => {
  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) throw new AppError(404, '사용자를 찾을 수 없습니다');

  return prisma.user.update({
    where: { id: targetUserId },
    data: { status: input.status },
    select: USER_SELECT,
  });
};
