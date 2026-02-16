/**
 * 메인 라우터
 *
 * @description
 * - 모든 API 라우트를 통합
 * - 버전 관리 (/api/v1)
 */

import { Router, type Router as ExpressRouter } from 'express';
import authRoutes from './auth.routes';

const router: ExpressRouter = Router();

/**
 * API 라우트 등록
 */
router.use('/auth', authRoutes);

export default router;
