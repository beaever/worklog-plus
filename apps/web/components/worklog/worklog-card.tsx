'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@worklog-plus/ui';
import { WorklogCard as WorklogCardCompound } from '@worklog-plus/components';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Worklog } from '@worklog-plus/types';
import { useDeleteWorklog } from '@/hooks/use-worklogs';
import { DeleteWorklogDialog } from './delete-worklog-dialog';

interface WorklogCardProps {
  worklog: Worklog;
  projectName: string;
  onEdit?: () => void;
}

export function WorklogCard({ worklog, projectName, onEdit }: WorklogCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteWorklogMutation = useDeleteWorklog();

  // 파괴적 작업이므로 확인 다이얼로그에서 onConfirm으로 실행하고 토스트로 결과를 알린다.
  const handleDelete = async () => {
    try {
      await deleteWorklogMutation.mutateAsync(worklog.id);
      toast.success('업무일지가 삭제되었습니다');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '업무일지 삭제에 실패했습니다',
      );
      throw error; // 실패 시 다이얼로그를 닫지 않도록 에러를 전파한다.
    }
  };

  return (
    <>
      <WorklogCardCompound
        onClick={() => router.push(`/worklogs/${worklog.id}`)}
      >
        <WorklogCardCompound.Header>
          <div className='space-y-1'>
            <WorklogCardCompound.Title>
              {worklog.title}
            </WorklogCardCompound.Title>
            <WorklogCardCompound.Project name={projectName} />
          </div>
          <div className='relative'>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreVertical className='h-4 w-4' />
            </Button>
            {showMenu && (
              <>
                <div
                  className='fixed inset-0 z-10'
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className='absolute right-0 top-full z-20 mt-1 w-32 origin-top-right animate-scale-in rounded-md border bg-popover p-1 shadow-md'>
                  <button
                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent'
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit?.();
                    }}
                  >
                    <Edit className='h-4 w-4' />
                    수정
                  </button>
                  <button
                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-accent'
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash2 className='h-4 w-4' />
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        </WorklogCardCompound.Header>
        <WorklogCardCompound.Content>
          {worklog.content}
        </WorklogCardCompound.Content>
        <WorklogCardCompound.Meta>
          <WorklogCardCompound.Date date={worklog.date} />
          <WorklogCardCompound.Duration hours={worklog.duration} />
        </WorklogCardCompound.Meta>
      </WorklogCardCompound>

      <DeleteWorklogDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        worklogTitle={worklog.title}
        onConfirm={handleDelete}
      />
    </>
  );
}
