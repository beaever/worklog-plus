import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorklogCard } from '../worklog/worklog-card';

describe('WorklogCard 컴파운드 패턴', () => {
  const today = new Date().toISOString();

  describe('루트 컴포넌트', () => {
    it('클릭 이벤트가 동작해야 함', () => {
      const handleClick = vi.fn();
      render(
        <WorklogCard onClick={handleClick}>
          <WorklogCard.Header>
            <WorklogCard.Title>API 개발 완료</WorklogCard.Title>
          </WorklogCard.Header>
        </WorklogCard>,
      );

      fireEvent.click(screen.getByRole('article'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Header', () => {
    it('Title과 Project를 렌더링해야 함', () => {
      render(
        <WorklogCard>
          <WorklogCard.Header>
            <WorklogCard.Title>API 개발 완료</WorklogCard.Title>
            <WorklogCard.Project name='WorkLog+ 백엔드' />
          </WorklogCard.Header>
        </WorklogCard>,
      );

      expect(screen.getByText('API 개발 완료')).toBeInTheDocument();
      expect(screen.getByText('WorkLog+ 백엔드')).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('내용을 렌더링해야 함', () => {
      render(
        <WorklogCard>
          <WorklogCard.Content>Express 인증 미들웨어 구현 완료</WorklogCard.Content>
        </WorklogCard>,
      );

      expect(screen.getByText('Express 인증 미들웨어 구현 완료')).toBeInTheDocument();
    });
  });

  describe('Meta', () => {
    it('날짜와 소요 시간을 표시해야 함', () => {
      render(
        <WorklogCard>
          <WorklogCard.Meta>
            <WorklogCard.Date date={today} />
            <WorklogCard.Duration hours={3} />
          </WorklogCard.Meta>
        </WorklogCard>,
      );

      expect(screen.getByText('오늘')).toBeInTheDocument();
      expect(screen.getByText('3시간')).toBeInTheDocument();
    });

    it('30분을 올바르게 표시해야 함', () => {
      render(
        <WorklogCard>
          <WorklogCard.Meta>
            <WorklogCard.Duration hours={0.5} />
          </WorklogCard.Meta>
        </WorklogCard>,
      );
      expect(screen.getByText('30분')).toBeInTheDocument();
    });

    it('1시간 30분을 올바르게 표시해야 함', () => {
      render(
        <WorklogCard>
          <WorklogCard.Meta>
            <WorklogCard.Duration hours={1.5} />
          </WorklogCard.Meta>
        </WorklogCard>,
      );
      expect(screen.getByText('1시간 30분')).toBeInTheDocument();
    });
  });

  describe('컴파운드 패턴 서브컴포넌트 접근', () => {
    it('WorklogCard.Header가 존재해야 함', () => {
      expect(WorklogCard.Header).toBeDefined();
    });
    it('WorklogCard.Title이 존재해야 함', () => {
      expect(WorklogCard.Title).toBeDefined();
    });
    it('WorklogCard.Project가 존재해야 함', () => {
      expect(WorklogCard.Project).toBeDefined();
    });
    it('WorklogCard.Content가 존재해야 함', () => {
      expect(WorklogCard.Content).toBeDefined();
    });
    it('WorklogCard.Meta가 존재해야 함', () => {
      expect(WorklogCard.Meta).toBeDefined();
    });
    it('WorklogCard.Date가 존재해야 함', () => {
      expect(WorklogCard.Date).toBeDefined();
    });
    it('WorklogCard.Duration이 존재해야 함', () => {
      expect(WorklogCard.Duration).toBeDefined();
    });
  });
});
