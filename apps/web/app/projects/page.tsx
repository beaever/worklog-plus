'use client';

import { useState, useMemo } from 'react';
import { Button, EmptyState } from '@worklog/ui';
import { FolderOpen, Plus } from 'lucide-react';
import { useProjectStore } from '@worklog/store';
import type {
  ProjectStatus,
  ProjectSummary,
  CreateProjectInput,
} from '@worklog/types';
import { ProjectCard } from '@/components/project/project-card';
import { ProjectFilter } from '@/components/project/project-filter';
import { ProjectFormModal } from '@/components/project/project-form-modal';

// Mock data for development
const mockProjects: ProjectSummary[] = [
  {
    id: '1',
    name: 'WorkLog+ 백엔드',
    status: 'ACTIVE',
    progress: 65,
    worklogCount: 24,
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'WorkLog+ 프론트엔드',
    status: 'ACTIVE',
    progress: 45,
    worklogCount: 18,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    name: '모바일 앱 개발',
    status: 'PLANNED',
    progress: 10,
    worklogCount: 3,
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    name: 'API 문서화',
    status: 'DONE',
    progress: 100,
    worklogCount: 12,
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

export default function ProjectsPage() {
  const { projects, setProjects, addProject } = useProjectStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>(
    'ALL',
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initialize with mock data if empty
  useState(() => {
    if (projects.length === 0) {
      setProjects(mockProjects);
    }
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const handleCreateProject = async (data: CreateProjectInput) => {
    const newProject: ProjectSummary = {
      id: String(Date.now()),
      name: data.name,
      status: data.status,
      progress: 0,
      worklogCount: 0,
      updatedAt: new Date().toISOString(),
    };
    addProject(newProject);
  };

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
