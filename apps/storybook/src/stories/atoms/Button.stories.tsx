import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@worklog/ui';
import { Plus, Edit } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '버튼',
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: '삭제',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: '취소',
    variant: 'outline',
  },
};

export const Secondary: Story = {
  args: {
    children: '보조 버튼',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: '고스트',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: '링크',
    variant: 'link',
  },
};

export const Small: Story = {
  args: {
    children: '작은 버튼',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: '큰 버튼',
    size: 'lg',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className='mr-2 h-4 w-4' />
        새로 만들기
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    children: <Edit className='h-4 w-4' />,
    size: 'icon',
    variant: 'ghost',
  },
};

export const Disabled: Story = {
  args: {
    children: '비활성화',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <Button variant='default'>Default</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button variant='link'>Link</Button>
      <Button variant='destructive'>Destructive</Button>
    </div>
  ),
};
