'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Badge, Card, CardHeader, CardContent } from '@worklog-plus/ui';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Clock,
  FolderOpen,
} from 'lucide-react';
import type { WorklogCreateInput } from '@worklog-plus/types';
import { WorklogFormModal } from '@/components/worklog/worklog-form-modal';
import { DeleteWorklogDialog } from '@/components/worklog/delete-worklog-dialog';
import {
  useWorklog,
  useUpdateWorklog,
  useDeleteWorklog,
} from '@/hooks/use-worklogs';
import { useProjects } from '@/hooks/use-projects';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

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
  const params = useParams();
  const worklogId = params.id as string;

  const { data: worklog, isLoading: isLoadingWorklog } = useWorklog(worklogId);
  const { data: projectsData } = useProjects({ limit: 100 });
  const updateWorklogMutation = useUpdateWorklog();
  const deleteWorklogMutation = useDeleteWorklog();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const projects = projectsData?.data || [];
  const projectName =
    projects.find((p) => p.id === worklog?.projectId)?.name ?? '알 수 없음';

  const handleUpdateWorklog = async (data: WorklogCreateInput) => {
    updateWorklogMutation.mutate(
      { id: worklogId, ...data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          toast.success('업무일지가 수정되었습니다');
        },
        onError: (error) => {
          toast.error(error.message || '업무일지 수정에 실패했습니다');
        },
      },
    );
  };

  const handleDeleteWorklog = async () => {
    deleteWorklogMutation.mutate(worklogId, {
      onSuccess: () => {
        toast.success('업무일지가 삭제되었습니다');
        router.push('/worklogs');
      },
      onError: (error) => {
        toast.error(error.message || '업무일지 삭제에 실패했습니다');
      },
    });
  };

  if (isLoadingWorklog || !worklog) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    );
  }

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
          <div className='prose prose-sm dark:prose-invert max-w-none'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {worklog.content}
            </ReactMarkdown>
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
        projects={projects}
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
