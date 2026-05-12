import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth';
import * as userService from '../services/user.service';
import type {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
  UserQueryInput,
} from '../schemas/user.schema';

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.getProfile(req.user!.userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.updateProfile(req.user!.userId, req.body as UpdateProfileInput);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const changeMyPassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await userService.changePassword(req.user!.userId, req.body as ChangePasswordInput);
    res.status(200).json({ success: true, message: '비밀번호가 변경되었습니다' });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await userService.getUsers(req.query as unknown as UserQueryInput);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.updateUserRole(req.params['userId'] as string, req.body as UpdateUserRoleInput);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.updateUserStatus(req.params['userId'] as string, req.body as UpdateUserStatusInput);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
