import type { ApiResponse } from '@worklog-plus/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

interface RequestConfig extends RequestInit {
  params?: Record<string, string> | undefined;
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

function onRefreshed() {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: () => void) {
  refreshSubscribers.push(callback);
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<ApiResponse<T>> {
  const { params, skipAuth: _skipAuth, ...init } = config;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (init.headers) {
    Object.entries(init.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  try {
    let response = await fetch(url, {
      ...init,
      headers,
      credentials: 'include',
    });

    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshed = await refreshAccessToken();
        isRefreshing = false;

        if (refreshed) {
          onRefreshed();
          response = await fetch(url, { ...init, headers, credentials: 'include' });
        } else {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return { success: false, error: '인증이 만료되었습니다. 다시 로그인해주세요.' };
        }
      } else {
        await new Promise<void>((resolve) => {
          addRefreshSubscriber(resolve);
        });
        response = await fetch(url, { ...init, headers, credentials: 'include' });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          (errorData as { message?: string; error?: string }).message ||
          (errorData as { message?: string; error?: string }).error ||
          `HTTP Error: ${response.status}`,
      };
    }

    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '네트워크 오류가 발생했습니다.',
    };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
