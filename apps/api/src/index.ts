/**
 * 서버 진입점 (Entry Point)
 * 
 * @description
 * - Express 서버를 시작합니다
 * - 데이터베이스 연결을 확인합니다
 * - 환경 변수를 검증합니다
 */

import createApp from './app';
import { env } from './config/env';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma 클라이언트 인스턴스
 * 데이터베이스와의 모든 통신에 사용됩니다
 */
const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * 서버 시작 함수
 * 
 * @description
 * 1. 데이터베이스 연결 확인
 * 2. Express 앱 생성
 * 3. 서버 시작
 * 4. Graceful Shutdown 설정
 */
const startServer = async () => {
  try {
    // ============================================
    // 1. 데이터베이스 연결 확인
    // ============================================
    console.log('🔌 데이터베이스 연결 확인 중...');
    await prisma.$connect();
    console.log('✅ 데이터베이스 연결 성공');

    // ============================================
    // 2. Express 앱 생성
    // ============================================
    const app = createApp();
    const PORT = parseInt(env.PORT, 10);

    // ============================================
    // 3. 서버 시작
    // ============================================
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('🚀 WorkLog+ API 서버 시작');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📍 서버 주소: http://localhost:${PORT}`);
      console.log(`🌍 환경: ${env.NODE_ENV}`);
      console.log(`🔐 CORS 허용: ${env.CORS_ORIGIN}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('💡 사용 가능한 엔드포인트:');
      console.log(`  - GET  http://localhost:${PORT}/health (헬스 체크)`);
      console.log('');
    });

    // ============================================
    // 4. Graceful Shutdown 설정
    // ============================================

    /**
     * 프로세스 종료 시그널 처리
     * 
     * @description
     * - 서버를 안전하게 종료합니다
     * - 진행 중인 요청을 완료한 후 종료
     * - 데이터베이스 연결 해제
     */
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n⚠️  ${signal} 시그널 수신`);
      console.log('🔄 서버 종료 중...');

      // 새로운 연결 거부
      server.close(async () => {
        console.log('✅ HTTP 서버 종료 완료');

        // 데이터베이스 연결 해제
        await prisma.$disconnect();
        console.log('✅ 데이터베이스 연결 해제 완료');

        console.log('👋 서버가 안전하게 종료되었습니다');
        process.exit(0);
      });

      // 30초 후 강제 종료
      setTimeout(() => {
        console.error('❌ 강제 종료 (타임아웃)');
        process.exit(1);
      }, 30000);
    };

    // 종료 시그널 리스너 등록
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ============================================
    // 예외 처리
    // ============================================

    /**
     * 처리되지 않은 Promise Rejection
     */
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise);
      console.error('❌ Reason:', reason);
      // 프로덕션에서는 로깅 서비스로 전송
    });

    /**
     * 처리되지 않은 예외
     */
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      // 프로덕션에서는 로깅 서비스로 전송
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// 서버 시작
startServer();
