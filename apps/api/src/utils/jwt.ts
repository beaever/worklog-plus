/**
 * JWT (JSON Web Token) 유틸리티
 * 
 * @description
 * - Access Token과 Refresh Token 생성
 * - 토큰 검증 및 디코딩
 * - 토큰 만료 시간 관리
 */

import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * JWT 페이로드 인터페이스
 * 토큰에 포함될 사용자 정보
 */
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Access Token 생성
 * 
 * @description
 * - API 요청 인증에 사용되는 단기 토큰
 * - 기본 만료 시간: 15분
 * 
 * @param {string} userId - 사용자 ID
 * @param {string} email - 사용자 이메일
 * @param {string} role - 사용자 역할 (USER, MANAGER, ADMIN, SYSTEM_ADMIN)
 * @returns {string} 생성된 Access Token
 * 
 * @example
 * const accessToken = generateAccessToken('user-id', 'user@example.com', 'USER');
 */
export const generateAccessToken = (
  userId: string,
  email: string,
  role: string,
): string => {
  const payload: JwtPayload = {
    userId,
    email,
    role,
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    issuer: 'worklog-plus',
    subject: userId,
  });
};

/**
 * Refresh Token 생성
 * 
 * @description
 * - Access Token 갱신에 사용되는 장기 토큰
 * - 기본 만료 시간: 7일
 * - 데이터베이스에 저장되어 관리됨
 * 
 * @param {string} userId - 사용자 ID
 * @returns {string} 생성된 Refresh Token
 * 
 * @example
 * const refreshToken = generateRefreshToken('user-id');
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      issuer: 'worklog-plus',
      subject: userId,
    },
  );
};

/**
 * Access Token 검증
 * 
 * @description
 * - 토큰의 유효성을 검증합니다
 * - 만료, 서명, 형식 등을 확인합니다
 * 
 * @param {string} token - 검증할 Access Token
 * @returns {JwtPayload} 디코딩된 페이로드
 * @throws {Error} 토큰이 유효하지 않은 경우
 * 
 * @example
 * try {
 *   const payload = verifyAccessToken(token);
 *   console.log(payload.userId);
 * } catch (error) {
 *   console.error('Invalid token');
 * }
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('토큰이 만료되었습니다');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('유효하지 않은 토큰입니다');
    }
    throw new Error('토큰 검증 실패');
  }
};

/**
 * Refresh Token 검증
 * 
 * @description
 * - Refresh Token의 유효성을 검증합니다
 * - Access Token 갱신 시 사용됩니다
 * 
 * @param {string} token - 검증할 Refresh Token
 * @returns {object} 디코딩된 페이로드 (userId 포함)
 * @throws {Error} 토큰이 유효하지 않은 경우
 * 
 * @example
 * try {
 *   const payload = verifyRefreshToken(token);
 *   console.log(payload.userId);
 * } catch (error) {
 *   console.error('Invalid refresh token');
 * }
 */
export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('리프레시 토큰이 만료되었습니다');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('유효하지 않은 리프레시 토큰입니다');
    }
    throw new Error('리프레시 토큰 검증 실패');
  }
};

/**
 * 토큰 디코딩 (검증 없이)
 * 
 * @description
 * - 토큰을 검증하지 않고 디코딩만 합니다
 * - 디버깅이나 로깅 목적으로 사용
 * - 실제 인증에는 사용하지 마세요!
 * 
 * @param {string} token - 디코딩할 토큰
 * @returns {JwtPayload | null} 디코딩된 페이로드 또는 null
 * 
 * @example
 * const payload = decodeToken(token);
 * if (payload) {
 *   console.log('User ID:', payload.userId);
 * }
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * 토큰 만료 시간 계산
 * 
 * @description
 * - 토큰의 만료 시간을 Date 객체로 반환합니다
 * 
 * @param {string} expiresIn - 만료 시간 (예: '15m', '7d')
 * @returns {Date} 만료 시간
 * 
 * @example
 * const expiresAt = getTokenExpirationDate('7d');
 * console.log(expiresAt); // 7일 후의 Date 객체
 */
export const getTokenExpirationDate = (expiresIn: string): Date => {
  const now = new Date();
  
  // 시간 단위 파싱 (예: '15m' -> 15분, '7d' -> 7일)
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1), 10);

  switch (unit) {
    case 's': // 초
      return new Date(now.getTime() + value * 1000);
    case 'm': // 분
      return new Date(now.getTime() + value * 60 * 1000);
    case 'h': // 시간
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case 'd': // 일
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    default:
      throw new Error(`지원하지 않는 시간 단위: ${unit}`);
  }
};
