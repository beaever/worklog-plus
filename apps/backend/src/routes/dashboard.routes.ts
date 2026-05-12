import { Router, type Router as ExpressRouter } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';
import { generalLimiter } from '../middleware/rate-limit';

const router: ExpressRouter = Router();

router.use(authenticate, generalLimiter);

router.get('/', dashboardController.getDashboard);
router.get('/stats', dashboardController.getStats);
router.get('/period-stats', dashboardController.getPeriodStats);
router.get('/weekly-activity', dashboardController.getWeeklyActivity);
router.get('/project-distribution', dashboardController.getProjectDistribution);
router.get('/monthly-trend', dashboardController.getMonthlyTrend);
router.get('/recent-worklogs', dashboardController.getRecentWorklogs);

export default router;
