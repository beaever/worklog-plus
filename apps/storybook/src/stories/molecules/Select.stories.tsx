import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from '@worklog/ui';

const meta: Meta = {
  title: 'Molecules/Select',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">옵션 1</SelectItem>
        <SelectItem value="option2">옵션 2</SelectItem>
        <SelectItem value="option3">옵션 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 w-[200px]">
      <Label>프로젝트 상태</Label>
      <Select defaultValue="active">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="planned">예정</SelectItem>
          <SelectItem value="active">진행중</SelectItem>
          <SelectItem value="done">완료</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const ProjectSelect: Story = {
  render: () => (
    <div className="space-y-2 w-[280px]">
      <Label>프로젝트</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="프로젝트 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">WorkLog+ 백엔드</SelectItem>
          <SelectItem value="2">WorkLog+ 프론트엔드</SelectItem>
          <SelectItem value="3">모바일 앱 개발</SelectItem>
          <SelectItem value="4">API 문서화</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="비활성화됨" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">옵션 1</SelectItem>
      </SelectContent>
    </Select>
  ),
};
