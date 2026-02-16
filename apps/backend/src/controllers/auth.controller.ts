/**
 * 인증 컨트롤러
 * 
 * @description
 * - HTTP 요청/응답 처리
 * - 서비스 계층 호출
 * - 에러 처리
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { RegisterInput, LoginInput, RefreshTokenInput } from '../schemas/auth.schema';
import { AuthRequest } from '../middleware/auth';

/**
 * 회원가입
 * 
 * POST /api/auth/register
 */
export const register = async (
  req: Request<object, object, RegisterInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const result = await authService.register(email, password, name);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 로그인
 * 
 * POST /api/auth/login
 */
export const login = async (
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 로그아웃
 * 
 * POST /api/auth/logout
 */
export const logout = async (
  req: Request<object, object, { refreshToken?: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.status(200).json({
      success: true,
      message: '로그아웃되었습니다',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 토큰 갱신
 * 
 * POST /api/auth/refresh
 */
export const refreshToken = async (
  req: Request<object, object, RefreshTokenInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refresh(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 현재 사용자 정보 조회
 * 
 * GET /api/auth/me
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new Error('인증되지 않은 사용자입니다');
    }

    const user = await authService.getCurrentUser(req.user.userId);

    // 비밀번호 해시 제거
    const { passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};
