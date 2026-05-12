import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../../middleware/error';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('../../utils/password', () => ({
  hashPassword: vi.fn().mockResolvedValue('$2b$hashed'),
  verifyPassword: vi.fn(),
}));

vi.mock('../../utils/jwt', () => ({
  generateAccessToken: vi.fn().mockReturnValue('mock-access-token'),
  generateRefreshToken: vi.fn().mockReturnValue('mock-refresh-token'),
  verifyRefreshToken: vi.fn(),
}));

import { prisma } from '../../lib/prisma';
import { hashPassword, verifyPassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import * as authService from '../auth.service';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: '테스트 사용자',
  passwordHash: '$2b$hashed',
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
  avatarUrl: null,
  status: 'ACTIVE',
};

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('새 사용자를 등록하고 토큰을 반환해야 함', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as any);

      const result = await authService.register('test@example.com', 'Password123!', '테스트 사용자');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(hashPassword).toHaveBeenCalledWith('Password123!');
      expect(result).toMatchObject({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: { id: 'user-1', email: 'test@example.com', name: '테스트 사용자', role: 'USER' },
      });
    });

    it('이메일 중복 시 409 에러를 던져야 함', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      await expect(
        authService.register('test@example.com', 'Password123!', '테스트'),
      ).rejects.toThrow(AppError);

      await expect(
        authService.register('test@example.com', 'Password123!', '테스트'),
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('login', () => {
    it('올바른 자격증명으로 로그인하면 토큰을 반환해야 함', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(verifyPassword).mockResolvedValue(true);
      vi.mocked(prisma.refreshToken.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as any);

      const result = await authService.login('test@example.com', 'Password123!');

      expect(result).toMatchObject({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: { id: 'user-1', email: 'test@example.com' },
      });
    });

    it('존재하지 않는 이메일로 로그인 시 401 에러를 던져야 함', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(authService.login('none@example.com', 'Password123!')).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('잘못된 비밀번호로 로그인 시 401 에러를 던져야 함', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(verifyPassword).mockResolvedValue(false);

      await expect(authService.login('test@example.com', 'WrongPassword')).rejects.toMatchObject({
        statusCode: 401,
      });
    });
  });

  describe('logout', () => {
    it('refreshToken이 있으면 해당 토큰만 삭제해야 함', async () => {
      vi.mocked(prisma.refreshToken.deleteMany).mockResolvedValue({ count: 1 });

      await authService.logout({ refreshToken: 'some-token' });

      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { token: 'some-token' },
      });
    });

    it('userId만 있으면 해당 사용자의 토큰을 모두 삭제해야 함', async () => {
      vi.mocked(prisma.refreshToken.deleteMany).mockResolvedValue({ count: 2 });

      await authService.logout({ userId: 'user-1' });

      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });
  });

  describe('refresh', () => {
    it('유효한 refresh token으로 새 토큰을 발급해야 함', async () => {
      vi.mocked(verifyRefreshToken).mockReturnValue({ userId: 'user-1', iat: 0, exp: 9999999999 });
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
        token: 'valid-token',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 86400000),
        user: mockUser,
      } as any);
      vi.mocked(prisma.$transaction).mockResolvedValue([{}, {}] as any);

      const result = await authService.refresh('valid-token');

      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
    });

    it('payload가 null이면 401 에러를 던져야 함', async () => {
      vi.mocked(verifyRefreshToken).mockReturnValue(null);

      await expect(authService.refresh('bad-token')).rejects.toMatchObject({ statusCode: 401 });
    });

    it('DB에 없는 토큰이면 401 에러를 던져야 함', async () => {
      vi.mocked(verifyRefreshToken).mockReturnValue({ userId: 'user-1', iat: 0, exp: 9999999999 });
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(null);

      await expect(authService.refresh('ghost-token')).rejects.toMatchObject({ statusCode: 401 });
    });

    it('만료된 토큰이면 401 에러를 던져야 함', async () => {
      vi.mocked(verifyRefreshToken).mockReturnValue({ userId: 'user-1', iat: 0, exp: 9999999999 });
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
        token: 'expired-token',
        userId: 'user-1',
        expiresAt: new Date(Date.now() - 1000),
        user: mockUser,
      } as any);
      vi.mocked(prisma.refreshToken.delete).mockResolvedValue({} as any);

      await expect(authService.refresh('expired-token')).rejects.toMatchObject({ statusCode: 401 });
    });
  });
});
