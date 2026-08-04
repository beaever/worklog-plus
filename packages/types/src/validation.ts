import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, '이름을 입력해주세요')
      .min(2, '이름은 2자 이상이어야 합니다')
      .max(100, '이름은 100자 이하여야 합니다')
      .trim(),
    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .email('올바른 이메일 형식이 아닙니다')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요')
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        '비밀번호는 영문과 숫자를 포함해야 합니다',
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
