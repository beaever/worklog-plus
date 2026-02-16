# WorkLog+ API 서버 설정 가이드

백엔드 지식이 없는 개발자를 위한 완전한 단계별 가이드입니다.

## 🎓 백엔드 기초 개념 (꼭 읽어보세요!)

### 백엔드란?

**백엔드**는 사용자가 보지 못하는 서버 쪽 프로그램입니다.

- **프론트엔드** (웹/모바일 앱): 사용자가 보고 클릭하는 화면
- **백엔드** (API 서버): 데이터를 저장하고 처리하는 서버
- **데이터베이스**: 실제 데이터가 저장되는 곳

**예시**: 로그인 버튼을 클릭하면

1. 프론트엔드가 이메일/비밀번호를 백엔드로 전송
2. 백엔드가 데이터베이스에서 사용자 정보 확인
3. 백엔드가 "로그인 성공" 또는 "실패" 응답
4. 프론트엔드가 결과를 화면에 표시

### API란?

**API**(Application Programming Interface)는 프론트엔드와 백엔드가 대화하는 방법입니다.

**예시**:

- `POST /api/auth/login` - 로그인 요청
- `GET /api/projects` - 프로젝트 목록 조회
- `POST /api/worklogs` - 업무일지 생성

### 데이터베이스란?

**데이터베이스**는 데이터를 체계적으로 저장하는 프로그램입니다.

**왜 필요한가?**

- 서버를 껐다 켜도 데이터가 사라지지 않음
- 많은 데이터를 빠르게 검색 가능
- 여러 사용자가 동시에 접근 가능

**PostgreSQL**: 우리가 사용하는 데이터베이스 프로그램

- 무료이고 안정적
- 대부분의 회사에서 사용
- SQL 언어로 데이터 조작

### ORM(Prisma)이란?

**ORM**(Object-Relational Mapping)은 SQL을 몰라도 데이터베이스를 다룰 수 있게 해주는 도구입니다.

**SQL 없이** (Prisma 사용):

```typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});
```

**SQL 직접 작성** (복잡함):

```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

**왜 Prisma를 사용하는가?**

- TypeScript 타입 자동 생성
- SQL 문법 몰라도 됨
- 오타 방지 (자동완성)

### 인증(JWT)이란?

**인증**은 "당신이 누구인지" 확인하는 과정입니다.

**JWT**(JSON Web Token):

- 로그인 성공 시 서버가 발급하는 "출입증"
- 이후 모든 요청에 이 토큰을 첨부
- 서버가 토큰을 확인하여 사용자 식별

**예시**:

1. 로그인 → 서버가 JWT 발급
2. 프로젝트 조회 → JWT를 함께 전송
3. 서버가 JWT 확인 → "이 사람이 맞네" → 데이터 전송

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

## �️ 필수 도구 설치

### 1. Node.js (JavaScript 실행 환경)

**Node.js란?**

- JavaScript를 브라우저 밖에서도 실행할 수 있게 해주는 프로그램
- 백엔드 서버를 만들 때 필요

**설치 확인**:

```bash
node --version
# v20.0.0 이상이어야 함
```

**설치 방법** (없는 경우):

- https://nodejs.org 에서 LTS 버전 다운로드

### 2. pnpm (패키지 관리자)

**pnpm이란?**

- 다른 사람이 만든 코드(라이브러리)를 쉽게 설치하는 도구
- npm보다 빠르고 디스크 공간 절약

**설치 확인**:

```bash
pnpm --version
# 9.0.0 이상이어야 함
```

**설치 방법** (없는 경우):

```bash
npm install -g pnpm
```

### 3. PostgreSQL (데이터베이스)

**PostgreSQL이란?**

- 데이터를 저장하고 관리하는 프로그램
- 사용자 정보, 프로젝트, 업무일지 등을 저장

**설치 방법 2가지**:

#### 방법 1: Docker 사용 (권장, 쉬움)

**Docker란?**

- 프로그램을 "컨테이너"라는 격리된 환경에서 실행
- 설치/삭제가 쉽고 깔끔함

**Docker 설치**:

- https://www.docker.com/products/docker-desktop 다운로드

**PostgreSQL 실행**:

```bash
docker run --name worklog-postgres \
  -e POSTGRES_USER=worklog \
  -e POSTGRES_PASSWORD=worklog123 \
  -e POSTGRES_DB=worklog_plus \
  -p 5432:5432 \
  -d postgres:16
```

**설명**:

- `--name worklog-postgres`: 컨테이너 이름
- `-e POSTGRES_USER=worklog`: 사용자 이름
- `-e POSTGRES_PASSWORD=worklog123`: 비밀번호
- `-e POSTGRES_DB=worklog_plus`: 데이터베이스 이름
- `-p 5432:5432`: 포트 번호 (PostgreSQL 기본 포트)
- `-d`: 백그라운드 실행
- `postgres:16`: PostgreSQL 16 버전 이미지

**실행 확인**:

```bash
docker ps
# worklog-postgres가 보이면 성공
```

#### 방법 2: 로컬 설치 (복잡함)

- Mac: `brew install postgresql@16`
- Windows: https://www.postgresql.org/download/windows/
- Linux: `sudo apt install postgresql-16`

## 🚀 빠른 시작

### 1단계: 프로젝트 폴더로 이동

```bash
cd apps/api
```

**왜?** 백엔드 서버 코드가 있는 폴더로 이동해야 합니다.

### 2단계: 의존성 설치

```bash
pnpm install
```

**무엇을 하는가?**

- `package.json`에 나열된 모든 라이브러리를 다운로드
- Express, Prisma, bcrypt 등 필요한 코드를 설치

**왜 필요한가?**

- 우리가 직접 만들지 않은 기능들을 사용하기 위해
- 예: bcrypt는 비밀번호를 안전하게 암호화

**성공 확인**:

- `node_modules` 폴더가 생성됨
- 에러 없이 완료

**실패 시**:

```bash
# 캐시 삭제 후 재시도
pnpm store prune
pnpm install
```

### 3단계: 환경 변수 설정

**환경 변수란?**

- 비밀번호, API 키 등 민감한 정보를 저장하는 파일
- `.env` 파일에 저장 (Git에 올리지 않음)
- 개발/프로덕션 환경마다 다른 값 사용 가능

**파일 생성**:

```bash
cp .env.example .env
```

**왜 .env.example을 복사하는가?**

- `.env.example`: 어떤 변수가 필요한지 보여주는 템플릿
- `.env`: 실제 값을 입력하는 파일 (Git에 올리지 않음)

**`.env` 파일 열고 수정**:

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
