'use client';

import { useState } from 'react';
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
} from '@worklog-plus/ui';
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectStatus,
} from '@worklog-plus/types';

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
  const [estimatedHours, setEstimatedHours] = useState(
    project?.estimatedHours != null ? String(project.estimatedHours) : '',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 종료 예정일이 시작일보다 이전이면 제출을 막고 안내한다(입력 즉시 반영).
  const isEndBeforeStart =
    endDate && startDate
      ? new Date(endDate) < new Date(startDate)
      : false;
  const endDateError = isEndBeforeStart
    ? '종료 예정일을 시작일 이후로 변경해주세요'
    : errors.endDate;
  const canSubmit = !isLoading && !!name.trim() && !isEndBeforeStart;

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

    if (estimatedHours.trim() !== '') {
      const n = Number(estimatedHours);
      if (!Number.isInteger(n) || n <= 0) {
        newErrors.estimatedHours = '예상 공수는 1 이상의 정수로 입력해주세요';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // 빈 문자열이면 undefined(미설정), 값이 있으면 정수로 변환
    const parsedEstimate =
      estimatedHours.trim() === '' ? undefined : Number(estimatedHours);

    setIsLoading(true);
    try {
      if (isEdit) {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          status,
          endDate: endDate || undefined,
          estimatedHours: parsedEstimate,
        } as UpdateProjectInput);
      } else {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          status,
          startDate,
          endDate: endDate || undefined,
          estimatedHours: parsedEstimate,
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
      setEstimatedHours(
        project?.estimatedHours != null ? String(project.estimatedHours) : '',
      );
      setErrors({});
    }
    onOpenChange(newOpen);
  };

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <ResponsiveModal.Content className='sm:max-w-[500px]'>
        <ResponsiveModal.Header>
          <ResponsiveModal.Title>
            {isEdit ? '프로젝트 수정' : '새 프로젝트'}
          </ResponsiveModal.Title>
        </ResponsiveModal.Header>
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
              {endDateError && (
                <p className='text-sm text-destructive'>{endDateError}</p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='estimatedHours'>예상 공수 (시간)</Label>
            <Input
              id='estimatedHours'
              type='number'
              min={1}
              step={1}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder='예: 120'
            />
            <p className='text-xs text-muted-foreground'>
              누적 업무일지 시간 대비 진행률을 계산하는 기준입니다. 비워두면 진행률이 표시되지 않습니다.
            </p>
            {errors.estimatedHours && (
              <p className='text-sm text-destructive'>{errors.estimatedHours}</p>
            )}
          </div>

          <ResponsiveModal.Footer>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
            <Button type='submit' disabled={!canSubmit}>
              {isLoading
                ? isEdit
                  ? '수정 중...'
                  : '생성 중...'
                : isEdit
                  ? '수정'
                  : '생성'}
            </Button>
          </ResponsiveModal.Footer>
        </form>
      </ResponsiveModal.Content>
    </ResponsiveModal>
  );
}
