'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProjectCard as ProjectCardCompound } from '@worklog-plus/components';
import { Trash2 } from 'lucide-react';
import { useUserStore } from '@worklog-plus/store';
import { toast } from 'sonner';
import type { ProjectSummary } from '@worklog-plus/types';
import { useDeleteProject } from '@/hooks/use-projects';
import { DeleteProjectDialog } from './delete-project-dialog';

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const user = useUserStore((state) => state.user);
  const deleteProjectMutation = useDeleteProject();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 소유자 또는 관리자만 카드에서 바로 삭제할 수 있다(실제 권한은 RLS가 최종 통제).
  const canDelete =
    user?.id === project.ownerId ||
    user?.role === 'ADMIN' ||
    user?.role === 'SYSTEM_ADMIN';

  const handleDelete = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project.id);
      toast.success('프로젝트가 삭제되었습니다');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '프로젝트 삭제에 실패했습니다',
      );
      throw error;
    }
  };

  return (
    <>
      <Link href={`/projects/${project.id}`}>
        <ProjectCardCompound>
          <ProjectCardCompound.Header>
            <div className='flex min-w-0 items-start gap-2'>
              <span className='mt-0.5 shrink-0'>
                <ProjectCardCompound.Icon />
              </span>
              <ProjectCardCompound.Title>
                {project.name}
              </ProjectCardCompound.Title>
            </div>
            <div className='flex shrink-0 items-center gap-1'>
              <ProjectCardCompound.Status status={project.status} />
              {canDelete && (
                <button
                  type='button'
                  aria-label='프로젝트 삭제'
                  className='rounded-sm p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 className='h-4 w-4' />
                </button>
              )}
            </div>
          </ProjectCardCompound.Header>
          <ProjectCardCompound.Progress value={project.progress} />
          <ProjectCardCompound.Footer>
            <ProjectCardCompound.Count count={project.worklogCount} />
            <ProjectCardCompound.UpdatedAt date={project.updatedAt} />
          </ProjectCardCompound.Footer>
        </ProjectCardCompound>
      </Link>

      {canDelete && (
        <DeleteProjectDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          projectName={project.name}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
