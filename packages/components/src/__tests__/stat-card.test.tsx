import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Users } from 'lucide-react';
import { StatCard } from '../dashboard/stat-card';

describe('StatCard 컴파운드 패턴', () => {
  describe('기본 렌더링', () => {
    it('Value와 Label을 렌더링해야 함', () => {
      render(
        <StatCard>
          <StatCard.Label>총 사용자</StatCard.Label>
          <StatCard.Value>1,234</StatCard.Value>
        </StatCard>,
      );

      expect(screen.getByText('총 사용자')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('Icon을 렌더링해야 함', () => {
      render(
        <StatCard>
          <StatCard.Icon icon={Users} />
          <StatCard.Label>총 사용자</StatCard.Label>
          <StatCard.Value>1,234</StatCard.Value>
        </StatCard>,
      );

      // icon이 렌더링되면 svg가 존재해야 함
      expect(document.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Trend', () => {
    it('양수 트렌드를 표시해야 함', () => {
      render(
        <StatCard>
          <StatCard.Trend value={12.5} />
        </StatCard>,
      );
      expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });

    it('음수 트렌드를 표시해야 함', () => {
      render(
        <StatCard>
          <StatCard.Trend value={-5.3} />
        </StatCard>,
      );
      expect(screen.getByText('-5.3%')).toBeInTheDocument();
    });

    it('0 트렌드를 표시해야 함', () => {
      render(
        <StatCard>
          <StatCard.Trend value={0} />
        </StatCard>,
      );
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('컴파운드 패턴 서브컴포넌트 접근', () => {
    it('StatCard.Icon이 존재해야 함', () => {
      expect(StatCard.Icon).toBeDefined();
    });
    it('StatCard.Label이 존재해야 함', () => {
      expect(StatCard.Label).toBeDefined();
    });
    it('StatCard.Value가 존재해야 함', () => {
      expect(StatCard.Value).toBeDefined();
    });
    it('StatCard.Trend가 존재해야 함', () => {
      expect(StatCard.Trend).toBeDefined();
    });
  });
});
