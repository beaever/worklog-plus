'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@worklog-plus/ui';
import { loginSchema, type LoginFormData } from '@worklog-plus/types';
import { useLogin } from '@/hooks/use-auth';

export function LoginForm() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {loginMutation.error && (
        <div className='rounded-md bg-red-50 p-3 text-sm text-red-600'>
          {loginMutation.error.message || '로그인에 실패했습니다.'}
        </div>
      )}

      <div className='space-y-2'>
        <label htmlFor='email' className='text-sm font-medium'>
          이메일
        </label>
        <Input
          id='email'
          type='email'
          placeholder='name@example.com'
          {...register('email')}
          disabled={loginMutation.isPending}
        />
        {errors.email && (
          <p className='text-sm text-red-600'>{errors.email.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <label htmlFor='password' className='text-sm font-medium'>
          비밀번호
        </label>
        <Input
          id='password'
          type='password'
          {...register('password')}
          disabled={loginMutation.isPending}
        />
        {errors.password && (
          <p className='text-sm text-red-600'>{errors.password.message}</p>
        )}
      </div>

      <Button
        type='submit'
        className='w-full'
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? '로그인 중...' : '로그인'}
      </Button>

      <p className='text-center text-sm text-muted-foreground'>
        계정이 없으신가요?{' '}
        <Link href='/register' className='text-primary hover:underline'>
          회원가입
        </Link>
      </p>
    </form>
  );
}
