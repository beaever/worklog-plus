import { z } from 'zod';

export const createWorklogSchema = z.object({
  projectId: z.string().uuid('올바른 프로젝트 ID 형식이 아닙니다'),
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이하여야 합니다').trim(),
  content: z.string().min(1, '내용을 입력해주세요').trim(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식은 YYYY-MM-DD 이어야 합니다'),
  duration: z.number().int().min(1, '소요 시간은 1 이상이어야 합니다').max(24, '소요 시간은 24시간 이하여야 합니다'),
});

export type CreateWorklogInput = z.infer<typeof createWorklogSchema>;

export const updateWorklogSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  content: z.string().min(1).trim().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  duration: z.number().int().min(1).max(24).optional(),
});

export type UpdateWorklogInput = z.infer<typeof updateWorklogSchema>;

export const worklogQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  projectId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type WorklogQueryInput = z.infer<typeof worklogQuerySchema>;
