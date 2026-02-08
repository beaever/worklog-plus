'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, Button } from '@worklog-plus/ui';
import { Bell, LogOut, User, Shield } from 'lucide-react';
import { useUserStore } from '@worklog-plus/store';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>설정</h1>
        <p className='text-muted-foreground'>앱 설정을 관리하세요</p>
      </div>

      {/* 프로필 섹션 */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            <h2 className='text-lg font-semibold'>프로필</h2>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium'>{user?.name ?? '사용자'}</p>
              <p className='text-sm text-muted-foreground'>
                {user?.email ?? 'user@example.com'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 알림 섹션 */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Bell className='h-5 w-5' />
            <h2 className='text-lg font-semibold'>알림</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium'>푸시 알림</p>
              <p className='text-sm text-muted-foreground'>
                업무일지 리마인더 및 프로젝트 업데이트 알림
              </p>
            </div>
            <button
              type='button'
              role='switch'
              aria-checked={notificationsEnabled}
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                notificationsEnabled ? 'bg-primary' : 'bg-input'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 보안 섹션 */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Shield className='h-5 w-5' />
            <h2 className='text-lg font-semibold'>보안</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium'>로그아웃</p>
              <p className='text-sm text-muted-foreground'>
                현재 기기에서 로그아웃합니다
              </p>
            </div>
            <Button variant='destructive' onClick={handleLogout}>
              <LogOut className='mr-2 h-4 w-4' />
              로그아웃
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
