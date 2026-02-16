# Prisma 가이드

Prisma ORM을 사용한 데이터베이스 관리 가이드입니다.

## 📋 개요

Prisma는 타입 안전한 데이터베이스 클라이언트를 제공하는 차세대 ORM입니다.

### 주요 특징

- **타입 안전성**: TypeScript와 완벽하게 통합
- **자동 마이그레이션**: 스키마 변경 시 자동으로 SQL 생성
- **직관적인 API**: 읽기 쉬운 쿼리 작성
- **성능**: 최적화된 쿼리 생성

## 📁 파일 구조

```
prisma/
├── schema.prisma    # 데이터베이스 스키마 정의
├── seed.ts          # 초기 데이터 생성 스크립트
├── migrations/      # 마이그레이션 파일 (자동 생성)
└── README.md        # 이 파일
```

## 🗄️ 데이터베이스 스키마

### 테이블 목록

1. **users** - 사용자
2. **projects** - 프로젝트
3. **worklogs** - 업무일지
4. **project_members** - 프로젝트 멤버십
5. **refresh_tokens** - 리프레시 토큰
6. **activity_logs** - 활동 로그
7. **audit_logs** - 감사 로그

### ERD (Entity Relationship Diagram)

```
users (1) ──< (N) projects (owner)
users (1) ──< (N) worklogs
users (1) ──< (N) project_members
users (1) ──< (N) refresh_tokens
users (1) ──< (N) activity_logs
users (1) ──< (N) audit_logs

projects (1) ──< (N) worklogs
projects (1) ──< (N) project_members
projects (1) ──< (N) activity_logs
```

## 🚀 Prisma 명령어

### 기본 명령어

```bash
# Prisma Client 생성
pnpm prisma:generate

# 마이그레이션 생성 및 실행
pnpm prisma:migrate

# Prisma Studio 실행 (GUI)
pnpm prisma:studio

# 시드 데이터 생성
pnpm prisma:seed

# 데이터베이스 푸시 (개발용)
pnpm db:push
```

### 상세 명령어

```bash
# 마이그레이션 생성 (이름 지정)
npx prisma migrate dev --name add_user_avatar

# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 리셋 (주의: 모든 데이터 삭제)
npx prisma migrate reset

# 스키마 포맷팅
npx prisma format

# 스키마 검증
npx prisma validate
```

## 📝 Prisma Client 사용법

### 기본 사용

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 사용자 조회
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});

// 사용자 생성
const newUser = await prisma.user.create({
  data: {
    email: 'new@example.com',
    passwordHash: 'hashed_password',
    name: '홍길동',
    role: 'USER',
  },
});

// 사용자 수정
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { name: '김철수' },
});

// 사용자 삭제
await prisma.user.delete({
  where: { id: userId },
});
```

### 관계 포함 조회

```typescript
// 프로젝트와 소유자 정보 함께 조회
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    owner: true,              // 소유자 정보
    worklogs: true,           // 업무일지 목록
    members: {                // 멤버 목록
      include: {
        user: true,           // 각 멤버의 사용자 정보
      },
    },
  },
});
```

### 필터링 및 정렬

```typescript
// 활성 프로젝트만 조회, 최신순 정렬
const projects = await prisma.project.findMany({
  where: {
    status: 'ACTIVE',
    ownerId: userId,
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 10,  // 최대 10개
  skip: 0,   // 페이지네이션
});
```

### 집계 쿼리

```typescript
// 사용자별 업무일지 통계
const stats = await prisma.worklog.aggregate({
  where: { userId },
  _count: true,              // 개수
  _sum: { duration: true },  // 총 소요 시간
  _avg: { duration: true },  // 평균 소요 시간
});

console.log(`총 ${stats._count}개의 업무일지`);
console.log(`총 작업 시간: ${stats._sum.duration}시간`);
console.log(`평균 작업 시간: ${stats._avg.duration}시간`);
```

### 트랜잭션

```typescript
// 여러 작업을 하나의 트랜잭션으로 실행
await prisma.$transaction(async (tx) => {
  // 프로젝트 생성
  const project = await tx.project.create({
    data: { name: '새 프로젝트', ownerId: userId },
  });

  // 활동 로그 생성
  await tx.activityLog.create({
    data: {
      projectId: project.id,
      userId,
      action: 'created_project',
      description: `프로젝트 "${project.name}"을 생성했습니다.`,
    },
  });

  // 감사 로그 생성
  await tx.auditLog.create({
    data: {
      action: 'PROJECT_CREATED',
      actorId: userId,
      targetType: 'PROJECT',
      targetId: project.id,
      targetName: project.name,
    },
  });
});
```

## 🌱 시드 데이터

### 시드 데이터 내용

`seed.ts` 스크립트는 다음 데이터를 생성합니다:

- **사용자 4명**
  - 시스템 관리자 (admin@worklog.com)
  - 프로젝트 매니저 (manager@worklog.com)
  - 일반 사용자 2명 (user1@worklog.com, user2@worklog.com)

- **프로젝트 3개**
  - WorkLog+ 백엔드 개발
  - WorkLog+ 프론트엔드 개발
  - 모바일 앱 개발

- **업무일지 4개**
- **프로젝트 멤버 3개**
- **활동 로그 2개**
- **감사 로그 2개**

### 시드 실행

```bash
# 시드 데이터 생성
pnpm prisma:seed

# 또는
npx prisma db seed
```

### 테스트 계정

모든 테스트 계정의 비밀번호는 동일합니다:

| 이메일 | 비밀번호 | 역할 |
|--------|----------|------|
| admin@worklog.com | admin123!@# | SYSTEM_ADMIN |
| manager@worklog.com | manager123!@# | MANAGER |
| user1@worklog.com | user123!@# | USER |
| user2@worklog.com | user123!@# | USER |

## 🔧 스키마 수정

### 1. schema.prisma 수정

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  // 새 필드 추가
  phone     String?  // 전화번호 (선택사항)
  // ...
}
```

### 2. 마이그레이션 생성

```bash
npx prisma migrate dev --name add_user_phone
```

### 3. Prisma Client 재생성

```bash
pnpm prisma:generate
```

## 🎨 Prisma Studio

Prisma Studio는 데이터베이스를 GUI로 관리할 수 있는 도구입니다.

### 실행

```bash
pnpm prisma:studio
```

브라우저에서 `http://localhost:5555` 접속

### 기능

- 데이터 조회 및 편집
- 필터링 및 정렬
- 관계 탐색
- 데이터 추가/삭제

## ⚠️ 주의사항

### 프로덕션 환경

- **절대로** `prisma migrate reset`을 실행하지 마세요 (모든 데이터 삭제)
- 마이그레이션 전 백업 필수
- `prisma db push` 대신 `prisma migrate deploy` 사용

### 개발 환경

- 스키마 변경 시 항상 마이그레이션 생성
- 마이그레이션 파일은 Git에 커밋
- 팀원과 마이그레이션 동기화

### 성능

- 필요한 필드만 `select`로 조회
- `include` 사용 시 N+1 문제 주의
- 인덱스 활용 (`@@index`)

## 🔍 트러블슈팅

### Prisma Client 생성 안됨

```bash
pnpm prisma:generate
```

### 마이그레이션 충돌

```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 리셋 (개발 환경에서만)
npx prisma migrate reset
```

### 데이터베이스 연결 실패

1. PostgreSQL이 실행 중인지 확인
2. `DATABASE_URL` 환경 변수 확인
3. 데이터베이스가 생성되어 있는지 확인

## 📚 참고 자료

- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Prisma Schema 레퍼런스](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma 마이그레이션](https://www.prisma.io/docs/concepts/components/prisma-migrate)
