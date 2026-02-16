/**
 * 인증 라우트
 *
 * @description
 * - 인증 관련 엔드포인트 정의
 * - 미들웨어 적용
 */

import { Router, type Router as ExpressRouter } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../schemas/auth.schema';

const router: ExpressRouter = Router();

/**
 * POST /api/auth/register
 * 회원가입
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * POST /api/auth/login
 * 로그인
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * POST /api/auth/logout
 * 로그아웃
 */
router.post('/logout', authController.logout);

/**
 * POST /api/auth/refresh
 * 토큰 갱신
 */
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refreshToken,
);

/**
 * GET /api/auth/me
 * 현재 사용자 정보 조회
 *
 * @requires Authentication
 */
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
