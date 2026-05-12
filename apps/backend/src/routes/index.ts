/**
 * 메인 라우터
 *
 * @description
 * - 모든 API 라우트를 통합
 * - 버전 관리 (/api/v1)
 */

import { Router, type Router as ExpressRouter } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import worklogRoutes from './worklog.routes';
import userRoutes from './user.routes';
import memberRoutes from './member.routes';
import activityRoutes, { auditRouter } from './activity.routes';
import dashboardRoutes from './dashboard.routes';

const router: ExpressRouter = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/projects/:projectId/members', memberRoutes);
router.use('/projects/:projectId/activity-logs', activityRoutes);
router.use('/worklogs', worklogRoutes);
router.use('/users', userRoutes);
router.use('/audit-logs', auditRouter);
router.use('/dashboard', dashboardRoutes);

export default router;
