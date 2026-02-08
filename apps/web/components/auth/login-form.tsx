'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '@worklog/ui';
import { useUserStore } from '@worklog/store';
import type { User } from '@worklog/types';
import { generateUUID } from '@/lib/utils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    // 모의 로그인 - 딜레이 추가하여 실제 API 호출처럼 보이게
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser: User = {
      id: generateUUID(),
      email,
      name: email.split('@')[0] ?? 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockTokens = {
      accessToken: `mock_access_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
    };

    login(mockUser, mockTokens);
    setIsLoading(false);
    router.push('/dashboard');
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
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
