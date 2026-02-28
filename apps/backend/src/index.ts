import createApp from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

const startServer = async () => {
  try {
    console.log('🔌 데이터베이스 연결 확인 중...');
    await prisma.$connect();
    console.log('✅ 데이터베이스 연결 성공');

    const app = createApp();
    const PORT = parseInt(env.PORT, 10);

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

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise);
      console.error('❌ Reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
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
