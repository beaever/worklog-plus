'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@worklog-plus/ui';
import { Eye, EyeOff } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@worklog-plus/types';
import { useRegister } from '@/hooks/use-auth';

export function RegisterForm() {
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = ({ name, email, password }: RegisterFormData) => {
    registerMutation.mutate({ name, email, password });
  };

  const isPending = registerMutation.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4'
        noValidate
      >
        {registerMutation.error && (
          <div
            role='alert'
            className='rounded-md bg-destructive/10 p-3 text-sm text-destructive'
          >
            {registerMutation.error.message || '회원가입에 실패했습니다.'}
          </div>
        )}

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='홍길동'
                  autoComplete='name'
                  autoFocus
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='name@example.com'
                  autoComplete='email'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='8자 이상, 영문+숫자 포함'
                    autoComplete='new-password'
                    disabled={isPending}
                    className='pr-10'
                    {...field}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((v) => !v)}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50'
                    aria-label={
                      showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                    }
                    disabled={isPending}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormDescription>
                최소 8자, 영문과 숫자를 포함해야 합니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='비밀번호를 다시 입력하세요'
                    autoComplete='new-password'
                    disabled={isPending}
                    className='pr-10'
                    {...field}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50'
                    aria-label={
                      showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                    }
                    disabled={isPending}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? '가입 중...' : '회원가입'}
        </Button>

        <p className='text-center text-sm text-muted-foreground'>
          이미 계정이 있으신가요?{' '}
          <Link href='/login' className='text-primary hover:underline'>
            로그인
          </Link>
        </p>
      </form>
    </Form>
  );
}
