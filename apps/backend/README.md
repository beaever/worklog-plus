# WorkLog+ API 서버

Express + Prisma + PostgreSQL 기반의 RESTful API 서버입니다.

## 📋 개요

WorkLog+ 프로젝트의 백엔드 API 서버로, 업무일지 관리 시스템의 모든 비즈니스 로직과 데이터 처리를 담당합니다.

### 주요 기능

- 🔐 **인증/인가**: JWT 기반 토큰 인증
- 👤 **사용자 관리**: 프로필, 역할, 권한 관리
- 📁 **프로젝트 관리**: CRUD, 대시보드, 통계
- 📝 **업무일지 관리**: CRUD, 검색, 필터링
- 📊 **대시보드**: 통계, 차트 데이터
- 🛡️ **관리자 기능**: 사용자 관리, 감사 로그

## 🛠️ 기술 스택

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.x
- **ORM**: Prisma 5.x
- **Database**: PostgreSQL 16
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Language**: TypeScript 5.x

## 📁 프로젝트 구조

```
apps/api/
├── src/
│   ├── index.ts              # 서버 진입점
│   ├── app.ts                # Express 앱 설정
│   ├── config/               # 환경 설정
│   │   ├── env.ts           # 환경 변수
│   │   └── cors.ts          # CORS 설정
│   ├── middleware/           # 미들웨어
│   │   ├── auth.ts          # JWT 인증
│   │   ├── error.ts         # 에러 핸들러
│   │   ├── validate.ts      # 요청 검증
│   │   └── logger.ts        # 로깅
│   ├── routes/               # 라우트
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── projects.routes.ts
│   │   ├── worklogs.routes.ts
│   │   ├── dashboard.routes.ts
│   │   └── admin.routes.ts
│   ├── controllers/          # 컨트롤러
│   ├── services/             # 비즈니스 로직
│   └── utils/                # 유틸리티
├── prisma/
│   ├── schema.prisma        # DB 스키마
│   └── seed.ts              # 시드 데이터
├── docs/                     # 문서
│   ├── API.md
│   ├── DATABASE.md
│   ├── AUTHENTICATION.md
│   └── DEPLOYMENT.md
├── .env.example             # 환경 변수 예시
├── package.json
└── tsconfig.json
```

## 🚀 빠른 시작

### 1. 사전 요구사항

- Node.js 20 이상
- PostgreSQL 16 이상
- pnpm 9 이상

### 2. 데이터베이스 준비

#### Docker 사용 (권장)

```bash
docker run --name worklog-postgres \
  -e POSTGRES_USER=worklog \
  -e POSTGRES_PASSWORD=worklog123 \
  -e POSTGRES_DB=worklog_plus \
  -p 5432:5432 \
  -d postgres:16
```

#### 로컬 PostgreSQL 사용

```bash
# PostgreSQL 설치 후
createdb worklog_plus
```

### 3. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 수정
# DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET 등 설정
```

### 4. 의존성 설치

```bash
# 루트 디렉토리에서
pnpm install

# 또는 apps/api 디렉토리에서
cd apps/api
pnpm install
```

### 5. 데이터베이스 마이그레이션

```bash
# Prisma 마이그레이션 실행
pnpm prisma:migrate

# 시드 데이터 생성 (선택사항)
pnpm prisma:seed
```

### 6. 개발 서버 실행

```bash
# 개발 모드 (Hot Reload)
pnpm dev

# 또는 루트에서
pnpm --filter @worklog-plus/api dev
```

서버가 시작되면 `http://localhost:8080`에서 접근 가능합니다.

## 📝 사용 가능한 스크립트

```bash
# 개발 서버 실행 (Hot Reload)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# Prisma 명령어
pnpm prisma:generate    # Prisma Client 생성
pnpm prisma:migrate     # 마이그레이션 실행
pnpm prisma:studio      # Prisma Studio 실행
pnpm prisma:seed        # 시드 데이터 생성

# 타입 체크
pnpm typecheck

# 린트
pnpm lint

# 테스트
pnpm test
```

## 🔌 API 엔드포인트

### 헬스 체크

```bash
GET /health
```

### 인증 (Authentication)

```bash
POST   /api/auth/register    # 회원가입
POST   /api/auth/login        # 로그인
POST   /api/auth/logout       # 로그아웃
POST   /api/auth/refresh      # 토큰 갱신
GET    /api/auth/me           # 내 정보 조회
```

### 사용자 (Users)

```bash
GET    /api/users/me          # 내 프로필 조회
PATCH  /api/users/me          # 내 프로필 수정
GET    /api/users/:id/profile # 사용자 프로필 조회
```

### 프로젝트 (Projects)

```bash
GET    /api/projects                    # 프로젝트 목록
POST   /api/projects                    # 프로젝트 생성
GET    /api/projects/:id                # 프로젝트 상세
PATCH  /api/projects/:id                # 프로젝트 수정
DELETE /api/projects/:id                # 프로젝트 삭제
GET    /api/projects/:id/dashboard      # 프로젝트 대시보드
GET    /api/projects/:id/activities     # 프로젝트 활동 로그
```

### 업무일지 (Worklogs)

```bash
GET    /api/worklogs          # 업무일지 목록
POST   /api/worklogs          # 업무일지 생성
GET    /api/worklogs/:id      # 업무일지 상세
PATCH  /api/worklogs/:id      # 업무일지 수정
DELETE /api/worklogs/:id      # 업무일지 삭제
```

### 대시보드 (Dashboard)

```bash
GET    /api/dashboard/stats                    # 전체 통계
GET    /api/dashboard/weekly-activity          # 주간 활동
GET    /api/dashboard/project-distribution     # 프로젝트 분포
GET    /api/dashboard/monthly-trend            # 월별 추이
```

### 관리자 (Admin)

```bash
GET    /api/admin/users           # 사용자 목록
GET    /api/admin/users/:id       # 사용자 상세
PATCH  /api/admin/users/:id       # 사용자 수정
DELETE /api/admin/users/:id       # 사용자 삭제
GET    /api/admin/roles           # 역할 목록
PATCH  /api/admin/roles/:id       # 역할 수정
GET    /api/admin/audit-logs      # 감사 로그
GET    /api/admin/settings        # 시스템 설정 조회
PATCH  /api/admin/settings        # 시스템 설정 수정
```

자세한 API 명세는 [API 문서](./docs/API.md)를 참고하세요.

## 🗄️ 데이터베이스

### 스키마

7개의 주요 테이블로 구성:
- `users` - 사용자
- `projects` - 프로젝트
- `worklogs` - 업무일지
- `project_members` - 프로젝트 멤버십
- `refresh_tokens` - 리프레시 토큰
- `activity_logs` - 활동 로그
- `audit_logs` - 감사 로그

자세한 스키마는 [데이터베이스 문서](./docs/DATABASE.md)를 참고하세요.

### Prisma Studio

데이터베이스를 GUI로 확인하고 수정할 수 있습니다:

```bash
pnpm prisma:studio
```

브라우저에서 `http://localhost:5555`로 접속

## 🔐 인증

JWT (JSON Web Token) 기반 인증을 사용합니다.

### 토큰 종류

- **Access Token**: 15분 유효, API 요청 시 사용
- **Refresh Token**: 7일 유효, Access Token 갱신용

### 인증 플로우

1. 로그인 → Access Token + Refresh Token 발급
2. API 요청 시 `Authorization: Bearer {accessToken}` 헤더 포함
3. Access Token 만료 시 Refresh Token으로 갱신
4. Refresh Token 만료 시 재로그인 필요

자세한 내용은 [인증 문서](./docs/AUTHENTICATION.md)를 참고하세요.

## 🧪 테스트

```bash
# 단위 테스트
pnpm test

# 테스트 커버리지
pnpm test:coverage

# E2E 테스트
pnpm test:e2e
```

## 📦 배포

### 프로덕션 빌드

```bash
# TypeScript 컴파일
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### 환경 변수 (프로덕션)

```env
NODE_ENV="production"
DATABASE_URL="postgresql://..."
JWT_ACCESS_SECRET="강력한-시크릿-키"
JWT_REFRESH_SECRET="강력한-시크릿-키"
CORS_ORIGIN="https://your-domain.com"
```

자세한 배포 가이드는 [배포 문서](./docs/DEPLOYMENT.md)를 참고하세요.

## 🐛 트러블슈팅

### 데이터베이스 연결 실패

```
❌ 데이터베이스 연결 실패
```

**해결 방법**:
1. PostgreSQL이 실행 중인지 확인
2. `DATABASE_URL` 환경 변수가 올바른지 확인
3. 데이터베이스가 생성되어 있는지 확인

### 포트 이미 사용 중

```
Error: listen EADDRINUSE: address already in use :::8080
```

**해결 방법**:
1. 다른 포트 사용: `.env`에서 `PORT=8081`로 변경
2. 기존 프로세스 종료: `lsof -ti:8080 | xargs kill`

### Prisma Client 생성 안됨

```
Error: @prisma/client did not initialize yet
```

**해결 방법**:
```bash
pnpm prisma:generate
```

## 📚 문서

- [API 명세](./docs/API.md)
- [데이터베이스 스키마](./docs/DATABASE.md)
- [인증 가이드](./docs/AUTHENTICATION.md)
- [배포 가이드](./docs/DEPLOYMENT.md)

## 🤝 기여

1. 이슈 생성
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 커밋 (`git commit -m 'Add amazing feature'`)
4. 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

Private

## 👥 개발자

WorkLog+ Team

---

**마지막 업데이트**: 2026-02-15
