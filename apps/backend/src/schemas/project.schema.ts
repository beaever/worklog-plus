import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, '프로젝트 이름을 입력해주세요').max(100, '프로젝트 이름은 100자 이하여야 합니다').trim(),
  description: z.string().max(1000, '설명은 1000자 이하여야 합니다').trim().optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'DONE']).default('PLANNED'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식은 YYYY-MM-DD 이어야 합니다'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식은 YYYY-MM-DD 이어야 합니다').optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z.string().min(1, '프로젝트 이름을 입력해주세요').max(100).trim().optional(),
  description: z.string().max(1000).trim().optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'DONE']).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const projectQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  status: z.enum(['PLANNED', 'ACTIVE', 'DONE']).optional(),
  search: z.string().optional(),
});

export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;
