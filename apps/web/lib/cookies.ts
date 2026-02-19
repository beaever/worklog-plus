/**
 * 쿠키 관리 유틸리티
 *
 * @description
 * 브라우저 쿠키를 설정, 조회, 삭제하는 유틸리티 함수들을 제공합니다.
 * Next.js 미들웨어에서 인증 상태를 확인하기 위해 사용됩니다.
 */

/**
 * 쿠키 설정 옵션 인터페이스
 */
interface CookieOptions {
  /** 쿠키 만료 시간 (일 단위) */
  days?: number;
  /** 쿠키 경로 (기본값: '/') */
  path?: string;
  /** 도메인 설정 */
  domain?: string;
  /** HTTPS에서만 전송 여부 */
  secure?: boolean;
  /** JavaScript 접근 차단 여부 */
  httpOnly?: boolean;
  /** SameSite 속성 */
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * 쿠키 설정
 *
 * @description
 * 브라우저에 쿠키를 설정합니다.
 *
 * @param {string} name - 쿠키 이름
 * @param {string} value - 쿠키 값
 * @param {CookieOptions} options - 쿠키 옵션
 *
 * @example
 * setCookie('accessToken', 'token-value', { days: 7, secure: true });
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  const {
    days = 7,
    path = '/',
    domain,
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'lax',
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // 만료 시간 설정
  if (days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  // 경로 설정
  cookieString += `; path=${path}`;

  // 도메인 설정
  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  // Secure 플래그 (HTTPS에서만 전송)
  if (secure) {
    cookieString += '; secure';
  }

  // SameSite 속성
  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
}

/**
 * 쿠키 조회
 *
 * @description
 * 브라우저에서 특정 쿠키 값을 조회합니다.
 *
 * @param {string} name - 쿠키 이름
 * @returns {string | null} 쿠키 값 또는 null
 *
 * @example
 * const token = getCookie('accessToken');
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookieItem = cookies[i];
    if (!cookieItem) continue;

    let cookie = cookieItem;
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
}

/**
 * 쿠키 삭제
 *
 * @description
 * 브라우저에서 특정 쿠키를 삭제합니다.
 * 만료 시간을 과거로 설정하여 삭제합니다.
 *
 * @param {string} name - 쿠키 이름
 * @param {string} path - 쿠키 경로 (기본값: '/')
 *
 * @example
 * deleteCookie('accessToken');
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
}

/**
 * 모든 쿠키 조회
 *
 * @description
 * 브라우저의 모든 쿠키를 객체 형태로 반환합니다.
 *
 * @returns {Record<string, string>} 쿠키 객체
 *
 * @example
 * const allCookies = getAllCookies();
 * console.log(allCookies.accessToken);
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') {
    return {};
  }

  const cookies: Record<string, string> = {};
  const cookieStrings = document.cookie.split(';');

  for (const cookieString of cookieStrings) {
    const [name, value] = cookieString.split('=').map((s) => s.trim());
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
}
