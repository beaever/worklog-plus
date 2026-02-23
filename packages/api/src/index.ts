/**
 * @worklog-plus/api 패키지
 *
 * @description
 * 프론트엔드에서 백엔드 API를 호출하기 위한 통합 클라이언트 라이브러리입니다.
 * 모든 API 호출을 타입 안전하게 처리하며, 일관된 에러 처리를 제공합니다.
 *
 * @why 이 패키지가 필요한 이유
 * 1. **타입 안전성**: TypeScript로 모든 API 요청/응답 타입 정의
 * 2. **재사용성**: 웹(Next.js)과 모바일(React Native) 모두에서 사용
 * 3. **일관성**: 모든 API 호출이 동일한 패턴과 에러 처리 사용
 * 4. **유지보수성**: API 변경 시 한 곳만 수정하면 전체 앱에 반영
 *
 * @architecture 구조
 * ```
 * @worklog-plus/api
 * ├── client.ts      - HTTP 클라이언트 (fetch 기반)
 * ├── auth.ts        - 인증 API (로그인, 회원가입, 토큰 관리)
 * ├── projects.ts    - 프로젝트 API (CRUD, 대시보드, 활동 로그)
 * ├── worklogs.ts    - 업무일지 API (CRUD, 필터링)
 * ├── users.ts       - 사용자 API (프로필 조회/수정)
 * └── index.ts       - 모든 API 통합 내보내기
 * ```
 *
 * @usage 사용 방법
 * ```typescript
 * // 1. 기본 사용
 * import { authApi, projectsApi } from '@worklog-plus/api';
 *
 * const response = await authApi.login({ email, password });
 * if (response.success) {
 *   console.log(response.data.accessToken);
 * }
 *
 * // 2. TanStack Query와 함께 사용
 * import { useQuery } from '@tanstack/react-query';
 * import { projectsApi } from '@worklog-plus/api';
 *
 * const { data, isLoading } = useQuery({
 *   queryKey: ['projects'],
 *   queryFn: async () => {
 *     const response = await projectsApi.getAll();
 *     if (!response.success) throw new Error(response.error);
 *     return response.data;
 *   }
 * });
 *
 * // 3. 에러 처리
 * const response = await projectsApi.create(data);
 * if (!response.success) {
 *   toast.error(response.error);
 *   return;
 * }
 * // 성공 처리
 * toast.success('프로젝트가 생성되었습니다');
 * ```
 *
 * @setup 환경 설정
 * ```bash
 * # .env.local (Next.js)
 * NEXT_PUBLIC_API_URL=http://localhost:8080
 *
 * # .env (React Native)
 * EXPO_PUBLIC_API_URL=http://localhost:8080
 * ```
 *
 * @features 주요 기능
 * - ✅ 타입 안전한 API 호출
 * - ✅ 자동 JSON 파싱
 * - ✅ 쿼리 파라미터 자동 인코딩
 * - ✅ 일관된 에러 응답 형식
 * - ✅ 페이지네이션 지원
 * - ✅ 필터링 및 검색
 * - ✅ TanStack Query 호환
 *
 * @example
 * // 인증 플로우
 * const loginResponse = await authApi.login({ email, password });
 * if (loginResponse.success) {
 *   localStorage.setItem('accessToken', loginResponse.data.accessToken);
 *   const userResponse = await authApi.me();
 *   if (userResponse.success) {
 *     userStore.setUser(userResponse.data);
 *   }
 * }
 *
 * @example
 * // 프로젝트 생성 및 목록 갱신
 * const createResponse = await projectsApi.create({
 *   name: '새 프로젝트',
 *   description: '설명',
 *   status: 'ACTIVE'
 * });
 *
 * if (createResponse.success) {
 *   // TanStack Query 캐시 무효화
 *   queryClient.invalidateQueries(['projects']);
 * }
 *
 * @see {@link https://github.com/your-repo/worklog-plus} - 프로젝트 저장소
 * @see {@link ./README.md} - 상세 문서
 */

export * from './client';
export * from './auth';
export * from './projects';
export * from './worklogs';
export * from './users';
export * from './dashboard';
