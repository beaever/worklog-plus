'use client';

import Link from 'next/link';
import { Button } from '@worklog-plus/ui';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4'>
      <div className='text-center'>
        <div className='mb-6 flex justify-center'>
          <div className='rounded-full bg-destructive/10 p-4'>
            <ShieldX className='h-12 w-12 text-destructive' />
          </div>
        </div>
        <h1 className='mb-2 text-4xl font-bold'>403</h1>
        <h2 className='mb-4 text-xl font-semibold'>접근 권한이 없습니다</h2>
        <p className='mb-8 text-muted-foreground'>
          이 페이지에 접근할 권한이 없습니다.
          <br />
          관리자에게 문의하세요.
        </p>
        <Link href='/dashboard'>
          <Button>
            <ArrowLeft className='mr-2 h-4 w-4' />
            대시보드로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
