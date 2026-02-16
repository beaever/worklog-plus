/**
 * 인증 미들웨어
 *
 * @description
 * - JWT 토큰 검증
 * - 사용자 인증 확인
 * - 역할 기반 권한 검증
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';

/**
 * 인증된 요청 인터페이스
 *
 * @description
 * - Express Request를 확장하여 user 속성 추가
 * - 미들웨어를 통과한 요청에는 user 정보가 포함됩니다
 */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * JWT 인증 미들웨어
 *
 * @description
 * - Authorization 헤더에서 JWT 토큰을 추출합니다
 * - 토큰을 검증하고 사용자 정보를 req.user에 저장합니다
 * - 인증 실패 시 401 Unauthorized 응답을 반환합니다
 *
 * @param {AuthRequest} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 * @param {NextFunction} next - 다음 미들웨어 함수
 *
 * @example
 * // 라우트에 적용
 * router.get('/profile', authenticate, (req: AuthRequest, res) => {
 *   const userId = req.user?.userId;
 *   // ...
 * });
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // Authorization 헤더 확인
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: '인증 토큰이 필요합니다',
      });
      return;
    }

    // Bearer 토큰 형식 확인
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: '잘못된 토큰 형식입니다. "Bearer {token}" 형식이어야 합니다',
      });
      return;
    }

    // 토큰 추출 (Bearer 제거)
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        error: '토큰이 제공되지 않았습니다',
      });
      return;
    }

    // 토큰 검증
    const payload = verifyAccessToken(token);

    // 사용자 정보를 요청 객체에 저장
    req.user = payload;

    // 다음 미들웨어로 진행
    next();
  } catch (error) {
    // 토큰 검증 실패
    const errorMessage =
      error instanceof Error ? error.message : '토큰 검증 실패';

    res.status(401).json({
      success: false,
      error: errorMessage,
    });
  }
};

/**
 * 역할 기반 권한 검증 미들웨어
 *
 * @description
 * - 사용자의 역할이 허용된 역할 목록에 포함되는지 확인합니다
 * - authenticate 미들웨어 이후에 사용해야 합니다
 * - 권한이 없으면 403 Forbidden 응답을 반환합니다
 *
 * @param {...string[]} allowedRoles - 허용된 역할 목록
 * @returns {Function} Express 미들웨어 함수
 *
 * @example
 * // 관리자만 접근 가능
 * router.delete('/users/:id', authenticate, authorize('ADMIN', 'SYSTEM_ADMIN'), deleteUser);
 *
 * // 매니저 이상만 접근 가능
 * router.post('/projects', authenticate, authorize('MANAGER', 'ADMIN', 'SYSTEM_ADMIN'), createProject);
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // 인증 확인 (authenticate 미들웨어가 먼저 실행되어야 함)
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: '인증이 필요합니다',
      });
      return;
    }

    // 역할 확인
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: '이 작업을 수행할 권한이 없습니다',
        requiredRoles: allowedRoles,
        userRole,
      });
      return;
    }

    // 권한 확인 완료, 다음 미들웨어로 진행
    next();
  };
};

/**
 * 선택적 인증 미들웨어
 *
 * @description
 * - 토큰이 있으면 검증하고, 없어도 다음 미들웨어로 진행합니다
 * - 공개 API이지만 로그인 시 추가 정보를 제공하는 경우 사용
 *
 * @param {AuthRequest} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 * @param {NextFunction} next - 다음 미들웨어 함수
 *
 * @example
 * // 로그인 여부와 관계없이 접근 가능하지만, 로그인 시 추가 정보 제공
 * router.get('/projects', optionalAuthenticate, getProjects);
 */
export const optionalAuthenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    // 토큰이 없으면 그냥 진행
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      next();
      return;
    }

    // 토큰이 있으면 검증
    const payload = verifyAccessToken(token);
    req.user = payload;

    next();
  } catch (error) {
    // 토큰 검증 실패해도 진행 (선택적이므로)
    next();
  }
};

/**
 * 본인 확인 미들웨어
 *
 * @description
 * - URL 파라미터의 userId와 인증된 사용자의 userId가 일치하는지 확인합니다
 * - 관리자는 모든 사용자에 접근 가능합니다
 *
 * @param {AuthRequest} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 * @param {NextFunction} next - 다음 미들웨어 함수
 *
 * @example
 * // 본인의 프로필만 수정 가능 (관리자는 모든 프로필 수정 가능)
 * router.patch('/users/:userId', authenticate, checkOwnership, updateUser);
 */
export const checkOwnership = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: '인증이 필요합니다',
    });
    return;
  }

  const { userId } = req.params;
  const authenticatedUserId = req.user.userId;
  const userRole = req.user.role;

  // 관리자는 모든 사용자에 접근 가능
  if (userRole === 'ADMIN' || userRole === 'SYSTEM_ADMIN') {
    next();
    return;
  }

  // 본인 확인
  if (userId !== authenticatedUserId) {
    res.status(403).json({
      success: false,
      error: '본인의 정보만 수정할 수 있습니다',
    });
    return;
  }

  next();
};
