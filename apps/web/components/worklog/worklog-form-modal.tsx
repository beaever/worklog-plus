'use client';

import { useState, useEffect } from 'react';
import {
  ResponsiveModal,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@worklog/ui';
import type { Worklog, WorklogCreateInput } from '@worklog/types';

interface Project {
  id: string;
  name: string;
}

type WorklogFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
} & (
  | {
      worklog?: undefined;
      onSubmit: (data: WorklogCreateInput) => Promise<void>;
    }
  | {
      worklog: Worklog;
      onSubmit: (data: WorklogCreateInput) => Promise<void>;
    }
);

export function WorklogFormModal({
  open,
  onOpenChange,
  projects,
  worklog,
  onSubmit,
}: WorklogFormModalProps) {
  const isEdit = !!worklog;

  const [projectId, setProjectId] = useState(worklog?.projectId ?? '');
  const [title, setTitle] = useState(worklog?.title ?? '');
  const [content, setContent] = useState(worklog?.content ?? '');
  const [date, setDate] = useState(
    worklog?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [duration, setDuration] = useState(String(worklog?.duration ?? ''));
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setProjectId(worklog?.projectId ?? '');
      setTitle(worklog?.title ?? '');
      setContent(worklog?.content ?? '');
      setDate(worklog?.date ?? new Date().toISOString().slice(0, 10));
      setDuration(String(worklog?.duration ?? ''));
      setErrors({});
    }
  }, [open, worklog]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!projectId) {
      newErrors.projectId = '프로젝트를 선택해주세요';
    }

    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }

    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요';
    }

    if (!date) {
      newErrors.date = '날짜를 선택해주세요';
    }

    const durationNum = parseFloat(duration);
    if (!duration || isNaN(durationNum) || durationNum <= 0) {
      newErrors.duration = '올바른 작업 시간을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        projectId: projectId as string,
        title: title.trim(),
        content: content.trim(),
        date,
        duration: parseFloat(duration),
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save worklog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModal.Content className='sm:max-w-[500px]'>
        <ResponsiveModal.Header>
          <ResponsiveModal.Title>
            {isEdit ? '업무일지 수정' : '업무일지 작성'}
          </ResponsiveModal.Title>
        </ResponsiveModal.Header>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='projectId'>프로젝트 *</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder='프로젝트 선택' />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectId && (
              <p className='text-sm text-destructive'>{errors.projectId}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='title'>제목 *</Label>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='업무 제목을 입력하세요'
            />
            {errors.title && (
              <p className='text-sm text-destructive'>{errors.title}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='content'>내용 *</Label>
            <Textarea
              id='content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='업무 내용을 상세히 기록하세요'
              rows={5}
            />
            {errors.content && (
              <p className='text-sm text-destructive'>{errors.content}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='date'>날짜 *</Label>
              <Input
                id='date'
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {errors.date && (
                <p className='text-sm text-destructive'>{errors.date}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='duration'>작업 시간 (시간) *</Label>
              <Input
                id='duration'
                type='number'
                step='0.5'
                min='0.5'
                max='24'
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder='예: 2.5'
              />
              {errors.duration && (
                <p className='text-sm text-destructive'>{errors.duration}</p>
              )}
            </div>
          </div>

          <ResponsiveModal.Footer>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? '저장 중...' : isEdit ? '수정' : '작성'}
            </Button>
          </ResponsiveModal.Footer>
        </form>
      </ResponsiveModal.Content>
    </ResponsiveModal>
  );
}
