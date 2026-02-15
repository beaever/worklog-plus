# 유틸리티 (Utils) 모듈

공통으로 사용되는 유틸리티 함수들을 제공합니다.

## 📁 파일 구조

```
utils/
├── jwt.ts          # JWT 토큰 생성 및 검증
├── password.ts     # 비밀번호 해싱 및 검증
├── pagination.ts   # 페이지네이션 헬퍼
├── logger.ts       # 로깅 유틸리티
└── README.md       # 이 파일
```

## 🔐 jwt.ts - JWT 토큰 관리

### 주요 기능

- Access Token 생성 (15분 유효)
- Refresh Token 생성 (7일 유효)
- 토큰 검증 및 디코딩

### 사용 예시

```typescript
import { generateAccessToken, verifyAccessToken } from './utils/jwt';

// 토큰 생성
const accessToken = generateAccessToken(user.id, user.email, user.role);
const refreshToken = generateRefreshToken(user.id);

// 토큰 검증
try {
  const payload = verifyAccessToken(token);
  console.log(payload.userId, payload.email, payload.role);
} catch (error) {
  console.error('Invalid token');
}
```

## 🔒 password.ts - 비밀번호 보안

### 주요 기능

- bcrypt를 사용한 안전한 해싱
- 비밀번호 검증
- 비밀번호 강도 검사
- 임시 비밀번호 생성

### 사용 예시

```typescript
import { hashPassword, comparePassword, validatePasswordStrength } from './utils/password';

// 회원가입 시 비밀번호 해싱
const hashedPassword = await hashPassword('userPassword123');
await prisma.user.create({
  data: {
    email: 'user@example.com',
    passwordHash: hashedPassword,
  },
});

// 로그인 시 비밀번호 검증
const user = await prisma.user.findUnique({ where: { email } });
const isValid = await comparePassword(inputPassword, user.passwordHash);

if (isValid) {
  // 로그인 성공
} else {
  // 비밀번호 불일치
}

// 비밀번호 강도 검사
const validation = validatePasswordStrength('weak');
if (!validation.isValid) {
  console.log(validation.message);
}
```

## 📄 pagination.ts - 페이지네이션

### 주요 기능

- 페이지네이션 파라미터 계산
- Prisma skip/take 값 생성
- 메타데이터 생성
- 표준 응답 형식

### 사용 예시

```typescript
import {
  getPaginationParams,
  createPaginatedResponse,
  extractPaginationFromQuery,
} from './utils/pagination';

// 쿼리 파라미터에서 추출
const { page, limit } = extractPaginationFromQuery(req.query);

// Prisma 쿼리용 값 계산
const { skip, take } = getPaginationParams(page, limit);

// 데이터 조회
const users = await prisma.user.findMany({ skip, take });
const total = await prisma.user.count();

// 응답 생성
const response = createPaginatedResponse(users, total, page, limit);
res.json(response);

// 응답 형태:
// {
//   data: [...],
//   meta: {
//     total: 45,
//     page: 2,
//     limit: 10,
//     totalPages: 5,
//     hasNext: true,
//     hasPrev: false,
//   },
// }
```

## 📝 logger.ts - 로깅

### 주요 기능

- 레벨별 로깅 (error, warn, info, debug)
- 구조화된 로그 출력
- 개발/프로덕션 환경별 포맷
- HTTP 요청 로깅

### 사용 예시

```typescript
import * as logger from './utils/logger';

// 에러 로그
logger.error('데이터베이스 연결 실패', { error: err.message });

// 경고 로그
logger.warn('API 요청 속도 제한 임박', { userId, requestCount: 95 });

// 정보 로그
logger.info('사용자 로그인', { userId, email });

// 디버그 로그
logger.debug('쿼리 실행', { sql, params });

// HTTP 요청 로그
logger.http('GET', '/api/users', 200, 45);
```

### 로그 레벨 설정

`.env` 파일에서 로그 레벨을 설정할 수 있습니다:

```env
LOG_LEVEL="info"  # error, warn, info, debug 중 선택
```

- `error`: 에러만 출력
- `warn`: 경고 이상 출력
- `info`: 정보 이상 출력 (기본값)
- `debug`: 모든 로그 출력

## 🎯 사용 가이드

### 1. JWT 토큰 사용

**로그인 시**:
```typescript
const accessToken = generateAccessToken(user.id, user.email, user.role);
const refreshToken = generateRefreshToken(user.id);

// Refresh Token은 DB에 저장
await prisma.refreshToken.create({
  data: {
    userId: user.id,
    token: refreshToken,
    expiresAt: getTokenExpirationDate(env.JWT_REFRESH_EXPIRES_IN),
  },
});

res.json({ accessToken, refreshToken });
```

**API 요청 시**:
```typescript
const token = req.headers.authorization?.replace('Bearer ', '');
const payload = verifyAccessToken(token);
// payload.userId, payload.email, payload.role 사용
```

### 2. 비밀번호 처리

**회원가입**:
```typescript
// 1. 비밀번호 강도 검사
const validation = validatePasswordStrength(password);
if (!validation.isValid) {
  return res.status(400).json({ error: validation.message });
}

// 2. 해싱
const hashedPassword = await hashPassword(password);

// 3. 저장
await prisma.user.create({
  data: { email, passwordHash: hashedPassword, name },
});
```

**로그인**:
```typescript
const user = await prisma.user.findUnique({ where: { email } });
if (!user) {
  return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다' });
}

const isValid = await comparePassword(password, user.passwordHash);
if (!isValid) {
  return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다' });
}
```

### 3. 페이지네이션 구현

```typescript
// GET /api/users?page=2&limit=20
export const getUsers = async (req: Request, res: Response) => {
  // 1. 쿼리 파라미터 추출
  const { page, limit } = extractPaginationFromQuery(req.query);
  
  // 2. Prisma 쿼리용 값 계산
  const { skip, take } = getPaginationParams(page, limit);
  
  // 3. 데이터 조회
  const [users, total] = await Promise.all([
    prisma.user.findMany({ skip, take }),
    prisma.user.count(),
  ]);
  
  // 4. 응답 생성
  const response = createPaginatedResponse(users, total, page, limit);
  res.json(response);
};
```

### 4. 로깅 전략

**에러 로깅**:
```typescript
try {
  await someOperation();
} catch (error) {
  logger.error('작업 실패', {
    operation: 'someOperation',
    error: error.message,
    stack: error.stack,
  });
  throw error;
}
```

**정보 로깅**:
```typescript
logger.info('사용자 생성', {
  userId: user.id,
  email: user.email,
  role: user.role,
});
```

**디버그 로깅** (개발 환경):
```typescript
logger.debug('쿼리 실행', {
  model: 'User',
  operation: 'findMany',
  params: { skip, take },
});
```

## ⚠️ 주의사항

### JWT
- Access Token은 짧게 (15분), Refresh Token은 길게 (7일)
- 시크릿 키는 절대 노출하지 말 것
- 프로덕션에서는 강력한 시크릿 키 사용 (최소 32자)

### 비밀번호
- 절대 평문으로 저장하지 말 것
- bcrypt Salt Rounds는 10 권장 (보안과 성능의 균형)
- 비밀번호 검증 실패 시 구체적인 이유를 노출하지 말 것

### 페이지네이션
- 최대 limit은 100으로 제한 (DoS 공격 방지)
- 큰 데이터셋은 커서 기반 페이지네이션 고려

### 로깅
- 민감한 정보(비밀번호, 토큰)는 로그에 남기지 말 것
- 프로덕션에서는 로그 레벨을 'warn' 또는 'error'로 설정
- 로그는 외부 로깅 서비스로 전송 권장 (Sentry, DataDog 등)

## 📚 참고 자료

- [JWT 공식 문서](https://jwt.io/)
- [bcrypt 라이브러리](https://github.com/kelektiv/node.bcrypt.js)
- [Prisma 페이지네이션](https://www.prisma.io/docs/concepts/components/prisma-client/pagination)
