'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Badge } from '@worklog-plus/ui';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import type { ProjectStatus, UpdateProjectInput } from '@worklog-plus/types';
import { ProjectKPICards } from '@/components/project/project-kpi-cards';
import { ProjectProgress } from '@/components/project/project-progress';
import { ProjectTimeline } from '@/components/project/project-timeline';
import { ProjectActivityLog } from '@/components/project/project-activity-log';
import { ProjectFormModal } from '@/components/project/project-form-modal';
import { DeleteProjectDialog } from '@/components/project/delete-project-dialog';
import {
  useProject,
  useProjectDashboard,
  useProjectActivities,
  useUpdateProject,
  useDeleteProject,
} from '@/hooks/use-projects';
import { toast } from 'sonner';

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  PLANNED: { label: '예정', variant: 'secondary' },
  ACTIVE: { label: '진행중', variant: 'default' },
  DONE: { label: '완료', variant: 'outline' },
};

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const { data: project, isLoading: isLoadingProject } = useProject(projectId);
  const { data: dashboard, isLoading: isLoadingDashboard } =
    useProjectDashboard(projectId);
  const {
    data: activitiesData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingActivities,
  } = useProjectActivities(projectId);

  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isLoading =
    isLoadingProject || isLoadingDashboard || isLoadingActivities;

  if (isLoading || !project) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    );
  }

  const { label, variant } = statusConfig[project.status];

  const activities =
    activitiesData?.pages.flatMap((page) => page?.data || []) || [];
  const kpi = dashboard?.kpi;
  const progress = dashboard?.progress;
  const timeline = dashboard?.timeline || [];

  const handleUpdateProject = async (data: UpdateProjectInput) => {
    updateProjectMutation.mutate(
      { id: projectId, data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          toast.success('프로젝트가 수정되었습니다');
        },
        onError: (error) => {
          toast.error(error.message || '프로젝트 수정에 실패했습니다');
        },
      },
    );
  };

  const handleDeleteProject = async () => {
    deleteProjectMutation.mutate(projectId, {
      onSuccess: () => {
        toast.success('프로젝트가 삭제되었습니다');
        router.push('/projects');
      },
      onError: (error) => {
        toast.error(error.message || '프로젝트 삭제에 실패했습니다');
      },
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='space-y-2'>
          <button
            onClick={() => router.push('/projects')}
            className='flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            프로젝트 목록
          </button>
          <div className='flex items-center gap-3'>
            <h1 className='text-3xl font-bold'>{project.name}</h1>
            <Badge variant={variant}>{label}</Badge>
          </div>
          {project.description && (
            <p className='text-muted-foreground'>{project.description}</p>
          )}
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => setIsEditModalOpen(true)}>
            <Edit className='mr-2 h-4 w-4' />
            수정
          </Button>
          <Button
            variant='outline'
            className='text-destructive hover:text-destructive'
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            삭제
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpi && <ProjectKPICards kpi={kpi} />}

      {/* Progress & Timeline */}
      <div className='grid gap-4 lg:grid-cols-2'>
        {progress && <ProjectProgress progress={progress} />}
        <ProjectTimeline events={timeline} />
      </div>

      {/* Activity Log */}
      <ProjectActivityLog
        activities={activities}
        hasMore={hasNextPage || false}
        onLoadMore={() => fetchNextPage()}
      />

      {/* Edit Modal */}
      <ProjectFormModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        project={project}
        onSubmit={handleUpdateProject}
      />

      {/* Delete Dialog */}
      <DeleteProjectDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        projectName={project.name}
        onConfirm={handleDeleteProject}
      />
    </div>
  );
}
