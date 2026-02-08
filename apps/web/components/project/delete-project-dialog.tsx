'use client';

import { useState } from 'react';
import { ResponsiveModal, Button } from '@worklog-plus/ui';
import { AlertTriangle } from 'lucide-react';

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onConfirm: () => Promise<void>;
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
}: DeleteProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModal.Content className='sm:max-w-[425px]'>
        <ResponsiveModal.Header>
          <div className='flex items-center gap-2'>
            <div className='rounded-full bg-destructive/10 p-2'>
              <AlertTriangle className='h-5 w-5 text-destructive' />
            </div>
            <ResponsiveModal.Title>프로젝트 삭제</ResponsiveModal.Title>
          </div>
          <ResponsiveModal.Description className='pt-2'>
            <strong>{projectName}</strong> 프로젝트를 삭제하시겠습니까?
            <br />
            관련된 모든 업무일지와 데이터가 함께 삭제됩니다.
            <br />이 작업은 되돌릴 수 없습니다.
          </ResponsiveModal.Description>
        </ResponsiveModal.Header>
        <ResponsiveModal.Footer>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </Button>
        </ResponsiveModal.Footer>
      </ResponsiveModal.Content>
    </ResponsiveModal>
  );
}
