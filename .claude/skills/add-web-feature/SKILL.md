---
name: add-web-feature
description: WorkLog+ 웹앱(Next.js 15 App Router)에 새 기능을 추가한다 — packages/api 클라이언트 함수 → TanStack Query 훅(apps/web/hooks/use-*.ts) → 페이지/컴포넌트(shadcn + RHF+Zod). "웹 페이지 추가", "프론트 기능 만들기", "화면/폼 구현", "데이터 조회 훅 추가" 요청 시 사용.
---

# 웹 기능 추가 (add-web-feature)

`apps/web`에 기능을 추가할 때 확립된 데이터 페칭/상태 패턴을 따른다. 레퍼런스: `apps/web/hooks/use-projects.ts`, `packages/api/src/projects.ts`, `apps/web/app/projects/`.

## 계층과 순서

### 1. API 클라이언트 (없으면) — `packages/api/src/<resources>.ts`
- 백엔드 엔드포인트를 `apiClient.get/post/patch/delete<T>(...)`로 감싼 객체. `packages/api/src/index.ts`에 export.

### 2. TanStack Query 훅 — `apps/web/hooks/use-<resources>.ts`
- 파일 최상단 `'use client';`.
- **조회**: `useQuery({ queryKey: ['<resource>', params], queryFn, staleTime })`.
  - `queryKey` 규칙: 목록 `['projects', params]`, 단일 `['projects', id]`, 중첩 `['projects', id, 'dashboard']`.
  - 응답 `if (!response.success) throw new Error(response.error || '...')` 후 `return response.data`.
  - `staleTime`: 기본 30~60초. 단일 조회는 `enabled: !!id`.
- **변경**: `useMutation({ mutationFn, onSuccess })`, `onSuccess`에서 `queryClient.invalidateQueries({ queryKey: [...] })`로 캐시 무효화. 삭제는 `removeQueries`.
- 서버 상태는 TanStack Query, 전역 클라이언트 상태는 `@worklog-plus/store`(Zustand).

### 3. 페이지/컴포넌트
- 라우트: `apps/web/app/<segment>/page.tsx`. 데이터만 필요한 정적 영역은 **서버 컴포넌트**, 상호작용/쿼리 훅 사용은 `'use client'` **클라이언트 컴포넌트**로 분리.
- 페이지 전용 컴포넌트는 `apps/web/components/<domain>/`, 공용은 `packages/ui`(원자) 또는 `packages/components`(도메인).
- UI는 **shadcn/ui 우선**(`@worklog-plus/ui`의 button/card/dialog/form/input 등).
- **폼**: React Hook Form + Zod (`@worklog-plus/types`의 스키마 재사용). `zodResolver` 사용.
- 토스트: `sonner`. 아이콘: `lucide-react`. 차트: `recharts`.

## 인증/보안
- 토큰은 `httpOnly` 쿠키(코드에서 직접 다루지 않음). **localStorage 토큰 저장 금지**.
- 보호 페이지는 `apps/web/middleware.ts` 인증 흐름을 따른다. 권한 없는 접근은 `/403`.

## 완료 전 체크리스트
- [ ] `'use client'` 필요한 곳에만 지정(서버/클라이언트 경계 적절)
- [ ] `queryKey` 규칙 준수, mutation `onSuccess`에서 무효화
- [ ] `any` 미사용, 공용 타입은 `@worklog-plus/types`에서 import
- [ ] shadcn 컴포넌트 우선, 폼은 RHF+Zod
- [ ] localStorage 토큰 미사용
- [ ] `pnpm --filter @worklog-plus/web typecheck && lint` 통과
- [ ] (UI 컴포넌트 신규 시) `add-ui-component` 스킬 활용
