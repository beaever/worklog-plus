import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth';
import * as projectService from '../services/project.service';
import type { CreateProjectInput, UpdateProjectInput, ProjectQueryInput } from '../schemas/project.schema';

export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const project = await projectService.createProject(
      req.user!.userId,
      req.body as CreateProjectInput,
    );
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await projectService.getProjects(
      req.user!.userId,
      req.query as unknown as ProjectQueryInput,
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const project = await projectService.getProjectById(req.params['id'] as string, req.user!.userId);
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const project = await projectService.updateProject(
      req.params['id'] as string,
      req.user!.userId,
      req.user!.role,
      req.body as UpdateProjectInput,
    );
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await projectService.deleteProject(req.params['id'] as string, req.user!.userId, req.user!.role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
