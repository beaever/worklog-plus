# WorkLog+ Monorepo

pnpm + Turborepo 기반의 모노레포 프로젝트입니다.

## 기술 스택

- **Package Manager**: pnpm
- **Build System**: Turborepo
- **Web**: Next.js 15 (App Router)
- **Mobile**: React Native + Expo (WebView)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Language**: TypeScript (strict mode)

## 프로젝트 구조

```
worklog/
├── apps/
│   ├── web/              # Next.js 메인 서비스
│   └── mobile/           # React Native WebView 앱
│
├── packages/
│   ├── ui/               # 공용 UI 컴포넌트
│   ├── hooks/            # 공용 커스텀 훅
│   ├── api/              # API client
│   ├── store/            # Zustand 상태
│   ├── types/            # 공용 타입
│   └── config/           # eslint, tsconfig
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 시작하기

### 요구사항

- Node.js >= 20
- pnpm >= 9

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
# 전체 개발 서버 실행
pnpm dev

# Web만 실행
pnpm --filter @worklog-plus/web dev

# Mobile만 실행
pnpm --filter @worklog-plus/mobile start
```

### 빌드

```bash
# 전체 빌드
pnpm build

# 특정 앱만 빌드
pnpm --filter @worklog-plus/web build
```

### 린트

```bash
pnpm lint
```

## 패키지 설명

### apps/web

Next.js 15 기반의 메인 웹 서비스입니다.

- App Router 사용
- Tailwind CSS + shadcn/ui 스타일링
- TanStack Query 데이터 페칭

### apps/mobile

React Native + Expo 기반의 모바일 앱입니다.

- WebView로 웹 서비스 래핑
- 네이티브 기능 브릿지 지원
- UserAgent로 앱 환경 구분

### packages/types

프론트엔드 전체에서 사용하는 타입 정의입니다.

- User, Project, Worklog 등 도메인 타입
- API 응답 타입
- 공통 유틸리티 타입

### packages/api

API 요청을 추상화한 클라이언트입니다.

- fetch 기반 HTTP 클라이언트
- 타입 안전한 API 함수
- 에러 핸들링

### packages/store

Zustand 기반의 전역 상태 관리입니다.

- UI 상태 (사이드바, 모달 등)
- 사용자 인증 상태

### packages/hooks

도메인 독립적인 커스텀 훅입니다.

- useDebounce
- useModal
- useLocalStorage
- useMediaQuery

### packages/ui

공용 UI 컴포넌트 라이브러리입니다.

- Button, Card, Badge, Modal 등
- Tailwind CSS 기반
- shadcn/ui 스타일

### packages/config

공유 설정 파일입니다.

- TypeScript 설정 (base, nextjs, react-library, react-native)
- ESLint 설정 (base, react, nextjs)

## 의존성 규칙

```
apps → packages 의존 ⭕
packages 간 순환 의존 ❌

ui → types ⭕
api → types ⭕
store → types ⭕
hooks → (독립적)
```

## 개발 순서 가이드

1. `pnpm install` - 의존성 설치
2. `packages/types` - 타입 정의
3. `apps/web` - Layout 및 페이지 구현
4. `packages/api` - API mock 연결
5. `apps/mobile` - WebView 연결

## 스크립트

| 명령어        | 설명             |
| ------------- | ---------------- |
| `pnpm dev`    | 개발 서버 실행   |
| `pnpm build`  | 프로덕션 빌드    |
| `pnpm lint`   | 린트 검사        |
| `pnpm clean`  | 빌드 결과물 삭제 |
| `pnpm format` | 코드 포맷팅      |

## 환경 변수

### apps/web

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### apps/mobile

```env
EXPO_PUBLIC_WEB_URL=http://localhost:3000
```

## 라이선스

Private
