import { Router, type Router as ExpressRouter } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody, validateQuery, validateParams, commonSchemas } from '../middleware/validate';
import { generalLimiter } from '../middleware/rate-limit';
import {
  updateProfileSchema,
  changePasswordSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userQuerySchema,
} from '../schemas/user.schema';
import { z } from 'zod';

const router: ExpressRouter = Router();

router.use(authenticate, generalLimiter);

// 내 정보
router.get('/me', userController.getMe);
router.patch('/me', validateBody(updateProfileSchema), userController.updateMe);
router.patch('/me/password', validateBody(changePasswordSchema), userController.changeMyPassword);

// 관리자용
router.get(
  '/',
  authorize('ADMIN', 'SYSTEM_ADMIN'),
  validateQuery(userQuerySchema),
  userController.getUsers,
);

router.patch(
  '/:userId/role',
  authorize('ADMIN', 'SYSTEM_ADMIN'),
  validateParams(z.object({ userId: commonSchemas.uuid })),
  validateBody(updateUserRoleSchema),
  userController.updateUserRole,
);

router.patch(
  '/:userId/status',
  authorize('ADMIN', 'SYSTEM_ADMIN'),
  validateParams(z.object({ userId: commonSchemas.uuid })),
  validateBody(updateUserStatusSchema),
  userController.updateUserStatus,
);

export default router;
