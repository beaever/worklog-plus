/**
 * 환경 변수 관리 모듈
 * 
 * @description
 * - .env 파일에서 환경 변수를 로드하고 검증합니다
 * - 타입 안전한 환경 변수 접근을 제공합니다
 * - 필수 환경 변수가 없으면 에러를 발생시킵니다
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// .env 파일 로드
dotenv.config();

/**
 * 환경 변수 스키마 정의
 * Zod를 사용하여 환경 변수의 타입과 필수 여부를 검증합니다
 */
const envSchema = z.object({
  // 데이터베이스
  DATABASE_URL: z.string().min(1, '데이터베이스 URL이 필요합니다'),

  // JWT 시크릿
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT Access Secret은 최소 32자 이상이어야 합니다'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT Refresh Secret은 최소 32자 이상이어야 합니다'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // 서버 설정
  PORT: z.string().default('8080'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // 로그
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

/**
 * 환경 변수 검증 및 파싱
 * 
 * @throws {Error} 필수 환경 변수가 없거나 형식이 잘못된 경우
 */
const parseEnv = () => {
  try {
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
      JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      CORS_ORIGIN: process.env.CORS_ORIGIN,
      LOG_LEVEL: process.env.LOG_LEVEL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ 환경 변수 검증 실패:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error('환경 변수 설정을 확인해주세요. .env.example 파일을 참고하세요.');
    }
    throw error;
  }
};

/**
 * 검증된 환경 변수
 * 
 * @example
 * import { env } from './config/env';
 * console.log(env.PORT); // '8080'
 * console.log(env.NODE_ENV); // 'development'
 */
export const env = parseEnv();

/**
 * 환경 변수 타입
 * 다른 모듈에서 타입 추론에 사용할 수 있습니다
 */
export type Env = z.infer<typeof envSchema>;
