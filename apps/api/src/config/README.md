# 설정 (Config) 모듈

서버 실행에 필요한 환경 변수와 설정을 관리하는 모듈입니다.

## 📁 파일 구조

```
config/
├── env.ts      # 환경 변수 관리 및 검증
├── cors.ts     # CORS 설정
└── README.md   # 이 파일
```

## 🔧 env.ts - 환경 변수 관리

### 역할
- `.env` 파일에서 환경 변수를 로드합니다
- Zod를 사용하여 환경 변수를 검증합니다
- 타입 안전한 환경 변수 접근을 제공합니다

### 사용 방법

```typescript
import { env } from './config/env';

// 환경 변수 사용
console.log(env.PORT);           // '8080'
console.log(env.NODE_ENV);       // 'development'
console.log(env.DATABASE_URL);   // 'postgresql://...'
```

### 환경 변수 목록

| 변수명 | 필수 | 기본값 | 설명 |
|--------|------|--------|------|
| `DATABASE_URL` | ✅ | - | PostgreSQL 연결 URL |
| `JWT_ACCESS_SECRET` | ✅ | - | JWT Access Token 시크릿 (최소 32자) |
| `JWT_REFRESH_SECRET` | ✅ | - | JWT Refresh Token 시크릿 (최소 32자) |
| `JWT_ACCESS_EXPIRES_IN` | ❌ | `15m` | Access Token 만료 시간 |
| `JWT_REFRESH_EXPIRES_IN` | ❌ | `7d` | Refresh Token 만료 시간 |
| `PORT` | ❌ | `8080` | 서버 포트 |
| `NODE_ENV` | ❌ | `development` | 실행 환경 |
| `CORS_ORIGIN` | ❌ | `http://localhost:3000` | CORS 허용 도메인 |
| `LOG_LEVEL` | ❌ | `info` | 로그 레벨 |

### 검증 로직

환경 변수가 올바르지 않으면 서버 시작 시 에러가 발생합니다:

```
❌ 환경 변수 검증 실패:
  - JWT_ACCESS_SECRET: JWT Access Secret은 최소 32자 이상이어야 합니다
  - DATABASE_URL: 데이터베이스 URL이 필요합니다
```

## 🌐 cors.ts - CORS 설정

### 역할
- 프론트엔드에서 API 서버로의 요청을 허용합니다
- 개발/프로덕션 환경에 따라 다른 설정을 적용합니다
- 보안을 위해 허용된 도메인만 접근 가능하도록 제한합니다

### 허용된 Origin

**개발 환경**:
- `http://localhost:3000` (Next.js 웹)
- `http://localhost:8081` (Expo 모바일)
- 환경 변수에 설정된 도메인

**프로덕션 환경**:
- 환경 변수에 설정된 도메인만 허용

### CORS 옵션

```typescript
{
  origin: (origin, callback) => { /* 검증 로직 */ },
  credentials: true,                    // 쿠키 전송 허용
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', ...],
  maxAge: 86400                         // 24시간
}
```

### 사용 방법

```typescript
import { corsOptions } from './config/cors';
import cors from 'cors';

app.use(cors(corsOptions));
```

## 🚀 설정 파일 생성

### 1. .env 파일 생성

```bash
cd apps/api
cp .env.example .env
```

### 2. .env 파일 수정

```env
DATABASE_URL="postgresql://worklog:worklog123@localhost:5432/worklog_plus"
JWT_ACCESS_SECRET="your-super-secret-access-key-at-least-32-characters-long"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-at-least-32-characters-long"
PORT=8080
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

## ⚠️ 주의사항

### 보안
- **절대로** `.env` 파일을 Git에 커밋하지 마세요
- 프로덕션 환경에서는 반드시 강력한 시크릿 키를 사용하세요
- JWT 시크릿은 최소 32자 이상의 무작위 문자열을 사용하세요

### 시크릿 키 생성 방법

```bash
# Node.js로 무작위 문자열 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 환경별 설정

**개발 환경** (`.env`):
```env
NODE_ENV="development"
LOG_LEVEL="debug"
CORS_ORIGIN="http://localhost:3000"
```

**프로덕션 환경** (`.env.production`):
```env
NODE_ENV="production"
LOG_LEVEL="error"
CORS_ORIGIN="https://your-domain.com"
```

## 🔍 트러블슈팅

### 환경 변수 검증 실패
```
Error: 환경 변수 설정을 확인해주세요. .env.example 파일을 참고하세요.
```

**해결 방법**:
1. `.env` 파일이 존재하는지 확인
2. 필수 환경 변수가 모두 설정되어 있는지 확인
3. JWT 시크릿이 32자 이상인지 확인

### CORS 에러
```
⚠️  차단된 CORS 요청: http://localhost:3001
```

**해결 방법**:
1. `CORS_ORIGIN` 환경 변수에 프론트엔드 URL 추가
2. 개발 환경에서는 `cors.ts`의 `allowedOrigins` 배열에 추가

## 📚 관련 문서

- [Express 공식 문서](https://expressjs.com/)
- [CORS 미들웨어](https://github.com/expressjs/cors)
- [Zod 검증 라이브러리](https://zod.dev/)
