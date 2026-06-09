---
name: add-interaction
description: WorkLog+ 웹앱(Next.js 15)에 일관된 인터랙션을 추가한다 — hover/active/focus 마이크로 인터랙션, 진입/퇴장 애니메이션, 로딩 상태(Skeleton/pending), 사용자 피드백(sonner 토스트 + TanStack Query optimistic). "인터랙션 추가", "마이크로 인터랙션", "버튼/카드 hover 효과", "애니메이션 입히기", "로딩/피드백 개선", "/add-interaction" 요청 시 사용.
---

# 인터랙션 추가 (add-interaction)

WorkLog+는 인터랙션이 부족하다. 정적인 화면에 **일관된 피드백/모션**을 입혀 "반응하는 느낌"을 만든다. 새 라이브러리 도입보다 **기존 스택(Tailwind transition, sonner, nprogress, Skeleton)** 을 먼저 활용한다.

핵심 원칙: **빠르고(150–200ms) · 절제되고 · 접근성을 지키는** 모션. 화려함이 아니라 명료한 피드백이 목표다.

## 언제 어떤 인터랙션을 쓰나

| 상황 | 패턴 | 도구 |
|------|------|------|
| 클릭 가능한 요소(버튼/카드/링크) | hover/active/focus 트랜지션 | Tailwind `transition-*` |
| 목록/모달/토스트 등장·퇴장 | enter/exit 애니메이션 | keyframes(아래 1회 설정) |
| 데이터 로딩 중 | Skeleton · 버튼 pending spinner | `Skeleton`, `lucide` `Loader2` |
| 라우트 이동 | 상단 진행바 | `nprogress` (이미 적용됨) |
| 생성/수정/삭제 결과 | 토스트 + 낙관적 업데이트 | `sonner`, TanStack Query |
| 빈 상태 | 일러스트 + CTA | `EmptyState` (packages/ui) |

---

## 0. (1회) 모션 토큰 설정 — `packages/ui/tailwind.config.ts`

현재 keyframes/애니메이션 유틸이 없다. 아래를 `theme.extend`에 추가해 **공용 모션 토큰**을 만든다. 이미 있으면 건너뛴다.

```ts
theme: {
  extend: {
    // ...기존 colors, borderRadius 유지...
    keyframes: {
      'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      'fade-in-up': {
        from: { opacity: '0', transform: 'translateY(8px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
      'scale-in': {
        from: { opacity: '0', transform: 'scale(0.97)' },
        to: { opacity: '1', transform: 'scale(1)' },
      },
    },
    animation: {
      'fade-in': 'fade-in 0.2s ease-out',
      'fade-in-up': 'fade-in-up 0.25s ease-out',
      'scale-in': 'scale-in 0.15s ease-out',
    },
  },
}
```

`apps/web/tailwind.config.ts`는 ui 설정을 spread 하므로 web에서 바로 `animate-fade-in` 등을 쓸 수 있다.

### 접근성 — `prefers-reduced-motion` (필수, 1회) — `packages/ui/src/globals.css`

모션 민감 사용자를 위해 전역에서 애니메이션을 무력화한다. 새 인터랙션을 추가하기 전에 이 블록이 있는지 확인하고 없으면 추가한다.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 1. 마이크로 인터랙션 (hover / active / focus)

클릭 가능한 모든 요소에 **명시적 트랜지션**을 준다. `transition-colors`만 쓰던 곳도 hover/active 상태를 보강한다.

```tsx
// 카드: hover 시 살짝 떠오르고 테두리 강조
<div className="rounded-lg border bg-card p-4 transition-all duration-200
                hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md
                active:translate-y-0">
```

```tsx
// 아이콘 버튼: 색 + 배경 + 미세 확대
<button className="rounded-sm p-1 text-muted-foreground transition-colors
                   hover:bg-accent hover:text-foreground active:scale-95">
```

규칙:
- **duration**: 인터랙션 `150–200ms`. 길면 둔해 보인다.
- **focus 가시성 필수**: 키보드 접근을 위해 `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` 패턴 유지. hover만 주고 focus를 빼지 않는다.
- `group` + `group-hover:`로 부모 hover 시 자식(아이콘/배지)을 함께 반응시킨다.
- `cursor-pointer`를 잊지 않는다 (div 기반 클릭 요소).

---

## 2. 진입 / 퇴장 애니메이션

목록 아이템, 카드 그리드, 모달 콘텐츠 등 **새로 나타나는 요소**에 0번에서 만든 토큰을 적용한다.

```tsx
// 목록 stagger 등장 (인라인 style로 지연만 부여 — 과용 금지, 최대 ~8개)
{items.map((item, i) => (
  <li
    key={item.id}
    className="animate-fade-in-up"
    style={{ animationDelay: `${Math.min(i, 8) * 40}ms`, animationFillMode: 'backwards' }}
  >
    ...
  </li>
))}
```

```tsx
// 토스트/팝오버/드롭다운: scale-in
<div className="animate-scale-in origin-top-right ...">
```

규칙:
- stagger 지연은 `40–60ms` 간격, 항목이 많으면 상한(`Math.min(i, 8)`)을 둬 마지막까지 기다리지 않게 한다.
- 무한 반복 애니메이션 금지(스피너 제외). 등장은 1회성.

---

## 3. 로딩 상태

빈 화면/깜빡임 대신 **Skeleton**과 **pending 표시**로 진행 중임을 알린다.

```tsx
// TanStack Query 로딩: Skeleton 플레이스홀더 (실제 레이아웃과 같은 형태로)
import { Skeleton } from '@worklog-plus/ui';

if (isLoading) {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}
```

```tsx
// 제출 버튼 pending: 스피너 + 비활성화 (중복 제출 방지)
import { Loader2 } from 'lucide-react';

<Button disabled={isPending}>
  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isPending ? '저장 중...' : '저장'}
</Button>
```

규칙:
- 로딩 스켈레톤은 **실제 콘텐츠와 동일한 크기/배치**로 만들어 레이아웃 시프트(CLS)를 막는다.
- mutation 진행 중 버튼은 항상 `disabled` + 스피너. 라우트 이동 로딩은 이미 `nprogress`가 처리한다(중복 구현 금지).

---

## 4. 사용자 피드백 (토스트 + 낙관적 업데이트)

작업 결과를 **즉시** 알린다. 이미 `sonner`를 쓰므로 패턴을 통일한다.

```tsx
import { toast } from 'sonner';

const { mutate } = useMutation({
  mutationFn: deleteProject,
  // 낙관적 업데이트: 응답 전에 UI 먼저 반영
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['projects'] });
    const prev = queryClient.getQueryData(['projects']);
    queryClient.setQueryData(['projects'], (old) => old?.filter((p) => p.id !== id));
    return { prev };
  },
  onError: (_err, _id, ctx) => {
    queryClient.setQueryData(['projects'], ctx?.prev); // 롤백
    toast.error('삭제에 실패했어요. 다시 시도해 주세요.');
  },
  onSuccess: () => toast.success('프로젝트를 삭제했어요.'),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
});
```

규칙:
- 성공/실패 메시지는 **한국어, 사용자 관점**으로. 기술 용어/에러 코드 노출 금지.
- 삭제·토글처럼 되돌릴 수 있는 작업은 낙관적 업데이트로 즉각 반응시키되 **onError 롤백 필수**.
- 파괴적 작업(삭제)은 토스트 전에 확인 모달(`Dialog`/`Modal`)을 거친다.

---

## 적용 순서 (권장)

1. 0번 모션 토큰 + reduced-motion 블록이 있는지 확인, 없으면 먼저 추가.
2. 대상 화면에서 **클릭 가능 요소 → 로딩 상태 → 결과 피드백** 순으로 인터랙션이 빠진 곳을 찾는다.
3. 위 패턴을 재사용해 적용한다. 새 keyframe이 필요하면 0번 토큰에 추가하고 web에서 재사용.
4. 키보드(Tab/Enter)와 `prefers-reduced-motion: reduce`에서 동작을 직접 확인.

## 완료 전 체크리스트

- [ ] 클릭 가능 요소에 hover **+ active + focus-visible** 모두 존재 (focus 누락 금지)
- [ ] 트랜지션 `150–200ms`, 등장 애니메이션은 1회성(무한 반복 없음)
- [ ] 로딩 시 Skeleton/스피너로 깜빡임·중복 제출 방지, CLS 없음
- [ ] mutation 결과를 sonner 토스트(한국어)로 피드백, 파괴적 작업은 확인 모달
- [ ] 낙관적 업데이트 사용 시 `onError` 롤백 + `onSettled` invalidate
- [ ] `prefers-reduced-motion: reduce`에서 모션 비활성 확인
- [ ] `any` 미사용, `pnpm --filter @worklog-plus/web typecheck` 통과
