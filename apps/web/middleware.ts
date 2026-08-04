import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// 인증이 필요한 페이지 경로
const PROTECTED_ROUTES = [
  '/dashboard',
  '/projects',
  '/worklogs',
  '/settings',
];

// 인증 없이 접근 가능한 경로 (로그인 사용자는 대시보드로 리다이렉트)
const PUBLIC_ROUTES = ['/login', '/register'];

// Supabase 세션을 갱신하고 보호/공개 라우트 접근을 제어한다.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { user, supabaseResponse } = await updateSession(request);

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // 미인증 사용자가 보호 라우트 접근 → 로그인으로 (원래 경로를 callbackUrl로 전달)
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 인증 사용자가 로그인/회원가입 접근 → 대시보드로
  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 갱신된 세션 쿠키가 실린 응답을 반환해야 한다.
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 미들웨어 실행:
     * - api (API routes)
     * - _next/static, _next/image
     * - favicon.ico, 정적 파일(이미지/폰트)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)',
  ],
};
