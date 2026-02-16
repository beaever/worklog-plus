/**
 * 사용자 API 모듈
 *
 * @description
 * 사용자 관련 API 호출을 담당합니다.
 * 프로필 조회 및 수정 기능을 제공합니다.
 *
 * @why 설계 결정
 * 1. **getMe vs getProfile 분리**: 본인 정보와 타인 정보 조회를 구분
 * 2. **Partial 타입 사용**: 프로필 수정 시 변경할 필드만 전달
 * 3. **간결한 API**: 필수 기능만 제공하여 복잡도 최소화
 */
import type { User, UserProfile } from '@worklog-plus/types';
import { apiClient } from './client';

/**
 * 사용자 API 객체
 */
export const usersApi = {
  /**
   * 내 정보 조회
   *
   * @description
   * 현재 로그인한 사용자의 전체 정보를 조회합니다.
   * authApi.me()와 동일한 기능이지만, users 도메인에서 제공합니다.
   *
   * @returns {Promise<ApiResponse<User>>} 사용자 정보
   *
   * @why authApi.me()와 중복되는 이유
   * - 도메인 분리: 인증(auth)과 사용자(users)는 별도 도메인
   * - authApi.me(): 인증 확인 및 초기 로드용
   * - usersApi.getMe(): 사용자 정보 갱신용
   * - 실제로는 같은 엔드포인트를 호출하지만 의미적으로 구분
   *
   * @example
   * // 프로필 수정 후 최신 정보 가져오기
   * const response = await usersApi.getMe();
   * if (response.success) {
   *   userStore.setUser(response.data);
   * }
   *
   * @note 인증 필요
   * - Authorization 헤더에 Access Token 필요
   */
  getMe: () => apiClient.get<User>('/users/me'),

  /**
   * 다른 사용자 프로필 조회
   *
   * @description
   * 특정 사용자의 공개 프로필 정보를 조회합니다.
   * 민감한 정보(이메일 등)는 제외되고 공개 정보만 반환됩니다.
   *
   * @param {string} id - 사용자 ID
   * @returns {Promise<ApiResponse<UserProfile>>} 사용자 공개 프로필
   *
   * @why getMe와 분리한 이유
   * - 보안: 타인의 민감한 정보(이메일, 역할 등) 노출 방지
   * - 타입: UserProfile은 User보다 제한된 정보만 포함
   * - 권한: 본인 정보는 모두 볼 수 있지만, 타인은 공개 정보만
   *
   * @example
   * // 프로젝트 멤버 프로필 보기
   * const response = await usersApi.getProfile('user-id');
   * if (response.success) {
   *   console.log(response.data.name, response.data.avatar);
   * }
   *
   * @example
   * // 업무일지 작성자 정보 표시
   * const { data: author } = useQuery({
   *   queryKey: ['users', worklog.userId, 'profile'],
   *   queryFn: () => usersApi.getProfile(worklog.userId)
   * });
   */
  getProfile: (id: string) =>
    apiClient.get<UserProfile>(`/users/${id}/profile`),

  /**
   * 내 프로필 수정
   *
   * @description
   * 현재 로그인한 사용자의 프로필 정보를 수정합니다.
   * 변경할 필드만 전달하면 됩니다.
   *
   * @param {Partial<UserProfile>} data - 수정할 프로필 정보
   * @returns {Promise<ApiResponse<User>>} 수정된 사용자 정보
   *
   * @why Partial 타입을 사용하는 이유
   * - 유연성: 이름만, 아바타만, 또는 여러 필드를 동시에 수정 가능
   * - 효율성: 변경된 필드만 서버로 전송
   * - 타입 안전성: TypeScript가 허용된 필드만 수정 가능하도록 보장
   *
   * @example
   * // 이름만 수정
   * const response = await usersApi.updateProfile({
   *   name: '새로운 이름'
   * });
   *
   * @example
   * // 여러 필드 동시 수정
   * const response = await usersApi.updateProfile({
   *   name: '홍길동',
   *   avatar: 'https://example.com/avatar.jpg',
   *   bio: '백엔드 개발자'
   * });
   *
   * @example
   * // React Hook Form과 함께 사용
   * const onSubmit = async (formData: Partial<UserProfile>) => {
   *   const response = await usersApi.updateProfile(formData);
   *   if (response.success) {
   *     toast.success('프로필이 수정되었습니다');
   *     queryClient.invalidateQueries(['auth', 'me']);
   *   }
   * };
   *
   * @validation 서버 검증
   * - name: 1-100자
   * - avatar: 유효한 URL 형식
   * - bio: 최대 500자
   *
   * @note
   * - 이메일, 역할 등 민감한 정보는 수정 불가
   * - 관리자만 수정 가능한 필드는 별도 API 사용
   */
  updateProfile: (data: Partial<UserProfile>) =>
    apiClient.patch<User>('/users/me', data),
};
