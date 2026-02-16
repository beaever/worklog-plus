/**
 * 페이지네이션 유틸리티
 * 
 * @description
 * - 페이지네이션 파라미터 검증 및 계산
 * - Prisma 쿼리용 skip/take 값 생성
 * - 페이지네이션 메타데이터 생성
 */

/**
 * 페이지네이션 파라미터 인터페이스
 */
export interface PaginationParams {
  page: number;    // 현재 페이지 (1부터 시작)
  limit: number;   // 페이지당 항목 수
}

/**
 * 페이지네이션 결과 인터페이스
 */
export interface PaginationResult {
  skip: number;      // Prisma skip 값
  take: number;      // Prisma take 값
  page: number;      // 현재 페이지
  limit: number;     // 페이지당 항목 수
}

/**
 * 페이지네이션 메타데이터 인터페이스
 */
export interface PaginationMeta {
  total: number;       // 전체 항목 수
  page: number;        // 현재 페이지
  limit: number;       // 페이지당 항목 수
  totalPages: number;  // 전체 페이지 수
  hasNext: boolean;    // 다음 페이지 존재 여부
  hasPrev: boolean;    // 이전 페이지 존재 여부
}

/**
 * 기본 페이지네이션 설정
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100; // 한 번에 가져올 수 있는 최대 항목 수

/**
 * 페이지네이션 파라미터 검증 및 계산
 * 
 * @description
 * - 페이지와 limit 값을 검증하고 Prisma 쿼리용 값으로 변환합니다
 * - 잘못된 값은 기본값으로 대체됩니다
 * 
 * @param {number} page - 페이지 번호 (1부터 시작)
 * @param {number} limit - 페이지당 항목 수
 * @returns {PaginationResult} skip, take, page, limit 값
 * 
 * @example
 * const { skip, take } = getPaginationParams(2, 20);
 * 
 * const users = await prisma.user.findMany({
 *   skip,    // 20 (첫 20개 건너뛰기)
 *   take,    // 20 (20개 가져오기)
 * });
 */
export const getPaginationParams = (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
): PaginationResult => {
  // 페이지 번호 검증 (최소 1)
  const validPage = Math.max(1, Math.floor(page));

  // limit 검증 (최소 1, 최대 MAX_LIMIT)
  const validLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)));

  // Prisma skip 계산 (0부터 시작)
  const skip = (validPage - 1) * validLimit;

  return {
    skip,
    take: validLimit,
    page: validPage,
    limit: validLimit,
  };
};

/**
 * 페이지네이션 메타데이터 생성
 * 
 * @description
 * - 전체 항목 수를 기반으로 페이지네이션 메타데이터를 생성합니다
 * - API 응답에 포함하여 클라이언트에서 페이지네이션 UI를 구성할 수 있습니다
 * 
 * @param {number} total - 전체 항목 수
 * @param {number} page - 현재 페이지
 * @param {number} limit - 페이지당 항목 수
 * @returns {PaginationMeta} 페이지네이션 메타데이터
 * 
 * @example
 * const total = await prisma.user.count();
 * const meta = getPaginationMeta(total, 2, 10);
 * 
 * res.json({
 *   data: users,
 *   meta: {
 *     total: 45,
 *     page: 2,
 *     limit: 10,
 *     totalPages: 5,
 *     hasNext: true,
 *     hasPrev: true,
 *   },
 * });
 */
export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(total / limit);

  // 다음/이전 페이지 존재 여부
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrev,
  };
};

/**
 * 페이지네이션 응답 생성
 * 
 * @description
 * - 데이터와 메타데이터를 포함한 표준 페이지네이션 응답을 생성합니다
 * 
 * @param {T[]} data - 페이지네이션된 데이터 배열
 * @param {number} total - 전체 항목 수
 * @param {number} page - 현재 페이지
 * @param {number} limit - 페이지당 항목 수
 * @returns {object} 페이지네이션 응답 객체
 * 
 * @example
 * const users = await prisma.user.findMany({ skip, take });
 * const total = await prisma.user.count();
 * 
 * const response = createPaginatedResponse(users, total, page, limit);
 * res.json(response);
 * 
 * // 응답 형태:
 * // {
 * //   data: [...],
 * //   meta: {
 * //     total: 45,
 * //     page: 2,
 * //     limit: 10,
 * //     totalPages: 5,
 * //     hasNext: true,
 * //     hasPrev: true,
 * //   },
 * // }
 */
export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) => {
  const meta = getPaginationMeta(total, page, limit);

  return {
    data,
    meta,
  };
};

/**
 * 쿼리 파라미터에서 페이지네이션 값 추출
 * 
 * @description
 * - Express Request 객체에서 page와 limit 값을 안전하게 추출합니다
 * - 문자열을 숫자로 변환하고 검증합니다
 * 
 * @param {any} query - Express req.query 객체
 * @returns {PaginationParams} 검증된 page와 limit
 * 
 * @example
 * // GET /api/users?page=2&limit=20
 * const { page, limit } = extractPaginationFromQuery(req.query);
 * const { skip, take } = getPaginationParams(page, limit);
 */
export const extractPaginationFromQuery = (query: any): PaginationParams => {
  const page = query.page ? parseInt(query.page, 10) : DEFAULT_PAGE;
  const limit = query.limit ? parseInt(query.limit, 10) : DEFAULT_LIMIT;

  return {
    page: isNaN(page) ? DEFAULT_PAGE : page,
    limit: isNaN(limit) ? DEFAULT_LIMIT : limit,
  };
};
