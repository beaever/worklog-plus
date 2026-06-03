---
name: add-prisma-model
description: WorkLog+ 백엔드 Prisma 스키마에 새 모델(테이블)을 프로젝트 DB 규칙(@@map/@map snake_case, onDelete 명시)대로 추가하고 마이그레이션한다. "DB 모델/테이블 추가", "Prisma 스키마 변경", "새 엔티티 만들기" 요청 시 사용.
---

# Prisma 모델 추가 (add-prisma-model)

`apps/backend/prisma/schema.prisma`에 모델을 추가할 때 WorkLog+ DB 규칙을 따른다. 기존 모델(User, Project, Worklog, ProjectMember 등)을 레퍼런스로 패턴을 맞춘다.

## DB 규칙 (CLAUDE.md 강제)
- 모델명: `PascalCase`. 테이블명: `@@map("snake_case")` **필수**.
- 모든 컬럼: `@map("snake_case")` **필수**.
- 모든 관계: `onDelete` **명시 필수** (기본값 의존 금지).
  - nullable 필드만 `onDelete: SetNull` 허용.
  - **NOT NULL 필드에 `onDelete: SetNull` 금지** → `Cascade` 또는 `Restrict`.
- enum 대신 코드에서는 `as const` 객체를 쓰되, Prisma `enum`은 스키마 표현으로 허용.
- 타임스탬프: `createdAt DateTime @default(now()) @map("created_at")`, `updatedAt DateTime @updatedAt @map("updated_at")`.
- PK는 `id String @id @default(uuid()) @map("id")` 패턴(기존 모델 확인 후 일치).

## 모델 템플릿
```prisma
model Example {
  id          String   @id @default(uuid())
  name        String
  ownerId     String   @map("owner_id")
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("examples")
}
```
- 양방향 관계면 상대 모델에도 `examples Example[]` 역참조 필드를 추가한다.
- 인덱스가 필요한 조회 컬럼엔 `@@index([ownerId])` 추가.

## 마이그레이션 절차
1. 스키마 수정 후 클라이언트 재생성: `pnpm --filter @worklog-plus/backend prisma:generate`
2. 마이그레이션 생성/적용: `pnpm --filter @worklog-plus/backend prisma:migrate` (이름은 한국어 의미를 영어로, 예: `add_example_model`)
3. 시드 데이터가 필요하면 `apps/backend/prisma/seed.ts` 갱신 후 `pnpm --filter @worklog-plus/backend db:seed`.

## 완료 전 체크리스트
- [ ] `@@map` / 모든 `@map` snake_case 지정
- [ ] 모든 관계 `onDelete` 명시, NOT NULL에 SetNull 없음
- [ ] 역참조 필드 추가
- [ ] `prisma:generate` 성공(타입 반영)
- [ ] 마이그레이션 적용 성공
- [ ] (필요 시) seed 갱신

모델 추가 후 보통 `add-api-resource` 스킬로 해당 리소스의 API 계층을 만든다.
