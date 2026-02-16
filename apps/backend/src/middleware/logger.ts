/**
 * HTTP 요청 로깅 미들웨어
 *
 * @description
 * - 모든 HTTP 요청을 로깅합니다
 * - 요청 메서드, 경로, 상태 코드, 응답 시간을 기록합니다
 */

import { Request, Response, NextFunction } from 'express';
import * as logger from '../utils/logger';

/**
 * HTTP 요청 로깅 미들웨어
 *
 * @description
 * - 요청 시작 시간을 기록합니다
 * - 응답 완료 시 로그를 출력합니다
 * - 응답 시간을 계산하여 함께 기록합니다
 *
 * @param {Request} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 * @param {NextFunction} next - 다음 미들웨어 함수
 *
 * @example
 * // app.ts에서 등록
 * app.use(requestLogger);
 *
 * // 로그 출력 예시:
 * // [2026-02-15T06:24:00.000Z] INFO  GET /api/users 200 - 45ms
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // 요청 시작 시간 기록
  const startTime = Date.now();

  // 응답 완료 이벤트 리스너
  res.on('finish', () => {
    // 응답 시간 계산
    const duration = Date.now() - startTime;

    // 로그 출력
    logger.http(req.method, req.path, res.statusCode, duration);
  });

  next();
};

/**
 * 요청 본문 로깅 미들웨어 (개발 환경용)
 *
 * @description
 * - 요청 본문을 로그에 출력합니다
 * - 민감한 정보(비밀번호 등)는 마스킹 처리합니다
 * - 개발 환경에서만 사용하세요!
 *
 * @param {Request} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 * @param {NextFunction} next - 다음 미들웨어 함수
 *
 * @example
 * // 개발 환경에서만 사용
 * if (env.NODE_ENV === 'development') {
 *   app.use(requestBodyLogger);
 * }
 */
export const requestBodyLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.body && Object.keys(req.body).length > 0) {
    // 민감한 필드 마스킹
    const sanitizedBody = { ...req.body };
    const sensitiveFields = [
      'password',
      'passwordHash',
      'token',
      'refreshToken',
    ];

    sensitiveFields.forEach((field) => {
      if (sanitizedBody[field]) {
        sanitizedBody[field] = '***MASKED***';
      }
    });

    logger.debug('요청 본문', {
      method: req.method,
      path: req.path,
      body: sanitizedBody,
    });
  }

  next();
};
