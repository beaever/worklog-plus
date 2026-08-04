import * as Sentry from '@sentry/nextjs';

// 서버/엣지 런타임 초기화. DSN이 없으면 건너뛴다.
export function register(): void {
  if (!process.env.SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1,
    environment: process.env.VERCEL_ENV ?? 'development',
  });
}

// Next.js가 서버 렌더/Route Handler 에러를 이 훅으로 넘긴다.
export const onRequestError = Sentry.captureRequestError;
