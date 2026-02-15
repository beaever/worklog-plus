/**
 * 요청 검증 미들웨어
 * 
 * @description
 * - Zod 스키마를 사용한 요청 데이터 검증
 * - body, query, params 검증 지원
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * 요청 본문 검증 미들웨어
 * 
 * @description
 * - req.body를 Zod 스키마로 검증합니다
 * - 검증 실패 시 400 Bad Request 응답을 반환합니다
 * 
 * @param {ZodSchema} schema - Zod 검증 스키마
 * @returns {Function} Express 미들웨어 함수
 * 
 * @example
 * const createUserSchema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 *   name: z.string().min(1),
 * });
 * 
 * router.post('/users', validateBody(createUserSchema), createUser);
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // 스키마 검증
      const validated = schema.parse(req.body);
      
      // 검증된 데이터로 교체
      req.body = validated;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: '입력 데이터가 유효하지 않습니다',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      
      next(error);
    }
  };
};

/**
 * 쿼리 파라미터 검증 미들웨어
 * 
 * @description
 * - req.query를 Zod 스키마로 검증합니다
 * - 검증 실패 시 400 Bad Request 응답을 반환합니다
 * 
 * @param {ZodSchema} schema - Zod 검증 스키마
 * @returns {Function} Express 미들웨어 함수
 * 
 * @example
 * const paginationSchema = z.object({
 *   page: z.string().optional().transform(Number),
 *   limit: z.string().optional().transform(Number),
 * });
 * 
 * router.get('/users', validateQuery(paginationSchema), getUsers);
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: '쿼리 파라미터가 유효하지 않습니다',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      
      next(error);
    }
  };
};

/**
 * URL 파라미터 검증 미들웨어
 * 
 * @description
 * - req.params를 Zod 스키마로 검증합니다
 * - 검증 실패 시 400 Bad Request 응답을 반환합니다
 * 
 * @param {ZodSchema} schema - Zod 검증 스키마
 * @returns {Function} Express 미들웨어 함수
 * 
 * @example
 * const idSchema = z.object({
 *   id: z.string().uuid(),
 * });
 * 
 * router.get('/users/:id', validateParams(idSchema), getUser);
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'URL 파라미터가 유효하지 않습니다',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      
      next(error);
    }
  };
};

/**
 * 공통 검증 스키마
 * 
 * @description
 * - 자주 사용되는 검증 스키마를 미리 정의합니다
 */
export const commonSchemas = {
  /**
   * UUID 검증
   */
  uuid: z.string().uuid('유효한 UUID 형식이 아닙니다'),

  /**
   * 이메일 검증
   */
  email: z.string().email('유효한 이메일 형식이 아닙니다'),

  /**
   * 비밀번호 검증 (최소 8자, 영문+숫자)
   */
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(128, '비밀번호는 128자를 초과할 수 없습니다')
    .regex(/[a-zA-Z]/, '비밀번호는 영문자를 포함해야 합니다')
    .regex(/\d/, '비밀번호는 숫자를 포함해야 합니다'),

  /**
   * 페이지네이션 파라미터
   */
  pagination: z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform((val) => parseInt(val, 10)),
    limit: z
      .string()
      .optional()
      .default('10')
      .transform((val) => parseInt(val, 10)),
  }),

  /**
   * 날짜 문자열 (ISO 8601)
   */
  dateString: z.string().datetime('유효한 날짜 형식이 아닙니다 (ISO 8601)'),

  /**
   * 날짜 (YYYY-MM-DD)
   */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '유효한 날짜 형식이 아닙니다 (YYYY-MM-DD)'),
};
