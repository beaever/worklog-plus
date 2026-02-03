import type { Meta, StoryObj } from '@storybook/react';
import { Input, Label } from '@worklog/ui';
import { Search } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '입력하세요...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="email">이메일</Label>
      <Input id="email" type="email" placeholder="example@email.com" />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative w-80">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="검색..." className="pl-10" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: '비활성화됨',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '비밀번호',
  },
};

export const Date: Story = {
  args: {
    type: 'date',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
  },
};
