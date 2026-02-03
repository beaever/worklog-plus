import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from '@worklog/components';
import { FolderOpen, FileText, Clock, CheckCircle } from 'lucide-react';

const meta: Meta<typeof StatCard> = {
  title: 'Organisms/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '총 프로젝트',
    value: 12,
    description: '활성 프로젝트 8개',
    icon: FolderOpen,
  },
};

export const WithPositiveTrend: Story = {
  args: {
    title: '이번 주 업무일지',
    value: 24,
    description: '전주 대비',
    icon: FileText,
    trend: { value: 12, isPositive: true },
  },
};

export const WithNegativeTrend: Story = {
  args: {
    title: '이번 주 업무일지',
    value: 18,
    description: '전주 대비',
    icon: FileText,
    trend: { value: 8, isPositive: false },
  },
};

export const TimeValue: Story = {
  args: {
    title: '총 작업 시간',
    value: '156h',
    description: '이번 달 누적',
    icon: Clock,
    trend: { value: 8, isPositive: true },
  },
};

export const CompletedProjects: Story = {
  args: {
    title: '완료된 프로젝트',
    value: 4,
    description: '이번 분기',
    icon: CheckCircle,
  },
};

export const DashboardStats: Story = {
  render: () => (
    <div className="grid gap-4 w-[900px]" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      <StatCard
        title="총 프로젝트"
        value={12}
        description="활성 프로젝트 8개"
        icon={FolderOpen}
      />
      <StatCard
        title="이번 주 업무일지"
        value={24}
        description="전주 대비"
        icon={FileText}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="총 작업 시간"
        value="156h"
        description="이번 달 누적"
        icon={Clock}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title="완료된 프로젝트"
        value={4}
        description="이번 분기"
        icon={CheckCircle}
      />
    </div>
  ),
};
