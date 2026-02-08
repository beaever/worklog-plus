import Link from 'next/link';
import { Button } from '@worklog-plus/ui';

export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-6xl'>
          WorkLog+
        </h1>
        <p className='mt-6 text-lg leading-8 text-muted-foreground'>
          효율적인 업무 일지 관리를 위한 서비스
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Link href='/dashboard'>
            <Button size='lg'>시작하기</Button>
          </Link>
          <Link href='/projects'>
            <Button variant='outline' size='lg'>
              프로젝트 보기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
