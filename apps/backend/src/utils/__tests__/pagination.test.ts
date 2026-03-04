import { describe, it, expect } from 'vitest';
import {
  getPaginationParams,
  createPaginatedResponse,
  extractPaginationFromQuery,
} from '../pagination';

describe('Pagination Utils', () => {
  describe('getPaginationParams', () => {
    it('올바른 skip과 take 값을 계산해야 함', () => {
      const result = getPaginationParams(1, 10);
      expect(result).toEqual({ skip: 0, take: 10, page: 1, limit: 10 });
    });

    it('2페이지의 skip과 take 값을 계산해야 함', () => {
      const result = getPaginationParams(2, 10);
      expect(result).toEqual({ skip: 10, take: 10, page: 2, limit: 10 });
    });

    it('기본값을 사용해야 함', () => {
      const result = getPaginationParams();
      expect(result).toEqual({ skip: 0, take: 10, page: 1, limit: 10 });
    });
  });

  describe('createPaginatedResponse', () => {
    it('페이지네이션 응답을 생성해야 함', () => {
      const data = [1, 2, 3];
      const result = createPaginatedResponse(data, 100, 1, 10);

      expect(result).toEqual({
        data,
        meta: {
          total: 100,
          page: 1,
          limit: 10,
          totalPages: 10,
          hasNext: true,
          hasPrev: false,
        },
      });
    });

    it('마지막 페이지를 올바르게 처리해야 함', () => {
      const data = [1, 2, 3];
      const result = createPaginatedResponse(data, 23, 3, 10);

      expect(result.meta.hasNext).toBe(false);
      expect(result.meta.hasPrev).toBe(true);
    });
  });

  describe('extractPaginationFromQuery', () => {
    it('쿼리에서 페이지네이션 파라미터를 추출해야 함', () => {
      const query = { page: '2', limit: '15' };
      const result = extractPaginationFromQuery(query);

      expect(result).toEqual({ page: 2, limit: 15 });
    });

    it('기본값을 사용해야 함', () => {
      const query = {};
      const result = extractPaginationFromQuery(query);

      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it('잘못된 값에 대해 기본값을 사용해야 함', () => {
      const query = { page: 'invalid', limit: 'invalid' };
      const result = extractPaginationFromQuery(query);

      expect(result).toEqual({ page: 1, limit: 10 });
    });
  });
});
