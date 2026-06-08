---
name: add-api-resource
description: WorkLog+ 백엔드에 새 REST 리소스 한 개를 계층 아키텍처(schema → service → controller → route → 등록 → 테스트)대로 추가하고, packages/types 와 packages/api 클라이언트까지 연결한다. "API 엔드포인트 추가", "새 리소스/도메인 백엔드 만들기", "/new-endpoint" 요청 시 사용.
---

# 백엔드 리소스 추가 (add-api-resource)

WorkLog+ 백엔드(`apps/backend`)에 새 리소스를 추가할 때, 기존에 확립된 계층 패턴을 그대로 복제한다. 레퍼런스 구현은 **project** 리소스다. 새 리소스를 만들 때 아래 파일들을 항상 같이 읽어 패턴을 맞춘다.

레퍼런스 파일:
- `apps/backend/src/schemas/project.schema.ts`
- `apps/backend/src/services/project.service.ts`
- `apps/backend/src/controllers/project.controller.ts`
- `apps/backend/src/routes/project.routes.ts`
- `apps/backend/src/routes/index.ts`
- `apps/backend/src/services/__tests__/project.service.test.ts`
- `packages/api/src/projects.ts`

## 진행 순서

리소스 이름을 `<resource>`(단수, kebab/camel), 복수형을 `<resources>`라 하자. 다음 순서로 만든다. **DB 모델이 없으면 먼저 `add-prisma-model` 스킬로 모델을 추가**한다.

### 1. Zod 스키마 — `apps/backend/src/schemas/<resource>.schema.ts`
- `createXSchema`, `updateXSchema`, `xQuerySchema` 를 `z.object`로 정의하고 각각 `z.infer`로 `CreateXInput` 등 타입을 export.
- 에러 메시지는 **한국어**.
- 쿼리 스키마는 페이지네이션 포함: `page`/`limit`은 `z.string().optional().default('1').transform(Number)` 패턴.

```ts
import { z } from 'zod';

export const createXSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(100).trim(),
  // ...
});
export type CreateXInput = z.infer<typeof createXSchema>;

export const xQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  search: z.string().optional(),
});
export type XQueryInput = z.infer<typeof xQuerySchema>;
```

### 2. 서비스 — `apps/backend/src/services/<resource>.service.ts`
- `import { prisma } from '../lib/prisma'`, `import { AppError } from '../middleware/error'`.
- 비즈니스 에러는 `throw new AppError(statusCode, '한국어 메시지')` (404/403/409 등).
- **목록 조회**: `getPaginationParams` + `Promise.all([findMany, count])` + `createPaginatedResponse` (from `../utils/pagination`).
- `include`/`select`로 N+1 방지, 민감 필드(`passwordHash`) 제외.
- **2개 이상 DB 쓰기**가 함께 성공/실패해야 하면 `prisma.$transaction(async (tx) => { ... })`.
- 권한 검사(소유자/역할)는 서비스에서 수행하고 위반 시 `AppError(403, ...)`.

### 3. 컨트롤러 — `apps/backend/src/controllers/<resource>.controller.ts`
- `import type { AuthRequest } from '../middleware/auth'`, 시그니처 `(req: AuthRequest, res: Response, next: NextFunction): Promise<void>`.
- `try { ... } catch (error) { next(error); }`.
- 응답 형식 **반드시 준수**:
  - 단일/수정: `res.status(200).json({ success: true, data })`
  - 생성: `res.status(201).json({ success: true, data })`
  - 목록(페이지네이션): `res.status(200).json({ success: true, ...result })`
  - 삭제: `res.status(204).send()`
- `req.user!.userId`, `req.user!.role`로 인증 사용자 접근. `req.params['id'] as string`.

### 4. 라우트 — `apps/backend/src/routes/<resource>.routes.ts`
- `const router: ExpressRouter = Router();`
- `router.use(authenticate, generalLimiter);` 로 보호.
- 쓰기 엔드포인트엔 `authorize('MANAGER', 'ADMIN', 'SYSTEM_ADMIN')` 등 역할 가드.
- `validateBody(schema)`, `validateQuery(schema)`, `validateParams(z.object({ id: commonSchemas.uuid }))`.
- 엔드포인트 네이밍 규칙(CLAUDE.md): `GET /` 목록, `POST /` 생성, `GET /:id`, `PATCH /:id`, `DELETE /:id`, 중첩은 `GET /:id/children`.

### 5. 라우트 등록 — `apps/backend/src/routes/index.ts`
- `import xRoutes from './<resource>.routes'` 후 `router.use('/<resources>', xRoutes)` 추가.

### 6. 공용 타입 — `packages/types`
- 엔티티/응답 타입을 `packages/types`에 정의(또는 갱신)하고 `index`에서 export. `Omit<User, 'passwordHash'>` 류로 민감 필드 제거.

### 7. API 클라이언트 — `packages/api/src/<resources>.ts`
- `xApi = { getAll, getById, create, update, delete }` 객체로 `apiClient.get/post/patch/delete<T>(...)` 호출. `packages/api/src/index.ts`에 export 추가.

### 8. 테스트 — `apps/backend/src/services/__tests__/<resource>.service.test.ts`
- `vi.mock('../../lib/prisma')`, `beforeEach(() => vi.clearAllMocks())`.
- `it('...해야 함')` 한국어 설명. 성공/404/403/유효성 케이스 커버. (`test-writer` 에이전트 활용 가능)

## 완료 전 체크리스트
- [ ] 응답 형식 `{ success, data }` / `{ success, ...result }` 준수
- [ ] HTTP 상태코드 정확(201 생성, 204 삭제, 400/401/403/404/409)
- [ ] `any` 미사용, 반환 타입 명시
- [ ] 보호 라우트에 `authenticate` + 적절한 `authorize`
- [ ] 모든 입력 `validate*` 적용
- [ ] 민감 필드(`passwordHash`) 응답 제외
- [ ] 2+ 쓰기는 `$transaction`
- [ ] 목록은 페이지네이션
- [ ] 서비스 단위 테스트 추가
- [ ] `routes/index.ts` 등록, `packages/api`/`packages/types` 연결
- [ ] `pnpm --filter @worklog-plus/backend typecheck && test` 통과

작업 마무리 시 `convention-check` 스킬로 룰 위반을 한 번 더 검증한다.
