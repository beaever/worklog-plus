import * as React from 'react';
import { cn } from './lib/utils';

// 콘텐츠 로딩 중 표시되는 자리표시자. 크기/모양은 className으로 지정한다.
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
  );
}

export { Skeleton };
