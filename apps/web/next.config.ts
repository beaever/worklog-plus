import type { NextConfig } from 'next';

/**
 * Next.js 설정
 *
 * @description
 * 애플리케이션의 성능 최적화 및 빌드 설정을 관리합니다.
 *
 * **주요 설정:**
 * - React Strict Mode: 개발 중 잠재적 문제 감지
 * - 이미지 최적화: 자동 이미지 최적화 및 지연 로딩
 * - 번들 분석: 프로덕션 빌드 크기 분석
 * - 모노레포 패키지 트랜스파일
 */
const nextConfig: NextConfig = {
  /**
   * React Strict Mode 활성화
   * 개발 환경에서 잠재적인 문제를 조기에 발견합니다.
   */
  reactStrictMode: true,

  /**
   * 모노레포 패키지 트랜스파일
   * workspace 내 패키지들을 자동으로 트랜스파일합니다.
   */
  transpilePackages: [
    '@worklog-plus/ui',
    '@worklog-plus/hooks',
    '@worklog-plus/store',
    '@worklog-plus/api',
    '@worklog-plus/types',
  ],

  /**
   * 이미지 최적화 설정
   * Next.js Image 컴포넌트의 동작을 구성합니다.
   */
  images: {
    /**
     * 허용된 이미지 도메인
     * 외부 이미지를 사용할 경우 도메인을 추가해야 합니다.
     */
    domains: [],

    /**
     * 이미지 포맷 우선순위
     * 브라우저가 지원하는 경우 WebP 형식을 우선 사용합니다.
     */
    formats: ['image/webp', 'image/avif'],

    /**
     * 이미지 크기 최적화
     * 반응형 이미지를 위한 디바이스 크기 정의
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /**
   * 컴파일러 최적화
   * SWC 컴파일러 옵션 설정
   */
  compiler: {
    /**
     * 프로덕션 빌드에서 console.log 제거
     * 개발 환경에서는 유지됩니다.
     */
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  /**
   * 실험적 기능
   * Next.js의 최신 기능을 활성화합니다.
   */
  experimental: {
    /**
     * 최적화된 패키지 임포트
     * 특정 라이브러리의 트리 쉐이킹을 개선합니다.
     */
    optimizePackageImports: ['lucide-react', '@worklog-plus/ui'],
  },

  /**
   * 번들 분석기 설정
   * ANALYZE=true 환경 변수로 활성화
   *
   * 사용법: ANALYZE=true pnpm build
   */
};

export default nextConfig;
