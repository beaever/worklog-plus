# WorkLog+

> 업무 일지 관리 서비스 - pnpm + Turborepo 기반 모노레포

[![Chromatic](https://github.com/beaever/worklog-plus/actions/workflows/chromatic.yml/badge.svg)](https://github.com/beaever/worklog-plus/actions/workflows/chromatic.yml)

## 📋 프로젝트 소개

WorkLog+는 개발자와 팀을 위한 업무 일지 관리 서비스입니다. 프로젝트별 업무 기록, 대시보드 통계, 관리자 기능 등을 제공합니다.

### 주요 기능

- **프로젝트 관리**: 프로젝트 생성, 수정, 삭제 및 상태 관리
- **업무일지 작성**: 마크다운 지원, 프로젝트별 업무 기록
- **대시보드**: 주간/월별 활동 통계, 프로젝트 분포 차트
- **설정**: 프로필 수정, 비밀번호 변경, 테마 설정 (라이트/다크)
- **관리자**: 사용자 관리, 역할 관리, 감사 로그

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Data Fetching**: TanStack Query v5
- **Form**: React Hook Form + Zod
- **Toast**: Sonner
- **Theme**: next-themes

### Backend

- **Runtime**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (Access + Refresh Token)

### Mobile

- **Framework**: React Native + Expo
- **Approach**: WebView 래핑

### DevOps

- **Monorepo**: pnpm + Turborepo
- **CI/CD**: GitHub Actions
- **Storybook**: Chromatic

## 📁 프로젝트 구조

```
worklog-plus/
├── apps/
│   ├── web/              # Next.js 웹 서비스
│   ├── mobile/           # React Native 모바일 앱
│   ├── backend/          # Express API 서버
│   └── storybook/        # Storybook 문서화
│
├── packages/
│   ├── ui/               # 공용 UI 컴포넌트 (shadcn/ui)
│   ├── components/       # 도메인 컴포넌트
│   ├── hooks/            # 공용 커스텀 훅
│   ├── api/              # API 클라이언트
│   ├── store/            # Zustand 상태 관리
│   ├── types/            # 공용 타입 + Zod 스키마
│   └── config/           # ESLint, TypeScript 설정
│
├── docs/                 # 문서
├── .github/workflows/    # CI/CD 워크플로우
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 시작하기

### 요구사항

- Node.js >= 20
- pnpm >= 9
- PostgreSQL (백엔드 실행 시)

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

### 개발 서버 실행

```bash
# 전체 개발 서버 실행
pnpm dev

# Web만 실행
pnpm dev:web

# Mobile만 실행
pnpm dev:mobile

# Storybook 실행
pnpm storybook
```

### 빌드

```bash
# 전체 빌드
pnpm build

# Web만 빌드
pnpm build:web
```

## 📦 패키지 설명

| 패키지                | 설명                                    |
| --------------------- | --------------------------------------- |
| `apps/web`            | Next.js 15 웹 서비스 (App Router, SSR)  |
| `apps/mobile`         | React Native + Expo 모바일 앱 (WebView) |
| `apps/backend`        | Express API 서버 (Prisma, JWT)          |
| `apps/storybook`      | UI 컴포넌트 문서화                      |
| `packages/ui`         | shadcn/ui 기반 공용 UI 컴포넌트         |
| `packages/components` | 프로젝트, 업무일지 등 도메인 컴포넌트   |
| `packages/api`        | 타입 안전한 API 클라이언트              |
| `packages/store`      | Zustand 전역 상태 관리                  |
| `packages/types`      | 공용 타입 정의 + Zod 스키마             |
| `packages/hooks`      | 공용 커스텀 훅                          |
| `packages/config`     | ESLint, TypeScript 공유 설정            |

## 📜 스크립트

| 명령어            | 설명                    |
| ----------------- | ----------------------- |
| `pnpm dev`        | 전체 개발 서버 실행     |
| `pnpm dev:web`    | Web 개발 서버만 실행    |
| `pnpm dev:mobile` | Mobile 개발 서버만 실행 |
| `pnpm build`      | 프로덕션 빌드           |
| `pnpm typecheck`  | TypeScript 타입 검사    |
| `pnpm lint`       | ESLint 검사             |
| `pnpm format`     | Prettier 포맷팅         |
| `pnpm storybook`  | Storybook 실행          |
| `pnpm clean`      | 빌드 결과물 삭제        |

## 🔧 환경 변수

### apps/web (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### apps/mobile (.env)

```env
EXPO_PUBLIC_WEB_URL=http://localhost:3000
EXPO_PUBLIC_PRODUCTION_URL=https://your-production-url.com
```

### apps/backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/worklog
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

## 🔗 의존성 규칙

```
apps → packages ✅
packages → packages (단방향) ✅
packages 간 순환 의존 ❌

ui, api, store, components → types ✅
hooks → 독립적 (의존성 없음)
```

## 📄 라이선스

Private
