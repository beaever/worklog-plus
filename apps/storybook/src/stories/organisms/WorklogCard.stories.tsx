import type { Meta, StoryObj } from '@storybook/react';
import { WorklogCard } from '@worklog/components';
import type { Worklog } from '@worklog/types';

const meta: Meta<typeof WorklogCard> = {
  title: 'Organisms/WorklogCard',
  component: WorklogCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockWorklog: Worklog = {
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
};

export const Default: Story = {
  args: {
    worklog: mockWorklog,
    projectName: 'WorkLog+ 백엔드',
  },
};

export const Today: Story = {
  args: {
    worklog: {
      ...mockWorklog,
      title: '오늘 작성한 업무일지',
      content: '오늘 진행한 작업 내용입니다.',
      date: new Date().toISOString().slice(0, 10),
    },
    projectName: 'WorkLog+ 프론트엔드',
  },
};

export const Yesterday: Story = {
  args: {
    worklog: {
      ...mockWorklog,
      title: '어제 작성한 업무일지',
      content: '어제 진행한 작업 내용입니다.',
      date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    },
    projectName: '모바일 앱 개발',
  },
};

export const LongContent: Story = {
  args: {
    worklog: {
      ...mockWorklog,
      title: '긴 내용의 업무일지',
      content:
        'JWT 기반 인증 시스템 구현 완료. 액세스 토큰과 리프레시 토큰 발급 로직 개발. 토큰 만료 처리 미들웨어 구현. 비밀번호 해싱 (bcrypt) 적용. Rate limiting 적용. CORS 설정 완료.',
    },
    projectName: 'WorkLog+ 백엔드',
  },
};

export const ShortDuration: Story = {
  args: {
    worklog: {
      ...mockWorklog,
      title: '짧은 작업',
      content: '간단한 버그 수정',
      duration: 0.5,
    },
    projectName: 'WorkLog+ 백엔드',
  },
};

export const LongDuration: Story = {
  args: {
    worklog: {
      ...mockWorklog,
      title: '긴 작업',
      content: '대규모 리팩토링 작업',
      duration: 8,
    },
    projectName: 'WorkLog+ 백엔드',
  },
};

export const WorklogList: Story = {
  render: () => (
    <div className="space-y-4 w-[600px]">
      <WorklogCard
        worklog={{
          id: '1',
          projectId: '1',
          userId: 'user-1',
          title: 'API 인증 모듈 구현',
          content: 'JWT 기반 인증 시스템 구현 완료.',
          date: new Date().toISOString().slice(0, 10),
          duration: 4,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
        projectName="WorkLog+ 백엔드"
      />
      <WorklogCard
        worklog={{
          id: '2',
          projectId: '2',
          userId: 'user-1',
          title: '프론트엔드 컴포넌트 개발',
          content: 'Button, Card, Modal 등 공통 UI 컴포넌트 개발.',
          date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
          duration: 5,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        }}
        projectName="WorkLog+ 프론트엔드"
      />
      <WorklogCard
        worklog={{
          id: '3',
          projectId: '1',
          userId: 'user-1',
          title: '데이터베이스 스키마 설계',
          content: 'User, Project, Worklog 테이블 설계 및 관계 정의.',
          date: new Date(Date.now() - 172800000).toISOString().slice(0, 10),
          duration: 3,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
        }}
        projectName="WorkLog+ 백엔드"
      />
    </div>
  ),
};
