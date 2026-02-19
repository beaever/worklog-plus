import * as React from 'react';
import { cn } from './lib/utils';

/**
 * Skeleton 컴포넌트 Props
 * 
 * @interface SkeletonProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 스켈레톤의 너비 (CSS 값) */
  width?: string | number;
  /** 스켈레톤의 높이 (CSS 값) */
  height?: string | number;
  /** 원형 스켈레톤 여부 */
  circle?: boolean;
  /** 애니메이션 비활성화 여부 */
  noAnimation?: boolean;
}

/**
 * Skeleton 컴포넌트
 * 
 * @description
 * 콘텐츠 로딩 중 표시되는 스켈레톤 UI 컴포넌트입니다.
 * 사용자에게 로딩 상태를 시각적으로 전달하여 UX를 개선합니다.
 * 
 * **주요 기능:**
 * - 맞춤형 크기 설정 (width, height)
 * - 원형 스켈레톤 지원 (circle prop)
 * - 펄스 애니메이션 (비활성화 가능)
 * - Tailwind CSS 클래스와 호환
 * 
 * **사용 시나리오:**
 * - 데이터 페칭 중 테이블/리스트 로딩
 * - 카드 컴포넌트 로딩
 * - 프로필 이미지 로딩
 * - 텍스트 콘텐츠 로딩
 * 
 * @param {SkeletonProps} props - 컴포넌트 props
 * 
 * @example
 * // 기본 사용
 * <Skeleton className="h-4 w-full" />
 * 
 * @example
 * // 원형 스켈레톤 (프로필 이미지)
 * <Skeleton circle width={40} height={40} />
 * 
 * @example
 * // 카드 스켈레톤
 * <div className="space-y-2">
 *   <Skeleton className="h-4 w-3/4" />
 *   <Skeleton className="h-4 w-1/2" />
 * </div>
 */
function Skeleton({
  className,
  width,
  height,
  circle = false,
  noAnimation = false,
  style,
  ...props
}: SkeletonProps) {
  const customStyle: React.CSSProperties = {
    ...style,
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <div
      className={cn(
        'bg-muted',
        !noAnimation && 'animate-pulse',
        circle && 'rounded-full',
        !circle && 'rounded-md',
        className
      )}
      style={customStyle}
      {...props}
    />
  );
}

/**
 * SkeletonText 컴포넌트
 * 
 * @description
 * 텍스트 로딩을 위한 스켈레톤 컴포넌트입니다.
 * 여러 줄의 텍스트 스켈레톤을 쉽게 생성할 수 있습니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {number} props.lines - 텍스트 줄 수 (기본값: 3)
 * @param {string} props.className - 추가 CSS 클래스
 * 
 * @example
 * <SkeletonText lines={5} />
 */
function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            'h-4',
            // 마지막 줄은 짧게 표시
            index === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard 컴포넌트
 * 
 * @description
 * 카드 형태의 스켈레톤 컴포넌트입니다.
 * 이미지 + 텍스트 조합의 카드 로딩에 적합합니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.hasImage - 이미지 영역 표시 여부 (기본값: true)
 * @param {number} props.lines - 텍스트 줄 수 (기본값: 3)
 * @param {string} props.className - 추가 CSS 클래스
 * 
 * @example
 * <SkeletonCard hasImage lines={4} />
 */
function SkeletonCard({
  hasImage = true,
  lines = 3,
  className,
}: {
  hasImage?: boolean;
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4 rounded-lg border p-4', className)}>
      {hasImage && <Skeleton className="h-48 w-full" />}
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <SkeletonText lines={lines} />
      </div>
    </div>
  );
}

/**
 * SkeletonTable 컴포넌트
 * 
 * @description
 * 테이블 형태의 스켈레톤 컴포넌트입니다.
 * 데이터 테이블 로딩 시 사용합니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {number} props.rows - 행 개수 (기본값: 5)
 * @param {number} props.columns - 열 개수 (기본값: 4)
 * @param {string} props.className - 추가 CSS 클래스
 * 
 * @example
 * <SkeletonTable rows={10} columns={5} />
 */
function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* 테이블 헤더 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-8" />
        ))}
      </div>
      
      {/* 테이블 바디 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable };
