import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from '@worklog/components';
import type { ProjectSummary } from '@worklog/types';

const meta: Meta<typeof ProjectCard> = {
  title: 'Organisms/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockProject: ProjectSummary = {
  id: '1',
  name: 'WorkLog+ 백엔드',
  status: 'ACTIVE',
  progress: 65,
  worklogCount: 24,
  updatedAt: new Date().toISOString(),
};

export const Active: Story = {
  args: {
    project: mockProject,
  },
};

export const Planned: Story = {
  args: {
    project: {
      ...mockProject,
      id: '2',
      name: '모바일 앱 개발',
      status: 'PLANNED',
      progress: 10,
      worklogCount: 3,
    },
  },
};

export const Done: Story = {
  args: {
    project: {
      ...mockProject,
      id: '3',
      name: 'API 문서화',
      status: 'DONE',
      progress: 100,
      worklogCount: 12,
    },
  },
};

export const LowProgress: Story = {
  args: {
    project: {
      ...mockProject,
      id: '4',
      name: '신규 프로젝트',
      status: 'ACTIVE',
      progress: 15,
      worklogCount: 2,
    },
  },
};

export const HighProgress: Story = {
  args: {
    project: {
      ...mockProject,
      id: '5',
      name: '거의 완료된 프로젝트',
      status: 'ACTIVE',
      progress: 95,
      worklogCount: 45,
    },
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="grid gap-4 w-[900px]" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <ProjectCard
        project={{
          id: '1',
          name: '예정된 프로젝트',
          status: 'PLANNED',
          progress: 0,
          worklogCount: 0,
          updatedAt: new Date().toISOString(),
        }}
      />
      <ProjectCard
        project={{
          id: '2',
          name: '진행중인 프로젝트',
          status: 'ACTIVE',
          progress: 65,
          worklogCount: 24,
          updatedAt: new Date().toISOString(),
        }}
      />
      <ProjectCard
        project={{
          id: '3',
          name: '완료된 프로젝트',
          status: 'DONE',
          progress: 100,
          worklogCount: 48,
          updatedAt: new Date().toISOString(),
        }}
      />
    </div>
  ),
};
