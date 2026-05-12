import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

vi.mock('../../services/auth.service', () => ({
  register: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
  getCurrentUser: vi.fn(),
}));

import * as authService from '../../services/auth.service';
import * as authController from '../auth.controller';

const mockAuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: { id: 'user-1', email: 'test@example.com', name: '테스트', role: 'USER' },
};

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: '테스트',
  role: 'USER',
  passwordHash: 'hashed',
  status: 'ACTIVE',
  avatarUrl: null,
  lastLoginAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function mockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

function mockNext(): NextFunction {
  return vi.fn() as NextFunction;
}

describe('auth.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('로그인 성공 시 httpOnly 쿠키로 accessToken, refreshToken을 설정해야 함', async () => {
      vi.mocked(authService.login).mockResolvedValue(mockAuthResponse);

      const req = { body: { email: 'test@example.com', password: 'Password123!' } } as Request;
      const res = mockRes();

      await authController.login(req, res, mockNext());

      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'mock-access-token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'mock-refresh-token',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('로그인 성공 시 응답 body에 user만 포함하고 토큰은 제외해야 함', async () => {
      vi.mocked(authService.login).mockResolvedValue(mockAuthResponse);

      const req = { body: { email: 'test@example.com', password: 'Password123!' } } as Request;
      const res = mockRes();

      await authController.login(req, res, mockNext());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { user: mockAuthResponse.user },
      });
    });

    it('로그인 실패 시 next(error)를 호출해야 함', async () => {
      const error = new Error('인증 실패');
      vi.mocked(authService.login).mockRejectedValue(error);

      const req = { body: { email: 'wrong@example.com', password: 'wrong' } } as Request;
      const res = mockRes();
      const next = mockNext();

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('register', () => {
    it('회원가입 성공 시 httpOnly 쿠키로 토큰을 설정해야 함', async () => {
      vi.mocked(authService.register).mockResolvedValue(mockAuthResponse);

      const req = {
        body: { email: 'new@example.com', password: 'Password123!', name: '신규' },
      } as Request;
      const res = mockRes();

      await authController.register(req, res, mockNext());

      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'mock-access-token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'mock-refresh-token',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('회원가입 성공 시 201 상태와 user만 반환해야 함', async () => {
      vi.mocked(authService.register).mockResolvedValue(mockAuthResponse);

      const req = {
        body: { email: 'new@example.com', password: 'Password123!', name: '신규' },
      } as Request;
      const res = mockRes();

      await authController.register(req, res, mockNext());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { user: mockAuthResponse.user },
      });
    });
  });

  describe('logout', () => {
    it('로그아웃 시 accessToken, refreshToken 쿠키를 삭제해야 함', async () => {
      vi.mocked(authService.logout).mockResolvedValue(undefined);

      const req = {
        body: {},
        user: { userId: 'user-1', email: 'test@example.com', role: 'USER' },
        cookies: { refreshToken: 'mock-refresh-token' },
      } as unknown as Request;
      const res = mockRes();

      await authController.logout(req, res, mockNext());

      expect(res.clearCookie).toHaveBeenCalledWith('accessToken', expect.any(Object));
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('refreshToken', () => {
    it('요청 쿠키에서 refreshToken을 읽어 새 토큰을 발급해야 함', async () => {
      vi.mocked(authService.refresh).mockResolvedValue(mockAuthResponse);

      const req = {
        cookies: { refreshToken: 'valid-refresh-token' },
        body: {},
      } as unknown as Request;
      const res = mockRes();

      await authController.refreshToken(req, res, mockNext());

      expect(authService.refresh).toHaveBeenCalledWith('valid-refresh-token');
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'mock-access-token',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('쿠키에 refreshToken이 없으면 next(error)를 호출해야 함', async () => {
      const req = {
        cookies: {},
        body: {},
      } as unknown as Request;
      const res = mockRes();
      const next = mockNext();

      await authController.refreshToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(authService.refresh).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('인증된 사용자 정보를 반환하되 passwordHash는 제외해야 함', async () => {
      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser as any);

      const req = {
        user: { userId: 'user-1', email: 'test@example.com', role: 'USER' },
      } as unknown as Request;
      const res = mockRes();

      await authController.getCurrentUser(req, res, mockNext());

      const jsonCall = vi.mocked(res.json).mock.calls[0]?.[0];
      expect(jsonCall.success).toBe(true);
      expect(jsonCall.data).not.toHaveProperty('passwordHash');
    });
  });
});
