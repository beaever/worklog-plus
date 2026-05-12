import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (userId: string, email: string, role: string): string => {
  return jwt.sign({ userId, email, role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    issuer: 'worklog-plus',
    subject: userId,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    issuer: 'worklog-plus',
    subject: userId,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) throw new Error('토큰이 만료되었습니다');
    if (error instanceof jwt.JsonWebTokenError) throw new Error('유효하지 않은 토큰입니다');
    throw new Error('토큰 검증 실패');
  }
};

export const verifyRefreshToken = (token: string): { userId: string; iat: number; exp: number } | null => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; iat: number; exp: number };
  } catch {
    return null;
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};

export const getTokenExpirationDate = (expiresIn: string): Date => {
  const now = new Date();
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1), 10);

  switch (unit) {
    case 's': return new Date(now.getTime() + value * 1000);
    case 'm': return new Date(now.getTime() + value * 60 * 1000);
    case 'h': return new Date(now.getTime() + value * 60 * 60 * 1000);
    case 'd': return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    default: throw new Error(`지원하지 않는 시간 단위: ${unit}`);
  }
};
