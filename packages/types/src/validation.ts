import { z } from 'zod';

/**
 * 로그인 폼 스키마
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(4, '비밀번호는 4자 이상이어야 합니다'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 회원가입 폼 스키마
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, '이름을 입력해주세요')
      .min(2, '이름은 2자 이상이어야 합니다')
      .max(50, '이름은 50자 이하여야 합니다'),
    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요')
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        '비밀번호는 영문과 숫자를 포함해야 합니다',
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * 프로젝트 폼 스키마
 */
export const projectSchema = z.object({
  name: z
    .string()
    .min(1, '프로젝트 이름을 입력해주세요')
    .max(100, '프로젝트 이름은 100자 이하여야 합니다'),
  description: z
    .string()
    .max(500, '설명은 500자 이하여야 합니다')
    .optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'DONE'], {
    errorMap: () => ({ message: '상태를 선택해주세요' }),
  }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

/**
 * 업무일지 폼 스키마
 */
export const worklogSchema = z.object({
  projectId: z.string().min(1, '프로젝트를 선택해주세요'),
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(200, '제목은 200자 이하여야 합니다'),
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(10000, '내용은 10000자 이하여야 합니다'),
  date: z.string().min(1, '날짜를 선택해주세요'),
  duration: z
    .number()
    .min(0.5, '작업 시간은 최소 0.5시간이어야 합니다')
    .max(24, '작업 시간은 24시간을 초과할 수 없습니다'),
});

export type WorklogFormData = z.infer<typeof worklogSchema>;

/**
 * 프로필 수정 폼 스키마
 */
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 2자 이상이어야 합니다')
    .max(50, '이름은 50자 이하여야 합니다'),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * 비밀번호 변경 폼 스키마
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    newPassword: z
      .string()
      .min(1, '새 비밀번호를 입력해주세요')
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        '비밀번호는 영문과 숫자를 포함해야 합니다',
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
