'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@worklog-plus/ui';
import type { ProjectStatus } from '@worklog-plus/types';

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'PLANNED', label: '예정' },
  { value: 'ACTIVE', label: '진행중' },
  { value: 'DONE', label: '완료' },
];

interface ProjectStatusSelectProps {
  value: ProjectStatus;
  onChange: (status: ProjectStatus) => void;
  disabled?: boolean;
}

// 프로젝트 홈에서 모달 없이 상태를 바로 변경하기 위한 인라인 셀렉트.
export function ProjectStatusSelect({
  value,
  onChange,
  disabled = false,
}: ProjectStatusSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as ProjectStatus)}
      disabled={disabled}
    >
      <SelectTrigger className='h-8 w-auto gap-1 px-3 py-1 text-sm font-medium'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
