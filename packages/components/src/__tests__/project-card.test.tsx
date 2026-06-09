import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '../project/project-card';
import type { ProjectSummary } from '@worklog-plus/types';

const mockProject: ProjectSummary = {
  id: '1',
  name: 'WorkLog+ 백엔드',
  status: 'ACTIVE',
  progress: 65,
  worklogCount: 24,
  updatedAt: new Date().toISOString(),
  ownerId: 'owner-1',
};

describe('ProjectCard 컴파운드 패턴', () => {
  describe('루트 컴포넌트', () => {
    it('클릭 이벤트가 동작해야 함', () => {
      const handleClick = vi.fn();
      render(
        <ProjectCard onClick={handleClick}>
          <ProjectCard.Header>
            <ProjectCard.Title>{mockProject.name}</ProjectCard.Title>
            <ProjectCard.Status status={mockProject.status} />
          </ProjectCard.Header>
        </ProjectCard>,
      );

      fireEvent.click(screen.getByRole('article'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Header', () => {
    it('Title과 Status를 렌더링해야 함', () => {
      render(
        <ProjectCard>
          <ProjectCard.Header>
            <ProjectCard.Title>{mockProject.name}</ProjectCard.Title>
            <ProjectCard.Status status={mockProject.status} />
          </ProjectCard.Header>
        </ProjectCard>,
      );

      expect(screen.getByText('WorkLog+ 백엔드')).toBeInTheDocument();
      expect(screen.getByText('진행중')).toBeInTheDocument();
    });
  });

  describe('Status', () => {
    it('PLANNED 상태를 표시해야 함', () => {
      render(
        <ProjectCard>
          <ProjectCard.Status status='PLANNED' />
        </ProjectCard>,
      );
      expect(screen.getByText('예정')).toBeInTheDocument();
    });

    it('ACTIVE 상태를 표시해야 함', () => {
      render(
        <ProjectCard>
          <ProjectCard.Status status='ACTIVE' />
        </ProjectCard>,
      );
      expect(screen.getByText('진행중')).toBeInTheDocument();
    });

    it('DONE 상태를 표시해야 함', () => {
      render(
        <ProjectCard>
          <ProjectCard.Status status='DONE' />
        </ProjectCard>,
      );
      expect(screen.getByText('완료')).toBeInTheDocument();
    });
  });

  describe('Progress', () => {
    it('진행률을 표시해야 함', () => {
      render(
        <ProjectCard>
          <ProjectCard.Progress value={65} />
        </ProjectCard>,
      );
      expect(screen.getByText('65%')).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('Count와 UpdatedAt을 렌더링해야 함', () => {
      render(
        <ProjectCard>
          <ProjectCard.Footer>
            <ProjectCard.Count count={24} />
            <ProjectCard.UpdatedAt date={mockProject.updatedAt} />
          </ProjectCard.Footer>
        </ProjectCard>,
      );

      expect(screen.getByText('업무일지 24개')).toBeInTheDocument();
      expect(screen.getByText('오늘')).toBeInTheDocument();
    });
  });

  describe('컴파운드 패턴 서브컴포넌트 접근', () => {
    it('ProjectCard.Header가 존재해야 함', () => {
      expect(ProjectCard.Header).toBeDefined();
    });
    it('ProjectCard.Title이 존재해야 함', () => {
      expect(ProjectCard.Title).toBeDefined();
    });
    it('ProjectCard.Status가 존재해야 함', () => {
      expect(ProjectCard.Status).toBeDefined();
    });
    it('ProjectCard.Progress가 존재해야 함', () => {
      expect(ProjectCard.Progress).toBeDefined();
    });
    it('ProjectCard.Footer가 존재해야 함', () => {
      expect(ProjectCard.Footer).toBeDefined();
    });
    it('ProjectCard.Count가 존재해야 함', () => {
      expect(ProjectCard.Count).toBeDefined();
    });
    it('ProjectCard.UpdatedAt이 존재해야 함', () => {
      expect(ProjectCard.UpdatedAt).toBeDefined();
    });
  });
});
