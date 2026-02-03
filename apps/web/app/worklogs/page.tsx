'use client';

import { useState, useMemo } from 'react';
import { Button, EmptyState, Input } from '@worklog/ui';
import { FileText, Plus, Search } from 'lucide-react';
import type { Worklog } from '@worklog/types';
import { WorklogCard } from '@/components/worklog/worklog-card';
import { WorklogFormModal } from '@/components/worklog/worklog-form-modal';

// Mock data for development
const mockWorklogs: Worklog[] = [
  {
    id: '1',
    projectId: '1',
    userId: 'user-1',
    title: 'API 인증 모듈 구현',
    content:
      'JWT 기반 인증 시스템 구현 완료. 액세스 토큰과 리프레시 토큰 발급 로직 개발.',
    date: new Date().toISOString().slice(0, 10),
    duration: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    projectId: '1',
    userId: 'user-1',
    title: '데이터베이스 스키마 설계',
    content:
      'User, Project, Worklog 테이블 설계 및 관계 정의. Prisma 스키마 작성.',
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    duration: 3,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    projectId: '2',
    userId: 'user-1',
    title: '프론트엔드 컴포넌트 개발',
    content: 'Button, Card, Modal 등 공통 UI 컴포넌트 개발. Tailwind CSS 적용.',
    date: new Date(Date.now() - 172800000).toISOString().slice(0, 10),
    duration: 5,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    projectId: '2',
    userId: 'user-1',
    title: '반응형 레이아웃 구현',
    content: '모바일, 태블릿, 데스크톱 대응 반응형 레이아웃 구현.',
    date: new Date(Date.now() - 259200000).toISOString().slice(0, 10),
    duration: 2,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

// Mock projects for selection
const mockProjects = [
  { id: '1', name: 'WorkLog+ 백엔드' },
  { id: '2', name: 'WorkLog+ 프론트엔드' },
  { id: '3', name: '모바일 앱 개발' },
];

export default function WorklogsPage() {
  const [worklogs, setWorklogs] = useState<Worklog[]>(mockWorklogs);
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredWorklogs = useMemo(() => {
    return worklogs.filter(
      (worklog) =>
        worklog.title.toLowerCase().includes(search.toLowerCase()) ||
        worklog.content.toLowerCase().includes(search.toLowerCase()),
    );
  }, [worklogs, search]);

  const handleCreateWorklog = async (
    data: Omit<Worklog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ) => {
    const newWorklog: Worklog = {
      ...data,
      id: String(Date.now()),
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorklogs((prev) => [newWorklog, ...prev]);
  };

  const handleDeleteWorklog = (id: string) => {
    setWorklogs((prev) => prev.filter((w) => w.id !== id));
  };

  const getProjectName = (projectId: string) => {
    return mockProjects.find((p) => p.id === projectId)?.name ?? '알 수 없음';
  };

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
        projects={mockProjects}
        onSubmit={handleCreateWorklog}
      />
    </div>
  );
}
