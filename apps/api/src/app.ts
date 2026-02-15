/**
 * Express 애플리케이션 설정
 * 
 * @description
 * - Express 앱 인스턴스 생성 및 미들웨어 설정
 * - 라우트 등록
 * - 에러 핸들러 설정
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { env } from './config/env';

/**
 * Express 애플리케이션 생성 및 설정
 * 
 * @returns {Application} 설정된 Express 앱 인스턴스
 */
const createApp = (): Application => {
  const app = express();

  // ============================================
  // 보안 미들웨어
  // ============================================

  /**
   * Helmet - HTTP 헤더 보안 강화
   * - XSS 공격 방지
   * - 클릭재킹 방지
   * - MIME 타입 스니핑 방지
   */
  app.use(helmet());

  /**
   * CORS - 교차 출처 리소스 공유 설정
   * - 프론트엔드에서 API 접근 허용
   */
  app.use(cors(corsOptions));

  // ============================================
  // 요청 파싱 미들웨어
  // ============================================

  /**
   * JSON 요청 본문 파싱
   * - Content-Type: application/json
   * - 최대 크기: 10MB
   */
  app.use(express.json({ limit: '10mb' }));

  /**
   * URL-encoded 요청 본문 파싱
   * - Content-Type: application/x-www-form-urlencoded
   */
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ============================================
  // 로깅 미들웨어
  // ============================================

  /**
   * Morgan - HTTP 요청 로깅
   * - 개발 환경: 상세한 로그 (dev 포맷)
   * - 프로덕션: 간결한 로그 (combined 포맷)
   */
  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // ============================================
  // 헬스 체크 엔드포인트
  // ============================================

  /**
   * GET /health
   * 
   * @description 서버 상태 확인용 엔드포인트
   * @returns {object} 서버 상태 정보
   * 
   * @example
   * curl http://localhost:8080/health
   * // { "status": "ok", "timestamp": "2026-02-15T06:24:00.000Z" }
   */
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  // ============================================
  // API 라우트 (나중에 추가)
  // ============================================

  /**
   * API 라우트 등록
   * 모든 API는 /api 접두사를 사용합니다
   */
  // app.use('/api/auth', authRoutes);
  // app.use('/api/users', usersRoutes);
  // app.use('/api/projects', projectsRoutes);
  // app.use('/api/worklogs', worklogsRoutes);
  // app.use('/api/dashboard', dashboardRoutes);
  // app.use('/api/admin', adminRoutes);

  // ============================================
  // 404 핸들러
  // ============================================

  /**
   * 존재하지 않는 라우트 처리
   */
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: '요청하신 리소스를 찾을 수 없습니다',
      path: req.path,
    });
  });

  // ============================================
  // 에러 핸들러 (나중에 추가)
  // ============================================

  /**
   * 전역 에러 핸들러
   * 모든 에러를 중앙에서 처리합니다
   */
  // app.use(errorHandler);

  return app;
};

export default createApp;
