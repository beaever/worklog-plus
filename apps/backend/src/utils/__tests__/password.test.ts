import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../password';

describe('Password Utils', () => {
  const testPassword = 'TestPassword123!';

  describe('hashPassword', () => {
    it('비밀번호를 해싱해야 함', async () => {
      const hash = await hashPassword(testPassword);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(testPassword);
      expect(hash.startsWith('$2')).toBe(true);
    });

    it('같은 비밀번호라도 다른 해시를 생성해야 함', async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('올바른 비밀번호를 검증해야 함', async () => {
      const hash = await hashPassword(testPassword);
      const isValid = await comparePassword(testPassword, hash);
      
      expect(isValid).toBe(true);
    });

    it('잘못된 비밀번호를 거부해야 함', async () => {
      const hash = await hashPassword(testPassword);
      const isValid = await comparePassword('WrongPassword', hash);
      
      expect(isValid).toBe(false);
    });
  });
});
