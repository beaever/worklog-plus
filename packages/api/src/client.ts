/**
 * API 클라이언트 모듈
 *
 * @description
 * 프론트엔드에서 백엔드 API를 호출하기 위한 통합 클라이언트입니다.
 * fetch API를 기반으로 구현되었으며, 모든 HTTP 메서드(GET, POST, PUT, PATCH, DELETE)를 지원합니다.
 *
 * @why 설계 결정
 * 1. **fetch API 사용**: axios 대신 브라우저 네이티브 fetch를 사용하여 번들 크기 최소화
 * 2. **ApiResponse 타입 통일**: 모든 응답을 { success, data?, error? } 형태로 통일하여 일관된 에러 처리
 * 3. **타입 안전성**: TypeScript 제네릭을 활용하여 컴파일 타임에 타입 체크
 * 4. **간결한 API**: 각 HTTP 메서드별로 간단한 함수 제공
 *
 * @example
 * // GET 요청
 * const response = await apiClient.get<User[]>('/users');
 * if (response.success) {
 *   console.log(response.data); // User[] 타입
 * }
 *
 * @example
 * // POST 요청
 * const response = await apiClient.post<User>('/users', {
 *   email: 'user@example.com',
 *   name: 'John Doe'
 * });
 */
import type { ApiResponse } from '@worklog-plus/types';

/**
 * API 기본 URL
 *
 * @description
 * - 프로덕션: 환경 변수에서 실제 API 서버 URL 사용
 * - 개발: 환경 변수가 없으면 '/api' 사용 (Next.js API 라우트)
 *
 * @example
 * // .env.local
 * NEXT_PUBLIC_API_URL=http://localhost:8080
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

/**
 * HTTP 요청 설정 인터페이스
 *
 * @description
 * fetch API의 RequestInit을 확장하여 쿼리 파라미터 기능을 추가했습니다.
 *
 * @property {Record<string, string>} params - URL 쿼리 파라미터 (예: { page: '1', limit: '10' })
 *
 * @why params를 별도로 처리하는 이유
 * - URL 인코딩을 자동으로 처리 (URLSearchParams 사용)
 * - 쿼리 파라미터 구성을 객체로 간편하게 전달
 * - 코드 가독성 향상
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, string> | undefined;
}

/**
 * HTTP 요청을 처리하는 핵심 함수
 *
 * @description
 * fetch API를 래핑하여 일관된 에러 처리와 타입 안전성을 제공합니다.
 * 모든 응답을 ApiResponse<T> 타입으로 통일하여 성공/실패 처리를 간소화합니다.
 *
 * @template T - 응답 데이터의 타입
 * @param {string} endpoint - API 엔드포인트 경로 (예: '/auth/login', '/projects')
 * @param {RequestConfig} config - fetch 설정 + 쿼리 파라미터
 * @returns {Promise<ApiResponse<T>>} 성공 시 { success: true, data }, 실패 시 { success: false, error }
 *
 * @why 이렇게 설계한 이유
 * 1. **일관된 에러 처리**: 모든 HTTP 에러를 ApiResponse 형태로 변환
 * 2. **타입 안전성**: 제네릭을 통해 응답 타입 보장
 * 3. **자동 JSON 파싱**: Content-Type을 기본으로 설정하여 별도 설정 불필요
 * 4. **쿼리 파라미터 자동 처리**: URLSearchParams로 자동 인코딩
 *
 * @example
 * // GET 요청 (쿼리 파라미터 포함)
 * const response = await request<User>('/users/123', {
 *   method: 'GET',
 *   params: { include: 'profile' }
 * });
 * // 실제 URL: /users/123?include=profile
 *
 * @example
 * // POST 요청
 * const response = await request<AuthResponse>('/auth/login', {
 *   method: 'POST',
 *   body: JSON.stringify({ email: 'user@example.com', password: '12345678' })
 * });
 *
 * @example
 * // 에러 처리
 * const response = await request<User>('/users/999');
 * if (!response.success) {
 *   console.error(response.error); // "HTTP Error: 404"
 * }
 */
async function request<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<ApiResponse<T>> {
  const { params, ...init } = config;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      error: `HTTP Error: ${response.status}`,
    };
  }

  const data = (await response.json()) as T;
  return { success: true, data };
}

/**
 * API 클라이언트 객체
 *
 * @description
 * HTTP 메서드별로 간편하게 사용할 수 있는 함수들을 제공합니다.
 * 모든 함수는 제네릭 타입을 지원하여 타입 안전성을 보장합니다.
 *
 * @why 각 메서드를 별도 함수로 분리한 이유
 * - 코드 가독성: apiClient.get() 형태가 직관적
 * - 타입 추론: TypeScript가 각 메서드의 파라미터 타입을 정확히 추론
 * - 일관성: 모든 API 호출이 동일한 패턴 사용
 *
 * @example
 * // TanStack Query와 함께 사용
 * const { data, isLoading } = useQuery({
 *   queryKey: ['users'],
 *   queryFn: () => apiClient.get<User[]>('/users')
 * });
 *
 * @example
 * // 직접 사용
 * const response = await apiClient.post<Project>('/projects', {
 *   name: '새 프로젝트',
 *   description: '프로젝트 설명'
 * });
 * if (response.success) {
 *   console.log('프로젝트 생성 성공:', response.data);
 * }
 */
export const apiClient = {
  /**
   * GET 요청
   *
   * @description
   * 데이터를 조회할 때 사용합니다. 쿼리 파라미터를 통해 필터링, 페이지네이션 등을 처리할 수 있습니다.
   *
   * @template T - 응답 데이터 타입
   * @param {string} endpoint - API 엔드포인트
   * @param {Record<string, string>} params - 쿼리 파라미터 (선택사항)
   *
   * @example
   * // 기본 조회
   * const response = await apiClient.get<User[]>('/users');
   *
   * @example
   * // 페이지네이션
   * const response = await apiClient.get<PaginatedResponse<Project>>('/projects', {
   *   page: '1',
   *   limit: '10'
   * });
   */
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', params }),

  /**
   * POST 요청
   *
   * @description
   * 새로운 데이터를 생성할 때 사용합니다. 요청 본문은 자동으로 JSON으로 변환됩니다.
   *
   * @template T - 응답 데이터 타입
   * @param {string} endpoint - API 엔드포인트
   * @param {unknown} body - 요청 본문 (객체 형태)
   *
   * @example
   * // 로그인
   * const response = await apiClient.post<AuthResponse>('/auth/login', {
   *   email: 'user@example.com',
   *   password: '12345678'
   * });
   *
   * @example
   * // 프로젝트 생성
   * const response = await apiClient.post<Project>('/projects', {
   *   name: '새 프로젝트',
   *   description: '설명',
   *   status: 'ACTIVE'
   * });
   */
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  /**
   * PUT 요청
   *
   * @description
   * 기존 데이터를 전체적으로 교체할 때 사용합니다. (모든 필드 포함)
   *
   * @template T - 응답 데이터 타입
   * @param {string} endpoint - API 엔드포인트
   * @param {unknown} body - 요청 본문
   *
   * @note PUT vs PATCH
   * - PUT: 전체 데이터 교체 (모든 필드 포함)
   * - PATCH: 일부 데이터만 수정 (변경할 필드만 포함)
   */
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  /**
   * PATCH 요청
   *
   * @description
   * 기존 데이터의 일부만 수정할 때 사용합니다. (변경할 필드만 포함)
   *
   * @template T - 응답 데이터 타입
   * @param {string} endpoint - API 엔드포인트
   * @param {unknown} body - 수정할 필드만 포함한 객체
   *
   * @example
   * // 프로필 이름만 수정
   * const response = await apiClient.patch<User>('/users/me', {
   *   name: '새로운 이름'
   * });
   *
   * @example
   * // 프로젝트 상태만 변경
   * const response = await apiClient.patch<Project>('/projects/123', {
   *   status: 'DONE'
   * });
   */
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),

  /**
   * DELETE 요청
   *
   * @description
   * 데이터를 삭제할 때 사용합니다.
   *
   * @template T - 응답 데이터 타입 (보통 void)
   * @param {string} endpoint - API 엔드포인트
   *
   * @example
   * // 프로젝트 삭제
   * const response = await apiClient.delete<void>('/projects/123');
   * if (response.success) {
   *   console.log('삭제 성공');
   * }
   *
   * @example
   * // 업무일지 삭제
   * const response = await apiClient.delete<void>('/worklogs/456');
   */
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
