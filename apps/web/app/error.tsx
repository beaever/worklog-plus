'use client';

import { useEffect } from 'react';
import { Button } from '@worklog-plus/ui';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

/**
 * 에러 타입 분류
 * 
 * @description
 * 에러 메시지를 분석하여 에러 타입을 분류합니다.
 * 각 타입에 따라 적절한 사용자 메시지를 표시합니다.
 */
type ErrorType = 'network' | 'auth' | 'notFound' | 'server' | 'unknown';

/**
 * 에러 타입 감지 함수
 * 
 * @param {Error} error - 발생한 에러 객체
 * @returns {ErrorType} 분류된 에러 타입
 */
function getErrorType(error: Error): ErrorType {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'network';
  }
  if (message.includes('auth') || message.includes('unauthorized') || message.includes('401')) {
    return 'auth';
  }
  if (message.includes('not found') || message.includes('404')) {
    return 'notFound';
  }
  if (message.includes('server') || message.includes('500')) {
    return 'server';
  }
  
  return 'unknown';
}

/**
 * 에러 타입별 메시지 정의
 */
const ERROR_MESSAGES: Record<ErrorType, { title: string; description: string }> = {
  network: {
    title: '네트워크 연결 오류',
    description: '인터넷 연결을 확인하고 다시 시도해주세요.',
  },
  auth: {
    title: '인증 오류',
    description: '로그인이 만료되었습니다. 다시 로그인해주세요.',
  },
  notFound: {
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 페이지가 존재하지 않습니다.',
  },
  server: {
    title: '서버 오류',
    description: '일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
  unknown: {
    title: '오류가 발생했습니다',
    description: '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.',
  },
};

/**
 * 전역 에러 바운더리 컴포넌트
 * 
 * @description
 * Next.js App Router의 전역 에러 처리 컴포넌트입니다.
 * 애플리케이션에서 발생하는 모든 에러를 캐치하고 사용자 친화적인 UI를 표시합니다.
 * 
 * **주요 기능:**
 * - 에러 타입별 맞춤 메시지 표시
 * - 재시도 버튼 제공
 * - 홈으로 이동 버튼 제공
 * - 개발 환경에서 상세 에러 정보 표시
 * - 에러 로깅 (프로덕션 환경에서는 Sentry 등으로 전송 가능)
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {Error & { digest?: string }} props.error - 발생한 에러 객체
 * @param {() => void} props.reset - 에러 상태를 리셋하고 재시도하는 함수
 * 
 * @example
 * // Next.js가 자동으로 에러 발생 시 이 컴포넌트를 렌더링합니다
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /**
     * 에러 로깅
     * 
     * 프로덕션 환경에서는 Sentry, LogRocket 등의 
     * 에러 모니터링 서비스로 전송할 수 있습니다.
     */
    console.error('Application error:', error);
    
    // TODO: 프로덕션 환경에서 에러 모니터링 서비스로 전송
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error);
    // }
  }, [error]);

  const errorType = getErrorType(error);
  const { title, description } = ERROR_MESSAGES[errorType];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* 에러 아이콘 */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-6">
            <AlertCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        {/* 에러 메시지 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-4 text-base text-gray-600">
            {description}
          </p>

          {/* 개발 환경에서만 상세 에러 정보 표시 */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 rounded-lg bg-gray-100 p-4 text-left">
              <summary className="cursor-pointer font-medium text-gray-700">
                개발자 정보 (프로덕션에서는 표시되지 않음)
              </summary>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">에러 메시지:</span>{' '}
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Digest:</span> {error.digest}
                  </p>
                )}
                {error.stack && (
                  <pre className="mt-2 overflow-auto rounded bg-gray-200 p-2 text-xs text-gray-800">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="inline-flex items-center gap-2"
            size="lg"
          >
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="inline-flex items-center gap-2"
            size="lg"
          >
            <Home className="h-4 w-4" />
            홈으로 이동
          </Button>
        </div>

        {/* 추가 도움말 */}
        <div className="text-center text-sm text-gray-500">
          <p>
            문제가 계속되면{' '}
            <a
              href="mailto:support@worklog-plus.com"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              고객 지원팀
            </a>
            에 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
