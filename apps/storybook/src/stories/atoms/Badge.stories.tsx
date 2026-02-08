import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@worklog-plus/ui';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: '보조',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: '위험',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: '아웃라인',
    variant: 'outline',
  },
};

export const ProjectStatus: Story = {
  render: () => (
    <div className='flex gap-2'>
      <Badge variant='secondary'>예정</Badge>
      <Badge variant='default'>진행중</Badge>
      <Badge variant='outline'>완료</Badge>
    </div>
  ),
};
