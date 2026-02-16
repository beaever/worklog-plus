/**
 * 업무일지 API 모듈
 *
 * @description
 * 업무일지 관련 모든 API 호출을 담당합니다.
 * CRUD 작업과 프로젝트별 필터링, 페이지네이션을 지원합니다.
 *
 * @why 설계 결정
 * 1. **프로젝트별 필터링**: 특정 프로젝트의 업무일지만 조회 가능
 * 2. **페이지네이션**: 대량의 업무일지 효율적 처리
 * 3. **간결한 CRUD**: 표준 REST API 패턴 준수
 */
import type {
  Worklog,
  WorklogCreateInput,
  WorklogUpdateInput,
  PaginatedResponse,
} from '@worklog-plus/types';
import { apiClient } from './client';

/**
 * 업무일지 API 객체
 */
export const worklogsApi = {
  /**
   * 업무일지 목록 조회
   *
   * @description
   * 업무일지 목록을 가져옵니다. 프로젝트별 필터링을 지원합니다.
   *
   * @param {string} projectId - 프로젝트 ID (선택사항, 지정 시 해당 프로젝트의 업무일지만 조회)
   * @param {number} page - 페이지 번호 (기본 1)
   * @param {number} limit - 페이지당 항목 수 (기본 10)
   * @returns {Promise<ApiResponse<PaginatedResponse<Worklog>>>} 업무일지 목록
   *
   * @why projectId를 선택사항으로 한 이유
   * - 유연성: 전체 업무일지 또는 프로젝트별 업무일지 모두 조회 가능
   * - 재사용성: 하나의 API로 여러 용도 지원
   *
   * @example
   * // 전체 업무일지 조회
   * const response = await worklogsApi.getAll();
   *
   * @example
   * // 특정 프로젝트의 업무일지만 조회
   * const response = await worklogsApi.getAll('project-id');
   *
   * @example
   * // 페이지네이션
   * const response = await worklogsApi.getAll(undefined, 2, 20);
   *
   * @example
   * // TanStack Query 무한 스크롤
   * const { data, fetchNextPage } = useInfiniteQuery({
   *   queryKey: ['worklogs', projectId],
   *   queryFn: ({ pageParam = 1 }) =>
   *     worklogsApi.getAll(projectId, pageParam, 10),
   *   getNextPageParam: (lastPage, pages) =>
   *     lastPage.data.hasMore ? pages.length + 1 : undefined
   * });
   */
  getAll: (projectId?: string, page = 1, limit = 10) => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (projectId) {
      params.projectId = projectId;
    }
    return apiClient.get<PaginatedResponse<Worklog>>('/worklogs', params);
  },

  /**
   * 업무일지 상세 조회
   *
   * @description
   * 특정 업무일지의 상세 정보를 가져옵니다.
   *
   * @param {string} id - 업무일지 ID
   * @returns {Promise<ApiResponse<Worklog>>} 업무일지 상세 정보
   *
   * @example
   * const response = await worklogsApi.getById('worklog-id');
   * if (response.success) {
   *   console.log(response.data.title, response.data.content);
   * }
   */
  getById: (id: string) => apiClient.get<Worklog>(`/worklogs/${id}`),

  /**
   * 업무일지 생성
   *
   * @description
   * 새로운 업무일지를 작성합니다.
   *
   * @param {WorklogCreateInput} data - 업무일지 작성 정보
   * @returns {Promise<ApiResponse<Worklog>>} 생성된 업무일지
   *
   * @example
   * const response = await worklogsApi.create({
   *   projectId: 'project-id',
   *   title: '로그인 기능 구현',
   *   content: 'JWT 인증 방식으로 로그인 기능을 구현했습니다.',
   *   date: '2026-02-15',
   *   duration: 4.5 // 4.5시간
   * });
   *
   * @validation 서버 검증
   * - projectId: 필수, 존재하는 프로젝트여야 함
   * - title: 필수, 1-200자
   * - date: 필수, YYYY-MM-DD 형식
   * - duration: 선택, 0 < duration < 24
   */
  create: (data: WorklogCreateInput) =>
    apiClient.post<Worklog>('/worklogs', data),

  /**
   * 업무일지 수정
   *
   * @description
   * 기존 업무일지를 수정합니다. 변경할 필드만 전달하면 됩니다.
   *
   * @param {WorklogUpdateInput} data - 수정할 정보 (id 포함)
   * @returns {Promise<ApiResponse<Worklog>>} 수정된 업무일지
   *
   * @why id를 data에 포함시킨 이유
   * - 일관성: WorklogUpdateInput 타입에 id가 포함되어 있음
   * - 편의성: 하나의 객체로 모든 정보 전달
   * - 타입 안전성: id를 별도 파라미터로 분리하면 타입 불일치 가능
   *
   * @example
   * const response = await worklogsApi.update({
   *   id: 'worklog-id',
   *   title: '수정된 제목',
   *   duration: 5.0
   * });
   *
   * @note
   * - id는 필수이며 URL 경로에 사용됩니다
   * - 나머지 필드는 선택사항 (변경할 필드만 포함)
   */
  update: (data: WorklogUpdateInput) =>
    apiClient.patch<Worklog>(`/worklogs/${data.id}`, data),

  /**
   * 업무일지 삭제
   *
   * @description
   * 업무일지를 삭제합니다.
   *
   * @param {string} id - 업무일지 ID
   * @returns {Promise<ApiResponse<void>>} 성공 여부
   *
   * @warning
   * - 삭제는 되돌릴 수 없습니다
   * - 삭제 전 확인 다이얼로그 표시 권장
   *
   * @example
   * const handleDelete = async (worklogId: string) => {
   *   if (!confirm('정말 삭제하시겠습니까?')) return;
   *
   *   const response = await worklogsApi.delete(worklogId);
   *   if (response.success) {
   *     toast.success('업무일지가 삭제되었습니다');
   *     // 목록 새로고침
   *     queryClient.invalidateQueries(['worklogs']);
   *   }
   * };
   */
  delete: (id: string) => apiClient.delete<void>(`/worklogs/${id}`),
};
