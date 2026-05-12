# WorkLog+ 개발 룰

## 언어 규칙
- 모든 응답과 코드 설명은 **한국어**로 작성
- 커밋 메시지는 **한국어**로 작성
- 코드 주석은 **한국어**로 작성 (단, JSDoc 파라미터/반환값 태그는 영어 허용)

---

## 아키텍처 규칙

### 계층 구조 (백엔드)
```
routes → middleware → controllers → services → prisma (DB)
```
- **routes**: 엔드포인트 등록 + 미들웨어 체인 조립만 담당
- **controllers**: HTTP 요청/응답 처리 + 서비스 호출. 비즈니스 로직 금지
- **services**: 비즈니스 로직 담당. DB 직접 접근은 Prisma 클라이언트를 통해서만
- **schemas**: Zod 스키마로 요청 유효성 검증. 컨트롤러에서 validate 후 넘김
- **middleware**: 인증, 권한, 에러 처리, 검증 미들웨어

### 모노레포 구조
- `apps/backend`: Express API 서버
- `apps/web`: Next.js 15 App Router
- `apps/mobile`: React Native + Expo
- `packages/`: 공용 타입, API 클라이언트, UI 컴포넌트, 상태 관리, 훅

### 패키지 임포트 규칙
- 공용 타입은 `@worklog-plus/types`에서 정의하고 공유
- 공용 API 함수는 `@worklog-plus/api`에서 정의
- 앱 간 코드 복사 금지 — 공용 패키지로 추출

---

## 코드 스타일 규칙

### TypeScript
- `strict: true` 필수. `any` 사용 금지 (불가피 시 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` + 이유 주석)
- `unknown` > `any`
- 함수 반환 타입 명시 권장 (특히 async 함수)
- `Omit`, `Pick`, `Partial` 활용하여 중복 타입 정의 방지
- enum 대신 `const` 객체 + `as const` 패턴 사용

### 네이밍
- 파일명: `kebab-case.ts`
- 클래스/인터페이스/타입: `PascalCase`
- 함수/변수: `camelCase`
- 상수: `UPPER_SNAKE_CASE`
- Prisma 모델: `PascalCase` (스키마 정의)
- DB 컬럼: `snake_case` (`@map` 사용)

### 주석
- WHY가 자명하면 주석 불필요
- 비자명한 제약조건, 버그 우회, 숨겨진 불변성에만 주석 작성
- 다중 줄 주석 블록 금지. 한 줄 이내로

---

## API 설계 규칙

### 엔드포인트 네이밍
```
GET    /api/projects           # 목록
POST   /api/projects           # 생성
GET    /api/projects/:id       # 단일 조회
PATCH  /api/projects/:id       # 부분 수정
DELETE /api/projects/:id       # 삭제
GET    /api/projects/:id/worklogs  # 중첩 리소스
```

### 응답 형식 (표준)
```typescript
// 성공
{ success: true, data: T }

// 성공 (목록 + 페이지네이션)
{ success: true, data: T[], meta: PaginationMeta }

// 에러
{ success: false, error: string, details?: unknown }
```
- 모든 API 응답은 위 형식을 반드시 따름
- HTTP 상태 코드: 200(조회/수정), 201(생성), 204(삭제), 400(유효성), 401(미인증), 403(권한), 404(없음), 409(충돌), 500(서버에러)

### 페이지네이션
- 목록 API는 항상 페이지네이션 지원
- 쿼리 파라미터: `?page=1&limit=10`
- `extractPaginationFromQuery` + `getPaginationParams` + `createPaginatedResponse` 사용

### 에러 처리
- 비즈니스 에러는 `AppError(statusCode, message)` 사용
- 컨트롤러에서 try-catch 후 `next(error)` 전달
- 또는 `asyncHandler` 래퍼 사용 (try-catch 생략 가능)

---

## 보안 규칙

### 인증/인가
- 모든 보호된 라우트에 `authenticate` 미들웨어 필수
- 역할 기반 접근: `authorize('ADMIN', 'MANAGER')` 미들웨어 사용
- 본인 확인: `checkOwnership` 미들웨어 사용
- 역할 계층: `USER < MANAGER < ADMIN < SYSTEM_ADMIN`

### 입력 검증
- 모든 요청 본문은 Zod 스키마로 검증 (`validate` 미들웨어 적용)
- 쿼리 파라미터도 Zod로 검증
- SQL injection: Prisma ORM 사용으로 자동 방지

### 민감 정보
- `passwordHash`는 API 응답에서 반드시 제거
- 응답에서 제외할 필드: `Omit<User, 'passwordHash'>` 타입 활용
- 로그에 비밀번호, 토큰 원문 기록 금지

---

## 데이터베이스 규칙

### Prisma 스키마
- 모든 테이블명: `@@map("snake_case")`
- 모든 컬럼명: `@map("snake_case")`
- `onDelete` 명시 필수 (기본값 의존 금지)
- nullable 필드만 `onDelete: SetNull` 허용
- NOT NULL 필드에 `onDelete: SetNull` 금지

### 트랜잭션
- 2개 이상의 DB 쓰기가 함께 성공/실패해야 하면 `prisma.$transaction()` 필수
- 토큰 갱신, 프로젝트+멤버 동시 생성 등이 해당

### 쿼리 최적화
- N+1 문제 방지: `include` 또는 `select` 명시
- 불필요한 필드 조회 금지: `select`로 필요한 필드만
- 목록 조회 시 `count`와 `findMany`는 `Promise.all`로 병렬 실행

---

## 테스트 규칙

### 작성 기준
- 새로 추가하는 서비스 함수마다 단위 테스트 필수
- API 통합 테스트: 주요 엔드포인트 (성공, 인증실패, 유효성실패 케이스)
- 테스트 파일 위치: `__tests__` 폴더 또는 `.test.ts` suffix

### 테스트 스타일
- Vitest 사용
- DB 테스트는 실제 테스트 DB 사용 (mock 금지)
- 테스트 간 독립성 보장: 각 테스트 전후 데이터 정리

---

## Git/커밋 규칙

### 커밋 메시지 형식
```
<타입>: <한국어 설명>

타입 목록:
- feat: 새 기능
- fix: 버그 수정
- refactor: 리팩토링 (기능 변경 없음)
- test: 테스트 추가/수정
- chore: 빌드, 설정 변경
- docs: 문서 수정
- style: 코드 포맷
```

### 브랜치 전략
- `main`: 프로덕션 브랜치
- `dev`: 개발 통합 브랜치
- 기능 브랜치: `feature/<기능명>`
- 버그 수정: `fix/<버그명>`

---

## 프론트엔드 규칙 (Next.js)

### 데이터 페칭
- 서버 컴포넌트: 직접 fetch 또는 서비스 함수 호출
- 클라이언트 컴포넌트: TanStack Query 사용
- `staleTime: 60_000` (1분) 기본값 유지

### 상태 관리
- 서버 상태: TanStack Query
- 클라이언트 전역 상태: Zustand
- 폼 상태: React Hook Form + Zod

### 컴포넌트
- 공용 컴포넌트: `packages/ui` 또는 `packages/components`에 정의
- 페이지 전용 컴포넌트: 해당 앱의 `components/` 폴더
- shadcn/ui 컴포넌트 우선 활용

### 인증 토큰
- Access Token: `httpOnly` 쿠키 저장 (XSS 방지)
- Refresh Token: `httpOnly`, `secure`, `sameSite=strict` 쿠키
- localStorage 토큰 저장 금지

---

## 작업 진행 룰 (하네스 엔지니어링)

1. **계획 먼저**: 복잡한 작업은 Plan 모드로 설계 후 승인받고 구현
2. **태스크 추적**: TaskCreate로 작업 등록 → 시작 시 `in_progress` → 완료 시 `completed`
3. **병렬 처리**: 의존성 없는 작업은 병렬 Agent로 동시 진행
4. **룰 준수 검증**: 각 작업 완료 전 위 룰과 대조 확인
5. **커밋 단위**: 기능 단위로 커밋. 하나의 커밋에 여러 기능 혼재 금지
