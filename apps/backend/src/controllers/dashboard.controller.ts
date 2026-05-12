import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth';
import * as dashboardService from '../services/dashboard.service';
import { z } from 'zod';

const periodSchema = z.enum(['week', 'month', 'year']).default('month');

export const getDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await dashboardService.getDashboard(req.user!.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await dashboardService.getStats(req.user!.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPeriodStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = periodSchema.safeParse(req.query.period);
    const period = parsed.success ? parsed.data : 'month';
    const data = await dashboardService.getPeriodStats(req.user!.userId, period);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await dashboardService.getWeeklyActivity(req.user!.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getProjectDistribution = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await dashboardService.getProjectDistribution(req.user!.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyTrend = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await dashboardService.getMonthlyTrend(req.user!.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getRecentWorklogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await dashboardService.getRecentWorklogs(req.user!.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
