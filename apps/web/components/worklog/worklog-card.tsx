'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@worklog-plus/ui';
import { WorklogCard as WorklogCardCompound } from '@worklog-plus/components';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { Worklog } from '@worklog-plus/types';

interface WorklogCardProps {
  worklog: Worklog;
  projectName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WorklogCard({ worklog, projectName, onEdit, onDelete }: WorklogCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <WorklogCardCompound onClick={() => router.push(`/worklogs/${worklog.id}`)}>
      <WorklogCardCompound.Header>
        <div className='space-y-1'>
          <WorklogCardCompound.Title>{worklog.title}</WorklogCardCompound.Title>
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
              <div className='fixed inset-0 z-10' onClick={() => setShowMenu(false)} />
              <div className='absolute right-0 top-full z-20 mt-1 w-32 rounded-md border bg-popover p-1 shadow-md'>
                <button
                  className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent'
                  onClick={() => { setShowMenu(false); onEdit?.(); }}
                >
                  <Edit className='h-4 w-4' />
                  수정
                </button>
                <button
                  className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent'
                  onClick={() => { setShowMenu(false); onDelete?.(); }}
                >
                  <Trash2 className='h-4 w-4' />
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      </WorklogCardCompound.Header>
      <WorklogCardCompound.Content>{worklog.content}</WorklogCardCompound.Content>
      <WorklogCardCompound.Meta>
        <WorklogCardCompound.Date date={worklog.date} />
        <WorklogCardCompound.Duration hours={worklog.duration} />
      </WorklogCardCompound.Meta>
    </WorklogCardCompound>
  );
}
