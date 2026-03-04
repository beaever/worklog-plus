import { describe, it, expect } from 'vitest';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  decodeToken,
} from '../jwt';

describe('JWT Utils', () => {
  const testPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
    role: 'USER' as const,
  };

  describe('generateAccessToken', () => {
    it('액세스 토큰을 생성해야 함', () => {
      const token = generateAccessToken(
        testPayload.userId,
        testPayload.email,
        testPayload.role,
      );
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('generateRefreshToken', () => {
    it('리프레시 토큰을 생성해야 함', () => {
      const token = generateRefreshToken(testPayload.userId);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyAccessToken', () => {
    it('유효한 액세스 토큰을 검증해야 함', () => {
      const token = generateAccessToken(
        testPayload.userId,
        testPayload.email,
        testPayload.role,
      );
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('잘못된 토큰에 대해 에러를 발생시켜야 함', () => {
      expect(() => verifyAccessToken('invalid-token')).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('토큰을 디코딩해야 함', () => {
      const token = generateAccessToken(
        testPayload.userId,
        testPayload.email,
        testPayload.role,
      );
      const decoded = decodeToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(testPayload.userId);
    });

    it('잘못된 토큰에 대해 null을 반환해야 함', () => {
      const decoded = decodeToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });
});
