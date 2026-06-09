'use client';

import { useState } from 'react';
import { Button, EmptyState, Skeleton } from '@worklog-plus/ui';
import { FolderOpen, Plus } from 'lucide-react';
import type { ProjectStatus, CreateProjectInput } from '@worklog-plus/types';
import { ProjectCard } from '@/components/project/project-card';
import { ProjectFilter } from '@/components/project/project-filter';
import { ProjectFormModal } from '@/components/project/project-form-modal';
import { useProjects, useCreateProject } from '@/hooks/use-projects';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>(
    'ALL',
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const queryParams: {
    page: number;
    limit: number;
    status?: ProjectStatus;
    search?: string;
  } = {
    page: 1,
    limit: 100,
  };

  if (statusFilter !== 'ALL') {
    queryParams.status = statusFilter;
  }
  if (search) {
    queryParams.search = search;
  }

  const { data: projectsData, isLoading } = useProjects(queryParams);

  const createProjectMutation = useCreateProject();

  const projects = projectsData?.data || [];
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch;
  });

  // await로 생성 완료까지 폼의 로딩 상태("생성 중...")를 유지하고, 성공 후에만 모달이 닫히게 한다.
  const handleCreateProject = async (data: CreateProjectInput) => {
    try {
      await createProjectMutation.mutateAsync(data);
      toast.success('프로젝트가 생성되었습니다');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '프로젝트 생성에 실패했습니다',
      );
      throw error; // 실패 시 모달을 닫지 않도록 폼으로 에러를 전파한다.
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>프로젝트</h1>
            <p className='text-muted-foreground'>
              프로젝트를 관리하고 업무 현황을 확인하세요
            </p>
          </div>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='space-y-4 rounded-lg border bg-card p-6'>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='h-5 w-12 rounded-full' />
              </div>
              <Skeleton className='h-2 w-full rounded-full' />
              <div className='flex justify-between'>
                <Skeleton className='h-3 w-20' />
                <Skeleton className='h-3 w-16' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isEmpty = projects.length === 0;
  const isFilteredEmpty = filteredProjects.length === 0 && !isEmpty;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>프로젝트</h1>
          <p className='text-muted-foreground'>
            프로젝트를 관리하고 업무 현황을 확인하세요
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />새 프로젝트
        </Button>
      </div>

      {!isEmpty && (
        <ProjectFilter
          search={search}
          status={statusFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
        />
      )}

      {isEmpty ? (
        <EmptyState
          icon={<FolderOpen className='h-12 w-12' />}
          title='프로젝트가 없습니다'
          description='새 프로젝트를 생성하여 업무 일지를 관리해보세요.'
          action={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              첫 프로젝트 만들기
            </Button>
          }
        />
      ) : isFilteredEmpty ? (
        <EmptyState
          icon={<FolderOpen className='h-12 w-12' />}
          title='검색 결과가 없습니다'
          description='다른 검색어나 필터를 사용해보세요.'
        />
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredProjects.map((project, i) => (
            <div
              key={project.id}
              className='animate-fade-in-up'
              style={{
                animationDelay: `${Math.min(i, 8) * 40}ms`,
                animationFillMode: 'backwards',
              }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}

      <ProjectFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
