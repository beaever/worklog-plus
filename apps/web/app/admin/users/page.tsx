'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@worklog/ui';
import { Search, Eye, Edit, MoreHorizontal } from 'lucide-react';
import type { UserListItem, UserRole, UserStatus } from '@worklog/types';

const mockUsers: UserListItem[] = [
  {
    id: '1',
    name: '홍길동',
    email: 'hong@example.com',
    role: 'SYSTEM_ADMIN',
    status: 'ACTIVE',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: '김철수',
    email: 'kim@example.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2024-02-20T00:00:00Z',
  },
  {
    id: '3',
    name: '이영희',
    email: 'lee@example.com',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: '4',
    name: '박지민',
    email: 'park@example.com',
    role: 'USER',
    status: 'SUSPENDED',
    createdAt: '2024-04-05T00:00:00Z',
  },
  {
    id: '5',
    name: '최수진',
    email: 'choi@example.com',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2024-05-12T00:00:00Z',
  },
];

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

const statusLabels: Record<UserStatus, string> = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>사용자 관리</h1>
        <p className='text-muted-foreground'>시스템 사용자를 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용자 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='이름 또는 이메일로 검색...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className='w-full sm:w-40'>
                <SelectValue placeholder='역할 필터' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>모든 역할</SelectItem>
                <SelectItem value='SYSTEM_ADMIN'>System Admin</SelectItem>
                <SelectItem value='ADMIN'>Admin</SelectItem>
                <SelectItem value='MANAGER'>Manager</SelectItem>
                <SelectItem value='USER'>User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full sm:w-32'>
                <SelectValue placeholder='상태 필터' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>모든 상태</SelectItem>
                <SelectItem value='ACTIVE'>활성</SelectItem>
                <SelectItem value='SUSPENDED'>정지</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className='space-y-4 md:hidden'>
            {filteredUsers.map((user) => (
              <div key={user.id} className='rounded-lg border p-4'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary'>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className='font-medium'>{user.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link href={`/admin/users/${user.id}`}>
                    <Button variant='ghost' size='icon'>
                      <Eye className='h-4 w-4' />
                    </Button>
                  </Link>
                </div>
                <div className='mt-3 flex flex-wrap items-center gap-2'>
                  <Badge variant={roleBadgeVariants[user.role]}>
                    {roleLabels[user.role]}
                  </Badge>
                  <span
                    className={`inline-flex items-center gap-1 text-sm ${
                      user.status === 'ACTIVE'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                    {statusLabels[user.status]}
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 데스크톱 테이블 뷰 */}
          <div className='hidden md:block'>
            <table className='w-full'>
              <thead>
                <tr className='border-b text-left text-sm text-muted-foreground'>
                  <th className='pb-3 font-medium'>이름</th>
                  <th className='pb-3 font-medium'>이메일</th>
                  <th className='pb-3 font-medium'>역할</th>
                  <th className='pb-3 font-medium'>상태</th>
                  <th className='pb-3 font-medium'>가입일</th>
                  <th className='pb-3 font-medium'>액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className='border-b last:border-0'>
                    <td className='py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary'>
                          {user.name.charAt(0)}
                        </div>
                        <span className='font-medium'>{user.name}</span>
                      </div>
                    </td>
                    <td className='py-4 text-muted-foreground'>{user.email}</td>
                    <td className='py-4'>
                      <Badge variant={roleBadgeVariants[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                    </td>
                    <td className='py-4'>
                      <span
                        className={`inline-flex items-center gap-1 text-sm ${
                          user.status === 'ACTIVE'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            user.status === 'ACTIVE'
                              ? 'bg-green-600'
                              : 'bg-red-600'
                          }`}
                        />
                        {statusLabels[user.status]}
                      </span>
                    </td>
                    <td className='py-4 text-muted-foreground'>
                      {formatDate(user.createdAt)}
                    </td>
                    <td className='py-4'>
                      <div className='flex items-center gap-1'>
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant='ghost' size='icon' title='상세 보기'>
                            <Eye className='h-4 w-4' />
                          </Button>
                        </Link>
                        <Link href={`/admin/users/${user.id}/edit`}>
                          <Button variant='ghost' size='icon' title='수정'>
                            <Edit className='h-4 w-4' />
                          </Button>
                        </Link>
                        <Button variant='ghost' size='icon' title='더보기'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className='py-12 text-center text-muted-foreground'>
              검색 결과가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
