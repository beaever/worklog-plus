---
name: convention-check
description: 변경된(또는 지정한) 코드를 WorkLog+ CLAUDE.md 룰과 대조 감사하여 위반 사항을 보고한다. 코드는 수정하지 않고 위반 목록과 수정 제안만 제시. "룰 검증", "컨벤션 체크", "커밋 전 점검", "/convention-check" 요청 시 사용.
---

# 컨벤션 감사 (convention-check)

WorkLog+ `CLAUDE.md` 룰 대비 코드 위반을 찾는다. **읽기 전용** — 코드를 고치지 않고 위반과 수정 제안만 보고한다(수정은 사용자 승인 후 별도).

## 대상 범위
- 기본: 현재 변경분. `git diff --name-only` 와 `git diff --name-only --staged` 로 변경 파일을 모은 뒤 해당 파일을 읽어 검사한다.
- 사용자가 경로/PR을 지정하면 그 범위.

## 점검 항목 (CLAUDE.md 기준)

### 공통/TypeScript
- [ ] `any` 사용 없음 (불가피 시 `// eslint-disable-next-line` + 이유 주석 있는지)
- [ ] async 함수 등 반환 타입 명시
- [ ] enum 대신 `as const` 객체
- [ ] 네이밍: 파일 `kebab-case`, 타입 `PascalCase`, 함수/변수 `camelCase`, 상수 `UPPER_SNAKE_CASE`
- [ ] **멀티라인 주석 블록 금지**, 자명한 주석 없음(WHY만)

### 백엔드 계층
- [ ] routes는 미들웨어 조립만, controllers에 비즈니스 로직 없음, services가 로직 담당
- [ ] DB 접근은 services에서 prisma로만
- [ ] 응답 형식 `{ success: true, data }` / 목록 `{ success, ...result }` / 에러 `{ success: false, error }`
- [ ] HTTP 상태코드 정확(201/204/400/401/403/404/409/500)
- [ ] 비즈니스 에러는 `AppError(status, msg)`, 컨트롤러 `next(error)`
- [ ] 보호 라우트 `authenticate`, 역할 가드 `authorize`, 입력 `validate*`
- [ ] 목록 API 페이지네이션 적용

### 보안
- [ ] `passwordHash` 등 민감 필드 응답 제외(`Omit<...>`)
- [ ] 로그에 비밀번호/토큰 원문 없음
- [ ] 프론트 localStorage 토큰 저장 없음(httpOnly 쿠키)

### DB / Prisma
- [ ] `@@map`/`@map` snake_case
- [ ] 모든 관계 `onDelete` 명시, NOT NULL에 SetNull 없음
- [ ] 2+ 쓰기 `$transaction`
- [ ] N+1 방지 `include`/`select`, 목록 `Promise.all([findMany, count])`

### 프론트엔드
- [ ] 서버 상태 TanStack Query(`staleTime` 기본 유지), 전역 Zustand, 폼 RHF+Zod
- [ ] 공용 컴포넌트 위치 규칙(ui/components/앱별)

### 테스트
- [ ] 새 서비스 함수에 단위 테스트 동반(Vitest)

## 보고 형식
위반을 다음처럼 표로 정리하고, 자동 검증 가능한 항목은 명령으로 교차 확인한다:
- `pnpm lint` / `pnpm typecheck` 결과 참고.

```
| 파일:라인 | 위반 룰 | 문제 | 수정 제안 |
|-----------|---------|------|-----------|
```
위반이 없으면 "위반 없음 — 룰 준수"로 보고한다. 심각도(차단/경고/제안)를 구분해 우선순위를 매긴다.
