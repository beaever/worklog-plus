# 미들웨어 (Middleware) 모듈

Express 미들웨어 함수들을 제공합니다.

## 📁 파일 구조

```
middleware/
├── auth.ts       # JWT 인증 및 권한 검증
├── error.ts      # 에러 처리
├── validate.ts   # 요청 데이터 검증
├── logger.ts     # HTTP 요청 로깅
└── README.md     # 이 파일
```

## 🔐 auth.ts - 인증 및 권한

### 주요 미들웨어

#### 1. authenticate
JWT 토큰을 검증하고 사용자 정보를 추출합니다.

```typescript
import { authenticate, AuthRequest } from './middleware/auth';

router.get('/profile', authenticate, (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  // ...
});
```

#### 2. authorize
역할 기반 권한을 검증합니다.

```typescript
import { authenticate, authorize } from './middleware/auth';

// 관리자만 접근 가능
router.delete('/users/:id', 
  authenticate, 
  authorize('ADMIN', 'SYSTEM_ADMIN'), 
  deleteUser
);

// 매니저 이상만 접근 가능
router.post('/projects', 
  authenticate, 
  authorize('MANAGER', 'ADMIN', 'SYSTEM_ADMIN'), 
  createProject
);
```

#### 3. optionalAuthenticate
토큰이 있으면 검증하고, 없어도 진행합니다.

```typescript
import { optionalAuthenticate } from './middleware/auth';

// 로그인 여부와 관계없이 접근 가능
router.get('/projects', optionalAuthenticate, getProjects);
```

#### 4. checkOwnership
본인 확인 (관리자는 모든 사용자 접근 가능)

```typescript
import { authenticate, checkOwnership } from './middleware/auth';

// 본인의 프로필만 수정 가능
router.patch('/users/:userId', authenticate, checkOwnership, updateUser);
```

### 사용 예시

```typescript
// 인증 필요
router.get('/me', authenticate, getMe);

// 인증 + 역할 확인
router.post('/admin/users', authenticate, authorize('ADMIN'), createUser);

// 인증 + 본인 확인
router.patch('/users/:userId', authenticate, checkOwnership, updateProfile);

// 선택적 인증
router.get('/public-data', optionalAuthenticate, getPublicData);
```

## ⚠️ error.ts - 에러 처리

### 주요 기능

#### 1. AppError
커스텀 에러 클래스

```typescript
import { AppError } from './middleware/error';

// 사용 예시
if (!user) {
  throw new AppError('사용자를 찾을 수 없습니다', 404);
}

if (user.status === 'SUSPENDED') {
  throw new AppError('정지된 계정입니다', 403);
}
```

#### 2. errorHandler
전역 에러 핸들러

```typescript
import { errorHandler } from './middleware/error';

// app.ts에서 마지막에 등록
app.use(errorHandler);
```

#### 3. notFoundHandler
404 에러 핸들러

```typescript
import { notFoundHandler, errorHandler } from './middleware/error';

// 모든 라우트 이후에 등록
app.use(notFoundHandler);
app.use(errorHandler);
```

#### 4. asyncHandler
비동기 핸들러 래퍼

```typescript
import { asyncHandler } from './middleware/error';

// try-catch 없이 사용
router.get('/users', asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ success: true, data: users });
}));
```

### 에러 처리 흐름

```typescript
// 1. 비즈니스 로직에서 에러 발생
router.post('/users', asyncHandler(async (req, res) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: req.body.email },
  });
  
  if (existingUser) {
    throw new AppError('이미 존재하는 이메일입니다', 409);
  }
  
  // ...
}));

// 2. asyncHandler가 에러를 catch하여 errorHandler로 전달
// 3. errorHandler가 적절한 응답 생성
// {
//   "success": false,
//   "error": "이미 존재하는 이메일입니다"
// }
```

## ✅ validate.ts - 요청 검증

### 주요 미들웨어

#### 1. validateBody
요청 본문 검증

```typescript
import { validateBody } from './middleware/validate';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

router.post('/users', validateBody(createUserSchema), createUser);
```

#### 2. validateQuery
쿼리 파라미터 검증

```typescript
import { validateQuery, commonSchemas } from './middleware/validate';

router.get('/users', validateQuery(commonSchemas.pagination), getUsers);
```

#### 3. validateParams
URL 파라미터 검증

```typescript
import { validateParams, commonSchemas } from './middleware/validate';
import { z } from 'zod';

const idSchema = z.object({
  id: commonSchemas.uuid,
});

router.get('/users/:id', validateParams(idSchema), getUser);
```

### 공통 스키마

```typescript
import { commonSchemas } from './middleware/validate';

// UUID
commonSchemas.uuid

// 이메일
commonSchemas.email

// 비밀번호 (최소 8자, 영문+숫자)
commonSchemas.password

// 페이지네이션
commonSchemas.pagination

// 날짜 (ISO 8601)
commonSchemas.dateString

// 날짜 (YYYY-MM-DD)
commonSchemas.date
```

### 사용 예시

```typescript
import { validateBody, validateQuery, validateParams, commonSchemas } from './middleware/validate';
import { z } from 'zod';

// 회원가입 검증
const registerSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
  name: z.string().min(1).max(100),
});

router.post('/auth/register', validateBody(registerSchema), register);

// 프로젝트 생성 검증
const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  startDate: commonSchemas.date,
  endDate: commonSchemas.date.optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'DONE']),
});

router.post('/projects', 
  authenticate, 
  validateBody(createProjectSchema), 
  createProject
);

// 페이지네이션 검증
router.get('/projects', 
  validateQuery(commonSchemas.pagination), 
  getProjects
);
```

## 📝 logger.ts - HTTP 로깅

### 주요 미들웨어

#### 1. requestLogger
모든 HTTP 요청 로깅

```typescript
import { requestLogger } from './middleware/logger';

// app.ts에서 등록
app.use(requestLogger);

// 로그 출력:
// [2026-02-15T06:24:00.000Z] INFO  GET /api/users 200 - 45ms
```

#### 2. requestBodyLogger
요청 본문 로깅 (개발 환경용)

```typescript
import { requestBodyLogger } from './middleware/logger';
import { env } from './config/env';

// 개발 환경에서만 사용
if (env.NODE_ENV === 'development') {
  app.use(requestBodyLogger);
}
```

## 🎯 미들웨어 적용 순서

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './config/cors';
import { requestLogger } from './middleware/logger';
import { authenticate, authorize } from './middleware/auth';
import { validateBody } from './middleware/validate';
import { errorHandler, notFoundHandler } from './middleware/error';

const app = express();

// 1. 보안 미들웨어
app.use(helmet());
app.use(cors(corsOptions));

// 2. 요청 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. 로깅
app.use(requestLogger);

// 4. 라우트
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, usersRoutes);
app.use('/api/admin', authenticate, authorize('ADMIN'), adminRoutes);

// 5. 404 핸들러
app.use(notFoundHandler);

// 6. 에러 핸들러 (마지막)
app.use(errorHandler);
```

## 📚 참고 자료

- [Express 미들웨어](https://expressjs.com/ko/guide/using-middleware.html)
- [Zod 검증 라이브러리](https://zod.dev/)
- [JWT 인증](https://jwt.io/)
