import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';
import type { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { env } from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000, // 15분
  });
  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  });
}

function clearAuthCookies(res: Response): void {
  res.clearCookie('accessToken', COOKIE_OPTIONS);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
}

export const register = async (
  req: Request<object, object, RegisterInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(201).json({
      success: true,
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(200).json({
      success: true,
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    const userId = req.user?.userId;

    await authService.logout({
      ...(refreshToken !== undefined && { refreshToken }),
      ...(userId !== undefined && { userId }),
    });

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: '로그아웃되었습니다',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;

    if (!token) {
      throw new AppError(401, 'Refresh Token이 필요합니다');
    }

    const result = await authService.refresh(token);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(200).json({
      success: true,
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError(401, '인증되지 않은 사용자입니다');
    }

    const user = await authService.getCurrentUser(req.user.userId);
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};
