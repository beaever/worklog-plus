"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@worklog/ui";
import { Calendar, FileText } from "lucide-react";
import type { ProjectSummary, ProjectStatus } from "@worklog/types";

interface ProjectCardProps {
  project: ProjectSummary;
}

const statusConfig: Record<ProjectStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  PLANNED: { label: "예정", variant: "secondary" },
  ACTIVE: { label: "진행중", variant: "default" },
  DONE: { label: "완료", variant: "outline" },
};

function getProgressColor(progress: number): string {
  if (progress < 40) return "bg-red-500";
  if (progress < 80) return "bg-yellow-500";
  return "bg-green-500";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { label, variant } = statusConfig[project.status];

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
            <Badge variant={variant}>{label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>진행률</span>
              <span>{project.progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-all ${getProgressColor(project.progress)}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>업무일지 {project.worklogCount}개</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
