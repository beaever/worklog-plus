/**
 * 프로젝트 API 모듈
 *
 * @description
 * 프로젝트 관련 모든 API 호출을 담당합니다.
 * CRUD(생성, 조회, 수정, 삭제) 작업과 대시보드, 활동 로그 조회를 지원합니다.
 *
 * @why 설계 결정
 * 1. **페이지네이션 지원**: 대량의 프로젝트 데이터를 효율적으로 처리
 * 2. **필터링 기능**: 상태별, 검색어별 프로젝트 필터링
 * 3. **대시보드 분리**: 프로젝트 상세 정보와 통계를 별도 API로 제공
 * 4. **활동 로그**: 프로젝트 변경 이력 추적
 */
import type {
  Project,
  ProjectSummary,
  ProjectDashboard,
  ActivityLog,
  CreateProjectInput,
  UpdateProjectInput,
  PaginatedResponse,
  ProjectStatus,
} from '@worklog-plus/types';
import { apiClient } from './client';

/**
 * 프로젝트 목록 조회 파라미터
 *
 * @description
 * 프로젝트 목록을 조회할 때 사용하는 필터링 및 페이지네이션 옵션입니다.
 *
 * @why 인터페이스로 분리한 이유
 * - 타입 안전성: 파라미터 구조를 명확히 정의
 * - 재사용성: 여러 곳에서 동일한 파라미터 타입 사용
 * - 확장성: 새로운 필터 옵션 추가 용이
 *
 * @property {number} page - 페이지 번호 (1부터 시작)
 * @property {number} limit - 페이지당 항목 수 (기본 10개)
 * @property {ProjectStatus} status - 프로젝트 상태 필터 (PLANNED, ACTIVE, DONE)
 * @property {string} search - 검색어 (프로젝트 이름, 설명에서 검색)
 */
export interface ProjectListParams {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  search?: string;
}

/**
 * 프로젝트 API 객체
 */
export const projectsApi = {
  /**
   * 프로젝트 목록 조회
   *
   * @description
   * 페이지네이션과 필터링을 지원하는 프로젝트 목록을 가져옵니다.
   * 각 프로젝트는 요약 정보(ProjectSummary)만 포함합니다.
   *
   * @param {ProjectListParams} params - 조회 옵션
   * @returns {Promise<ApiResponse<PaginatedResponse<ProjectSummary>>>} 프로젝트 목록과 페이지네이션 정보
   *
   * @why 페이지네이션이 필요한 이유
   * - 성능: 모든 프로젝트를 한 번에 로드하면 느림
   * - UX: 무한 스크롤 또는 페이지 버튼으로 탐색
   * - 서버 부하: 필요한 데이터만 전송
   *
   * @example
   * // 기본 조회 (첫 페이지, 10개)
   * const response = await projectsApi.getAll();
   *
   * @example
   * // 페이지네이션
   * const response = await projectsApi.getAll({
   *   page: 2,
   *   limit: 20
   * });
   *
   * @example
   * // 상태 필터링
   * const response = await projectsApi.getAll({
   *   status: 'ACTIVE'
   * });
   *
   * @example
   * // 검색
   * const response = await projectsApi.getAll({
   *   search: '웹사이트'
   * });
   *
   * @example
   * // TanStack Query와 함께 사용
   * const { data, isLoading } = useQuery({
   *   queryKey: ['projects', { page, status, search }],
   *   queryFn: () => projectsApi.getAll({ page, status, search })
   * });
   */
  getAll: (params: ProjectListParams = {}) => {
    const { page = 1, limit = 10, status, search } = params;
    const queryParams: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (status) queryParams.status = status;
    if (search) queryParams.search = search;

    return apiClient.get<PaginatedResponse<ProjectSummary>>(
      '/projects',
      queryParams,
    );
  },

  /**
   * 프로젝트 상세 조회
   *
   * @description
   * 특정 프로젝트의 상세 정보를 가져옵니다.
   * 프로젝트 멤버, 통계 등 전체 정보를 포함합니다.
   *
   * @param {string} id - 프로젝트 ID (UUID)
   * @returns {Promise<ApiResponse<Project>>} 프로젝트 상세 정보
   *
   * @example
   * const response = await projectsApi.getById('123e4567-e89b-12d3-a456-426614174000');
   * if (response.success) {
   *   console.log(response.data.name, response.data.members);
   * }
   */
  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  /**
   * 프로젝트 생성
   *
   * @description
   * 새로운 프로젝트를 생성합니다. 생성자는 자동으로 프로젝트 멤버로 추가됩니다.
   *
   * @param {CreateProjectInput} data - 프로젝트 생성 정보
   * @returns {Promise<ApiResponse<Project>>} 생성된 프로젝트
   *
   * @example
   * const response = await projectsApi.create({
   *   name: '새 웹사이트 개발',
   *   description: '회사 홈페이지 리뉴얼',
   *   startDate: '2026-03-01',
   *   endDate: '2026-06-30',
   *   status: 'PLANNED'
   * });
   *
   * @validation 서버 검증
   * - name: 필수, 1-200자
   * - startDate: 필수, YYYY-MM-DD 형식
   * - endDate: 선택, startDate 이후여야 함
   */
  create: (data: CreateProjectInput) =>
    apiClient.post<Project>('/projects', data),

  /**
   * 프로젝트 수정
   *
   * @description
   * 기존 프로젝트의 정보를 수정합니다. 변경할 필드만 전달하면 됩니다.
   *
   * @param {string} id - 프로젝트 ID
   * @param {UpdateProjectInput} data - 수정할 정보 (Partial)
   * @returns {Promise<ApiResponse<Project>>} 수정된 프로젝트
   *
   * @why PATCH 사용
   * - 일부 필드만 수정 가능 (PUT은 전체 교체)
   * - 효율적: 변경된 필드만 전송
   *
   * @example
   * // 상태만 변경
   * const response = await projectsApi.update('project-id', {
   *   status: 'DONE'
   * });
   *
   * @example
   * // 여러 필드 수정
   * const response = await projectsApi.update('project-id', {
   *   name: '수정된 프로젝트명',
   *   description: '새로운 설명',
   *   endDate: '2026-12-31'
   * });
   */
  update: (id: string, data: UpdateProjectInput) =>
    apiClient.patch<Project>(`/projects/${id}`, data),

  /**
   * 프로젝트 삭제
   *
   * @description
   * 프로젝트를 삭제합니다. 관련된 업무일지도 함께 삭제될 수 있습니다.
   *
   * @param {string} id - 프로젝트 ID
   * @returns {Promise<ApiResponse<void>>} 성공 여부
   *
   * @warning 주의사항
   * - 삭제는 되돌릴 수 없습니다
   * - 프로젝트에 속한 업무일지도 삭제될 수 있습니다
   * - 삭제 전 확인 다이얼로그 표시 권장
   *
   * @example
   * const handleDelete = async (projectId: string) => {
   *   if (!confirm('정말 삭제하시겠습니까?')) return;
   *
   *   const response = await projectsApi.delete(projectId);
   *   if (response.success) {
   *     toast.success('프로젝트가 삭제되었습니다');
   *     router.push('/projects');
   *   }
   * };
   */
  delete: (id: string) => apiClient.delete<void>(`/projects/${id}`),

  /**
   * 프로젝트 대시보드 조회
   *
   * @description
   * 프로젝트의 통계 및 대시보드 데이터를 가져옵니다.
   * 업무일지 개수, 진행률, 멤버 활동 등의 정보를 포함합니다.
   *
   * @param {string} id - 프로젝트 ID
   * @returns {Promise<ApiResponse<ProjectDashboard>>} 대시보드 데이터
   *
   * @why 별도 API로 분리한 이유
   * - 성능: 상세 조회와 대시보드 데이터를 분리하여 필요할 때만 로드
   * - 캐싱: 대시보드 데이터는 자주 변경되므로 별도 캐시 전략 적용
   *
   * @example
   * const { data: dashboard } = useQuery({
   *   queryKey: ['projects', projectId, 'dashboard'],
   *   queryFn: () => projectsApi.getDashboard(projectId),
   *   staleTime: 60000 // 1분
   * });
   */
  getDashboard: (id: string) =>
    apiClient.get<ProjectDashboard>(`/projects/${id}/dashboard`),

  /**
   * 프로젝트 활동 로그 조회
   *
   * @description
   * 프로젝트의 변경 이력 및 활동 로그를 가져옵니다.
   * 누가, 언제, 무엇을 했는지 추적할 수 있습니다.
   *
   * @param {string} id - 프로젝트 ID
   * @param {number} page - 페이지 번호 (기본 1)
   * @param {number} limit - 페이지당 항목 수 (기본 20)
   * @returns {Promise<ApiResponse<PaginatedResponse<ActivityLog>>>} 활동 로그 목록
   *
   * @why 활동 로그가 필요한 이유
   * - 감사: 누가 프로젝트를 수정했는지 추적
   * - 협업: 팀원들의 활동 파악
   * - 디버깅: 문제 발생 시 변경 이력 확인
   *
   * @example
   * // 최근 활동 20개 조회
   * const response = await projectsApi.getActivities('project-id');
   *
   * @example
   * // 무한 스크롤 구현
   * const { data, fetchNextPage } = useInfiniteQuery({
   *   queryKey: ['projects', projectId, 'activities'],
   *   queryFn: ({ pageParam = 1 }) =>
   *     projectsApi.getActivities(projectId, pageParam),
   *   getNextPageParam: (lastPage, pages) =>
   *     lastPage.data.hasMore ? pages.length + 1 : undefined
   * });
   */
  getActivities: (id: string, page = 1, limit = 20) =>
    apiClient.get<PaginatedResponse<ActivityLog>>(
      `/projects/${id}/activities`,
      {
        page: String(page),
        limit: String(limit),
      },
    ),
};
