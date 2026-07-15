# WorkLog+ 📊

> 개인의 업무일지가 그대로 팀의 진척 리포트가 되는 업무 기록 도구

[![CI/CD](https://github.com/beaever/worklog-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/beaever/worklog-plus/actions)
[![Chromatic](https://github.com/beaever/worklog-plus/actions/workflows/chromatic.yml/badge.svg)](https://github.com/beaever/worklog-plus/actions/workflows/chromatic.yml)

**데모**: https://worklog-plus.vercel.app/

## 🎯 프로젝트 개요

**WorkLog+**는 개발자와 팀을 위한 업무일지 관리 도구입니다. 프로젝트 관리, 업무 기록, 대시보드 분석을 제공하며 웹과 모바일을 함께 지원합니다.

이 저장소는 **Express + Prisma 3-tier 구조로 시작했다가 Supabase 기반으로 전면 이전하며 백엔드 서버를 제거한** 이력을 가지고 있습니다. 현재 백엔드는 Supabase(Postgres + Auth + RLS + RPC)이며, 별도의 API 서버는 존재하지 않습니다. 마이그레이션의 배경과 판단은 [핵심 설계 판단](#-핵심-설계-판단)에 정리했습니다.

### 주요 기능

- **프로젝트 관리**: 생성/수정/삭제, 인라인 상태 변경, 공수 기반 진행률 산정
- **업무일지 작성**: 마크다운 기반 기록 및 관리
- **대시보드**: 주간 활동, 프로젝트 분포, 월간 트렌드 시각화
- **인증**: Supabase Auth 기반 로그인/회원가입, 역할(role) 기반 권한
- **반응형 UI**: 데스크톱/태블릿/모바일 지원
- **서버 상태 관리**: TanStack Query 기반 캐싱 및 자동 갱신

### 개발 기간 & 인원

- **기간**: 2026년 2월 ~ 2026년 6월
- **인원**: 1명

---

## 🏗️ 기술 스택

### Web

| 분류              | 기술            | 버전   | 사용 목적                      |
| ----------------- | --------------- | ------ | ------------------------------ |
| **Framework**     | Next.js         | 15.1.x | App Router 기반 웹 프레임워크  |
| **Language**      | TypeScript      | 5.7.x  | 타입 안전성 보장 (strict mode) |
| **UI**            | React           | 19.x   | -                              |
| **State**         | Zustand         | 5.x    | 경량 전역 상태 관리            |
| **Data Fetching** | TanStack Query  | 5.62.x | 서버 상태 관리 및 캐싱         |
| **Styling**       | Tailwind CSS    | 3.4.x  | 유틸리티 기반 스타일링         |
| **UI Library**    | shadcn/ui       | -      | 접근성 높은 컴포넌트           |
| **Form**          | React Hook Form | 7.71.x | 폼 상태 관리                   |
| **Validation**    | Zod             | 3.22.x | 스키마 검증 (`packages/types`) |
| **Charts**        | Recharts        | 2.15.x | 데이터 시각화                  |
| **Markdown**      | react-markdown  | 10.x   | 업무일지 렌더링 (remark-gfm)   |
| **Toast**         | sonner          | 2.x    | 알림                           |
| **Theme**         | next-themes     | 0.4.x  | 다크 모드                      |

### Mobile

| 분류         | 기술         | 버전    | 사용 목적               |
| ------------ | ------------ | ------- | ----------------------- |
| **Runtime**  | Expo         | ~52.0.0 | 크로스 플랫폼 개발 환경 |
| **Platform** | React Native | 0.76.x  | WebView 기반 모바일 셸  |

### Backend (Supabase)

| 분류               | 기술                     | 사용 목적                     |
| ------------------ | ------------------------ | ----------------------------- |
| **Database**       | PostgreSQL (Supabase)    | 관계형 데이터베이스           |
| **Authentication** | Supabase Auth            | 인증 및 세션 관리             |
| **Authorization**  | Row Level Security (RLS) | DB 레벨 선언적 권한 제어      |
| **Aggregation**    | Postgres RPC             | 대시보드 집계 (`*_stats_rpc`) |
| **Client**         | `@supabase/ssr`          | SSR/CSR 양쪽의 세션 처리      |

### DevOps & Tools

| 분류                | 기술                     | 사용 목적             |
| ------------------- | ------------------------ | --------------------- |
| **Monorepo**        | Turborepo                | 빌드 최적화 및 캐싱   |
| **Package Manager** | pnpm 9.15.0              | 의존성 설치           |
| **Testing**         | Vitest + Testing Library | 단위/컴포넌트 테스트  |
| **CI/CD**           | GitHub Actions           | 자동화된 검사 및 배포 |
| **Code Quality**    | ESLint, Prettier         | 코드 품질 관리        |
| **Component Dev**   | Storybook, Chromatic     | UI 컴포넌트 개발/리뷰 |
| **Deployment**      | Vercel                   | 웹 배포               |

---

## 📁 프로젝트 구조

```
worklog-plus/
├── apps/
│   ├── web/              # Next.js 15 웹 애플리케이션
│   ├── mobile/           # React Native + Expo 모바일 앱 (WebView)
│   └── storybook/        # UI 컴포넌트 문서화
│
├── packages/
│   ├── ui/               # shadcn/ui 기반 공용 컴포넌트
│   ├── components/       # 도메인 컴포넌트 (프로젝트, 업무일지 등)
│   ├── store/            # Zustand 전역 상태
│   ├── hooks/            # 공용 커스텀 훅
│   ├── types/            # 공용 타입 + Zod 스키마
│   └── config/           # ESLint, TypeScript 설정
│
├── supabase/
│   ├── config.toml       # 로컬 스택 설정 (Custom Access Token Hook 포함)
│   ├── migrations/       # 스키마 / 함수 / RLS 정책 / 집계 RPC
│   └── seed.sql          # 데모 데이터
│
├── .github/workflows/    # CI/CD 워크플로우
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

Supabase 스키마와 정책의 상세 설명은 [`supabase/README.md`](./supabase/README.md)를 참고하세요.

### 의존성 그래프

```bash
pnpm graph
```

`graph.html`이 생성되며, 브라우저에서 Turborepo 태스크 의존성을 확인할 수 있습니다.

**주요 의존성 규칙:**

- `apps` → `packages` (단방향)
- `packages` 간 순환 의존 금지
- `ui`, `store`, `components` → `types`
- `hooks` → 독립적 (의존성 없음)

---

## 🚀 시작하기

### 요구사항

- **Node.js** >= 20
- **pnpm** 9.15.0 (`packageManager` 필드로 고정)
- **Docker** (로컬 Supabase 스택 실행 시)

### 설치

```bash
git clone https://github.com/beaever/worklog-plus.git
cd worklog-plus
pnpm install
```

### 로컬 Supabase 실행

```bash
npx supabase start      # 로컬 스택 기동 (Docker 필요)
npx supabase db reset   # 마이그레이션 + seed 재적용
npx supabase status     # URL / 키 확인
```

스튜디오는 http://127.0.0.1:54323 에서 열립니다. seed 계정은 [`supabase/README.md`](./supabase/README.md)에 정리되어 있습니다.

### 환경 변수 설정

각 앱의 `.env.example`을 복사해 사용하세요.

#### Web (`apps/web/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase status 의 anon key>
SUPABASE_SERVICE_ROLE_KEY=<supabase status 의 service_role key>
```

> `SUPABASE_SERVICE_ROLE_KEY`는 RLS를 우회하므로 서버 사이드에서만 사용하며, 클라이언트에 노출되면 안 됩니다.

#### Mobile (`apps/mobile/.env`)

```env
EXPO_PUBLIC_WEB_URL=http://localhost:3000
EXPO_PUBLIC_PRODUCTION_URL=https://worklog-plus.vercel.app
```

### 개발 서버 실행

```bash
pnpm dev            # 전체 개발 서버
pnpm dev:web        # Web만
pnpm dev:mobile     # Mobile만
pnpm dev:mobile:ios # Mobile (iOS 시뮬레이터)
pnpm storybook      # Storybook
```

### 빌드

```bash
pnpm build       # 전체 빌드
pnpm build:web   # Web만
```

---

## 💡 핵심 설계 판단

### 1. Express + Prisma → Supabase 전면 이전

**배경:** 초기에는 Express + Prisma + PostgreSQL 3-tier 구조였습니다. 1인 개발 규모에서 API 서버는 CRUD를 DB로 넘기는 얇은 통과 계층에 가까웠고, 인증 토큰 관리와 배포 대상이 늘어나는 비용만 남았습니다.

**판단:** 백엔드 서버를 유지하는 대신 Supabase로 이전해 서버 자체를 제거했습니다. 다만 인증과 데이터를 한 번에 옮기면 실패 시 원인을 가릴 수 없어, **인증 → 데이터 → 정리** 순의 단계로 쪼개 위험을 분리하고 각 단계를 독립 PR로 검증하며 이전했습니다.

**결과:** `apps/backend`가 제거되고 배포 대상이 Vercel 하나로 줄었습니다. JWT 발급·갱신, bcrypt 해싱, refresh token 테이블 등 직접 관리하던 인증 코드가 사라졌습니다.

### 2. 권한 규칙을 애플리케이션에서 RLS로 이관

**문제:** 권한 규칙이 Express 미들웨어와 서비스 코드 곳곳에 흩어져 있어, 새 엔드포인트를 추가할 때마다 검사를 빠뜨릴 여지가 있었습니다.

**판단:** 규칙을 선언적 RLS 정책으로 DB에 내려, **애플리케이션이 뚫려도 DB가 막는** 구조로 바꿨습니다.

**해결한 난점:** 프로젝트와 멤버 테이블이 서로의 정책을 참조하면서 정책 평가가 무한재귀에 빠졌습니다. 참조 경로를 `SECURITY DEFINER` 헬퍼 함수로 끊어 해결했습니다. 함께 권한상승 차단 트리거를 두어 역할 컬럼의 자가 변경을 막았습니다.

### 3. Custom Access Token Hook 으로 역할 주입

**문제:** RLS 정책이 평가될 때마다 사용자의 역할을 확인하려고 users 테이블을 조회했습니다. 정책은 행마다 평가되므로 이 조회가 반복 비용이 됩니다.

**판단:** Custom Access Token Hook으로 JWT에 역할 claim을 주입해, 정책이 토큰만 보고 판단하도록 바꿨습니다.

**결과:** RLS 평가 시의 사용자 테이블 조회가 제거됐습니다.

### 4. 대시보드 집계의 N+1 제거

**문제:** 대시보드의 날짜별 통계를 날짜마다 쿼리를 도는 방식으로 만들어, 기간이 길어질수록 쿼리 수가 선형으로 늘었습니다.

**판단:** `generate_series`로 날짜 축을 DB에서 만들고 단일 `GROUP BY`로 집계하는 RPC(`*_stats_rpc`)로 대체했습니다.

**결과:** 기간과 무관하게 쿼리 1회로 집계됩니다.

### 5. Monorepo 아키텍처

**선택 이유:** 웹과 모바일, Storybook이 동일한 도메인 컴포넌트와 타입을 공유하므로 코드 재사용과 일관된 의존성 관리가 필요했습니다.

**구현:** pnpm workspace로 패키지를 관리하고 Turborepo로 병렬 빌드 및 캐싱을 적용했습니다. `apps → packages` 단방향 규칙을 두어 순환 의존을 방지합니다.

---

## 🧪 테스트

### 테스트 전략

- **단위/컴포넌트 테스트**: Vitest + Testing Library
- **커버리지**: v8 provider (`@vitest/coverage-v8`)
- **CI**: GitHub Actions에서 `pnpm ci`(typecheck → lint → build → test) 실행
- **비주얼 리뷰**: Storybook + Chromatic

### 작성된 테스트

| 위치                                             | 대상                   |
| ------------------------------------------------ | ---------------------- |
| `packages/components/src/__tests__/project-card` | 프로젝트 카드 컴포넌트 |
| `packages/components/src/__tests__/worklog-card` | 업무일지 카드 컴포넌트 |
| `packages/components/src/__tests__/stat-card`    | 통계 카드 컴포넌트     |
| `packages/store/src/__tests__/user-store`        | 사용자 전역 상태       |
| `apps/web/lib/__tests__/utils`                   | 공통 유틸리티 함수     |

> 커버리지는 전 구간이 아닌 위 영역에 한정됩니다. E2E는 아직 없습니다.

### 테스트 실행

```bash
pnpm test         # 전체 테스트
pnpm test:watch   # watch 모드
```

---

## 🚢 배포

### Web (Vercel)

`main` 브랜치 푸시 시 Vercel이 자동 배포합니다. 환경 변수는 Vercel 대시보드에서 설정합니다.

### Database (Supabase)

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push     # 마이그레이션 원격 반영
```

---

## 스크립트

| 명령어                    | 설명                            |
| ------------------------- | ------------------------------- |
| `pnpm dev`                | 전체 개발 서버 실행             |
| `pnpm dev:web`            | Web 개발 서버만 실행            |
| `pnpm dev:mobile`         | Mobile 개발 서버만 실행         |
| `pnpm dev:mobile:ios`     | Mobile iOS 시뮬레이터           |
| `pnpm dev:mobile:android` | Mobile Android 에뮬레이터       |
| `pnpm build`              | 프로덕션 빌드                   |
| `pnpm build:web`          | Web만 빌드                      |
| `pnpm typecheck`          | TypeScript 타입 검사            |
| `pnpm lint`               | ESLint 검사                     |
| `pnpm test`               | 전체 테스트 실행                |
| `pnpm test:watch`         | 테스트 watch 모드               |
| `pnpm ci`                 | typecheck + lint + build + test |
| `pnpm format`             | Prettier 포맷팅                 |
| `pnpm format:check`       | Prettier 검사                   |
| `pnpm storybook`          | Storybook 실행                  |
| `pnpm chromatic`          | Chromatic 업로드                |
| `pnpm graph`              | 의존성 그래프 생성              |
| `pnpm clean`              | 빌드 결과물 삭제                |

---

## 🔮 향후 개선 계획

- [ ] E2E 테스트 (Playwright)
- [ ] 접근성 개선 (WCAG 2.1 AA)
- [ ] 실시간 협업 (Supabase Realtime)
- [ ] 고급 검색/필터링
- [ ] 모바일 네이티브 전환 (현재 WebView 셸)

---

## 📄 라이선스

Private

---

## 👨‍💻 개발자

**GitHub**: [@beaever](https://github.com/beaever)
**Repository**: [worklog-plus](https://github.com/beaever/worklog-plus)
