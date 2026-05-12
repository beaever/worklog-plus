import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from '@worklog-plus/components';

const meta: Meta<typeof ProjectCard> = {
  title: 'Organisms/ProjectCard',
  component: ProjectCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date().toISOString();

// 컴파운드 패턴 전체 사용 예시
export const Compound: Story = {
  render: () => (
    <div className='w-80'>
      <ProjectCard onClick={() => {}}>
        <ProjectCard.Header>
          <div className='flex items-center gap-2'>
            <ProjectCard.Icon />
            <ProjectCard.Title>WorkLog+ 백엔드</ProjectCard.Title>
          </div>
          <ProjectCard.Status status='ACTIVE' />
        </ProjectCard.Header>
        <ProjectCard.Progress value={65} />
        <ProjectCard.Footer>
          <ProjectCard.Count count={24} />
          <ProjectCard.UpdatedAt date={today} />
        </ProjectCard.Footer>
      </ProjectCard>
    </div>
  ),
};

export const Active: Story = {
  render: () => (
    <div className='w-80'>
      <ProjectCard>
        <ProjectCard.Header>
          <div className='flex items-center gap-2'>
            <ProjectCard.Icon />
            <ProjectCard.Title>WorkLog+ 백엔드</ProjectCard.Title>
          </div>
          <ProjectCard.Status status='ACTIVE' />
        </ProjectCard.Header>
        <ProjectCard.Progress value={65} />
        <ProjectCard.Footer>
          <ProjectCard.Count count={24} />
          <ProjectCard.UpdatedAt date={today} />
        </ProjectCard.Footer>
      </ProjectCard>
    </div>
  ),
};

export const Planned: Story = {
  render: () => (
    <div className='w-80'>
      <ProjectCard>
        <ProjectCard.Header>
          <div className='flex items-center gap-2'>
            <ProjectCard.Icon />
            <ProjectCard.Title>모바일 앱 개발</ProjectCard.Title>
          </div>
          <ProjectCard.Status status='PLANNED' />
        </ProjectCard.Header>
        <ProjectCard.Progress value={10} />
        <ProjectCard.Footer>
          <ProjectCard.Count count={3} />
          <ProjectCard.UpdatedAt date={today} />
        </ProjectCard.Footer>
      </ProjectCard>
    </div>
  ),
};

export const Done: Story = {
  render: () => (
    <div className='w-80'>
      <ProjectCard>
        <ProjectCard.Header>
          <div className='flex items-center gap-2'>
            <ProjectCard.Icon />
            <ProjectCard.Title>API 문서화</ProjectCard.Title>
          </div>
          <ProjectCard.Status status='DONE' />
        </ProjectCard.Header>
        <ProjectCard.Progress value={100} />
        <ProjectCard.Footer>
          <ProjectCard.Count count={12} />
          <ProjectCard.UpdatedAt date={today} />
        </ProjectCard.Footer>
      </ProjectCard>
    </div>
  ),
};
