# WorkLog+ 프로젝트 상세 TODO 리스트

> 생성일: 2026-02-14  
> 프로젝트: WorkLog+ (업무일지 관리 서비스)  
> 기술 스택: Next.js 15, React Native, Zustand, TanStack Query, Tailwind CSS

---

## 📋 프로젝트 현황 요약

### ✅ 완료된 작업
- 모노레포 구조 설정 (pnpm + Turborepo)
- 기본 타입 정의 (User, Project, Worklog, Auth)
- API 클라이언트 구조 (fetch 기반)
- Zustand 스토어 (user-store, project-store)
- UI 컴포넌트 라이브러리 (shadcn/ui 기반)
- Next.js 웹 앱 기본 구조
- React Native 모바일 앱 (WebView)
- 주요 페이지 레이아웃 (대시보드, 프로젝트, 업무일지, 인증, 관리자)
- Storybook 설정

### 🚧 진행 중 / 미완성
- 실제 백엔드 API 연동 (현재 Mock 데이터 사용)
- 인증 플로우 완성
- 관리자 기능 구현
- 차트 데이터 연동
- 모바일 앱 네이티브 기능

---

## 🎯 우선순위별 TODO

## 1️⃣ 최우선 (Critical)

### 1.1 백엔드 API 연동
**현재 상태**: Mock 데이터로만 동작  
**목표**: 실제 백엔드 API와 연동

- [ ] **환경 변수 설정**
  - `apps/web/.env.local` 생성
  - `NEXT_PUBLIC_API_URL` 설정
  - `apps/mobile/.env` 생성
  - `EXPO_PUBLIC_WEB_URL` 설정

- [ ] **API 클라이언트 인증 헤더 추가**
  - `packages/api/src/client.ts` 수정
  - localStorage에서 토큰 읽어서 Authorization 헤더 추가
  - 401 에러 시 자동 토큰 갱신 로직 구현

- [ ] **프로젝트 API 연동**
  - `apps/web/app/projects/page.tsx` - Mock 데이터 제거
  - `apps/web/hooks/use-project-detail.ts` - TODO 주석 해제 및 실제 API 호출
  - TanStack Query 훅 생성 (`useProjects`, `useProject`, `useCreateProject` 등)

- [ ] **업무일지 API 연동**
  - `apps/web/app/worklogs/page.tsx` - Mock 데이터 제거
  - TanStack Query 훅 생성 (`useWorklogs`, `useWorklog`, `useCreateWorklog` 등)

- [ ] **대시보드 API 연동**
  - `apps/web/app/dashboard/page.tsx` - 실제 통계 데이터 연동
  - 차트 컴포넌트에 실제 데이터 전달

### 1.2 인증 시스템 완성
**현재 상태**: 로그인 폼만 있고 실제 인증 미구현  
**목표**: 완전한 인증 플로우 구현

- [ ] **로그인/회원가입 기능 완성**
  - `apps/web/components/auth/login-form.tsx` - 실제 API 호출로 변경
  - `apps/web/components/auth/register-form.tsx` - 회원가입 API 연동
  - 로그인 성공 시 토큰 저장 및 리다이렉트

- [ ] **인증 미들웨어 구현**
  - `apps/web/middleware.ts` 생성
  - 보호된 라우트 접근 제어 (/dashboard, /projects, /worklogs 등)
  - 비인증 사용자는 /login으로 리다이렉트

- [ ] **토큰 갱신 로직**
  - Refresh Token을 이용한 자동 토큰 갱신
  - `packages/api/src/auth.ts` - refresh API 활용
  - 401 에러 시 자동 갱신 후 재시도

- [ ] **로그아웃 기능**
  - 헤더/사이드바에 로그아웃 버튼 추가
  - 로그아웃 시 토큰 삭제 및 스토어 초기화
  - /login으로 리다이렉트

- [ ] **사용자 정보 자동 로드**
  - 앱 시작 시 토큰 확인
  - 유효한 토큰이 있으면 사용자 정보 로드 (`authApi.me()`)
  - `packages/store/src/user-store.ts` 업데이트

### 1.3 에러 처리 및 로딩 상태
**현재 상태**: 에러 처리 미흡  
**목표**: 사용자 친화적인 에러 처리

- [ ] **전역 에러 바운더리**
  - `apps/web/app/error.tsx` 개선
  - 에러 타입별 메시지 표시
  - 재시도 버튼 추가

- [ ] **API 에러 처리**
  - `packages/api/src/client.ts` - 에러 응답 구조화
  - 네트워크 에러, 서버 에러, 인증 에러 구분
  - Toast 알림 또는 에러 모달 표시

- [ ] **로딩 상태 UI**
  - Skeleton 컴포넌트 추가 (`packages/ui/src/skeleton.tsx`)
  - 각 페이지에 로딩 상태 표시
  - Suspense 경계 설정

---

## 2️⃣ 높음 (High Priority)

### 2.1 프로젝트 상세 페이지 완성
**파일**: `apps/web/app/projects/[id]/page.tsx`

- [ ] **프로젝트 정보 표시**
  - 프로젝트 이름, 설명, 상태, 기간
  - 진행률 표시
  - 수정/삭제 버튼

- [ ] **프로젝트 KPI 카드**
  - 전체 작업, 완료 작업, 진행 중, 지연 작업 통계
  - 실제 데이터 연동

- [ ] **타임라인 이벤트**
  - 프로젝트 활동 로그 표시
  - 무한 스크롤 또는 페이지네이션

- [ ] **프로젝트 수정 모달**
  - 프로젝트 정보 수정 폼
  - 유효성 검사
  - API 연동

- [ ] **프로젝트 삭제 확인**
  - 삭제 확인 다이얼로그
  - 삭제 후 프로젝트 목록으로 리다이렉트

### 2.2 업무일지 상세 페이지 완성
**파일**: `apps/web/app/worklogs/[id]/page.tsx`

- [ ] **업무일지 상세 정보 표시**
  - 제목, 내용, 날짜, 소요 시간
  - 프로젝트 정보
  - 작성자 정보

- [ ] **업무일지 수정 기능**
  - 수정 모달 또는 인라인 편집
  - API 연동

- [ ] **업무일지 삭제 기능**
  - 삭제 확인 다이얼로그
  - 삭제 후 목록으로 리다이렉트

- [ ] **마크다운 지원 (선택사항)**
  - 업무일지 내용을 마크다운으로 작성
  - 마크다운 렌더러 추가

### 2.3 대시보드 차트 데이터 연동
**파일**: `apps/web/app/dashboard/page.tsx`

- [ ] **주간 활동 차트**
  - `components/dashboard/weekly-activity-chart.tsx`
  - 실제 데이터 연동 (최근 7일 업무일지 통계)

- [ ] **프로젝트 분포 차트**
  - `components/dashboard/project-distribution-chart.tsx`
  - 프로젝트별 업무일지 개수 또는 시간

- [ ] **월별 추이 차트**
  - `components/dashboard/monthly-trend-chart.tsx`
  - 최근 6개월 업무일지 추이

- [ ] **최근 업무일지**
  - `components/dashboard/recent-worklogs.tsx`
  - 최근 5개 업무일지 표시
  - 클릭 시 상세 페이지로 이동

### 2.4 설정 페이지 구현
**파일**: `apps/web/app/settings/page.tsx`

- [ ] **프로필 설정**
  - 이름, 이메일 수정
  - 프로필 이미지 업로드 (선택사항)

- [ ] **비밀번호 변경**
  - 현재 비밀번호 확인
  - 새 비밀번호 입력 및 확인
  - API 연동

- [ ] **알림 설정**
  - 이메일 알림 on/off
  - 푸시 알림 on/off (모바일)

- [ ] **테마 설정**
  - 라이트/다크 모드 토글
  - 시스템 설정 따르기 옵션

---

## 3️⃣ 중간 (Medium Priority)

### 3.1 관리자 기능 구현
**현재 상태**: 레이아웃만 존재  
**목표**: 관리자 페이지 완성

- [ ] **사용자 관리** (`apps/web/app/admin/users/page.tsx`)
  - 전체 사용자 목록 표시
  - 사용자 검색 및 필터링
  - 사용자 상태 변경 (활성/비활성)
  - 사용자 역할 변경

- [ ] **사용자 상세** (`apps/web/app/admin/users/[id]/page.tsx`)
  - 사용자 정보 상세 표시
  - 사용자 프로젝트 목록
  - 사용자 업무일지 통계

- [ ] **역할 관리** (`apps/web/app/admin/roles/page.tsx`)
  - 역할 목록 (USER, ADMIN, SYSTEM_ADMIN)
  - 역할별 권한 설정

- [ ] **감사 로그** (`apps/web/app/admin/audit-logs/page.tsx`)
  - 시스템 활동 로그 표시
  - 로그 필터링 (날짜, 사용자, 액션)

- [ ] **시스템 설정** (`apps/web/app/admin/settings/page.tsx`)
  - 전역 설정 관리
  - 시스템 통계

- [ ] **관리자 권한 체크**
  - 관리자 페이지 접근 시 권한 확인
  - 비관리자는 403 페이지로 리다이렉트

### 3.2 검색 및 필터링 개선

- [ ] **프로젝트 필터링 강화**
  - 상태별 필터 (PLANNED, ACTIVE, DONE)
  - 날짜 범위 필터
  - 정렬 옵션 (최신순, 이름순, 진행률순)

- [ ] **업무일지 필터링 강화**
  - 프로젝트별 필터
  - 날짜 범위 필터
  - 소요 시간별 필터

- [ ] **전역 검색 기능**
  - 헤더에 검색 바 추가
  - 프로젝트, 업무일지 통합 검색
  - 검색 결과 페이지

### 3.3 페이지네이션 및 무한 스크롤

- [ ] **프로젝트 목록 페이지네이션**
  - `apps/web/app/projects/page.tsx`
  - TanStack Query의 `useInfiniteQuery` 활용
  - 무한 스크롤 또는 페이지 버튼

- [ ] **업무일지 목록 페이지네이션**
  - `apps/web/app/worklogs/page.tsx`
  - 무한 스크롤 구현

- [ ] **활동 로그 페이지네이션**
  - 프로젝트 상세 페이지 활동 로그
  - Load More 버튼

### 3.4 폼 유효성 검사 강화

- [ ] **React Hook Form + Zod 도입**
  - `packages/ui` 또는 `packages/hooks`에 폼 훅 추가
  - Zod 스키마로 유효성 검사

- [ ] **프로젝트 폼 유효성 검사**
  - 이름 필수, 최소/최대 길이
  - 날짜 유효성 (시작일 < 종료일)

- [ ] **업무일지 폼 유효성 검사**
  - 제목 필수
  - 날짜 형식 검사
  - 소요 시간 범위 (0 < duration < 24)

- [ ] **로그인/회원가입 폼 유효성 검사**
  - 이메일 형식
  - 비밀번호 강도 (최소 8자, 특수문자 포함 등)

---

## 4️⃣ 낮음 (Low Priority)

### 4.1 모바일 앱 네이티브 기능

- [ ] **푸시 알림**
  - Expo Notifications 설정
  - 백엔드 푸시 알림 API 연동

- [ ] **오프라인 지원**
  - AsyncStorage를 이용한 로컬 캐싱
  - 오프라인 시 읽기 전용 모드

- [ ] **네이티브 공유 기능**
  - 업무일지 공유 (텍스트, 링크)

- [ ] **생체 인증**
  - Face ID / Touch ID 지원
  - 로그인 시 생체 인증 옵션

### 4.2 성능 최적화

- [ ] **이미지 최적화**
  - Next.js Image 컴포넌트 활용
  - 프로필 이미지, 로고 등

- [ ] **코드 스플리팅**
  - 동적 import 활용
  - 페이지별 번들 크기 최적화

- [ ] **React Query 캐싱 전략**
  - staleTime, cacheTime 설정
  - Optimistic Update 적용

- [ ] **Lighthouse 점수 개선**
  - Performance, Accessibility, SEO 점수 90+ 목표

### 4.3 테스트 작성

- [ ] **단위 테스트**
  - Vitest 설정
  - 유틸 함수 테스트 (`packages/hooks`, `apps/web/lib/utils.ts`)

- [ ] **컴포넌트 테스트**
  - React Testing Library
  - UI 컴포넌트 테스트 (`packages/ui`)

- [ ] **E2E 테스트**
  - Playwright 설정
  - 주요 사용자 플로우 테스트 (로그인, 프로젝트 생성, 업무일지 작성)

### 4.4 문서화

- [ ] **API 문서**
  - Swagger 또는 Postman Collection
  - 각 API 엔드포인트 설명

- [ ] **컴포넌트 문서**
  - Storybook 스토리 추가
  - 각 컴포넌트 Props 설명

- [ ] **개발 가이드**
  - 새로운 개발자를 위한 온보딩 문서
  - 코딩 컨벤션, Git 플로우

### 4.5 추가 기능

- [ ] **다국어 지원 (i18n)**
  - next-intl 또는 react-i18next
  - 한국어, 영어 지원

- [ ] **다크 모드 토글**
  - 헤더에 테마 토글 버튼
  - next-themes 활용

- [ ] **CSV/Excel 내보내기**
  - 프로젝트 목록 내보내기
  - 업무일지 목록 내보내기

- [ ] **업무일지 템플릿**
  - 자주 사용하는 업무일지 템플릿 저장
  - 템플릿으로 빠르게 작성

- [ ] **프로젝트 아카이브**
  - 완료된 프로젝트 아카이브
  - 아카이브된 프로젝트 복원

---

## 🐛 버그 및 개선사항

### 버그 수정

- [ ] **로그인 폼 role 하드코딩 제거**
  - `apps/web/components/auth/login-form.tsx:57`
  - TODO 주석 참고: role을 선택할 수 있도록 수정

- [ ] **프로덕션 URL 설정**
  - `apps/mobile/src/utils/get-dev-server-url.ts:39`
  - TODO 주석 참고: 실제 배포 URL 설정

- [ ] **UUID 생성 함수 개선**
  - `apps/web/lib/utils.ts:42`
  - crypto.randomUUID() 우선 사용, 폴백 로직 개선

### UX 개선

- [ ] **빈 상태 개선**
  - EmptyState 컴포넌트 일관성 유지
  - 액션 버튼 추가

- [ ] **로딩 인디케이터**
  - 버튼 클릭 시 로딩 스피너
  - 페이지 전환 시 로딩 바

- [ ] **토스트 알림**
  - 성공/실패 메시지 표시
  - sonner 또는 react-hot-toast 도입

- [ ] **모달 애니메이션**
  - 부드러운 페이드 인/아웃
  - 백드롭 클릭 시 닫기

### 접근성 (a11y)

- [ ] **키보드 네비게이션**
  - Tab 키로 모든 요소 접근 가능
  - Focus 스타일 명확하게

- [ ] **ARIA 속성 추가**
  - 모달, 다이얼로그에 적절한 ARIA 속성
  - 스크린 리더 지원

- [ ] **색상 대비**
  - WCAG AA 기준 충족
  - 다크 모드에서도 충분한 대비

---

## 📦 패키지 의존성

### 추가 고려 패키지

- [ ] **폼 관리**: react-hook-form, zod
- [ ] **날짜 처리**: date-fns 또는 dayjs
- [ ] **차트**: recharts (이미 설치됨)
- [ ] **토스트**: sonner 또는 react-hot-toast
- [ ] **테이블**: @tanstack/react-table
- [ ] **드래그 앤 드롭**: @dnd-kit/core (프로젝트 순서 변경 등)
- [ ] **마크다운**: react-markdown, remark-gfm
- [ ] **파일 업로드**: react-dropzone

---

## 🚀 배포 준비

### 웹 배포 (Vercel/Netlify)

- [ ] **환경 변수 설정**
  - Vercel/Netlify 대시보드에서 환경 변수 추가
  - `NEXT_PUBLIC_API_URL`

- [ ] **빌드 최적화**
  - `pnpm build:web` 성공 확인
  - 번들 크기 분석

- [ ] **도메인 연결**
  - 커스텀 도메인 설정
  - SSL 인증서 확인

### 모바일 배포 (App Store/Play Store)

- [ ] **앱 아이콘 및 스플래시 스크린**
  - 다양한 해상도 아이콘 준비
  - 스플래시 스크린 디자인

- [ ] **앱 정보 작성**
  - 앱 이름, 설명, 스크린샷
  - 개인정보 처리방침

- [ ] **EAS Build 설정**
  - `eas.json` 설정
  - 프로덕션 빌드 생성

- [ ] **스토어 제출**
  - App Store Connect
  - Google Play Console

---

## 📊 우선순위 요약

| 우선순위 | 작업 | 예상 시간 |
|---------|------|----------|
| 🔴 최우선 | 백엔드 API 연동 | 2-3일 |
| 🔴 최우선 | 인증 시스템 완성 | 1-2일 |
| 🔴 최우선 | 에러 처리 및 로딩 상태 | 1일 |
| 🟡 높음 | 프로젝트 상세 페이지 | 1-2일 |
| 🟡 높음 | 업무일지 상세 페이지 | 1일 |
| 🟡 높음 | 대시보드 차트 연동 | 1-2일 |
| 🟡 높음 | 설정 페이지 | 1일 |
| 🟢 중간 | 관리자 기능 | 3-4일 |
| 🟢 중간 | 검색/필터링 개선 | 1-2일 |
| 🟢 중간 | 페이지네이션 | 1일 |
| 🔵 낮음 | 모바일 네이티브 기능 | 2-3일 |
| 🔵 낮음 | 성능 최적화 | 1-2일 |
| 🔵 낮음 | 테스트 작성 | 3-5일 |

**총 예상 시간**: 약 3-4주 (1인 기준)

---

## 💡 개발 팁

1. **API 연동 순서**: 인증 → 프로젝트 → 업무일지 → 대시보드 순으로 진행
2. **TanStack Query 활용**: 서버 상태 관리를 Query로 처리하여 코드 간소화
3. **타입 안전성**: API 응답 타입을 `packages/types`에 정의하여 일관성 유지
4. **컴포넌트 재사용**: 공통 UI는 `packages/ui`에, 도메인 컴포넌트는 `apps/web/components`에
5. **에러 처리**: 모든 API 호출에 try-catch 및 에러 상태 처리
6. **로딩 상태**: 사용자 경험을 위해 모든 비동기 작업에 로딩 인디케이터 추가

---

## 📝 참고 사항

- 현재 프로젝트는 **프론트엔드만 구현**되어 있으며, 백엔드 API는 별도 개발 필요
- Mock 데이터는 개발 편의를 위한 것이며, 실제 배포 전 제거 필요
- 모바일 앱은 WebView 기반이므로 웹 기능이 완성되면 자동으로 반영됨
- Storybook은 UI 컴포넌트 개발 및 문서화에 활용

---

**마지막 업데이트**: 2026-02-14  
**작성자**: Cascade AI Assistant
