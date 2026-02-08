'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t bg-background'>
      <div className='mx-auto max-w-7xl px-6 py-8'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='flex flex-col items-center gap-2 md:items-start'>
            <Link href='/dashboard' className='text-lg font-bold'>
              WorkLog+
            </Link>
            <p className='text-sm text-muted-foreground'>
              업무 일지 관리 서비스
            </p>
          </div>

          <div className='flex flex-col items-center gap-4 md:flex-row md:gap-8'>
            <nav className='flex gap-6 text-sm text-muted-foreground'>
              <Link
                href='/dashboard'
                className='hover:text-foreground transition-colors'
              >
                대시보드
              </Link>
              <Link
                href='/projects'
                className='hover:text-foreground transition-colors'
              >
                프로젝트
              </Link>
              <Link
                href='/worklogs'
                className='hover:text-foreground transition-colors'
              >
                업무일지
              </Link>
              <Link
                href='/settings'
                className='hover:text-foreground transition-colors'
              >
                설정
              </Link>
            </nav>
          </div>
        </div>

        <div className='mt-8 border-t pt-6 text-center text-sm text-muted-foreground'>
          <p>© {currentYear} WorkLog+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
