import Link from 'next/link';
import { Button } from '@worklog-plus/ui';

export default function NotFound() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <div className='text-center'>
        <p className='text-sm font-semibold text-primary'>404</p>
        <h1 className='mt-4 text-4xl font-bold tracking-tight sm:text-6xl'>
          페이지를 찾을 수 없습니다
        </h1>
        <p className='mt-6 text-lg leading-8 text-muted-foreground'>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Link href='/'>
            <Button size='lg'>홈으로 돌아가기</Button>
          </Link>
          <Link href='/dashboard'>
            <Button variant='outline' size='lg'>
              대시보드로 이동
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
