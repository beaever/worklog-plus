import { Router, type Router as ExpressRouter } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rate-limit';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../schemas/auth.schema';

const router: ExpressRouter = Router();

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register,
);

router.post('/login', authLimiter, validate(loginSchema), authController.login);

router.post('/logout', authenticate, authController.logout);

router.post(
  '/refresh',
  authLimiter,
  validate(refreshTokenSchema),
  authController.refreshToken,
);

router.get('/me', authenticate, authController.getCurrentUser);

export default router;
