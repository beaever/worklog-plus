import type { Meta, StoryObj } from '@storybook/react';
import { WorklogCard } from '@worklog-plus/components';

const meta: Meta<typeof WorklogCard> = {
  title: 'Organisms/WorklogCard',
  component: WorklogCard,
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
      <WorklogCard onClick={() => {}}>
        <WorklogCard.Header>
          <WorklogCard.Title>Express 인증 미들웨어 구현</WorklogCard.Title>
          <WorklogCard.Project name='WorkLog+ 백엔드' />
        </WorklogCard.Header>
        <WorklogCard.Content>
          JWT 기반 인증 미들웨어를 구현하고 httpOnly 쿠키로 토큰을 관리하도록
          수정했습니다.
        </WorklogCard.Content>
        <WorklogCard.Meta>
          <WorklogCard.Date date={today} />
          <WorklogCard.Duration hours={3} />
        </WorklogCard.Meta>
      </WorklogCard>
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <div className='w-80'>
      <WorklogCard>
        <WorklogCard.Header>
          <WorklogCard.Title>API 엔드포인트 개발</WorklogCard.Title>
          <WorklogCard.Project name='WorkLog+ 백엔드' />
        </WorklogCard.Header>
        <WorklogCard.Content>
          프로젝트 CRUD API를 완성하고 Zod 스키마 검증을 추가했습니다.
        </WorklogCard.Content>
        <WorklogCard.Meta>
          <WorklogCard.Date date={today} />
          <WorklogCard.Duration hours={2} />
        </WorklogCard.Meta>
      </WorklogCard>
    </div>
  ),
};

export const HalfHour: Story = {
  name: '30분 작업',
  render: () => (
    <div className='w-80'>
      <WorklogCard>
        <WorklogCard.Header>
          <WorklogCard.Title>코드 리뷰</WorklogCard.Title>
          <WorklogCard.Project name='공통' />
        </WorklogCard.Header>
        <WorklogCard.Content>PR 리뷰 및 피드백 작성</WorklogCard.Content>
        <WorklogCard.Meta>
          <WorklogCard.Date date={today} />
          <WorklogCard.Duration hours={0.5} />
        </WorklogCard.Meta>
      </WorklogCard>
    </div>
  ),
};

export const LongContent: Story = {
  name: '긴 내용',
  render: () => (
    <div className='w-80'>
      <WorklogCard>
        <WorklogCard.Header>
          <WorklogCard.Title>데이터베이스 마이그레이션</WorklogCard.Title>
          <WorklogCard.Project name='인프라' />
        </WorklogCard.Header>
        <WorklogCard.Content>
          Supabase로 PostgreSQL 데이터베이스를 마이그레이션했습니다. Transaction
          Pooler(6543)와 Session Pooler(5432)를 각각 DATABASE_URL과 DIRECT_URL로
          설정하여 PgBouncer 호환성 이슈를 해결했습니다.
        </WorklogCard.Content>
        <WorklogCard.Meta>
          <WorklogCard.Date date={today} />
          <WorklogCard.Duration hours={4.5} />
        </WorklogCard.Meta>
      </WorklogCard>
    </div>
  ),
};
