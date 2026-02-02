"use client";

import { Input } from "@worklog/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@worklog/ui";
import { Search } from "lucide-react";
import type { ProjectStatus } from "@worklog/types";

interface ProjectFilterProps {
  search: string;
  status: ProjectStatus | "ALL";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProjectStatus | "ALL") => void;
}

const statusOptions: { value: ProjectStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "PLANNED", label: "예정" },
  { value: "ACTIVE", label: "진행중" },
  { value: "DONE", label: "완료" },
];

export function ProjectFilter({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: ProjectFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="프로젝트 검색..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={status}
        onValueChange={(v: ProjectStatus | "ALL") => onStatusChange(v)}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="상태 선택" />
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
  );
}
