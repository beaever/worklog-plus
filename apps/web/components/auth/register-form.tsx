'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '@worklog-plus/ui';
import { useUserStore } from '@worklog-plus/store';
import type { User } from '@worklog-plus/types';
import { generateUUID } from '@/lib/utils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): string | null => {
    if (!name.trim()) {
      return '이름을 입력해주세요.';
    }
    if (name.trim().length < 2) {
      return '이름은 2자 이상이어야 합니다.';
    }
    if (!email.trim()) {
      return '이메일을 입력해주세요.';
    }
    if (!EMAIL_REGEX.test(email)) {
      return '올바른 이메일 형식이 아닙니다.';
    }
    if (!password) {
      return '비밀번호를 입력해주세요.';
    }
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    if (password !== confirmPassword) {
      return '비밀번호가 일치하지 않습니다.';
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

    // 모의 회원가입 - 딜레이 추가하여 실제 API 호출처럼 보이게
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser: User = {
      id: generateUUID(),
      email,
      name: name.trim(),
      role: 'USER',
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
        <label htmlFor='name' className='text-sm font-medium'>
          이름
        </label>
        <Input
          id='name'
          type='text'
          placeholder='홍길동'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

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
          placeholder='8자 이상 입력하세요'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='confirmPassword' className='text-sm font-medium'>
          비밀번호 확인
        </label>
        <Input
          id='confirmPassword'
          type='password'
          placeholder='비밀번호를 다시 입력하세요'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? '가입 중...' : '회원가입'}
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
