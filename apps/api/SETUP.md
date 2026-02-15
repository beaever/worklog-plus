# WorkLog+ API 서버 설정 가이드

백엔드 API 서버를 실행하기 위한 단계별 가이드입니다.

## 📋 현재 상태

✅ **완료된 작업** (23개 파일):
- 프로젝트 설정 파일 (package.json, tsconfig.json, .env.example)
- Prisma 스키마 및 시드 데이터
- 환경 설정 (env.ts, cors.ts)
- 유틸리티 (JWT, 비밀번호, 페이지네이션, 로거)
- 미들웨어 (인증, 에러 처리, 검증, 로깅)
- Express 앱 기본 구조 (app.ts, index.ts)
- README 문서 (각 모듈별)

⏳ **진행 예정**:
- API 라우트 및 컨트롤러 구현
- 서비스 레이어 구현
- API 문서 작성

## 🚀 빠른 시작

### 1단계: 의존성 설치

```bash
# apps/api 디렉토리로 이동
cd apps/api

# 의존성 설치
pnpm install
```

### 2단계: 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일을 열고 다음 값들을 설정하세요:

```env
# 데이터베이스 URL (PostgreSQL)
DATABASE_URL="postgresql://worklog:worklog123@localhost:5432/worklog_plus"

# JWT 시크릿 키 (32자 이상의 랜덤 문자열)
JWT_ACCESS_SECRET="your-super-secret-access-key-at-least-32-characters-long-change-this"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-at-least-32-characters-long-change-this"

# 서버 설정
PORT=8080
NODE_ENV="development"

# CORS (프론트엔드 URL)
CORS_ORIGIN="http://localhost:3000"
```

**시크릿 키 생성 방법**:
```bash
# Node.js로 무작위 문자열 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3단계: PostgreSQL 데이터베이스 준비

#### Option 1: Docker 사용 (권장)

```bash
# PostgreSQL 컨테이너 실행
docker run --name worklog-postgres \
  -e POSTGRES_USER=worklog \
  -e POSTGRES_PASSWORD=worklog123 \
  -e POSTGRES_DB=worklog_plus \
  -p 5432:5432 \
  -d postgres:16

# 컨테이너 상태 확인
docker ps
```

#### Option 2: 로컬 PostgreSQL 사용

```bash
# PostgreSQL 설치 후
createdb worklog_plus
```

### 4단계: Prisma 마이그레이션

```bash
# Prisma Client 생성
pnpm prisma:generate

# 데이터베이스 마이그레이션 실행
pnpm prisma:migrate

# 시드 데이터 생성 (선택사항)
pnpm prisma:seed
```

### 5단계: 개발 서버 실행

```bash
# 개발 모드로 실행 (Hot Reload)
pnpm dev
```

서버가 성공적으로 시작되면 다음과 같은 메시지가 표시됩니다:

```
🔌 데이터베이스 연결 확인 중...
✅ 데이터베이스 연결 성공

🚀 WorkLog+ API 서버 시작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 서버 주소: http://localhost:8080
🌍 환경: development
🔐 CORS 허용: http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 사용 가능한 엔드포인트:
  - GET  http://localhost:8080/health (헬스 체크)
```

### 6단계: API 테스트

```bash
# 헬스 체크
curl http://localhost:8080/health

# 응답:
# {
#   "status": "ok",
#   "timestamp": "2026-02-15T06:24:00.000Z",
#   "environment": "development"
# }
```

## 🔧 문제 해결

### 의존성 설치 실패

```bash
# pnpm 캐시 삭제 후 재설치
pnpm store prune
pnpm install
```

### 데이터베이스 연결 실패

**에러**: `Error: P1001: Can't reach database server`

**해결 방법**:
1. PostgreSQL이 실행 중인지 확인
2. `.env`의 `DATABASE_URL`이 올바른지 확인
3. 포트 번호 확인 (기본: 5432)

```bash
# Docker 컨테이너 확인
docker ps

# 컨테이너 재시작
docker restart worklog-postgres
```

### Prisma Client 생성 안됨

**에러**: `@prisma/client did not initialize yet`

**해결 방법**:
```bash
pnpm prisma:generate
```

### 포트 이미 사용 중

**에러**: `Error: listen EADDRINUSE: address already in use :::8080`

**해결 방법**:
1. `.env`에서 다른 포트 사용 (`PORT=8081`)
2. 또는 기존 프로세스 종료:
```bash
lsof -ti:8080 | xargs kill
```

### TypeScript 에러

현재 TypeScript 에러가 표시되는 것은 정상입니다. 의존성을 설치하면 해결됩니다:

```bash
cd apps/api
pnpm install
```

## 📦 설치될 주요 패키지

### Dependencies
- `express` - 웹 프레임워크
- `@prisma/client` - Prisma ORM 클라이언트
- `bcrypt` - 비밀번호 해싱
- `jsonwebtoken` - JWT 토큰
- `zod` - 스키마 검증
- `cors` - CORS 미들웨어
- `helmet` - 보안 헤더
- `morgan` - HTTP 로깅
- `dotenv` - 환경 변수

### DevDependencies
- `typescript` - TypeScript 컴파일러
- `prisma` - Prisma CLI
- `tsx` - TypeScript 실행기
- `nodemon` - 파일 변경 감지
- `@types/*` - TypeScript 타입 정의

## 🎯 다음 단계

의존성 설치 후:

1. **API 라우트 구현** (진행 예정)
   - 인증 API (로그인, 회원가입, 토큰 갱신)
   - 사용자 API (프로필 조회/수정)
   - 프로젝트 API (CRUD, 대시보드)
   - 업무일지 API (CRUD, 검색)
   - 대시보드 API (통계, 차트)
   - 관리자 API (사용자 관리, 감사 로그)

2. **프론트엔드 연동**
   - API 클라이언트 설정 (`packages/api`)
   - 환경 변수 설정 (`NEXT_PUBLIC_API_URL=http://localhost:8080`)

3. **테스트**
   - Postman/Thunder Client로 API 테스트
   - 프론트엔드에서 실제 API 호출

## 📚 참고 문서

- [README.md](./README.md) - 전체 프로젝트 가이드
- [prisma/README.md](./prisma/README.md) - Prisma 사용 가이드
- [src/config/README.md](./src/config/README.md) - 환경 설정 가이드
- [src/middleware/README.md](./src/middleware/README.md) - 미들웨어 가이드
- [src/utils/README.md](./src/utils/README.md) - 유틸리티 가이드

## ✅ 체크리스트

설정 완료 확인:

- [ ] pnpm 설치 확인 (`pnpm --version`)
- [ ] Node.js 20+ 설치 확인 (`node --version`)
- [ ] PostgreSQL 실행 중 (Docker 또는 로컬)
- [ ] `.env` 파일 생성 및 설정
- [ ] 의존성 설치 완료 (`pnpm install`)
- [ ] Prisma 마이그레이션 완료 (`pnpm prisma:migrate`)
- [ ] 시드 데이터 생성 (선택사항, `pnpm prisma:seed`)
- [ ] 개발 서버 실행 성공 (`pnpm dev`)
- [ ] 헬스 체크 API 응답 확인 (`curl http://localhost:8080/health`)

모든 체크리스트를 완료하면 백엔드 API 서버가 정상적으로 실행됩니다!

---

**마지막 업데이트**: 2026-02-15
