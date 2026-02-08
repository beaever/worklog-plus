'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
} from '@worklog/ui';
import { Shield, Users, ChevronRight } from 'lucide-react';
import type { Role } from '@worklog/types';

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'SYSTEM_ADMIN',
    description: '시스템 전체 접근 권한',
    userCount: 1,
    permissions: [
      {
        id: '1',
        key: 'project.create',
        name: '프로젝트 생성',
        description: '',
        enabled: true,
      },
      {
        id: '2',
        key: 'project.edit',
        name: '프로젝트 수정',
        description: '',
        enabled: true,
      },
      {
        id: '3',
        key: 'project.delete',
        name: '프로젝트 삭제',
        description: '',
        enabled: true,
      },
      {
        id: '4',
        key: 'user.view',
        name: '사용자 조회',
        description: '',
        enabled: true,
      },
      {
        id: '5',
        key: 'user.manage',
        name: '사용자 관리',
        description: '',
        enabled: true,
      },
      {
        id: '6',
        key: 'role.view',
        name: '역할 조회',
        description: '',
        enabled: true,
      },
      {
        id: '7',
        key: 'role.manage',
        name: '역할 관리',
        description: '',
        enabled: true,
      },
      {
        id: '8',
        key: 'system.view',
        name: '시스템 설정 조회',
        description: '',
        enabled: true,
      },
      {
        id: '9',
        key: 'system.update',
        name: '시스템 설정 수정',
        description: '',
        enabled: true,
      },
      {
        id: '10',
        key: 'audit.view',
        name: 'Audit 로그 조회',
        description: '',
        enabled: true,
      },
    ],
  },
  {
    id: '2',
    name: 'ADMIN',
    description: '사용자 관리 권한',
    userCount: 3,
    permissions: [
      {
        id: '1',
        key: 'project.create',
        name: '프로젝트 생성',
        description: '',
        enabled: true,
      },
      {
        id: '2',
        key: 'project.edit',
        name: '프로젝트 수정',
        description: '',
        enabled: true,
      },
      {
        id: '3',
        key: 'project.delete',
        name: '프로젝트 삭제',
        description: '',
        enabled: true,
      },
      {
        id: '4',
        key: 'user.view',
        name: '사용자 조회',
        description: '',
        enabled: true,
      },
      {
        id: '5',
        key: 'user.manage',
        name: '사용자 관리',
        description: '',
        enabled: true,
      },
      {
        id: '10',
        key: 'audit.view',
        name: 'Audit 로그 조회',
        description: '',
        enabled: true,
      },
    ],
  },
  {
    id: '3',
    name: 'MANAGER',
    description: '프로젝트 소유자 권한',
    userCount: 10,
    permissions: [
      {
        id: '1',
        key: 'project.create',
        name: '프로젝트 생성',
        description: '',
        enabled: true,
      },
      {
        id: '2',
        key: 'project.edit',
        name: '프로젝트 수정',
        description: '',
        enabled: true,
      },
      {
        id: '4',
        key: 'user.view',
        name: '사용자 조회',
        description: '',
        enabled: true,
      },
    ],
  },
  {
    id: '4',
    name: 'USER',
    description: '일반 사용자 권한',
    userCount: 50,
    permissions: [
      {
        id: '4',
        key: 'user.view',
        name: '사용자 조회',
        description: '',
        enabled: true,
      },
    ],
  },
];

const roleDisplayNames: Record<string, string> = {
  SYSTEM_ADMIN: 'System Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'User',
};

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(
    mockRoles[0] ?? null,
  );

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>권한 & 역할 관리</h1>
        <p className='text-muted-foreground'>
          시스템 역할과 권한을 관리합니다.
        </p>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle>역할 목록</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {mockRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                  selectedRole?.id === role.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <Shield className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='font-medium'>{roleDisplayNames[role.name]}</p>
                    <p className='text-xs text-muted-foreground'>
                      {role.description}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary' className='text-xs'>
                    <Users className='mr-1 h-3 w-3' />
                    {role.userCount}
                  </Badge>
                  <ChevronRight className='h-4 w-4 text-muted-foreground' />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className='lg:col-span-2'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>
                  {selectedRole
                    ? roleDisplayNames[selectedRole.name]
                    : '역할 선택'}
                </CardTitle>
                <CardDescription>
                  {selectedRole?.description || '왼쪽에서 역할을 선택하세요'}
                </CardDescription>
              </div>
              {selectedRole && (
                <Button variant='outline' disabled>
                  수정 (SYSTEM_ADMIN 전용)
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <div className='space-y-4'>
                <h3 className='font-medium'>권한 목록</h3>
                <div className='grid gap-2 sm:grid-cols-2'>
                  {selectedRole.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className='flex items-center gap-3 rounded-lg border p-3'
                    >
                      <div
                        className={`h-3 w-3 rounded-full ${
                          permission.enabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      <div>
                        <p className='text-sm font-medium'>{permission.name}</p>
                        <p className='text-xs text-muted-foreground'>
                          {permission.key}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='py-12 text-center text-muted-foreground'>
                역할을 선택하면 권한 목록이 표시됩니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
