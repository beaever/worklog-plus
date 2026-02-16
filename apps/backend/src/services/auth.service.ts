/**
 * 인증 서비스
 *
 * @description
 * - 회원가입, 로그인, 로그아웃 비즈니스 로직
 * - JWT 토큰 생성 및 검증
 * - Refresh Token 관리
 */

import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { AppError } from '../middleware/error';

const prisma = new PrismaClient();

/**
 * 인증 응답 인터페이스
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

/**
 * 회원가입
 *
 * @param email - 이메일
 * @param password - 비밀번호
 * @param name - 이름
 * @returns 토큰과 사용자 정보
 */
export const register = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> => {
  // 1. 이메일 중복 확인
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(409, '이미 사용 중인 이메일입니다');
  }

  // 2. 비밀번호 해싱
  const passwordHash = await hashPassword(password);

  // 3. 사용자 생성
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role: 'USER' as const,
    },
  });

  // 4. 토큰 생성
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // 5. Refresh Token 저장
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

/**
 * 로그인
 *
 * @param email - 이메일
 * @param password - 비밀번호
 * @returns 토큰과 사용자 정보
 */
export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  // 1. 사용자 조회
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(401, '이메일 또는 비밀번호가 올바르지 않습니다');
  }

  // 2. 비밀번호 검증
  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    throw new AppError(401, '이메일 또는 비밀번호가 올바르지 않습니다');
  }

  // 3. 토큰 생성
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // 4. 기존 Refresh Token 삭제 (선택적)
  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
      expiresAt: {
        lt: new Date(), // 만료된 토큰만 삭제
      },
    },
  });

  // 5. 새 Refresh Token 저장
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

/**
 * 로그아웃
 *
 * @param refreshToken - Refresh Token
 */
export const logout = async (refreshToken: string): Promise<void> => {
  // Refresh Token 삭제
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};

/**
 * 토큰 갱신
 *
 * @param refreshToken - Refresh Token
 * @returns 새로운 토큰과 사용자 정보
 */
export const refresh = async (refreshToken: string): Promise<AuthResponse> => {
  // 1. Refresh Token 검증
  const payload = verifyRefreshToken(refreshToken);

  if (!payload) {
    throw new AppError(401, '유효하지 않은 Refresh Token입니다');
  }

  // 2. DB에서 Refresh Token 확인
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new AppError(401, '유효하지 않은 Refresh Token입니다');
  }

  // 3. 만료 확인
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
    throw new AppError(401, '만료된 Refresh Token입니다');
  }

  // 4. 새 토큰 생성
  const user = storedToken.user;
  const newAccessToken = generateAccessToken(user.id, user.email, user.role);
  const newRefreshToken = generateRefreshToken(user.id);

  // 5. 기존 Refresh Token 삭제 및 새 토큰 저장
  await prisma.$transaction([
    prisma.refreshToken.delete({
      where: { token: refreshToken },
    }),
    prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

/**
 * 현재 사용자 정보 조회
 *
 * @param userId - 사용자 ID
 * @returns 사용자 정보
 */
export const getCurrentUser = async (userId: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, '사용자를 찾을 수 없습니다');
  }

  return user;
};
