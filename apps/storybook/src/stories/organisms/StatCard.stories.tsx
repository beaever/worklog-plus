import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from '@worklog-plus/components';
import { FolderOpen, FileText, Clock, CheckCircle, Users } from 'lucide-react';

const meta: Meta<typeof StatCard> = {
  title: 'Organisms/StatCard',
  component: StatCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 컴파운드 패턴 전체 사용 예시
export const Compound: Story = {
  render: () => (
    <div className='w-48'>
      <StatCard>
        <StatCard.Header>
          <StatCard.Label>총 사용자</StatCard.Label>
          <StatCard.Icon icon={Users} />
        </StatCard.Header>
        <StatCard.Value>1,234</StatCard.Value>
        <StatCard.Trend value={12.5} />
      </StatCard>
    </div>
  ),
};

export const PositiveTrend: Story = {
  name: '상승 추세',
  render: () => (
    <div className='w-48'>
      <StatCard>
        <StatCard.Header>
          <StatCard.Label>활성 프로젝트</StatCard.Label>
          <StatCard.Icon icon={FolderOpen} />
        </StatCard.Header>
        <StatCard.Value>12</StatCard.Value>
        <StatCard.Trend value={8.3} />
      </StatCard>
    </div>
  ),
};

export const NegativeTrend: Story = {
  name: '하락 추세',
  render: () => (
    <div className='w-48'>
      <StatCard>
        <StatCard.Header>
          <StatCard.Label>완료된 업무</StatCard.Label>
          <StatCard.Icon icon={CheckCircle} />
        </StatCard.Header>
        <StatCard.Value>47</StatCard.Value>
        <StatCard.Trend value={-3.2} />
      </StatCard>
    </div>
  ),
};

export const NoTrend: Story = {
  name: '추세 없음',
  render: () => (
    <div className='w-48'>
      <StatCard>
        <StatCard.Header>
          <StatCard.Label>업무일지</StatCard.Label>
          <StatCard.Icon icon={FileText} />
        </StatCard.Header>
        <StatCard.Value>128</StatCard.Value>
      </StatCard>
    </div>
  ),
};

export const Dashboard: Story = {
  name: '대시보드 그리드',
  render: () => (
    <div className='grid grid-cols-2 gap-4 w-96'>
      <StatCard>
        <StatCard.Header>
          <StatCard.Label>총 프로젝트</StatCard.Label>
          <StatCard.Icon icon={FolderOpen} />
        </StatCard.Header>
        <StatCard.Value>24</StatCard.Value>
        <StatCard.Trend value={4.1} />
      </StatCard>
      <StatCard>
        <StatCard.Header>
          <StatCard.Label>업무일지</StatCard.Label>
          <StatCard.Icon icon={FileText} />
        </StatCard.Header>
        <StatCard.Value>156</StatCard.Value>
        <StatCard.Trend value={12.5} />
      </StatCard>
      <StatCard>
        <StatCard.Header>
          <StatCard.Label>총 시간</StatCard.Label>
          <StatCard.Icon icon={Clock} />
        </StatCard.Header>
        <StatCard.Value>480h</StatCard.Value>
        <StatCard.Trend value={-2.3} />
      </StatCard>
      <StatCard>
        <StatCard.Header>
          <StatCard.Label>완료율</StatCard.Label>
          <StatCard.Icon icon={CheckCircle} />
        </StatCard.Header>
        <StatCard.Value>87%</StatCard.Value>
        <StatCard.Trend value={0} />
      </StatCard>
    </div>
  ),
};
