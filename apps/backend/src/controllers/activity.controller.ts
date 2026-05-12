import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth';
import * as activityService from '../services/activity.service';
import { extractPaginationFromQuery } from '../utils/pagination';

export const getProjectActivities = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit } = extractPaginationFromQuery(req.query as Record<string, unknown>);
    const result = await activityService.getProjectActivities(
      req.params['projectId'] as string,
      req.user!.userId,
      req.user!.role,
      page,
      limit,
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit } = extractPaginationFromQuery(req.query as Record<string, unknown>);
    const result = await activityService.getAuditLogs(page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
