'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@worklog/ui';
import { Save } from 'lucide-react';
import type { SystemSettings } from '@worklog/types';

const mockSettings: SystemSettings = {
  general: {
    serviceName: 'WorkLog+',
    defaultLanguage: 'ko',
    timezone: 'Asia/Seoul',
  },
  projectRules: {
    maxProjectsPerUser: 10,
    defaultProjectStatus: 'PLANNED',
  },
  security: {
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    sessionTimeoutMinutes: 60,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(mockSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>시스템 설정</h1>
          <p className='text-muted-foreground'>시스템 전반의 설정을 관리합니다.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className='mr-2 h-4 w-4' />
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>일반 설정</CardTitle>
            <CardDescription>서비스 기본 정보를 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='serviceName'>서비스 이름</Label>
                <Input
                  id='serviceName'
                  value={settings.general.serviceName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, serviceName: e.target.value },
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='defaultLanguage'>기본 언어</Label>
                <Select
                  value={settings.general.defaultLanguage}
                  onValueChange={(value: 'ko' | 'en') =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, defaultLanguage: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ko'>한국어</SelectItem>
                    <SelectItem value='en'>English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='timezone'>타임존</Label>
                <Select
                  value={settings.general.timezone}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Asia/Seoul'>Asia/Seoul (KST)</SelectItem>
                    <SelectItem value='America/New_York'>America/New_York (EST)</SelectItem>
                    <SelectItem value='Europe/London'>Europe/London (GMT)</SelectItem>
                    <SelectItem value='Asia/Tokyo'>Asia/Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>프로젝트 규칙</CardTitle>
            <CardDescription>프로젝트 생성 및 관리 규칙을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='maxProjects'>사용자당 최대 프로젝트 수</Label>
                <Input
                  id='maxProjects'
                  type='number'
                  value={settings.projectRules.maxProjectsPerUser}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      projectRules: {
                        ...settings.projectRules,
                        maxProjectsPerUser: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='defaultStatus'>기본 프로젝트 상태</Label>
                <Select
                  value={settings.projectRules.defaultProjectStatus}
                  onValueChange={(value: 'PLANNED' | 'ACTIVE') =>
                    setSettings({
                      ...settings,
                      projectRules: {
                        ...settings.projectRules,
                        defaultProjectStatus: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='PLANNED'>예정</SelectItem>
                    <SelectItem value='ACTIVE'>진행중</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>보안 설정</CardTitle>
            <CardDescription>비밀번호 정책 및 세션 설정을 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='passwordMinLength'>최소 비밀번호 길이</Label>
                <Input
                  id='passwordMinLength'
                  type='number'
                  value={settings.security.passwordMinLength}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        passwordMinLength: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='sessionTimeout'>세션 타임아웃 (분)</Label>
                <Input
                  id='sessionTimeout'
                  type='number'
                  value={settings.security.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        sessionTimeoutMinutes: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='requireSpecialChar'
                  checked={settings.security.passwordRequireSpecialChar}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        passwordRequireSpecialChar: e.target.checked,
                      },
                    })
                  }
                  className='h-4 w-4 rounded border-gray-300'
                />
                <Label htmlFor='requireSpecialChar'>특수문자 필수</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
