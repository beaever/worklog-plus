import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').max(100).trim().optional(),
  avatarUrl: z.string().url('올바른 URL 형식이 아닙니다').optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '비밀번호는 영문과 숫자를 포함해야 합니다'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'MANAGER', 'ADMIN', 'SYSTEM_ADMIN']),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED']),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;

export const userQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  search: z.string().optional(),
  role: z.enum(['USER', 'MANAGER', 'ADMIN', 'SYSTEM_ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
});

export type UserQueryInput = z.infer<typeof userQuerySchema>;
