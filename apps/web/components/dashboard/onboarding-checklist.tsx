'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@worklog-plus/ui';
import { Check, FolderPlus, PenLine, ArrowRight } from 'lucide-react';

interface OnboardingChecklistProps {
  hasProject: boolean;
  hasWorklog: boolean;
}

// 첫 프로젝트/일지를 만들기 전까지만 노출되는 시작 안내.
// 둘 다 끝나면 렌더하지 않으므로 완료 상태를 따로 저장할 필요가 없다.
export function OnboardingChecklist({
  hasProject,
  hasWorklog,
}: OnboardingChecklistProps) {
  if (hasProject && hasWorklog) return null;

  const steps = [
    {
      done: hasProject,
      icon: FolderPlus,
      title: '첫 프로젝트 만들기',
      description: '업무를 담을 프로젝트를 하나 만들어 주세요.',
      href: '/projects',
      cta: '프로젝트 만들기',
    },
    {
      done: hasWorklog,
      icon: PenLine,
      title: '첫 업무일지 쓰기',
      description: '오늘 한 일을 기록하면 대시보드가 채워집니다.',
      href: '/worklogs',
      cta: '업무일지 쓰기',
    },
  ];

  // 앞 단계가 끝나야 다음 단계로 넘어갈 수 있으므로 하나만 활성화한다.
  const activeIndex = steps.findIndex((step) => !step.done);

  return (
    <Card className='border-primary/30 bg-primary/5'>
      <CardHeader>
        <CardTitle className='text-lg'>WorkLog+ 시작하기</CardTitle>
        <p className='text-sm text-muted-foreground'>
          두 단계만 마치면 업무 현황이 자동으로 쌓입니다.
        </p>
      </CardHeader>
      <CardContent className='space-y-3'>
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={step.title}
              className={`flex items-center gap-3 rounded-lg border bg-card p-3 ${
                step.done ? 'opacity-60' : ''
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  step.done
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.done ? (
                  <Check className='h-4 w-4' />
                ) : (
                  <step.icon className='h-4 w-4' />
                )}
              </span>

              <div className='min-w-0 flex-1'>
                <p
                  className={`text-sm font-medium ${
                    step.done ? 'line-through' : ''
                  }`}
                >
                  {step.title}
                </p>
                {!step.done && (
                  <p className='text-xs text-muted-foreground'>
                    {step.description}
                  </p>
                )}
              </div>

              {isActive && (
                <Button asChild size='sm' className='shrink-0'>
                  <Link href={step.href}>
                    {step.cta}
                    <ArrowRight className='ml-1 h-3.5 w-3.5' />
                  </Link>
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
