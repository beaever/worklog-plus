'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge, Card, CardHeader, CardContent } from '@worklog-plus/ui';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Clock,
  FolderOpen,
} from 'lucide-react';
import type { Worklog, WorklogCreateInput } from '@worklog-plus/types';
import { WorklogFormModal } from '@/components/worklog/worklog-form-modal';
import { DeleteWorklogDialog } from '@/components/worklog/delete-worklog-dialog';

// Mock data
const mockWorklog: Worklog = {
  id: '1',
  projectId: '1',
  userId: 'user-1',
  title: 'API 인증 모듈 구현',
  content: `## 작업 내용

### 1. JWT 기반 인증 시스템 구현
- 액세스 토큰 발급 로직 개발
- 리프레시 토큰 발급 및 갱신 로직 개발
- 토큰 만료 처리 미들웨어 구현

### 2. 보안 강화
- 비밀번호 해싱 (bcrypt)
- Rate limiting 적용
- CORS 설정

### 3. 테스트
- 단위 테스트 작성
- 통합 테스트 작성`,
  date: new Date().toISOString().slice(0, 10),
  duration: 4,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockProjects = [
  { id: '1', name: 'WorkLog+ 백엔드' },
  { id: '2', name: 'WorkLog+ 프론트엔드' },
  { id: '3', name: '모바일 앱 개발' },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function WorklogDetailPage() {
  const router = useRouter();
  const [worklog, setWorklog] = useState<Worklog>(mockWorklog);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const projectName =
    mockProjects.find((p) => p.id === worklog.projectId)?.name ?? '알 수 없음';

  const handleUpdateWorklog = async (data: WorklogCreateInput) => {
    setWorklog({
      ...worklog,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteWorklog = async () => {
    router.push('/worklogs');
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='space-y-2'>
          <button
            onClick={() => router.push('/worklogs')}
            className='flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            업무일지 목록
          </button>
          <h1 className='text-2xl font-bold sm:text-3xl'>{worklog.title}</h1>
          <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
            <Badge variant='secondary' className='gap-1'>
              <FolderOpen className='h-3 w-3' />
              {projectName}
            </Badge>
            <span className='flex items-center gap-1'>
              <Calendar className='h-4 w-4' />
              {formatDate(worklog.date)}
            </span>
            <span className='flex items-center gap-1'>
              <Clock className='h-4 w-4' />
              {formatDuration(worklog.duration)}
            </span>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => setIsEditModalOpen(true)}>
            <Edit className='mr-2 h-4 w-4' />
            수정
          </Button>
          <Button
            variant='outline'
            className='text-destructive hover:text-destructive'
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            삭제
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <h2 className='text-lg font-semibold'>업무 내용</h2>
        </CardHeader>
        <CardContent>
          <div className='prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap'>
            {worklog.content}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardContent className='pt-6'>
          <div className='grid gap-4 text-sm sm:grid-cols-2'>
            <div>
              <span className='text-muted-foreground'>작성일시</span>
              <p className='font-medium'>{formatDateTime(worklog.createdAt)}</p>
            </div>
            <div>
              <span className='text-muted-foreground'>수정일시</span>
              <p className='font-medium'>{formatDateTime(worklog.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <WorklogFormModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        projects={mockProjects}
        worklog={worklog}
        onSubmit={handleUpdateWorklog}
      />

      {/* Delete Dialog */}
      <DeleteWorklogDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        worklogTitle={worklog.title}
        onConfirm={handleDeleteWorklog}
      />
    </div>
  );
}
