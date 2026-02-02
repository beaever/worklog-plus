'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge } from '@worklog/ui';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import type {
  Project,
  ProjectDashboard,
  ProjectStatus,
  UpdateProjectInput,
} from '@worklog/types';
import { ProjectKPICards } from '@/components/project/project-kpi-cards';
import { ProjectProgress } from '@/components/project/project-progress';
import { ProjectTimeline } from '@/components/project/project-timeline';
import { ProjectActivityLog } from '@/components/project/project-activity-log';
import { ProjectFormModal } from '@/components/project/project-form-modal';
import { DeleteProjectDialog } from '@/components/project/delete-project-dialog';
import { useProjectStore } from '@worklog/store';

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  PLANNED: { label: '예정', variant: 'secondary' },
  ACTIVE: { label: '진행중', variant: 'default' },
  DONE: { label: '완료', variant: 'outline' },
};

// Mock data for development
const mockProject: Project = {
  id: '1',
  name: 'WorkLog+ 백엔드',
  description: 'WorkLog+ 서비스의 백엔드 API 개발 프로젝트',
  status: 'ACTIVE',
  startDate: '2024-01-15',
  endDate: '2024-06-30',
  ownerId: 'user-1',
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockDashboard: ProjectDashboard = {
  projectId: '1',
  kpi: {
    totalTasks: 48,
    completedTasks: 31,
    inProgressTasks: 12,
    delayedTasks: 5,
  },
  progress: {
    percentage: 65,
    status: 'MEDIUM',
  },
  timeline: [
    {
      id: 't1',
      type: 'TASK_DONE',
      description: 'API 인증 모듈 구현 완료',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 't2',
      type: 'TASK_ADDED',
      description: '데이터베이스 마이그레이션 작업 추가',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 't3',
      type: 'STATUS_CHANGED',
      description: "프로젝트 상태가 '진행중'으로 변경됨",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 't4',
      type: 'TASK_DONE',
      description: '프로젝트 초기 설정 완료',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 't5',
      type: 'CREATED',
      description: '프로젝트가 생성됨',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
  ],
  recentActivities: [
    {
      id: 'a1',
      action: 'API 인증 모듈 구현을 완료했습니다',
      actor: { id: 'user-1', name: '김개발' },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'a2',
      action: '새 작업을 추가했습니다',
      actor: { id: 'user-2', name: '이기획' },
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'a3',
      action: '프로젝트 설명을 수정했습니다',
      actor: { id: 'user-1', name: '김개발' },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'a4',
      action: '프로젝트 상태를 변경했습니다',
      actor: { id: 'user-3', name: '박매니저' },
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
};

export default function ProjectDetailPage() {
  const router = useRouter();
  const { updateProject, removeProject } = useProjectStore();

  const [project, setProject] = useState<Project>(mockProject);
  const [dashboard] = useState<ProjectDashboard>(mockDashboard);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { label, variant } = statusConfig[project.status];

  const handleUpdateProject = async (data: UpdateProjectInput) => {
    const updatedProject = {
      ...project,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setProject(updatedProject);
    updateProject(project.id, data);
  };

  const handleDeleteProject = async () => {
    removeProject(project.id);
    router.push('/projects');
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
      <ProjectKPICards kpi={dashboard.kpi} />

      {/* Progress & Timeline */}
      <div className='grid gap-4 lg:grid-cols-2'>
        <ProjectProgress progress={dashboard.progress} />
        <ProjectTimeline events={dashboard.timeline} />
      </div>

      {/* Activity Log */}
      <ProjectActivityLog
        activities={dashboard.recentActivities}
        hasMore={true}
        onLoadMore={() => console.log('Load more activities')}
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
