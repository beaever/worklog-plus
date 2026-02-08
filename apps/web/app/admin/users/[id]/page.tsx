'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@worklog/ui';
import { ArrowLeft, Mail, Calendar, Clock } from 'lucide-react';
import type { UserDetail, UserRole } from '@worklog/types';

const mockUserDetail: UserDetail = {
  id: '2',
  name: '김철수',
  email: 'kim@example.com',
  role: 'ADMIN',
  status: 'ACTIVE',
  lastLoginAt: '2025-02-08T10:30:00Z',
  createdAt: '2024-02-20T00:00:00Z',
  updatedAt: '2025-02-08T10:30:00Z',
  projectAccess: [
    { projectId: '1', projectName: 'WorkLog+ 백엔드', access: 'WRITE' },
    { projectId: '2', projectName: 'WorkLog+ 프론트엔드', access: 'READ' },
    { projectId: '3', projectName: '모바일 앱 개발', access: 'NONE' },
  ],
};

const roleLabels: Record<UserRole, string> = {
  SYSTEM_ADMIN: 'System Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'User',
};

const roleBadgeVariants: Record<
  UserRole,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  SYSTEM_ADMIN: 'destructive',
  ADMIN: 'default',
  MANAGER: 'secondary',
  USER: 'outline',
};

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: _id } = use(params);
  const user = mockUserDetail;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/admin/users'>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold'>사용자 상세</h1>
          <p className='text-muted-foreground'>
            사용자 정보 및 권한을 관리합니다.
          </p>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary'>
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className='text-xl font-semibold'>{user.name}</h2>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Mail className='h-4 w-4' />
                  {user.email}
                </div>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>가입일</p>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>마지막 로그인</p>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <span>{formatDateTime(user.lastLoginAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>권한 설정</CardTitle>
            <CardDescription>SYSTEM_ADMIN만 수정 가능</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>역할</label>
              <Select defaultValue={user.role} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='SYSTEM_ADMIN'>System Admin</SelectItem>
                  <SelectItem value='ADMIN'>Admin</SelectItem>
                  <SelectItem value='MANAGER'>Manager</SelectItem>
                  <SelectItem value='USER'>User</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant={roleBadgeVariants[user.role]} className='mt-1'>
                {roleLabels[user.role]}
              </Badge>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>상태</label>
              <div className='flex items-center gap-2'>
                <span
                  className={`h-3 w-3 rounded-full ${
                    user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span>{user.status === 'ACTIVE' ? '활성' : '정지'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>프로젝트 접근 권한</CardTitle>
          <CardDescription>
            사용자가 접근할 수 있는 프로젝트 목록
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b text-left text-sm text-muted-foreground'>
                  <th className='pb-3 font-medium'>프로젝트</th>
                  <th className='pb-3 font-medium'>접근 권한</th>
                </tr>
              </thead>
              <tbody>
                {user.projectAccess.map((project) => (
                  <tr
                    key={project.projectId}
                    className='border-b last:border-0'
                  >
                    <td className='py-3 font-medium'>{project.projectName}</td>
                    <td className='py-3'>
                      <Select defaultValue={project.access} disabled>
                        <SelectTrigger className='w-32'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='NONE'>접근 불가</SelectItem>
                          <SelectItem value='READ'>읽기</SelectItem>
                          <SelectItem value='WRITE'>읽기/쓰기</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
