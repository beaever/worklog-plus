'use client';

import { useState } from 'react';
import { ResponsiveModal, Button } from '@worklog-plus/ui';
import { AlertTriangle } from 'lucide-react';

interface DeleteWorklogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worklogTitle: string;
  onConfirm: () => Promise<void>;
}

export function DeleteWorklogDialog({
  open,
  onOpenChange,
  worklogTitle,
  onConfirm,
}: DeleteWorklogDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete worklog:', error);
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
            <ResponsiveModal.Title>업무일지 삭제</ResponsiveModal.Title>
          </div>
        </ResponsiveModal.Header>
        <div className='py-4'>
          <p className='text-sm text-muted-foreground'>
            <strong className='text-foreground'>{worklogTitle}</strong>{' '}
            업무일지를 삭제하시겠습니까?
          </p>
          <p className='mt-2 text-sm text-muted-foreground'>
            이 작업은 되돌릴 수 없습니다.
          </p>
        </div>
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
