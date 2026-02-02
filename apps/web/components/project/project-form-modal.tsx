'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectStatus,
} from '@worklog/types';

type ProjectFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
} & (
  | {
      project?: undefined;
      onSubmit: (data: CreateProjectInput) => Promise<void>;
    }
  | { project: Project; onSubmit: (data: UpdateProjectInput) => Promise<void> }
);

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'PLANNED', label: '예정' },
  { value: 'ACTIVE', label: '진행중' },
  { value: 'DONE', label: '완료' },
];

export function ProjectFormModal({
  open,
  onOpenChange,
  project,
  onSubmit,
}: ProjectFormModalProps) {
  const isEdit = !!project;

  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [status, setStatus] = useState<ProjectStatus>(
    project?.status ?? 'PLANNED',
  );
  const [startDate, setStartDate] = useState(
    project?.startDate ?? new Date().toISOString().split('T')[0],
  );
  const [endDate, setEndDate] = useState(project?.endDate ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = '프로젝트 이름을 입력해주세요';
    }

    if (!startDate) {
      newErrors.startDate = '시작일을 선택해주세요';
    }

    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = '종료일은 시작일 이후여야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      if (isEdit) {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          status,
          endDate: endDate || undefined,
        } as UpdateProjectInput);
      } else {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          status,
          startDate,
          endDate: endDate || undefined,
        } as CreateProjectInput);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName(project?.name ?? '');
      setDescription(project?.description ?? '');
      setStatus(project?.status ?? 'PLANNED');
      setStartDate(
        project?.startDate ?? new Date().toISOString().split('T')[0],
      );
      setEndDate(project?.endDate ?? '');
      setErrors({});
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? '프로젝트 수정' : '새 프로젝트'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>프로젝트 이름 *</Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='프로젝트 이름을 입력하세요'
            />
            {errors.name && (
              <p className='text-sm text-destructive'>{errors.name}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>설명</Label>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='프로젝트에 대한 간단한 설명'
              rows={3}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='status'>상태 *</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ProjectStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder='상태 선택' />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='startDate'>시작일 *</Label>
              <Input
                id='startDate'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isEdit}
              />
              {errors.startDate && (
                <p className='text-sm text-destructive'>{errors.startDate}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='endDate'>종료 예정일</Label>
              <Input
                id='endDate'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {errors.endDate && (
                <p className='text-sm text-destructive'>{errors.endDate}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? '저장 중...' : isEdit ? '수정' : '생성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
