'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from '@worklog/ui';
import { Search, User, FolderOpen, Shield, Settings } from 'lucide-react';
import type { AuditLog, AuditAction } from '@worklog/types';

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'USER_ROLE_CHANGED',
    actor: { id: '1', name: '홍길동', email: 'hong@example.com' },
    target: { type: 'USER', id: '2', name: '김철수' },
    metadata: { oldRole: 'USER', newRole: 'ADMIN' },
    createdAt: '2025-02-08T14:30:00Z',
  },
  {
    id: '2',
    action: 'PROJECT_DELETED',
    actor: { id: '1', name: '홍길동', email: 'hong@example.com' },
    target: { type: 'PROJECT', id: '5', name: '테스트 프로젝트' },
    createdAt: '2025-02-08T12:15:00Z',
  },
  {
    id: '3',
    action: 'USER_STATUS_CHANGED',
    actor: { id: '2', name: '김철수', email: 'kim@example.com' },
    target: { type: 'USER', id: '4', name: '박지민' },
    metadata: { oldStatus: 'ACTIVE', newStatus: 'SUSPENDED' },
    createdAt: '2025-02-07T16:45:00Z',
  },
  {
    id: '4',
    action: 'SYSTEM_SETTINGS_UPDATED',
    actor: { id: '1', name: '홍길동', email: 'hong@example.com' },
    target: { type: 'SYSTEM', id: 'settings', name: '시스템 설정' },
    metadata: { field: 'sessionTimeout', oldValue: 30, newValue: 60 },
    createdAt: '2025-02-07T10:00:00Z',
  },
  {
    id: '5',
    action: 'PROJECT_CREATED',
    actor: { id: '3', name: '이영희', email: 'lee@example.com' },
    target: { type: 'PROJECT', id: '6', name: 'WorkLog+ 모바일' },
    createdAt: '2025-02-06T09:30:00Z',
  },
  {
    id: '6',
    action: 'USER_CREATED',
    actor: { id: '1', name: '홍길동', email: 'hong@example.com' },
    target: { type: 'USER', id: '5', name: '최수진' },
    createdAt: '2025-02-05T11:20:00Z',
  },
  {
    id: '7',
    action: 'ROLE_UPDATED',
    actor: { id: '1', name: '홍길동', email: 'hong@example.com' },
    target: { type: 'ROLE', id: 'manager', name: 'Manager' },
    metadata: { addedPermission: 'project.delete' },
    createdAt: '2025-02-04T15:00:00Z',
  },
];

const actionLabels: Record<AuditAction, string> = {
  USER_CREATED: '사용자 생성',
  USER_UPDATED: '사용자 수정',
  USER_DELETED: '사용자 삭제',
  USER_ROLE_CHANGED: '역할 변경',
  USER_STATUS_CHANGED: '상태 변경',
  PROJECT_CREATED: '프로젝트 생성',
  PROJECT_UPDATED: '프로젝트 수정',
  PROJECT_DELETED: '프로젝트 삭제',
  ROLE_UPDATED: '역할 수정',
  SYSTEM_SETTINGS_UPDATED: '시스템 설정 변경',
};

const getTargetIcon = (type?: string) => {
  switch (type) {
    case 'USER':
      return <User className='h-4 w-4' />;
    case 'PROJECT':
      return <FolderOpen className='h-4 w-4' />;
    case 'ROLE':
      return <Shield className='h-4 w-4' />;
    case 'SYSTEM':
      return <Settings className='h-4 w-4' />;
    default:
      return null;
  }
};

const getActionBadgeVariant = (
  action: AuditAction,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (action.includes('DELETED')) return 'destructive';
  if (action.includes('CREATED')) return 'default';
  if (action.includes('CHANGED') || action.includes('UPDATED'))
    return 'secondary';
  return 'outline';
};

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.target?.name.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>활동 로그</h1>
        <p className='text-muted-foreground'>시스템 활동 로그를 조회합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>활동 로그</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='사용자 또는 대상으로 검색...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue placeholder='액션 필터' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>모든 액션</SelectItem>
                <SelectItem value='USER_CREATED'>사용자 생성</SelectItem>
                <SelectItem value='USER_ROLE_CHANGED'>역할 변경</SelectItem>
                <SelectItem value='USER_STATUS_CHANGED'>상태 변경</SelectItem>
                <SelectItem value='PROJECT_CREATED'>프로젝트 생성</SelectItem>
                <SelectItem value='PROJECT_DELETED'>프로젝트 삭제</SelectItem>
                <SelectItem value='SYSTEM_SETTINGS_UPDATED'>
                  시스템 설정 변경
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-4'>
            {filteredLogs.map((log) => (
              <div key={log.id} className='rounded-lg border p-4'>
                {/* 모바일 레이아웃 */}
                <div className='flex flex-col gap-3 sm:hidden'>
                  <div className='flex items-center justify-between'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
                      {getTargetIcon(log.target?.type)}
                    </div>
                    <span className='text-xs text-muted-foreground'>
                      {formatDateTime(log.createdAt)}
                    </span>
                  </div>
                  <Badge
                    variant={getActionBadgeVariant(log.action)}
                    className='w-fit'
                  >
                    {actionLabels[log.action]}
                  </Badge>
                  <div className='space-y-1'>
                    <p className='text-sm'>
                      <span className='font-medium'>{log.actor.name}</span>
                    </p>
                    <p className='text-xs text-muted-foreground break-all'>
                      {log.actor.email}
                    </p>
                    {log.target && (
                      <p className='text-sm'>
                        <span className='text-muted-foreground'>→ </span>
                        <span className='font-medium'>{log.target.name}</span>
                      </p>
                    )}
                  </div>
                  {log.metadata && (
                    <p className='text-xs text-muted-foreground break-all'>
                      {JSON.stringify(log.metadata)}
                    </p>
                  )}
                </div>

                {/* 데스크톱 레이아웃 */}
                <div className='hidden sm:flex sm:items-start sm:gap-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                    {getTargetIcon(log.target?.type)}
                  </div>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {actionLabels[log.action]}
                      </Badge>
                      <span className='text-sm text-muted-foreground'>
                        {formatDateTime(log.createdAt)}
                      </span>
                    </div>
                    <p className='text-sm'>
                      <span className='font-medium'>{log.actor.name}</span>
                      <span className='text-muted-foreground'>
                        {' '}
                        ({log.actor.email})
                      </span>
                      {log.target && (
                        <>
                          <span className='text-muted-foreground'> → </span>
                          <span className='font-medium'>{log.target.name}</span>
                        </>
                      )}
                    </p>
                    {log.metadata && (
                      <p className='text-xs text-muted-foreground'>
                        {JSON.stringify(log.metadata)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className='py-12 text-center text-muted-foreground'>
              검색 결과가 없습니다.
            </div>
          )}

          {filteredLogs.length > 0 && (
            <div className='mt-6 text-center'>
              <p className='text-sm text-muted-foreground'>
                더 많은 로그를 보려면 스크롤하세요
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
