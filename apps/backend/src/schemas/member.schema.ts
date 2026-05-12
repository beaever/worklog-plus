import { z } from 'zod';

export const addMemberSchema = z.object({
  userId: z.string().uuid('올바른 사용자 ID 형식이 아닙니다'),
  access: z.enum(['READ', 'WRITE']).default('READ'),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;

export const updateMemberAccessSchema = z.object({
  access: z.enum(['READ', 'WRITE']),
});

export type UpdateMemberAccessInput = z.infer<typeof updateMemberAccessSchema>;
