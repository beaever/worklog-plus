import { Router, type Router as ExpressRouter } from 'express';
import * as memberController from '../controllers/member.controller';
import { authenticate } from '../middleware/auth';
import { validateBody, validateParams, commonSchemas } from '../middleware/validate';
import { generalLimiter } from '../middleware/rate-limit';
import { addMemberSchema, updateMemberAccessSchema } from '../schemas/member.schema';
import { z } from 'zod';

// project.routes.ts에서 mergeParams: true로 마운트됨
const router: ExpressRouter = Router({ mergeParams: true });

router.use(authenticate, generalLimiter);

const projectUserParams = z.object({
  projectId: commonSchemas.uuid,
  userId: commonSchemas.uuid,
});
const projectParams = z.object({ projectId: commonSchemas.uuid });

router.get('/', validateParams(projectParams), memberController.getMembers);

router.post(
  '/',
  validateParams(projectParams),
  validateBody(addMemberSchema),
  memberController.addMember,
);

router.patch(
  '/:userId',
  validateParams(projectUserParams),
  validateBody(updateMemberAccessSchema),
  memberController.updateMemberAccess,
);

router.delete(
  '/:userId',
  validateParams(projectUserParams),
  memberController.removeMember,
);

export default router;
