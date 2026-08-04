import * as Sentry from '@sentry/nextjs';

// DSN이 없으면 초기화하지 않는다 — 로컬/미설정 환경에서 조용히 비활성.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // 트래픽이 늘면 낮춘다. 초기에는 표본이 적어 전량 수집이 낫다.
    tracesSampleRate: 1,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
  });
}

// App Router의 클라이언트 네비게이션을 트랜잭션으로 잇는다.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
