---
name: add-ui-component
description: WorkLog+ 공용 UI 패키지(packages/ui)에 shadcn/ui 스타일 재사용 컴포넌트를 추가하고 export 등록 및 (옵션) Storybook 스토리를 작성한다. "공용 컴포넌트 추가", "버튼/모달/입력 컴포넌트 만들기", "디자인 시스템 컴포넌트" 요청 시 사용.
---

# 공용 UI 컴포넌트 추가 (add-ui-component)

여러 앱(web/mobile/storybook)에서 재사용할 원자 컴포넌트는 `packages/ui`에 둔다. 도메인 의존(프로젝트/업무일지 등) 컴포넌트는 `packages/components`, 페이지 전용은 해당 앱의 `components/`.

레퍼런스: `packages/ui/src`의 기존 컴포넌트(button/card/dialog/form/input/label/modal/select/textarea/badge).

## 작성 규칙
- 파일명 `kebab-case.tsx`. 컴포넌트/타입은 `PascalCase`.
- shadcn/ui 컨벤션: `React.forwardRef` + `className` 병합(`cn` 유틸) + 변형은 `class-variance-authority(cva)`.
- props 타입은 `React.ComponentPropsWithoutRef<...>` 확장, `any` 금지.
- 접근성: 적절한 ARIA/role, 포커스 가능 요소엔 키보드 지원.
- 스타일은 Tailwind 클래스. 색/간격은 기존 토큰/패턴 재사용.

```tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const exampleVariants = cva('base-classes', {
  variants: { variant: { default: '...', outline: '...' } },
  defaultVariants: { variant: 'default' },
});

export interface ExampleProps
  extends React.ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof exampleVariants> {}

export const Example = forwardRef<HTMLDivElement, ExampleProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(exampleVariants({ variant }), className)} {...props} />
  ),
);
Example.displayName = 'Example';
```

## 등록
- `packages/ui/src/index.ts`(또는 배럴 파일)에 `export * from './example'` 추가.
- web에서 `import { Example } from '@worklog-plus/ui'`로 사용 가능한지 확인.

## Storybook (권장)
- `apps/storybook`에 스토리 추가: 주요 variant/state를 시각화. `pnpm storybook`으로 확인.
- 시각 회귀는 Chromatic(`pnpm chromatic`)으로 검증.

## 완료 전 체크리스트
- [ ] `forwardRef` + `cn` + (변형 시) `cva`
- [ ] `any` 미사용, props 타입 명시
- [ ] 배럴 export 등록
- [ ] 접근성 속성
- [ ] (권장) Storybook 스토리
- [ ] `pnpm --filter @worklog-plus/ui typecheck` 통과
