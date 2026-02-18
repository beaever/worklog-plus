'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input } from '@worklog-plus/ui';
import { useLogin } from '@/hooks/use-auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateForm = (): string | null => {
    if (!email.trim()) {
      return '이메일을 입력해주세요.';
    }
    if (!EMAIL_REGEX.test(email)) {
      return '올바른 이메일 형식이 아닙니다.';
    }
    if (!password) {
      return '비밀번호를 입력해주세요.';
    }
    if (password.length < 4) {
      return '비밀번호는 4자 이상이어야 합니다.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onError: (err) => {
          setError(err.message || '로그인에 실패했습니다.');
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {error && (
        <div className='rounded-md bg-red-50 p-3 text-sm text-red-600'>
          {error}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loginMutation.isPending}
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='password' className='text-sm font-medium'>
          비밀번호
        </label>
        <Input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loginMutation.isPending}
        />
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
