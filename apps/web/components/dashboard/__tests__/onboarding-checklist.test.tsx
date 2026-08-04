import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OnboardingChecklist } from '../onboarding-checklist';

describe('OnboardingChecklist', () => {
  it('두 단계를 모두 마치면 렌더하지 않는다', () => {
    const { container } = render(
      <OnboardingChecklist hasProject hasWorklog />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('아무것도 없으면 첫 단계 CTA만 노출한다', () => {
    render(<OnboardingChecklist hasProject={false} hasWorklog={false} />);

    expect(screen.getByText('첫 프로젝트 만들기')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /프로젝트 만들기/ })).toHaveAttribute(
      'href',
      '/projects',
    );
    // 앞 단계가 안 끝났으므로 다음 단계 CTA는 아직 없다
    expect(
      screen.queryByRole('link', { name: /업무일지 쓰기/ }),
    ).not.toBeInTheDocument();
  });

  it('프로젝트만 있으면 다음 단계로 넘어간다', () => {
    render(<OnboardingChecklist hasProject hasWorklog={false} />);

    expect(screen.getByRole('link', { name: /업무일지 쓰기/ })).toHaveAttribute(
      'href',
      '/worklogs',
    );
    expect(
      screen.queryByRole('link', { name: /프로젝트 만들기/ }),
    ).not.toBeInTheDocument();
  });
});
