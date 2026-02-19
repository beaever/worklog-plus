import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 보호된 라우트 목록
 * 
 * @description
 * 인증이 필요한 페이지 경로들을 정의합니다.
 * 이 경로들에 접근하려면 유효한 accessToken이 필요합니다.
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/projects',
  '/worklogs',
  '/settings',
  '/admin',
];

/**
 * 공개 라우트 목록
 * 
 * @description
 * 인증 없이 접근 가능한 페이지 경로들을 정의합니다.
 * 로그인한 사용자가 접근 시 대시보드로 리다이렉트됩니다.
 */
const PUBLIC_ROUTES = ['/login', '/register'];

/**
 * Next.js 미들웨어 함수
 * 
 * @description
 * 모든 요청에 대해 실행되며, 인증 상태를 확인하고 적절한 라우팅을 수행합니다.
 * 
 * **동작 방식:**
 * 1. 쿠키에서 accessToken 확인
 * 2. 보호된 라우트 접근 시 토큰 없으면 로그인 페이지로 리다이렉트
 * 3. 공개 라우트 접근 시 토큰 있으면 대시보드로 리다이렉트
 * 4. 그 외의 경우 요청 통과
 * 
 * @param {NextRequest} request - Next.js 요청 객체
 * @returns {NextResponse} Next.js 응답 객체 (리다이렉트 또는 통과)
 * 
 * @example
 * // 자동으로 모든 요청에 대해 실행됨
 * // 설정은 하단의 config 객체에서 관리
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 쿠키에서 accessToken 확인
  // 브라우저의 localStorage는 서버 사이드에서 접근 불가하므로
  // 클라이언트에서 쿠키에도 토큰을 저장하도록 수정 필요
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // 보호된 라우트 확인
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  // 공개 라우트 확인
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  /**
   * 보호된 라우트 접근 제어
   * 
   * 토큰이 없는 사용자가 보호된 라우트에 접근하려고 하면
   * 로그인 페이지로 리다이렉트하고, 원래 접근하려던 URL을 
   * callbackUrl 쿼리 파라미터로 전달합니다.
   */
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  /**
   * 공개 라우트 접근 제어
   * 
   * 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하려고 하면
   * 대시보드로 리다이렉트합니다.
   */
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // 그 외의 경우 요청 통과
  return NextResponse.next();
}

/**
 * 미들웨어 설정
 * 
 * @description
 * 미들웨어가 실행될 경로를 정의합니다.
 * 
 * **제외 경로:**
 * - `_next/static`: Next.js 정적 파일
 * - `_next/image`: Next.js 이미지 최적화
 * - `favicon.ico`: 파비콘
 * - API 라우트: `/api/*`
 * - 정적 파일: 이미지, 폰트 등
 */
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 대해 미들웨어 실행:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public 폴더의 파일들 (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)',
  ],
};
