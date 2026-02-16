/**
 * 인증 관련 Zod 스키마
 * 
 * @description
 * - 요청 데이터 검증
 * - 타입 안전성 보장
 * - 자동 타입 추론
 */

import { z } from 'zod';

/**
 * 회원가입 요청 스키마
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email('유효한 이메일 주소를 입력해주세요')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      '비밀번호는 영문과 숫자를 포함해야 합니다',
    ),
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(100, '이름은 100자를 초과할 수 없습니다')
    .trim(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * 로그인 요청 스키마
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('유효한 이메일 주소를 입력해주세요')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * 토큰 갱신 요청 스키마
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh Token을 입력해주세요'),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
