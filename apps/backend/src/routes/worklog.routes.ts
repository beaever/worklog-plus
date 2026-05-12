import { Router, type Router as ExpressRouter } from 'express';
import * as worklogController from '../controllers/worklog.controller';
import { authenticate } from '../middleware/auth';
import { validateBody, validateQuery, validateParams, commonSchemas } from '../middleware/validate';
import { generalLimiter } from '../middleware/rate-limit';
import {
  createWorklogSchema,
  updateWorklogSchema,
  worklogQuerySchema,
} from '../schemas/worklog.schema';
import { z } from 'zod';

const router: ExpressRouter = Router();

router.use(authenticate, generalLimiter);

router.post('/', validateBody(createWorklogSchema), worklogController.createWorklog);

router.get('/', validateQuery(worklogQuerySchema), worklogController.getWorklogs);

router.get(
  '/:id',
  validateParams(z.object({ id: commonSchemas.uuid })),
  worklogController.getWorklog,
);

router.patch(
  '/:id',
  validateParams(z.object({ id: commonSchemas.uuid })),
  validateBody(updateWorklogSchema),
  worklogController.updateWorklog,
);

router.delete(
  '/:id',
  validateParams(z.object({ id: commonSchemas.uuid })),
  worklogController.deleteWorklog,
);

export default router;
