# WorkLog+ 백엔드 개발 로그

> **작성일**: 2026년 2월 16일  
> **작성자**: Cascade AI + thebeaever  
> **목적**: 백엔드 개발 과정에서의 의사결정, 문제 해결, 고려사항 기록

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [개발 환경 설정](#개발-환경-설정)
3. [아키텍처 설계](#아키텍처-설계)
4. [발생한 문제와 해결 방법](#발생한-문제와-해결-방법)
5. [개발 시 고려사항](#개발-시-고려사항)
6. [다음 단계](#다음-단계)

---

## 프로젝트 개요

### 목표
업무일지 관리 시스템의 백엔드 API 서버 구축

### 기술 스택
- **런타임**: Node.js 20+
- **프레임워크**: Express.js
- **언어**: TypeScript (strict mode)
- **데이터베이스**: PostgreSQL 16
- **ORM**: Prisma
- **인증**: JWT (Access Token + Refresh Token)
- **검증**: Zod
- **로깅**: Winston
- **컨테이너**: Docker

### 주요 기능
- 사용자 인증 및 권한 관리
- 프로젝트 CRUD
- 업무일지 CRUD
- 대시보드 통계
- 활동 로그 추적
- 감사 로그

---

## 개발 환경 설정

### 1. 패키지 이름 충돌 해결

#### 문제 상황
```bash
pnpm install 실행 시 에러 발생
원인: apps/api와 packages/api의 패키지 이름이 모두 @worklog-plus/api로 중복
```

#### 해결 방법
**왜 이렇게 해결했는가?**
- 모노레포에서는 각 패키지가 고유한 이름을 가져야 함
- 백엔드와 프론트엔드 API 클라이언트는 명확히 구분되어야 함
- 의미적으로도 backend와 api(클라이언트)는 다른 역할

**적용한 해결책**
```json
// apps/api/package.json (변경 전)
{
  "name": "@worklog-plus/api"
}

// apps/backend/package.json (변경 후)
{
  "name": "@worklog-plus/backend"
}
```

**디렉토리 이름도 변경**
- `apps/api` → `apps/backend`
- 일관성 유지: 패키지 이름과 디렉토리 이름 일치

### 2. TypeScript 설정 오류 해결

#### 문제 1: extends 경로 오류
```typescript
// tsconfig.json (변경 전)
{
  "extends": "../../packages/config/typescript/base.json"
}
```

**문제점**: 상대 경로는 모노레포 구조 변경 시 깨지기 쉬움

**해결책**
```typescript
// tsconfig.json (변경 후)
{
  "extends": "@worklog-plus/config/typescript/base.json"
}
```

**왜 이렇게?**
- 패키지 이름으로 참조하면 경로 변경에 강건함
- pnpm workspace가 자동으로 해결
- 다른 패키지에서도 동일한 패턴 사용 가능

#### 문제 2: Prisma rootDir 충돌
```
error TS6059: File 'prisma/seed.ts' is not under 'rootDir' 'src'
```

**원인 분석**
- TypeScript는 기본적으로 `src/` 디렉토리만 컴파일 대상으로 인식
- `prisma/seed.ts`는 `src/` 외부에 위치
- `include`에 `prisma/**/*`를 추가하면 rootDir 충돌 발생

**해결 방법**
```json
// tsconfig.json
{
  "include": ["src/**/*"], // prisma 제거
  "exclude": ["node_modules", "dist", "prisma"]
}
```

**왜 이렇게?**
- Prisma seed는 별도로 `tsx`로 실행되므로 TypeScript 컴파일 대상에서 제외해도 무방
- rootDir를 `src/`로 명확히 유지하여 빌드 산출물 구조 일관성 유지

### 3. TypeScript 타입 에러 수정

#### 문제 1: 사용하지 않는 파라미터 경고
```typescript
// 에러 발생 코드
app.get('/health', (req: Request, res: Response) => {
  // req를 사용하지 않음
});
```

**해결책**
```typescript
app.get('/health', (_req: Request, res: Response) => {
  // 언더스코어로 "의도적으로 사용하지 않음"을 표시
});
```

**왜 이렇게?**
- TypeScript strict mode에서는 사용하지 않는 변수를 에러로 처리
- 언더스코어 접두사는 "의도적으로 사용하지 않음"을 명시하는 관례
- Express 미들웨어 시그니처를 유지하면서 경고 제거

#### 문제 2: Prisma 에러 타입 처리
```typescript
// 초기 코드 (에러 발생)
import { Prisma } from '@prisma/client';

if (error instanceof Prisma.PrismaClientKnownRequestError) {
  // PrismaClientKnownRequestError가 타입으로 존재하지 않음
}
```

**문제 분석**
- `@prisma/client`에서 export하는 `Prisma` 네임스페이스에는 에러 클래스가 포함되지 않음
- Prisma 에러는 런타임에만 존재하는 클래스

**해결책**
```typescript
// 에러 코드와 이름으로 판별
if (error.code && typeof error.code === 'string' && error.code.startsWith('P')) {
  // Prisma 에러 처리
}

if (error.name === 'PrismaClientValidationError') {
  // Validation 에러 처리
}
```

**왜 이렇게?**
- Prisma 에러는 `instanceof` 체크가 불가능
- 에러 코드(`P2002`, `P2025` 등)는 Prisma 공식 문서에 명시된 안정적인 식별자
- 타입 안전성을 유지하면서 런타임 에러 처리 가능

#### 문제 3: JWT 타입 에러
```typescript
// 에러 발생 코드
jwt.sign(payload, secret, {
  expiresIn: '15m',
  issuer: 'worklog-plus'
});
// Type error: expiresIn does not exist in type SignCallback
```

**원인**
- `jsonwebtoken` 라이브러리의 타입 정의가 오버로드되어 있음
- TypeScript가 잘못된 오버로드를 선택

**해결책**
```typescript
jwt.sign(
  payload,
  secret,
  {
    expiresIn: '15m',
    issuer: 'worklog-plus',
    subject: userId,
  } as jwt.SignOptions,
);
```

**왜 이렇게?**
- 타입 단언(`as jwt.SignOptions`)으로 올바른 타입 명시
- 런타임 동작은 동일하지만 TypeScript 컴파일러에게 정확한 타입 정보 제공

### 4. Docker 환경 설정

#### 문제: Docker 명령어 인식 불가
```bash
$ docker --version
zsh: command not found: docker
```

**원인 분석**
- Docker Desktop은 설치되어 있으나 PATH에 등록되지 않음
- macOS에서 Docker Desktop 설치 시 자동으로 PATH가 설정되지 않는 경우 발생

**해결 과정**

1. **Docker 실행 파일 위치 확인**
```bash
$ ls -la /Applications/Docker.app/Contents/Resources/bin/docker
-rwxr-xr-x@ 1 thebeaever admin 40374176 2 10 20:25 docker
```

2. **PATH에 추가**
```bash
echo 'export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

3. **확인**
```bash
$ docker --version
Docker version 29.2.0, build 0b9d198
```

**왜 이렇게?**
- 심볼릭 링크 생성은 sudo 권한 필요 (보안상 권장하지 않음)
- PATH 추가는 사용자 권한으로 가능하며 더 안전
- `.zshrc`에 추가하여 영구적으로 적용

### 5. PostgreSQL 컨테이너 실행

```bash
docker run --name worklog-postgres \
  -e POSTGRES_USER=worklog \
  -e POSTGRES_PASSWORD=worklog123 \
  -e POSTGRES_DB=worklog_plus \
  -p 5432:5432 \
  -d postgres:16
```

**각 옵션 설명**
- `--name worklog-postgres`: 컨테이너 이름 지정 (관리 용이)
- `-e POSTGRES_USER=worklog`: PostgreSQL 사용자명
- `-e POSTGRES_PASSWORD=worklog123`: 비밀번호 (개발 환경용)
- `-e POSTGRES_DB=worklog_plus`: 초기 데이터베이스 이름
- `-p 5432:5432`: 포트 매핑 (호스트:컨테이너)
- `-d`: 백그라운드 실행
- `postgres:16`: PostgreSQL 16 버전 이미지

**왜 Docker를 사용하는가?**
- 로컬 환경 오염 방지
- 팀원 간 동일한 환경 보장
- 쉬운 초기화 및 재시작
- 프로덕션 환경과 유사한 설정

---

## 아키텍처 설계

### 1. 디렉토리 구조

```
apps/backend/
├── prisma/
│   ├── schema.prisma      # 데이터베이스 스키마
│   ├── seed.ts            # 시드 데이터
│   └── migrations/        # 마이그레이션 파일
├── src/
│   ├── config/            # 환경 설정
│   │   ├── env.ts         # 환경 변수 (Zod 검증)
│   │   └── cors.ts        # CORS 설정
│   ├── middleware/        # Express 미들웨어
│   │   ├── auth.ts        # 인증/권한 미들웨어
│   │   ├── error.ts       # 에러 처리
│   │   ├── validate.ts    # 요청 검증
│   │   └── logger.ts      # HTTP 로깅
│   ├── utils/             # 유틸리티 함수
│   │   ├── jwt.ts         # JWT 토큰 관리
│   │   ├── password.ts    # 비밀번호 해싱
│   │   ├── pagination.ts  # 페이지네이션
│   │   └── logger.ts      # 구조화된 로깅
│   ├── routes/            # API 라우트 (TODO)
│   ├── controllers/       # 컨트롤러 (TODO)
│   ├── services/          # 비즈니스 로직 (TODO)
│   ├── app.ts             # Express 앱 설정
│   └── index.ts           # 서버 진입점
├── .env                   # 환경 변수
├── .env.example           # 환경 변수 템플릿
├── package.json
└── tsconfig.json
```

**왜 이런 구조를?**

#### Layered Architecture (계층화 아키텍처)
```
Request → Routes → Controllers → Services → Database
                ↓
            Middleware
```

**각 계층의 역할**
1. **Routes**: URL 매핑, 미들웨어 적용
2. **Controllers**: 요청/응답 처리, 검증
3. **Services**: 비즈니스 로직, 트랜잭션
4. **Middleware**: 횡단 관심사 (인증, 로깅, 에러 처리)

**장점**
- 관심사의 분리 (Separation of Concerns)
- 테스트 용이성
- 코드 재사용성
- 유지보수성

### 2. 데이터베이스 스키마 설계

#### 주요 테이블

```prisma
// 1. User - 사용자
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  name          String
  role          UserRole @default(USER)
  // ... 관계 필드
}

// 2. Project - 프로젝트
model Project {
  id          String        @id @default(uuid())
  name        String
  description String?
  status      ProjectStatus @default(PLANNED)
  startDate   DateTime
  endDate     DateTime?
  // ... 관계 필드
}

// 3. Worklog - 업무일지
model Worklog {
  id        String   @id @default(uuid())
  title     String
  content   String
  date      DateTime
  duration  Float?
  // ... 관계 필드
}

// 4. ProjectMember - 프로젝트 멤버
model ProjectMember {
  id         String           @id @default(uuid())
  permission MemberPermission @default(READ)
  // ... 관계 필드
}

// 5. RefreshToken - 리프레시 토큰
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  expiresAt DateTime
  // ... 관계 필드
}

// 6. ActivityLog - 활동 로그
model ActivityLog {
  id          String   @id @default(uuid())
  action      String
  description String?
  // ... 관계 필드
}

// 7. AuditLog - 감사 로그
model AuditLog {
  id        String   @id @default(uuid())
  action    String
  tableName String
  recordId  String?
  // ... 관계 필드
}
```

**설계 원칙**

1. **UUID 사용**
   - 왜? 분산 시스템에서 충돌 없이 ID 생성 가능
   - 보안: 순차적 ID보다 예측 불가능

2. **Soft Delete 미사용**
   - 현재는 Hard Delete 사용
   - 이유: 감사 로그로 삭제 이력 추적 가능
   - 향후 필요시 `deletedAt` 필드 추가 고려

3. **관계 설정**
   - `onDelete: Cascade`: 부모 삭제 시 자식도 삭제
   - `onDelete: Restrict`: 자식이 있으면 부모 삭제 불가
   - 예: Project 삭제 시 Worklog도 함께 삭제 (Cascade)

4. **인덱스 전략**
   - `@unique`: 이메일, 토큰 등
   - `@@index`: 자주 조회되는 필드 (userId, projectId, date)
   - 성능과 저장 공간의 트레이드오프 고려

### 3. 인증 시스템 설계

#### JWT 이중 토큰 전략

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. Login (email, password)
       ▼
┌─────────────┐
│   Server    │
└──────┬──────┘
       │ 2. Verify password
       │ 3. Generate Access Token (15분)
       │ 4. Generate Refresh Token (7일)
       │ 5. Store Refresh Token in DB
       ▼
┌─────────────┐
│   Client    │ Store tokens in localStorage
└──────┬──────┘
       │ 6. API Request with Access Token
       ▼
┌─────────────┐
│   Server    │ Verify Access Token
└─────────────┘
```

**왜 이중 토큰?**

1. **Access Token (단기)**
   - 만료: 15분
   - 용도: API 요청 인증
   - 저장: localStorage (또는 메모리)
   - 장점: 탈취되어도 피해 최소화

2. **Refresh Token (장기)**
   - 만료: 7일
   - 용도: Access Token 갱신
   - 저장: DB + localStorage
   - 장점: 로그아웃 시 무효화 가능

**보안 고려사항**

1. **비밀번호 해싱**
```typescript
// bcrypt 사용 (salt rounds: 10)
const hash = await bcrypt.hash(password, 10);
```
   - 왜 bcrypt? 느린 해싱 알고리즘 → 무차별 대입 공격 방어
   - Salt rounds 10: 보안과 성능의 균형

2. **토큰 저장**
   - Refresh Token은 DB에 저장하여 로그아웃 시 무효화
   - Access Token은 stateless (DB 조회 없이 검증)

3. **CORS 설정**
```typescript
const corsOptions = {
  origin: env.CORS_ORIGIN, // 허용된 도메인만
  credentials: true,        // 쿠키 전송 허용
};
```

### 4. 에러 처리 전략

#### 계층별 에러 처리

```typescript
// 1. 커스텀 에러 클래스
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
  }
}

// 2. 비즈니스 로직에서 발생
throw new AppError(404, '프로젝트를 찾을 수 없습니다');

// 3. 전역 에러 핸들러에서 처리
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }
  // ...
});
```

**에러 타입별 처리**

1. **AppError (커스텀 에러)**
   - 비즈니스 로직에서 의도적으로 발생
   - 상태 코드와 메시지 포함

2. **Prisma 에러**
   - P2002: Unique 제약 위반 → 409 Conflict
   - P2025: 레코드 없음 → 404 Not Found
   - P2003: Foreign key 위반 → 400 Bad Request

3. **Validation 에러 (Zod)**
   - 요청 데이터 검증 실패 → 400 Bad Request
   - 상세한 필드별 에러 메시지 제공

4. **기타 에러**
   - 예상치 못한 에러 → 500 Internal Server Error
   - 프로덕션에서는 상세 정보 숨김

**왜 이렇게?**
- 클라이언트에게 명확한 에러 정보 제공
- 보안: 프로덕션에서 민감한 정보 노출 방지
- 로깅: 모든 에러를 구조화된 형태로 기록

### 5. 로깅 시스템

#### Winston을 사용한 구조화된 로깅

```typescript
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

**로그 레벨**
- `error`: 에러 발생 시
- `warn`: 경고 (예: deprecated API 사용)
- `info`: 일반 정보 (서버 시작, API 요청)
- `debug`: 디버깅 정보 (개발 환경)

**왜 Winston?**
- 구조화된 로그 (JSON 형식)
- 다양한 전송 방식 (콘솔, 파일, 외부 서비스)
- 로그 레벨별 필터링
- 프로덕션 환경에서 로그 수집 용이

---

## 발생한 문제와 해결 방법

### 문제 1: 패키지 이름 충돌
**증상**: `pnpm install` 실패
**원인**: apps/api와 packages/api의 이름 중복
**해결**: apps/api → apps/backend로 변경
**교훈**: 모노레포에서는 패키지 이름 고유성 필수

### 문제 2: TypeScript rootDir 충돌
**증상**: `prisma/seed.ts`가 rootDir 외부에 있다는 에러
**원인**: include에 prisma 폴더 포함
**해결**: prisma를 exclude에 추가, tsx로 별도 실행
**교훈**: 빌드 대상과 실행 스크립트 분리

### 문제 3: Prisma 타입 에러
**증상**: `instanceof Prisma.PrismaClientKnownRequestError` 타입 에러
**원인**: Prisma 에러 클래스가 타입으로 export되지 않음
**해결**: 에러 코드와 이름으로 판별
**교훈**: 런타임 에러는 타입 체크가 어려울 수 있음

### 문제 4: JWT 타입 오버로드
**증상**: `jwt.sign()` 타입 에러
**원인**: TypeScript가 잘못된 오버로드 선택
**해결**: `as jwt.SignOptions` 타입 단언
**교훈**: 복잡한 오버로드는 명시적 타입 단언 필요

### 문제 5: Docker PATH 미설정
**증상**: `docker: command not found`
**원인**: Docker Desktop 설치 후 PATH 미등록
**해결**: ~/.zshrc에 PATH 추가
**교훈**: macOS에서 GUI 앱 설치 후 CLI 도구 PATH 확인 필요

---

## 개발 시 고려사항

### 1. 보안

#### 현재 적용된 보안 조치
- ✅ 비밀번호 bcrypt 해싱
- ✅ JWT 토큰 기반 인증
- ✅ CORS 설정
- ✅ 환경 변수로 시크릿 관리
- ✅ SQL Injection 방지 (Prisma ORM)
- ✅ 요청 검증 (Zod)

#### 추가 고려사항
- ⚠️ Rate Limiting (무차별 대입 공격 방지)
- ⚠️ HTTPS 적용 (프로덕션)
- ⚠️ Helmet.js (보안 헤더)
- ⚠️ 입력 sanitization (XSS 방지)
- ⚠️ CSRF 토큰 (프론트엔드 연동 시)

### 2. 성능

#### 데이터베이스 최적화
```typescript
// 1. 인덱스 활용
@@index([userId, date]) // 자주 조회되는 필드

// 2. N+1 쿼리 방지
include: {
  user: true,
  project: true,
} // Eager loading

// 3. 페이지네이션
skip: (page - 1) * limit,
take: limit,
```

#### 캐싱 전략 (향후 적용)
- Redis를 사용한 세션 캐싱
- 자주 조회되는 데이터 캐싱
- CDN 활용 (정적 파일)

### 3. 확장성

#### 현재 구조의 확장 가능성
- ✅ Layered Architecture → 마이크로서비스 전환 용이
- ✅ Prisma → 다른 데이터베이스로 전환 가능
- ✅ JWT → Stateless 인증으로 수평 확장 가능
- ✅ Docker → 컨테이너 오케스트레이션 (Kubernetes) 적용 가능

#### 향후 고려사항
- 메시지 큐 (RabbitMQ, Kafka) - 비동기 작업
- 로드 밸런서 - 트래픽 분산
- 데이터베이스 복제 - 읽기 성능 향상
- 모니터링 (Prometheus, Grafana)

### 4. 테스트

#### 테스트 전략 (향후 구현)
```typescript
// 1. 단위 테스트 (Jest)
describe('generateAccessToken', () => {
  it('should generate valid JWT token', () => {
    const token = generateAccessToken('user-id', 'email', 'USER');
    expect(token).toBeDefined();
  });
});

// 2. 통합 테스트 (Supertest)
describe('POST /api/auth/login', () => {
  it('should return tokens on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });
});

// 3. E2E 테스트 (Playwright)
```

### 5. 문서화

#### API 문서화 (향후 적용)
- Swagger/OpenAPI 스펙 생성
- Postman Collection
- 각 엔드포인트별 예제 요청/응답

#### 코드 문서화
- ✅ JSDoc으로 모든 함수/클래스 문서화
- ✅ README.md에 설정 가이드
- ✅ 이 문서 (DEVELOPMENT_LOG.md)

### 6. 환경 분리

```
Development (개발)
├── 로컬 PostgreSQL (Docker)
├── 상세한 로그
├── Hot reload
└── 시드 데이터

Staging (스테이징)
├── 프로덕션과 동일한 환경
├── 테스트 데이터
└── 성능 테스트

Production (프로덕션)
├── 관리형 데이터베이스 (AWS RDS, etc.)
├── 최소한의 로그
├── 모니터링
└── 백업 자동화
```

---

## 다음 단계

### 즉시 진행할 작업

#### 1. API 라우트 구현 (우선순위 높음)

**인증 라우트** (`/api/auth`)
- [ ] POST `/api/auth/register` - 회원가입
- [ ] POST `/api/auth/login` - 로그인
- [ ] POST `/api/auth/logout` - 로그아웃
- [ ] POST `/api/auth/refresh` - 토큰 갱신
- [ ] GET `/api/auth/me` - 현재 사용자 정보

**사용자 라우트** (`/api/users`)
- [ ] GET `/api/users/me` - 내 정보 조회
- [ ] PATCH `/api/users/me` - 내 정보 수정
- [ ] GET `/api/users/:id/profile` - 다른 사용자 프로필 조회

**프로젝트 라우트** (`/api/projects`)
- [ ] GET `/api/projects` - 프로젝트 목록 (페이지네이션, 필터링)
- [ ] GET `/api/projects/:id` - 프로젝트 상세
- [ ] POST `/api/projects` - 프로젝트 생성
- [ ] PATCH `/api/projects/:id` - 프로젝트 수정
- [ ] DELETE `/api/projects/:id` - 프로젝트 삭제
- [ ] GET `/api/projects/:id/dashboard` - 프로젝트 대시보드
- [ ] GET `/api/projects/:id/activities` - 프로젝트 활동 로그

**업무일지 라우트** (`/api/worklogs`)
- [ ] GET `/api/worklogs` - 업무일지 목록
- [ ] GET `/api/worklogs/:id` - 업무일지 상세
- [ ] POST `/api/worklogs` - 업무일지 생성
- [ ] PATCH `/api/worklogs/:id` - 업무일지 수정
- [ ] DELETE `/api/worklogs/:id` - 업무일지 삭제

#### 2. 각 라우트별 구현 순서

```
1. Zod 스키마 정의 (요청/응답 검증)
2. Service 계층 구현 (비즈니스 로직)
3. Controller 구현 (요청/응답 처리)
4. Route 등록 (미들웨어 적용)
5. 테스트 (Postman/curl)
```

#### 3. 추가 기능

- [ ] 파일 업로드 (프로필 이미지, 첨부파일)
- [ ] 이메일 발송 (비밀번호 재설정)
- [ ] 알림 시스템
- [ ] 검색 기능 (Elasticsearch)
- [ ] 통계 및 리포트

### 중장기 계획

#### Phase 1: 핵심 기능 완성 (1-2주)
- API 라우트 전체 구현
- 프론트엔드 연동
- 기본 테스트

#### Phase 2: 고도화 (2-3주)
- 파일 업로드
- 이메일 발송
- 알림 시스템
- 검색 기능

#### Phase 3: 최적화 및 배포 (1-2주)
- 성능 최적화
- 보안 강화
- 모니터링 설정
- CI/CD 구축
- 프로덕션 배포

---

## 참고 자료

### 공식 문서
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Zod](https://zod.dev/)
- [JWT](https://jwt.io/)

### 베스트 프랙티스
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [REST API Design](https://restfulapi.net/)

### 보안
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

---

## 변경 이력

| 날짜 | 작성자 | 내용 |
|------|--------|------|
| 2026-02-16 | Cascade AI | 초기 문서 작성 - 환경 설정, 아키텍처, 문제 해결 |

---

**이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.**
