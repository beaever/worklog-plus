'use client';

import { useState } from 'react';
import { Button, EmptyState } from '@worklog-plus/ui';
import { FolderOpen, Plus } from 'lucide-react';
import type { ProjectStatus, CreateProjectInput } from '@worklog-plus/types';
import { ProjectCard } from '@/components/project/project-card';
import { ProjectFilter } from '@/components/project/project-filter';
import { ProjectFormModal } from '@/components/project/project-form-modal';
import { useProjects, useCreateProject } from '@/hooks/use-projects';

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

  const handleCreateProject = async (data: CreateProjectInput) => {
    createProjectMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
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
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-48 animate-pulse rounded-lg bg-muted'
            ></div>
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
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
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
