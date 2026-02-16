/**
 * CORS (Cross-Origin Resource Sharing) 설정
 * 
 * @description
 * - 프론트엔드에서 API 서버로의 요청을 허용하기 위한 CORS 설정
 * - 개발 환경과 프로덕션 환경에 따라 다른 설정 적용
 * - 보안을 위해 허용된 도메인만 접근 가능하도록 제한
 */

import { CorsOptions } from 'cors';
import { env } from './env';

/**
 * 허용된 Origin 목록
 * 
 * @description
 * - 개발 환경: localhost의 다양한 포트 허용
 * - 프로덕션: 환경 변수에 설정된 도메인만 허용
 */
const allowedOrigins = env.NODE_ENV === 'production'
  ? [env.CORS_ORIGIN] // 프로덕션: 설정된 도메인만
  : [
      'http://localhost:3000', // Next.js 개발 서버
      'http://localhost:8081', // Expo 개발 서버
      env.CORS_ORIGIN,
    ];

/**
 * CORS 설정 옵션
 * 
 * @property {function} origin - Origin 검증 함수
 * @property {boolean} credentials - 쿠키 전송 허용 여부
 * @property {string[]} methods - 허용할 HTTP 메서드
 * @property {string[]} allowedHeaders - 허용할 요청 헤더
 * @property {number} maxAge - Preflight 요청 캐시 시간 (초)
 */
export const corsOptions: CorsOptions = {
  /**
   * Origin 검증
   * 
   * @param {string | undefined} origin - 요청의 Origin
   * @param {function} callback - 검증 결과 콜백
   */
  origin: (origin, callback) => {
    // Origin이 없는 경우 (같은 도메인 요청, Postman 등)
    if (!origin) {
      return callback(null, true);
    }

    // 허용된 Origin인지 확인
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  차단된 CORS 요청: ${origin}`);
      callback(new Error('CORS 정책에 의해 차단되었습니다'));
    }
  },

  // 쿠키 및 인증 정보 전송 허용
  credentials: true,

  // 허용할 HTTP 메서드
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // 허용할 요청 헤더
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],

  // Preflight 요청 캐시 시간 (24시간)
  maxAge: 86400,
};

/**
 * 개발 환경에서 CORS 정보 출력
 */
if (env.NODE_ENV === 'development') {
  console.log('🌐 CORS 설정:');
  console.log(`  - 허용된 Origin: ${allowedOrigins.join(', ')}`);
  console.log(`  - Credentials: ${corsOptions.credentials}`);
}
