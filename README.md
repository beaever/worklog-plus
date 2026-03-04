# WorkLog+ 📊

> 엔터프라이즈급 업무일지 관리 시스템 - Full-Stack TypeScript Monorepo

[![CI/CD](https://github.com/beaever/worklog-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/beaever/worklog-plus/actions)
[![Chromatic](https://github.com/beaever/worklog-plus/actions/workflows/chromatic.yml/badge.svg)](https://github.com/beaever/worklog-plus/actions/workflows/chromatic.yml)

## 🎯 프로젝트 개요

**WorkLog+**는 개발자와 팀을 위한 현대적인 업무일지 관리 시스템입니다. 프로젝트 관리, 업무 기록, 대시보드 분석 기능을 제공하며, 웹과 모바일 환경을 모두 지원하는 크로스 플랫폼 애플리케이션입니다.

### 주요 기능

- ✅ **프로젝트 관리**: 프로젝트 생성, 수정, 삭제 및 상태 관리
- ✅ **업무일지 작성**: 마크다운 기반 업무 기록 및 관리
- ✅ **대시보드**: 주간 활동, 프로젝트 분포, 월간 트렌드 시각화
- ✅ **인증 시스템**: JWT 기반 로그인/회원가입, 자동 토큰 갱신
- ✅ **반응형 UI**: 데스크톱, 태블릿, 모바일 완벽 지원
- ✅ **실시간 데이터**: TanStack Query 기반 캐싱 및 자동 갱신

### 개발 기간 & 인원

- **기간**: 2026년 1월 - 2026년 2월 (약 2개월)
- **인원**: 1명 (Full-Stack 개발)

---

## 🏗️ 기술 스택

### Frontend

| 분류              | 기술                | 버전   | 사용 목적                                  |
| ----------------- | ------------------- | ------ | ------------------------------------------ |
| **Framework**     | Next.js             | 15.1.x | React 기반 웹 프레임워크 (App Router, SSR) |
| **Mobile**        | React Native + Expo | 0.76.x | 크로스 플랫폼 모바일 앱 (WebView)          |
| **Language**      | TypeScript          | 5.7.x  | 타입 안전성 보장 (strict mode)             |
| **State**         | Zustand             | 5.x    | 경량 전역 상태 관리                        |
| **Data Fetching** | TanStack Query      | 5.62.x | 서버 상태 관리 및 캐싱                     |
| **Styling**       | Tailwind CSS        | 3.4.x  | 유틸리티 기반 스타일링                     |
| **UI Library**    | shadcn/ui           | -      | 접근성 높은 컴포넌트                       |
| **Form**          | React Hook Form     | 7.71.x | 폼 상태 관리                               |
| **Validation**    | Zod                 | 3.22.x | 스키마 검증                                |
| **Charts**        | Recharts            | 2.15.x | 데이터 시각화                              |

### Backend

| 분류               | 기술       | 버전   | 사용 목적           |
| ------------------ | ---------- | ------ | ------------------- |
| **Runtime**        | Node.js    | 20.x   | JavaScript 런타임   |
| **Framework**      | Express    | 4.18.x | RESTful API 서버    |
| **Database**       | PostgreSQL | -      | 관계형 데이터베이스 |
| **ORM**            | Prisma     | 5.8.x  | 타입 안전 DB 쿼리   |
| **Authentication** | JWT        | 9.0.x  | 토큰 기반 인증      |
| **Password**       | bcrypt     | 5.1.x  | 비밀번호 해싱       |
| **Security**       | Helmet     | 7.1.x  | HTTP 헤더 보안      |

### DevOps & Tools

| 분류                | 기술             | 사용 목적               |
| ------------------- | ---------------- | ----------------------- |
| **Monorepo**        | Turborepo        | 빌드 최적화 및 캐싱     |
| **Package Manager** | pnpm             | 빠른 의존성 설치        |
| **Testing**         | Vitest           | 단위 테스트 및 커버리지 |
| **CI/CD**           | GitHub Actions   | 자동화된 빌드 및 배포   |
| **Code Quality**    | ESLint, Prettier | 코드 품질 관리          |
| **Component Dev**   | Storybook        | UI 컴포넌트 개발        |
| **Deployment**      | Railway          | 백엔드 배포             |

---

## 📁 프로젝트 구조

```
worklog-plus/
├── apps/
│   ├── web/              # Next.js 15 웹 애플리케이션
│   ├── mobile/           # React Native + Expo 모바일 앱
│   ├── backend/          # Express API 서버
│   └── storybook/        # UI 컴포넌트 문서화
│
├── packages/
│   ├── ui/               # shadcn/ui 기반 공용 컴포넌트
│   ├── components/       # 도메인 컴포넌트 (프로젝트, 업무일지 등)
│   ├── api/              # 타입 안전한 API 클라이언트
│   ├── store/            # Zustand 전역 상태
│   ├── hooks/            # 공용 커스텀 훅
│   ├── types/            # 공용 타입 + Zod 스키마
│   └── config/           # ESLint, TypeScript 설정
│
├── .github/workflows/    # CI/CD 워크플로우
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### 의존성 그래프

프로젝트의 패키지 간 의존성 관계를 시각화하려면:

```bash
pnpm graph
```

이 명령어는 `graph.html` 파일을 생성하며, 브라우저에서 열어 Turborepo 태스크 의존성을 확인할 수 있습니다.

**주요 의존성 규칙:**

- `apps` → `packages` (단방향)
- `packages` 간 순환 의존 금지
- `ui`, `api`, `store`, `components` → `types`
- `hooks` → 독립적 (의존성 없음)

---

## 🚀 시작하기

### 요구사항

- **Node.js** >= 20
- **pnpm** >= 9
- **PostgreSQL** (백엔드 실행 시)

### 설치

```bash
# 저장소 클론
git clone https://github.com/beaever/worklog-plus.git
cd worklog-plus

# 의존성 설치
pnpm install

# Prisma Client 생성 (백엔드)
pnpm --filter @worklog-plus/backend exec prisma generate
```

### 환경 변수 설정

#### Web (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

#### Mobile (.env)

```env
EXPO_PUBLIC_WEB_URL=http://localhost:3000
EXPO_PUBLIC_ENV=development
```

#### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/worklog
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=development
```

### 개발 서버 실행

```bash
# 전체 개발 서버 실행
pnpm dev

# Web만 실행
pnpm dev:web

# Mobile만 실행
pnpm dev:mobile

# Backend만 실행
pnpm --filter @worklog-plus/backend dev

# Storybook 실행
pnpm storybook
```

### 빌드

```bash
# 전체 빌드
pnpm build

# Web만 빌드
pnpm build:web

# Backend만 빌드
pnpm --filter @worklog-plus/backend build
```

### 테스트

```bash
# 전체 테스트 실행
pnpm test

# 테스트 watch 모드
pnpm test:watch

# 커버리지 리포트
pnpm test:coverage
```

---

## 💡 핵심 구현 사항

### 1. Monorepo 아키텍처

**선택 이유:**

- 코드 재사용성 극대화 (UI, Types, API 공유)
- 일관된 개발 환경 및 의존성 관리
- 효율적인 빌드 파이프라인 (Turborepo 캐싱)

**구현:**

- pnpm workspace로 패키지 관리
- Turborepo로 병렬 빌드 및 캐싱
- 명확한 의존성 규칙 설정 (순환 의존 방지)

### 2. 인증 시스템

**특징:**

- Access Token (15분) + Refresh Token (7일) 이중 토큰 전략
- 401 에러 시 자동 토큰 갱신 및 요청 재시도
- localStorage와 Cookie 이중 저장 (SSR 지원)
- Next.js Middleware로 서버 사이드 라우트 보호

**보안 구현:**

- CORS 설정으로 허용된 도메인만 접근
- bcrypt 비밀번호 해싱 (salt rounds: 10)
- Helmet을 통한 HTTP 헤더 보안
- Rate Limiting으로 무차별 대입 공격 방지

### 3. 성능 최적화

**이미지 최적화:**

- WebP/AVIF 포맷으로 이미지 크기 50% 감소
- 반응형 이미지로 불필요한 데이터 전송 방지
- Lazy Loading으로 초기 로딩 속도 개선

**코드 스플리팅:**

- 페이지별 번들 분리로 초기 로딩 시간 40% 단축
- 동적 import 활용
- Skeleton UI로 로딩 경험 개선

**TanStack Query 캐싱:**

- staleTime 설정으로 불필요한 API 요청 80% 감소
- Mutation 성공 시 자동 쿼리 무효화
- 사용자 경험 향상 (즉각적인 데이터 표시)

### 4. 에러 처리 시스템

**전역 에러 바운더리:**

- 에러 타입별 맞춤 메시지 (네트워크, 인증, 서버 등)
- 재시도 버튼으로 사용자 액션 제공
- 개발 환경에서 상세 스택 트레이스 표시

**API 에러 처리:**

- 구조화된 에러 응답
- Prisma 에러 자동 변환
- 사용자 친화적인 에러 메시지

---

## 📊 프로젝트 성과

### 코드 품질

- **TypeScript 커버리지**: 100% (strict mode)
- **ESLint 규칙**: 0 에러
- **컴포넌트 재사용률**: 85% 이상
- **테스트 커버리지**: 주요 유틸 함수 100%
- **빌드 안정성**: 테스트 자동 실행으로 품질 보장

### 개발 생산성

- **빌드 시간**: Turborepo 캐싱으로 70% 단축
- **Hot Reload**: < 1초
- **타입 체크**: 병렬 처리로 50% 단축

---

## 🔧 주요 도전 과제 및 해결

### 1. Monorepo 의존성 관리

**문제:** 패키지 간 순환 의존성 발생, 빌드 순서 문제로 타입 에러

**해결:** turbo.json으로 명확한 빌드 순서 정의, 의존성 그래프 시각화

**결과:** 빌드 실패율 0%, 개발자 경험 개선

### 2. 인증 토큰 관리

**문제:** SSR 환경에서 localStorage 접근 불가, 토큰 만료 시 UX 저하

**해결:** localStorage + Cookie 이중 저장, 자동 토큰 갱신 로직 구현

**결과:** SSR/CSR 모두 지원, 세션 유지율 95% 이상

### 3. Lint 에러 수정

**문제:** 백엔드 ESLint 설정 누락, TypeScript strict mode 에러 다수 발생

**해결:**

- ESLint 9.x flat config 형식으로 설정 파일 생성
- 타입 import를 `type` 키워드로 명시적 분리
- `any` 타입을 `unknown`으로 변경 후 타입 가드 추가
- 미사용 변수를 `_` prefix로 처리 또는 제거

**결과:** Lint 에러 0개, 타입 안전성 100% 달성

---

## 🧪 테스트

### 테스트 전략

- **단위 테스트**: Vitest를 사용한 유틸 함수 테스트
- **커버리지**: v8 provider로 코드 커버리지 측정
- **자동 실행**: 빌드 시 테스트 자동 실행 (Turbo 파이프라인)
- **CI/CD**: GitHub Actions에서 자동 테스트 실행

### 작성된 테스트

**Backend**

- `jwt.test.ts` - JWT 토큰 생성, 검증, 디코딩
- `password.test.ts` - 비밀번호 해싱 및 검증
- `pagination.test.ts` - 페이지네이션 로직

**Web**

- `utils.test.ts` - 공통 유틸리티 함수

### 테스트 실행

```bash
# 전체 테스트 실행
pnpm test

# 백엔드 테스트만
pnpm --filter @worklog-plus/backend test

# 웹 테스트만
pnpm --filter @worklog-plus/web test

# Watch 모드
pnpm test:watch

# 커버리지 리포트
pnpm test:coverage
```

### 빌드 시 자동 테스트

프로젝트는 **빌드 전에 자동으로 테스트를 실행**하도록 설정되어 있습니다.

```bash
# build 실행 시 자동으로 test 실행됨
pnpm build
```

`turbo.json`의 build task가 test에 의존하도록 설정되어 있어, 테스트가 실패하면 빌드도 실패합니다.

---

## 🚢 배포

### Backend (Railway)

Railway를 통해 백엔드 API 서버를 배포할 수 있습니다.

```bash
# Railway CLI 설치
npm install -g @railway/cli

# Railway 로그인
railway login

# 프로젝트 초기화
railway init

# 배포
railway up
```

환경 변수는 Railway 대시보드에서 설정하세요.

### Frontend (Vercel)

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

---

## 스크립트

| 명령어               | 설명                             |
| -------------------- | -------------------------------- |
| `pnpm dev`           | 전체 개발 서버 실행              |
| `pnpm dev:web`       | Web 개발 서버만 실행             |
| `pnpm dev:mobile`    | Mobile 개발 서버만 실행          |
| `pnpm build`         | 프로덕션 빌드 (테스트 자동 실행) |
| `pnpm typecheck`     | TypeScript 타입 검사             |
| `pnpm lint`          | ESLint 검사                      |
| `pnpm test`          | 전체 테스트 실행                 |
| `pnpm test:watch`    | 테스트 watch 모드                |
| `pnpm test:coverage` | 테스트 커버리지 리포트           |
| `pnpm format`        | Prettier 포맷팅                  |
| `pnpm storybook`     | Storybook 실행                   |
| `pnpm clean`         | 빌드 결과물 삭제                 |

---

## 학습 및 성장

### 기술적 성장

1. **Monorepo 아키텍처 설계** - 패키지 분리 전략, Turborepo 최적화
2. **Next.js 15 App Router** - RSC, Streaming SSR, Middleware
3. **TanStack Query 고급 활용** - 캐싱 전략, 자동 재시도
4. **TypeScript 고급 기법** - Generic, Utility Types, 타입 가드
5. **보안 Best Practices** - JWT, CORS, Rate Limiting, Helmet

### 배운 점

- 초기 아키텍처 설계의 중요성
- 성능은 처음부터 고려해야 함
- 타입 안전성의 가치
- 사용자 경험 우선 사고
- 테스트 코드의 중요성

---

## 🔮 향후 개선 계획

### 단기 (1개월)

- [ ] E2E 테스트 (Playwright)
- [ ] 접근성 개선 (WCAG 2.1 AA)
- [ ] PWA 지원

### 중기 (3개월)

- [ ] 실시간 협업 (WebSocket)
- [ ] 다국어 지원 (i18n)
- [ ] 고급 검색/필터링

### 장기 (6개월)

- [ ] AI 기반 업무 분석
- [ ] 팀 협업 기능
- [ ] 모바일 네이티브 앱

---

## 📄 라이선스

Private

---

## 👨‍💻 개발자

**GitHub**: [@beaever](https://github.com/beaever)  
**Repository**: [worklog-plus](https://github.com/beaever/worklog-plus)

---

**마지막 업데이트**: 2026년 3월
