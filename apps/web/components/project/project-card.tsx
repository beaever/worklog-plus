'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProjectCard as ProjectCardCompound } from '@worklog-plus/components';
import { Trash2 } from 'lucide-react';
import { useUserStore } from '@worklog-plus/store';
import { toast } from 'sonner';
import type { ProjectSummary, ProjectStatus } from '@worklog-plus/types';
import { useDeleteProject, useUpdateProject } from '@/hooks/use-projects';
import { DeleteProjectDialog } from './delete-project-dialog';
import { ProjectStatusSelect } from './project-status-select';

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const user = useUserStore((state) => state.user);
  const deleteProjectMutation = useDeleteProject();
  const updateProjectMutation = useUpdateProject();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 소유자 또는 관리자만 카드에서 바로 상태 변경/삭제할 수 있다(실제 권한은 RLS가 최종 통제).
  const canManage =
    user?.id === project.ownerId ||
    user?.role === 'ADMIN' ||
    user?.role === 'SYSTEM_ADMIN';

  const handleStatusChange = (status: ProjectStatus) => {
    if (status === project.status) return;
    updateProjectMutation.mutate(
      { id: project.id, data: { status } },
      {
        onSuccess: () => toast.success('상태가 변경되었습니다'),
        onError: (error) =>
          toast.error(
            error instanceof Error ? error.message : '상태 변경에 실패했습니다',
          ),
      },
    );
  };

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
              {canManage ? (
                // 카드 전체가 Link이므로 셀렉트 조작이 페이지 이동을 트리거하지 않게 막는다.
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <ProjectStatusSelect
                    value={project.status}
                    onChange={handleStatusChange}
                    disabled={updateProjectMutation.isPending}
                  />
                </span>
              ) : (
                <ProjectCardCompound.Status status={project.status} />
              )}
              {canManage && (
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

      {canManage && (
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
