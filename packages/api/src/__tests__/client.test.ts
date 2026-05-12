import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// fetch를 전역으로 모킹
const mockFetch = vi.fn();
global.fetch = mockFetch;

// 모듈 캐시 초기화를 위해 동적 import
async function importApiClient() {
  vi.resetModules();
  const { apiClient } = await import('../client');
  return { apiClient };
}

describe('apiClient', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('credentials 설정', () => {
    it('모든 요청에 credentials: include가 포함되어야 함', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: {} }),
      });

      const { apiClient } = await importApiClient();
      await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ credentials: 'include' }),
      );
    });

    it('Authorization 헤더를 포함하지 않아야 함 (쿠키로 처리)', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: {} }),
      });

      const { apiClient } = await importApiClient();
      await apiClient.get('/test');

      const callArgs = mockFetch.mock.calls[0]?.[1] as RequestInit;
      const headers = callArgs?.headers as Record<string, string>;
      expect(headers).not.toHaveProperty('Authorization');
    });
  });

  describe('401 처리 (토큰 갱신)', () => {
    it('401 응답 시 /auth/refresh를 쿠키 기반으로 호출해야 함', async () => {
      // 첫 번째 요청: 401
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) })
        // refresh 요청: 성공
        .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) })
        // 재시도 요청: 성공
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true, data: 'retried' }),
        });

      const { apiClient } = await importApiClient();
      await apiClient.get('/protected');

      // refresh 호출 시 body 없이, credentials: include만 있어야 함
      const refreshCall = mockFetch.mock.calls[1];
      expect(refreshCall?.[0]).toContain('/auth/refresh');
      expect(refreshCall?.[1]).toMatchObject({
        method: 'POST',
        credentials: 'include',
      });
      // body가 없거나 undefined
      const refreshBody = (refreshCall?.[1] as RequestInit)?.body;
      expect(refreshBody === undefined || refreshBody === null).toBe(true);
    });

    it('refresh 실패 시 success: false를 반환해야 함', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) })
        .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) });

      const { apiClient } = await importApiClient();
      const result = await apiClient.get('/protected');

      expect(result.success).toBe(false);
    });
  });

  describe('HTTP 메서드', () => {
    it('POST 요청이 올바른 body와 함께 전송되어야 함', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: {} }),
      });

      const { apiClient } = await importApiClient();
      await apiClient.post('/test', { name: '테스트' });

      const callArgs = mockFetch.mock.calls[0]?.[1] as RequestInit;
      expect(callArgs?.method).toBe('POST');
      expect(callArgs?.body).toBe(JSON.stringify({ name: '테스트' }));
    });
  });
});
