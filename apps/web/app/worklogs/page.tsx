'use client';

import { useState, useMemo } from 'react';
import { Button, EmptyState, Input } from '@worklog-plus/ui';
import { FileText, Plus, Search } from 'lucide-react';
import type { WorklogCreateInput } from '@worklog-plus/types';
import { WorklogCard } from '@/components/worklog/worklog-card';
import { WorklogFormModal } from '@/components/worklog/worklog-form-modal';
import {
  useWorklogs,
  useCreateWorklog,
  useDeleteWorklog,
} from '@/hooks/use-worklogs';
import { useProjects } from '@/hooks/use-projects';

export default function WorklogsPage() {
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: worklogsData, isLoading: isLoadingWorklogs } = useWorklogs({
    page: 1,
    limit: 100,
  });
  const { data: projectsData } = useProjects({ page: 1, limit: 100 });

  const createWorklogMutation = useCreateWorklog();
  const deleteWorklogMutation = useDeleteWorklog();

  const worklogs = worklogsData?.data || [];
  const projects =
    projectsData?.data.map((p) => ({ id: p.id, name: p.name })) || [];

  const filteredWorklogs = useMemo(() => {
    return worklogs.filter(
      (worklog) =>
        worklog.title.toLowerCase().includes(search.toLowerCase()) ||
        worklog.content.toLowerCase().includes(search.toLowerCase()),
    );
  }, [worklogs, search]);

  const handleCreateWorklog = async (data: WorklogCreateInput) => {
    createWorklogMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  const handleDeleteWorklog = (id: string) => {
    deleteWorklogMutation.mutate(id);
  };

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name ?? '알 수 없음';
  };

  if (isLoadingWorklogs) {
    return (
      <div className='space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>업무일지</h1>
            <p className='text-muted-foreground'>
              일일 업무 내용을 기록하고 관리하세요
            </p>
          </div>
        </div>
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-32 animate-pulse rounded-lg bg-muted'
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const isEmpty = worklogs.length === 0;
  const isFilteredEmpty = filteredWorklogs.length === 0 && !isEmpty;

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>업무일지</h1>
          <p className='text-muted-foreground'>
            일일 업무 내용을 기록하고 관리하세요
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          업무일지 작성
        </Button>
      </div>

      {!isEmpty && (
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='업무일지 검색...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      )}

      {isEmpty ? (
        <EmptyState
          icon={<FileText className='h-12 w-12' />}
          title='업무일지가 없습니다'
          description='첫 업무일지를 작성하여 업무 내용을 기록해보세요.'
          action={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              첫 업무일지 작성하기
            </Button>
          }
        />
      ) : isFilteredEmpty ? (
        <EmptyState
          icon={<FileText className='h-12 w-12' />}
          title='검색 결과가 없습니다'
          description='다른 검색어를 사용해보세요.'
        />
      ) : (
        <div className='space-y-4'>
          {filteredWorklogs.map((worklog) => (
            <WorklogCard
              key={worklog.id}
              worklog={worklog}
              projectName={getProjectName(worklog.projectId)}
              onDelete={() => handleDeleteWorklog(worklog.id)}
            />
          ))}
        </div>
      )}

      <WorklogFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        projects={projects}
        onSubmit={handleCreateWorklog}
      />
    </div>
  );
}
