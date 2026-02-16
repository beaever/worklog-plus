/**
 * 인증 API 모듈
 *
 * @description
 * 사용자 인증과 관련된 모든 API 호출을 담당합니다.
 * JWT 토큰 기반 인증을 사용하며, Access Token과 Refresh Token을 관리합니다.
 *
 * @why 설계 결정
 * 1. **각 API를 별도 함수로 분리**: 코드 가독성과 재사용성 향상
 * 2. **JWT 토큰 방식**: Stateless 인증으로 서버 부하 감소
 * 3. **Refresh Token 지원**: Access Token 만료 시 자동 갱신 가능
 * 4. **타입 안전성**: TypeScript 타입으로 요청/응답 구조 보장
 *
 * @authentication_flow 인증 플로우
 * 1. 로그인 (login) → Access Token + Refresh Token 받음
 * 2. API 요청 시 Access Token을 Authorization 헤더에 포함
 * 3. Access Token 만료 시 Refresh Token으로 갱신 (refresh)
 * 4. Refresh Token도 만료되면 재로그인 필요
 *
 * @example
 * // 로그인 플로우
 * const loginResponse = await authApi.login({
 *   email: 'user@example.com',
 *   password: '12345678'
 * });
 *
 * if (loginResponse.success) {
 *   // 토큰 저장 (localStorage 또는 상태 관리)
 *   localStorage.setItem('accessToken', loginResponse.data.accessToken);
 *   localStorage.setItem('refreshToken', loginResponse.data.refreshToken);
 * }
 *
 * @example
 * // 토큰 갱신 플로우
 * const refreshToken = localStorage.getItem('refreshToken');
 * const refreshResponse = await authApi.refresh(refreshToken);
 *
 * if (refreshResponse.success) {
 *   localStorage.setItem('accessToken', refreshResponse.data.accessToken);
 * }
 */
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '@worklog-plus/types';
import { apiClient } from './client';

/**
 * 인증 API 객체
 *
 * @description
 * 로그인, 회원가입, 로그아웃, 토큰 갱신, 사용자 정보 조회 등의 기능을 제공합니다.
 */
export const authApi = {
  /**
   * 로그인
   *
   * @description
   * 이메일과 비밀번호로 로그인하여 JWT 토큰을 받습니다.
   * 성공 시 Access Token과 Refresh Token을 반환합니다.
   *
   * @param {LoginRequest} data - 로그인 정보 (email, password)
   * @returns {Promise<ApiResponse<AuthResponse>>} Access Token, Refresh Token, 사용자 정보
   *
   * @why 이렇게 설계한 이유
   * - Access Token: 짧은 유효기간 (15분), API 요청에 사용
   * - Refresh Token: 긴 유효기간 (7일), Access Token 갱신에 사용
   * - 보안: 비밀번호는 서버에서 bcrypt로 해싱하여 비교
   *
   * @example
   * const response = await authApi.login({
   *   email: 'user@example.com',
   *   password: '12345678'
   * });
   *
   * if (response.success) {
   *   const { accessToken, refreshToken, user } = response.data;
   *   // 토큰 저장
   *   localStorage.setItem('accessToken', accessToken);
   *   localStorage.setItem('refreshToken', refreshToken);
   *   // 사용자 정보 저장 (Zustand 등)
   *   userStore.setUser(user);
   * } else {
   *   console.error('로그인 실패:', response.error);
   * }
   *
   * @note 보안 주의사항
   * - 토큰은 localStorage보다 httpOnly 쿠키에 저장하는 것이 더 안전
   * - 하지만 모바일 앱 호환성을 위해 localStorage 사용
   */
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  /**
   * 회원가입
   *
   * @description
   * 새로운 사용자를 등록합니다. 회원가입 성공 시 자동으로 로그인되어 토큰을 받습니다.
   *
   * @param {RegisterRequest} data - 회원가입 정보 (email, password, name)
   * @returns {Promise<ApiResponse<AuthResponse>>} Access Token, Refresh Token, 사용자 정보
   *
   * @why 회원가입 후 자동 로그인하는 이유
   * - 사용자 경험 향상: 회원가입 후 바로 서비스 이용 가능
   * - 추가 로그인 단계 불필요
   *
   * @example
   * const response = await authApi.register({
   *   email: 'newuser@example.com',
   *   password: 'securePassword123',
   *   name: '홍길동'
   * });
   *
   * if (response.success) {
   *   // 자동 로그인됨
   *   const { accessToken, refreshToken, user } = response.data;
   *   localStorage.setItem('accessToken', accessToken);
   *   localStorage.setItem('refreshToken', refreshToken);
   *   // 대시보드로 리다이렉트
   *   router.push('/dashboard');
   * } else {
   *   // 에러 처리 (이미 존재하는 이메일 등)
   *   toast.error(response.error);
   * }
   *
   * @validation 서버 검증 사항
   * - 이메일 형식 검증
   * - 비밀번호 최소 8자, 영문+숫자 포함
   * - 이메일 중복 확인
   */
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  /**
   * 로그아웃
   *
   * @description
   * 현재 사용자를 로그아웃합니다. 서버에서 Refresh Token을 무효화합니다.
   *
   * @returns {Promise<ApiResponse<void>>} 성공 여부
   *
   * @why 서버에서 Refresh Token을 무효화하는 이유
   * - 보안: 탈취된 토큰으로 재로그인 방지
   * - Refresh Token은 데이터베이스에 저장되므로 삭제 가능
   * - Access Token은 stateless이므로 만료까지 유효 (15분)
   *
   * @example
   * const handleLogout = async () => {
   *   const response = await authApi.logout();
   *
   *   if (response.success) {
   *     // 로컬 토큰 삭제
   *     localStorage.removeItem('accessToken');
   *     localStorage.removeItem('refreshToken');
   *     // 상태 초기화
   *     userStore.clearUser();
   *     // 로그인 페이지로 이동
   *     router.push('/login');
   *   }
   * };
   *
   * @note 클라이언트 측 정리
   * - localStorage에서 토큰 삭제
   * - Zustand/Redux 등 상태 관리 스토어 초기화
   * - 로그인 페이지로 리다이렉트
   */
  logout: () => apiClient.post<void>('/auth/logout', {}),

  /**
   * 토큰 갱신
   *
   * @description
   * Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
   * Access Token이 만료되었을 때 자동으로 호출되어야 합니다.
   *
   * @param {string} refreshToken - Refresh Token
   * @returns {Promise<ApiResponse<AuthResponse>>} 새로운 Access Token과 Refresh Token
   *
   * @why Refresh Token이 필요한 이유
   * - Access Token은 짧은 유효기간 (15분)으로 보안 강화
   * - Refresh Token으로 자동 갱신하여 사용자가 재로그인할 필요 없음
   * - Refresh Token도 갱신되어 보안 유지
   *
   * @when 언제 호출하는가
   * 1. API 요청 시 401 Unauthorized 응답 받음
   * 2. 자동으로 refresh() 호출
   * 3. 새 Access Token으로 원래 요청 재시도
   * 4. Refresh Token도 만료되면 로그인 페이지로 이동
   *
   * @example
   * // API 클라이언트에서 자동 갱신 구현
   * const response = await fetch('/api/projects');
   *
   * if (response.status === 401) {
   *   // Access Token 만료
   *   const refreshToken = localStorage.getItem('refreshToken');
   *   const refreshResponse = await authApi.refresh(refreshToken);
   *
   *   if (refreshResponse.success) {
   *     // 새 토큰 저장
   *     localStorage.setItem('accessToken', refreshResponse.data.accessToken);
   *     localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
   *     // 원래 요청 재시도
   *     return fetch('/api/projects', {
   *       headers: {
   *         Authorization: `Bearer ${refreshResponse.data.accessToken}`
   *       }
   *     });
   *   } else {
   *     // Refresh Token도 만료 → 재로그인 필요
   *     router.push('/login');
   *   }
   * }
   *
   * @implementation TanStack Query와 함께 사용
   * // queryClient.ts
   * queryClient.setDefaultOptions({
   *   queries: {
   *     retry: (failureCount, error) => {
   *       if (error.status === 401 && failureCount === 0) {
   *         // 첫 401 에러는 토큰 갱신 후 재시도
   *         return true;
   *       }
   *       return false;
   *     }
   *   }
   * });
   */
  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { refreshToken }),

  /**
   * 현재 로그인한 사용자 정보 조회
   *
   * @description
   * Access Token을 사용하여 현재 로그인한 사용자의 정보를 가져옵니다.
   * 앱 시작 시 또는 페이지 새로고침 시 호출하여 사용자 상태를 복원합니다.
   *
   * @returns {Promise<ApiResponse<User>>} 사용자 정보 (id, email, name, role 등)
   *
   * @why 이 API가 필요한 이유
   * - 페이지 새로고침 시 사용자 정보 복원
   * - localStorage의 토큰만으로는 사용자 정보를 알 수 없음
   * - 서버에서 최신 사용자 정보 가져오기 (권한 변경 등)
   *
   * @when 언제 호출하는가
   * 1. 앱 시작 시 (App.tsx 또는 _app.tsx)
   * 2. 페이지 새로고침 시
   * 3. 로그인 후 사용자 정보 확인
   * 4. 프로필 수정 후 최신 정보 가져오기
   *
   * @example
   * // 앱 시작 시 사용자 정보 로드
   * useEffect(() => {
   *   const loadUser = async () => {
   *     const token = localStorage.getItem('accessToken');
   *     if (!token) return;
   *
   *     const response = await authApi.me();
   *     if (response.success) {
   *       userStore.setUser(response.data);
   *     } else {
   *       // 토큰이 유효하지 않음
   *       localStorage.removeItem('accessToken');
   *       router.push('/login');
   *     }
   *   };
   *
   *   loadUser();
   * }, []);
   *
   * @example
   * // TanStack Query로 사용자 정보 관리
   * const { data: user, isLoading } = useQuery({
   *   queryKey: ['auth', 'me'],
   *   queryFn: async () => {
   *     const response = await authApi.me();
   *     if (!response.success) throw new Error(response.error);
   *     return response.data;
   *   },
   *   enabled: !!localStorage.getItem('accessToken'),
   *   staleTime: 5 * 60 * 1000, // 5분
   * });
   *
   * @note 인증 필요
   * - Authorization 헤더에 Access Token 필요
   * - API 클라이언트에서 자동으로 추가해야 함
   */
  me: () => apiClient.get<User>('/auth/me'),
};
