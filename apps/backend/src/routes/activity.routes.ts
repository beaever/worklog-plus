import { Router, type Router as ExpressRouter } from 'express';
import * as activityController from '../controllers/activity.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateParams, commonSchemas } from '../middleware/validate';
import { generalLimiter } from '../middleware/rate-limit';
import { z } from 'zod';

const router: ExpressRouter = Router({ mergeParams: true });

router.use(authenticate, generalLimiter);

router.get(
  '/',
  validateParams(z.object({ projectId: commonSchemas.uuid })),
  activityController.getProjectActivities,
);

export default router;

// 감사 로그용 별도 라우터
export const auditRouter: ExpressRouter = Router();
auditRouter.use(authenticate, generalLimiter);
auditRouter.get('/', authorize('ADMIN', 'SYSTEM_ADMIN'), activityController.getAuditLogs);
