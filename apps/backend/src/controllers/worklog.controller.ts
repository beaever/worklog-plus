import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth';
import * as worklogService from '../services/worklog.service';
import type { CreateWorklogInput, UpdateWorklogInput, WorklogQueryInput } from '../schemas/worklog.schema';

export const createWorklog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const worklog = await worklogService.createWorklog(
      req.user!.userId,
      req.body as CreateWorklogInput,
    );
    res.status(201).json({ success: true, data: worklog });
  } catch (error) {
    next(error);
  }
};

export const getWorklogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await worklogService.getWorklogs(
      req.user!.userId,
      req.user!.role,
      req.query as unknown as WorklogQueryInput,
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getWorklog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const worklog = await worklogService.getWorklogById(
      req.params['id'] as string,
      req.user!.userId,
      req.user!.role,
    );
    res.status(200).json({ success: true, data: worklog });
  } catch (error) {
    next(error);
  }
};

export const updateWorklog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const worklog = await worklogService.updateWorklog(
      req.params['id'] as string,
      req.user!.userId,
      req.user!.role,
      req.body as UpdateWorklogInput,
    );
    res.status(200).json({ success: true, data: worklog });
  } catch (error) {
    next(error);
  }
};

export const deleteWorklog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await worklogService.deleteWorklog(req.params['id'] as string, req.user!.userId, req.user!.role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
