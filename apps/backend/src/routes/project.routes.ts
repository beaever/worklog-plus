import { Router, type Router as ExpressRouter } from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody, validateQuery, validateParams, commonSchemas } from '../middleware/validate';
import { generalLimiter } from '../middleware/rate-limit';
import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
} from '../schemas/project.schema';
import { z } from 'zod';

const router: ExpressRouter = Router();

router.use(authenticate, generalLimiter);

router.post(
  '/',
  authorize('MANAGER', 'ADMIN', 'SYSTEM_ADMIN'),
  validateBody(createProjectSchema),
  projectController.createProject,
);

router.get(
  '/',
  validateQuery(projectQuerySchema),
  projectController.getProjects,
);

router.get(
  '/:id',
  validateParams(z.object({ id: commonSchemas.uuid })),
  projectController.getProject,
);

router.patch(
  '/:id',
  validateParams(z.object({ id: commonSchemas.uuid })),
  validateBody(updateProjectSchema),
  projectController.updateProject,
);

router.delete(
  '/:id',
  validateParams(z.object({ id: commonSchemas.uuid })),
  projectController.deleteProject,
);

export default router;
