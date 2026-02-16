/**
 * 로거 유틸리티
 * 
 * @description
 * - 구조화된 로깅을 위한 유틸리티
 * - 로그 레벨별 출력 (error, warn, info, debug)
 * - 프로덕션 환경에서는 JSON 형식으로 출력
 */

import { env } from '../config/env';

/**
 * 로그 레벨 타입
 */
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * 로그 레벨 우선순위
 * 숫자가 낮을수록 중요한 로그
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

/**
 * 현재 로그 레벨
 * 환경 변수에서 설정된 레벨 이상의 로그만 출력됩니다
 */
const CURRENT_LOG_LEVEL = LOG_LEVELS[env.LOG_LEVEL];

/**
 * 로그 색상 (개발 환경용)
 */
const COLORS = {
  error: '\x1b[31m',   // 빨강
  warn: '\x1b[33m',    // 노랑
  info: '\x1b[36m',    // 청록
  debug: '\x1b[35m',   // 보라
  reset: '\x1b[0m',    // 리셋
};

/**
 * 로그 출력 여부 확인
 * 
 * @param {LogLevel} level - 확인할 로그 레벨
 * @returns {boolean} 출력 여부
 */
const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] <= CURRENT_LOG_LEVEL;
};

/**
 * 로그 포맷팅
 * 
 * @param {LogLevel} level - 로그 레벨
 * @param {string} message - 로그 메시지
 * @param {any} meta - 추가 메타데이터
 * @returns {string} 포맷팅된 로그 문자열
 */
const formatLog = (level: LogLevel, message: string, meta?: any): string => {
  const timestamp = new Date().toISOString();

  // 프로덕션: JSON 형식
  if (env.NODE_ENV === 'production') {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  }

  // 개발: 색상 있는 텍스트 형식
  const color = COLORS[level];
  const reset = COLORS.reset;
  const levelStr = level.toUpperCase().padEnd(5);
  
  let logStr = `${color}[${timestamp}] ${levelStr}${reset} ${message}`;
  
  if (meta) {
    logStr += `\n${JSON.stringify(meta, null, 2)}`;
  }
  
  return logStr;
};

/**
 * 에러 로그
 * 
 * @description
 * - 시스템 에러, 예외 상황 기록
 * - 항상 출력됩니다
 * 
 * @param {string} message - 에러 메시지
 * @param {any} meta - 추가 정보 (에러 객체, 스택 트레이스 등)
 * 
 * @example
 * logger.error('데이터베이스 연결 실패', { error: err.message });
 */
export const error = (message: string, meta?: any): void => {
  if (shouldLog('error')) {
    console.error(formatLog('error', message, meta));
  }
};

/**
 * 경고 로그
 * 
 * @description
 * - 잠재적 문제, 권장하지 않는 사용 패턴 기록
 * 
 * @param {string} message - 경고 메시지
 * @param {any} meta - 추가 정보
 * 
 * @example
 * logger.warn('API 요청 속도 제한 임박', { userId, requestCount: 95 });
 */
export const warn = (message: string, meta?: any): void => {
  if (shouldLog('warn')) {
    console.warn(formatLog('warn', message, meta));
  }
};

/**
 * 정보 로그
 * 
 * @description
 * - 일반적인 정보성 메시지
 * - 서버 시작, API 요청, 주요 이벤트 기록
 * 
 * @param {string} message - 정보 메시지
 * @param {any} meta - 추가 정보
 * 
 * @example
 * logger.info('사용자 로그인', { userId, email });
 */
export const info = (message: string, meta?: any): void => {
  if (shouldLog('info')) {
    console.log(formatLog('info', message, meta));
  }
};

/**
 * 디버그 로그
 * 
 * @description
 * - 개발 중 디버깅 정보
 * - 변수 값, 실행 흐름 추적
 * - 개발 환경에서만 사용 권장
 * 
 * @param {string} message - 디버그 메시지
 * @param {any} meta - 추가 정보
 * 
 * @example
 * logger.debug('쿼리 실행', { sql, params });
 */
export const debug = (message: string, meta?: any): void => {
  if (shouldLog('debug')) {
    console.log(formatLog('debug', message, meta));
  }
};

/**
 * HTTP 요청 로그
 * 
 * @description
 * - API 요청 정보 기록
 * - 메서드, 경로, 상태 코드, 응답 시간
 * 
 * @param {string} method - HTTP 메서드
 * @param {string} path - 요청 경로
 * @param {number} statusCode - 응답 상태 코드
 * @param {number} duration - 응답 시간 (ms)
 * 
 * @example
 * logger.http('GET', '/api/users', 200, 45);
 */
export const http = (
  method: string,
  path: string,
  statusCode: number,
  duration: number,
): void => {
  const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
  const message = `${method} ${path} ${statusCode} - ${duration}ms`;
  
  if (shouldLog(level)) {
    console.log(formatLog(level, message));
  }
};

/**
 * 로거 객체
 * 
 * @example
 * import * as logger from './utils/logger';
 * 
 * logger.info('서버 시작');
 * logger.error('에러 발생', { error });
 * logger.debug('디버그 정보', { data });
 */
export const logger = {
  error,
  warn,
  info,
  debug,
  http,
};

export default logger;
