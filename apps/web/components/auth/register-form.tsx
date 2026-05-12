'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@worklog-plus/ui';
import { registerSchema, type RegisterFormData } from '@worklog-plus/types';
import { useRegister } from '@/hooks/use-auth';

export function RegisterForm() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = ({ name, email, password }: RegisterFormData) => {
    registerMutation.mutate({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {registerMutation.error && (
        <div className='rounded-md bg-red-50 p-3 text-sm text-red-600'>
          {registerMutation.error.message || '회원가입에 실패했습니다.'}
        </div>
      )}

      <div className='space-y-2'>
        <label htmlFor='name' className='text-sm font-medium'>
          이름
        </label>
        <Input
          id='name'
          type='text'
          placeholder='홍길동'
          {...register('name')}
          disabled={registerMutation.isPending}
        />
        {errors.name && (
          <p className='text-sm text-red-600'>{errors.name.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <label htmlFor='email' className='text-sm font-medium'>
          이메일
        </label>
        <Input
          id='email'
          type='email'
          placeholder='name@example.com'
          {...register('email')}
          disabled={registerMutation.isPending}
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
          placeholder='8자 이상, 영문+숫자 포함'
          {...register('password')}
          disabled={registerMutation.isPending}
        />
        {errors.password && (
          <p className='text-sm text-red-600'>{errors.password.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <label htmlFor='confirmPassword' className='text-sm font-medium'>
          비밀번호 확인
        </label>
        <Input
          id='confirmPassword'
          type='password'
          placeholder='비밀번호를 다시 입력하세요'
          {...register('confirmPassword')}
          disabled={registerMutation.isPending}
        />
        {errors.confirmPassword && (
          <p className='text-sm text-red-600'>{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type='submit' className='w-full' disabled={registerMutation.isPending}>
        {registerMutation.isPending ? '가입 중...' : '회원가입'}
      </Button>

      <p className='text-center text-sm text-muted-foreground'>
        이미 계정이 있으신가요?{' '}
        <Link href='/login' className='text-primary hover:underline'>
          로그인
        </Link>
      </p>
    </form>
  );
}
