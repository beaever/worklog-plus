import { describe, it, expect } from 'vitest';
import { cn, formatDate, generateUUID } from '../utils';

describe('Utils', () => {
  describe('cn', () => {
    it('클래스명을 병합해야 함', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('조건부 클래스명을 처리해야 함', () => {
      const result = cn('base', { active: true, disabled: false });
      expect(result).toContain('base');
      expect(result).toContain('active');
      expect(result).not.toContain('disabled');
    });
  });

  describe('formatDate', () => {
    it('날짜를 포맷팅해야 함', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDate(date);
      expect(result).toBe('2024-01-15');
    });

    it('문자열 날짜를 포맷팅해야 함', () => {
      const result = formatDate('2024-01-15T10:30:00');
      expect(result).toBe('2024-01-15');
    });
  });

  describe('generateUUID', () => {
    it('UUID를 생성해야 함', () => {
      const uuid = generateUUID();
      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBeGreaterThan(0);
    });

    it('고유한 UUID를 생성해야 함', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });
});
