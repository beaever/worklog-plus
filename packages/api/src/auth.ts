import type { LoginRequest, RegisterRequest } from '@worklog-plus/types';
import type { User } from '@worklog-plus/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export interface AuthSuccessData {
  user: User;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<{ success: boolean; data?: AuthSuccessData; error?: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          (errorData as { message?: string; error?: string }).message ||
          (errorData as { message?: string; error?: string }).error ||
          '로그인에 실패했습니다',
      };
    }

    const result = await response.json();
    // 백엔드 응답: { success: true, data: { user } }
    return { success: true, data: (result as { data: AuthSuccessData }).data };
  },

  register: async (data: RegisterRequest): Promise<{ success: boolean; data?: AuthSuccessData; error?: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          (errorData as { message?: string; error?: string }).message ||
          (errorData as { message?: string; error?: string }).error ||
          '회원가입에 실패했습니다',
      };
    }

    const result = await response.json();
    return { success: true, data: (result as { data: AuthSuccessData }).data };
  },

  logout: async (): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      return { success: false, error: '로그아웃에 실패했습니다' };
    }

    return { success: true };
  },

  me: async (): Promise<{ success: boolean; data?: AuthSuccessData; error?: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      return { success: false, error: '사용자 정보를 가져올 수 없습니다' };
    }

    const result = await response.json();
    // 백엔드 응답: { success: true, data: { id, email, name, role, ... } }
    return { success: true, data: { user: (result as { data: User }).data } };
  },
};
