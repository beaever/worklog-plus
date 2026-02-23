'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, Button } from '@worklog-plus/ui';
import { Bell, LogOut, User, Shield, Moon, Sun, Monitor } from 'lucide-react';
import { useUserStore } from '@worklog-plus/store';
import { useCurrentUser } from '@/hooks/use-auth';
import { useUpdateProfile, useChangePassword } from '@/hooks/use-settings';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useUserStore();
  const { data: user } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleUpdateProfile = async () => {
    updateProfileMutation.mutate(profileData, {
      onSuccess: () => {
        setIsEditingProfile(false);
        toast.success('프로필이 업데이트되었습니다');
      },
      onError: (error) => {
        toast.error(error.message || '프로필 업데이트에 실패했습니다');
      },
    });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다');
      return;
    }

    changePasswordMutation.mutate(
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      },
      {
        onSuccess: () => {
          setIsChangingPassword(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          toast.success('비밀번호가 변경되었습니다');
        },
        onError: (error) => {
          toast.error(error.message || '비밀번호 변경에 실패했습니다');
        },
      },
    );
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
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              <h2 className='text-lg font-semibold'>프로필</h2>
            </div>
            {!isEditingProfile && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsEditingProfile(true)}
              >
                수정
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {isEditingProfile ? (
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>이름</label>
                <input
                  type='text'
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className='mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                />
              </div>
              <div>
                <label className='text-sm font-medium'>이메일</label>
                <input
                  type='email'
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className='mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                />
              </div>
              <div className='flex gap-2'>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? '저장 중...' : '저장'}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setIsEditingProfile(false)}
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className='font-medium'>{user?.name ?? '사용자'}</p>
              <p className='text-sm text-muted-foreground'>
                {user?.email ?? 'user@example.com'}
              </p>
            </div>
          )}
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

      {/* 테마 섹션 */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Monitor className='h-5 w-5' />
            <h2 className='text-lg font-semibold'>테마</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex gap-2'>
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className='flex-1'
            >
              <Sun className='mr-2 h-4 w-4' />
              라이트
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className='flex-1'
            >
              <Moon className='mr-2 h-4 w-4' />
              다크
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => setTheme('system')}
              className='flex-1'
            >
              <Monitor className='mr-2 h-4 w-4' />
              시스템
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 보안 섹션 */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              <h2 className='text-lg font-semibold'>보안</h2>
            </div>
            {!isChangingPassword && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsChangingPassword(true)}
              >
                비밀번호 변경
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {isChangingPassword && (
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>현재 비밀번호</label>
                <input
                  type='password'
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className='mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                />
              </div>
              <div>
                <label className='text-sm font-medium'>새 비밀번호</label>
                <input
                  type='password'
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className='mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                />
              </div>
              <div>
                <label className='text-sm font-medium'>새 비밀번호 확인</label>
                <input
                  type='password'
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className='mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                />
              </div>
              <div className='flex gap-2'>
                <Button
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? '변경 중...' : '변경'}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setIsChangingPassword(false)}
                >
                  취소
                </Button>
              </div>
            </div>
          )}
          <div className='flex items-center justify-between border-t pt-4'>
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
