import * as React from 'react';
import { cn } from './lib/utils';

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-4',
} as const;

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizeMap;
}

// 회전 로딩 스피너. 전역/로컬 어디서나 사용하는 기본 로딩 인디케이터.
function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  return (
    <div
      role='status'
      aria-label='로딩 중'
      className={cn(
        'animate-spin rounded-full border-primary border-t-transparent',
        sizeMap[size],
        className,
      )}
      {...props}
    />
  );
}

interface LoadingOverlayProps {
  // 화면 전체를 덮을지(fixed) 부모 영역만 채울지(absolute) 결정
  fullScreen?: boolean;
  label?: string;
}

// 스피너를 중앙에 배치한 로딩 오버레이. 페이지 전환/데이터 로딩 시 사용.
function LoadingOverlay({ fullScreen = false, label }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen
          ? 'fixed inset-0 z-50 bg-background/60 backdrop-blur-sm'
          : 'min-h-[400px] w-full',
      )}
    >
      <Spinner size='lg' />
      {label && <p className='text-sm text-muted-foreground'>{label}</p>}
    </div>
  );
}

export { Spinner, LoadingOverlay };
