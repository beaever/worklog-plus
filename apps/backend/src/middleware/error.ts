/**
 * 에러 핸들링 미들웨어
 *
 * @description
 * - 전역 에러 처리
 * - 에러 타입별 적절한 응답 생성
 * - 에러 로깅
 */

import type { Request, Response, NextFunction } from 'express';
import * as logger from '../utils/logger';
import { env } from '../config/env';

/**
 * 커스텀 에러 클래스
 *
 * @description
 * - HTTP 상태 코드와 메시지를 포함하는 에러
 * - 비즈니스 로직에서 의도적으로 발생시키는 에러
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // 운영 중 예상 가능한 에러

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 에러 응답 인터페이스
 */
interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
  stack?: string;
}

/**
 * Prisma 에러 처리
 *
 * @description
 * - Prisma에서 발생하는 데이터베이스 에러를 처리합니다
 * - 에러 코드에 따라 적절한 HTTP 상태 코드와 메시지를 반환합니다
 *
 * @param {any} error - Prisma 에러 객체
 * @returns {object} 상태 코드와 메시지
 */
const handlePrismaError = (
  error: unknown,
): { statusCode: number; message: string } => {
  const err = error as {
    code?: string;
    meta?: { target?: string[] };
    name?: string;
  };
  if (err.code && typeof err.code === 'string' && err.code.startsWith('P')) {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint 위반
        const field = err.meta?.target;
        return {
          statusCode: 409,
          message: `이미 존재하는 ${field ? field.join(', ') : '값'}입니다`,
        };
      }

      case 'P2025':
        // 레코드를 찾을 수 없음
        return {
          statusCode: 404,
          message: '요청한 리소스를 찾을 수 없습니다',
        };

      case 'P2003':
        // Foreign key constraint 위반
        return {
          statusCode: 400,
          message: '잘못된 참조입니다',
        };

      case 'P2014':
        // 관계 제약 조건 위반
        return {
          statusCode: 400,
          message: '관련된 데이터가 존재하여 삭제할 수 없습니다',
        };

      default:
        return {
          statusCode: 500,
          message: '데이터베이스 오류가 발생했습니다',
        };
    }
  }

  if (err.name === 'PrismaClientValidationError') {
    return {
      statusCode: 400,
      message: '잘못된 데이터 형식입니다',
    };
  }

  return {
    statusCode: 500,
    message: '데이터베이스 오류가 발생했습니다',
  };
};

/**
 * 전역 에러 핸들러 미들웨어
 *
 * @description
 * - 모든 에러를 중앙에서 처리합니다
 * - 에러 타입에 따라 적절한 응답을 생성합니다
 * - 개발 환경에서는 스택 트레이스를 포함합니다
 *
 * @param {any} err - 에러 객체
 * @param {Request} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 * @param {NextFunction} next - 다음 미들웨어 함수
 *
 * @example
 * // app.ts에서 마지막에 등록
 * app.use(errorHandler);
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = '서버 내부 오류가 발생했습니다';
  let details: unknown = undefined;

  // ============================================
  // 1. AppError (커스텀 에러)
  // ============================================
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // ============================================
  // 2. Prisma 에러
  // ============================================
  const errObj = err as {
    code?: string;
    name?: string;
    errors?: unknown;
    issues?: unknown;
    message?: string;
    stack?: string;
  };
  if (
    (errObj.code &&
      typeof errObj.code === 'string' &&
      errObj.code.startsWith('P')) ||
    errObj.name === 'PrismaClientValidationError'
  ) {
    const prismaError = handlePrismaError(err);
    statusCode = prismaError.statusCode;
    message = prismaError.message;
  }

  // ============================================
  // 3. Validation 에러 (Zod 등)
  // ============================================
  else if (errObj.name === 'ValidationError' || errObj.name === 'ZodError') {
    statusCode = 400;
    message = '입력 데이터가 유효하지 않습니다';
    details = errObj.errors || errObj.issues;
  }

  // ============================================
  // 4. JWT 에러
  // ============================================
  else if (errObj.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '유효하지 않은 토큰입니다';
  } else if (errObj.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '토큰이 만료되었습니다';
  }

  // ============================================
  // 5. 일반 에러
  // ============================================
  else if (err instanceof Error) {
    message = err.message;
  }

  // ============================================
  // 에러 로깅
  // ============================================
  logger.error('에러 발생', {
    method: req.method,
    path: req.path,
    statusCode,
    message,
    error: errObj.message,
    stack: errObj.stack,
    user: (req as { user?: { userId?: string } }).user?.userId,
  });

  // ============================================
  // 에러 응답 생성
  // ============================================
  const errorResponse: ErrorResponse = {
    success: false,
    error: message,
  };

  // 개발 환경에서는 추가 정보 포함
  if (env.NODE_ENV === 'development') {
    if (details) {
      errorResponse.details = details;
    }
    if (errObj.stack) {
      errorResponse.stack = errObj.stack;
    }
  }

  // 응답 전송
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found 핸들러
 *
 * @description
 * - 존재하지 않는 라우트에 대한 요청을 처리합니다
 * - errorHandler 미들웨어 이전에 등록해야 합니다
 *
 * @param {Request} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 *
 * @example
 * // app.ts에서 모든 라우트 이후에 등록
 * app.use(notFoundHandler);
 * app.use(errorHandler);
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: '요청하신 리소스를 찾을 수 없습니다',
    path: req.path,
  });
};

/**
 * 비동기 핸들러 래퍼
 *
 * @description
 * - 비동기 라우트 핸들러의 에러를 자동으로 catch합니다
 * - try-catch 없이 async/await를 사용할 수 있습니다
 *
 * @param {Function} fn - 비동기 라우트 핸들러 함수
 * @returns {Function} 래핑된 핸들러 함수
 *
 * @example
 * // try-catch 없이 사용
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await prisma.user.findMany();
 *   res.json({ success: true, data: users });
 * }));
 *
 * // 에러 발생 시 자동으로 errorHandler로 전달됨
 * router.post('/users', asyncHandler(async (req, res) => {
 *   const user = await prisma.user.create({ data: req.body });
 *   res.json({ success: true, data: user });
 * }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
