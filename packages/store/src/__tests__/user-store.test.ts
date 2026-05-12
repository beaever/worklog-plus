import { describe, it, expect, beforeEach } from 'vitest';
import { act } from 'react';
import { renderHook } from '@testing-library/react';

// Zustand store를 직접 import
import { useUserStore } from '../user-store';

describe('useUserStore', () => {
  beforeEach(() => {
    // 각 테스트 전 store 초기화
    useUserStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      _hasHydrated: false,
    });
  });

  describe('login', () => {
    it('login 액션은 user를 설정하고 isAuthenticated를 true로 변경해야 함', () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: '테스트',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        avatarUrl: null,
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      act(() => {
        useUserStore.getState().login(mockUser);
      });

      const state = useUserStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('login 액션은 토큰을 파라미터로 받지 않아야 함 (쿠키로 처리)', () => {
      const loginFn = useUserStore.getState().login;
      // 함수 인자 개수 확인: user 하나만 받아야 함
      expect(loginFn.length).toBe(1);
    });
  });

  describe('logout', () => {
    it('logout 액션은 user를 null로, isAuthenticated를 false로 변경해야 함', () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: '테스트',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        avatarUrl: null,
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      act(() => {
        useUserStore.getState().login(mockUser);
      });

      act(() => {
        useUserStore.getState().logout();
      });

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('store 구조', () => {
    it('tokens 상태가 없어야 함 (쿠키로 관리)', () => {
      const state = useUserStore.getState();
      expect(state).not.toHaveProperty('tokens');
    });

    it('setTokens 액션이 없어야 함', () => {
      const state = useUserStore.getState();
      expect(state).not.toHaveProperty('setTokens');
    });
  });

  describe('setLoading', () => {
    it('setLoading으로 isLoading 상태를 변경할 수 있어야 함', () => {
      act(() => {
        useUserStore.getState().setLoading(false);
      });

      expect(useUserStore.getState().isLoading).toBe(false);
    });
  });
});
