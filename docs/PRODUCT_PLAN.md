# WorkLog+ 상용화 기획서

> 방향: **하이브리드 (개인 → 팀 단계적)** · 수익모델: **Free → Pro(개인) → Team(조직) 3-tier**
> 작성: 2026-06-10(v1) · 갱신: 2026-08-04(v2, 코드베이스 재분석 반영)

---

## 0. 한 줄 요약

> **"개인의 업무일지가 그대로 팀의 진척 리포트가 되는, 가볍지만 인사이트가 쌓이는 업무 기록 도구."**

v1 대비 가장 큰 변화: **제품의 문제는 "단조로움"이 아니라 "가입한 사용자가 아무것도 할 수 없다"는 것**으로 재정의된다. 아래 §1에서 상술한다.

---

## 1. 현재 구현 상태 재평가 (2026-08-04)

### 1.1 v1 이후 해결된 것

| v1 지적 | 현재 |
|---|---|
| P3 — 프로젝트 KPI/진행률/타임라인이 전부 빈 값 | **해결.** `estimated_hours` 컬럼 추가 + `computeProjectProgress()`로 공수 대비 진행률·일정 건강도(AHEAD/ON_TRACK/BEHIND) 산출, 타임라인은 `activity_logs` 실데이터 |
| 알림 스켈레톤만 존재 | **부분 해결.** `activity_logs` 재활용해 목록은 실데이터. 단 읽음 상태는 localStorage |
| 관리자 기능 목업 | **삭제됨** (PR #74). 목업 유지보다 없는 편이 정직 |

### 1.2 실제로 동작하는 기능 (검증 완료)

- Supabase Auth 회원가입/로그인/로그아웃, 미들웨어 기반 세션 갱신·라우트 보호
- 프로젝트 CRUD(목록·상세·상태 인라인 변경·삭제), 페이지네이션, 검색/필터
- 업무일지 CRUD, 마크다운 렌더링(react-markdown + remark-gfm)
- 대시보드 4종 차트(주간 활동/월별 추이/프로젝트 분포/최근 일지) + 통계 카드
- 프로필 수정·비밀번호 변경, 다크모드
- RLS 기반 권한 통제 + JWT `user_role` claim 주입 + 권한상승 차단 트리거
- 모바일 WebView 래퍼(Expo)

### 1.3 **치명적 결함 — 상용화 이전에 반드시 (Blocker)**

| # | 결함 | 근거 | 영향 |
|---|---|---|---|
| **B1** | **신규 가입자는 프로젝트를 만들 수 없다** | `handle_new_user()`가 role을 `USER`로 강제 생성 → RLS `projects_insert`와 `/api/projects`가 **MANAGER 이상**을 요구 | 가입 직후 빈 화면. 역할을 올려줄 관리자 UI도 없음(삭제됨). **획득한 사용자가 100% 이탈** |
| **B2** | **팀 멤버를 추가할 방법이 없다** | `project_members` 테이블·RLS·`has_project_access()`는 있으나 초대 UI 없음. 게다가 `users_select`가 "본인 또는 관리자"만 허용 → **이메일로 상대를 찾는 것 자체가 불가능** | 협업 = 유료화 축이 구조적으로 막힘. Team tier 출시 불가 |
| **B3** | **결제·플랜 한도 전무** | Stripe 연동 없음, `plan` 컬럼 없음 | 수익화 0 |
| **B4** | **온보딩 없음** | 가입 → `/dashboard` 즉시 이동, 빈 상태 안내만 | B1과 겹쳐 첫 세션 이탈 극대화 |

> **판단: B1은 며칠 안에 고쳐야 하는 1순위다.** 기능을 더 붙이기 전에, 가입한 사람이 그날 첫 기록을 남길 수 있어야 한다.

### 1.4 보완이 필요한 것 (기술 부채 · 보안 · 품질)

| # | 항목 | 상세 | 우선도 |
|---|---|---|---|
| **S1** | **검색어 PostgREST 필터 주입** | `use-projects.ts` / `use-worklogs.ts`에서 `` .or(`name.ilike.%${search}%`) `` — 사용자 입력이 필터 DSL에 직접 삽입. 콤마·괄호·`)`가 들어가면 구문이 깨지거나 조건이 조작될 수 있다. RLS가 데이터 유출은 막지만 **접근 가능 범위 내 필터 우회**는 가능 | 높음 |
| **S2** | 알림 읽음 상태가 localStorage | 기기·브라우저 간 동기화 안 됨. 알림 전용 테이블 부재 | 중 |
| **S3** | 설정 페이지 "알림 켜기" 토글이 `useState` | 저장되지 않는 가짜 스위치 | 중 |
| **T1** | **RPC 3개가 완전히 미사용** | `worklog_daily_stats` / `worklog_monthly_stats` / `project_worklog_distribution`을 마이그레이션으로 만들어놓고, `lib/dashboard.ts`는 TS 루프+`filter`로 재구현. `.rpc()` 호출 0건 → **DB에서 GROUP BY 한 번이면 될 것을 전체 행을 끌어와 JS에서 집계** | 높음 |
| **T2** | `worklogs.duration`이 `integer` | 30분 단위 기록 불가. 시간 기록 도구로서 치명적 제약 | 높음 |
| **T3** | 폼 검증 일관성 없음 | 로그인/회원가입만 zod+RHF, 프로젝트/일지 폼은 `useState` + 수동 `errors` | 중 |
| **T4** | `audit_logs` 테이블 사용처 0 | admin 삭제 후 완전히 죽은 테이블 | 낮음 |
| **T5** | 테스트 사실상 없음 | web 0개, store 1개, components 3개. CI는 통과하지만 회귀를 잡지 못함 | 중 |
| **T6** | 에러 모니터링·제품 분석 부재 | Sentry 없음, 이벤트 트래킹 없음 → 이탈 지점을 알 수 없다 | 높음(상용화 시) |
| **T7** | `packages/components` 중복 층 | 컴파운드 카드를 web에서 다시 flat 래퍼로 감쌈. 소비자는 래퍼 + 스토리북뿐 | 낮음 |

### 1.5 남은 제품 공백 (v1 진단 중 유효한 것)

- **P1 피드백 루프 부재** — 목표·스트릭·히트맵·인사이트 없음. 매일 열 이유가 없다
- **P2 협업 레이어 미실현** — B2로 격상
- **P4 기록의 단조로움** — 태그·카테고리 없음

---

## 2. 페르소나 & 차별화

### 페르소나
| | Alex — 개인 프로 | Mina — 팀 리드 | Jun — 팀원 |
|---|---|---|---|
| 역할 | 프리랜서/직장인 | 매니저/PM | 실무자 |
| 목표 | 내 업무를 증명·회고 | 마이크로매니징 없이 진척 파악 | 최소 마찰로 기록·인정받기 |
| 페인 | 뭘 했는지 기억 안 남 | 주간 보고 취합이 수작업 | 입력이 번거롭고 보람 없음 |
| 가치 | 자동 인사이트·회고·스트릭 | 개인 일지 → 팀 리포트 자동 집계 | 가벼운 기록 + 반응/인정 |

### 차별화
- **Jira/Asana**: 너무 무겁다 → WorkLog+는 "일지" 단위의 가벼움
- **Notion/Docs**: 비구조적이라 집계 불가 → 구조화된 기록 + 자동 집계
- **Toggl/Clockify**: 시간만 → 시간 + 내용 + 인사이트 + 팀 리포트
- **핵심**: *개인용으로 가볍게 시작 → 팀 초대 한 번으로 협업·리포트가 켜지는 연속성*

---

## 3. 로드맵 (재정렬)

v1의 Phase 1(태그부터)은 **B1을 방치한 채 기능을 얹는 순서**였다. v2는 "쓸 수 있게 → 다시 오게 → 팀으로 → 돈으로" 순으로 바꾼다.

### Phase 0 — "쓸 수 있게 만들기" (1~2주) 🔴 최우선

> 목표: 가입한 사람이 **당일 첫 기록**을 남긴다.

| 작업 | 내용 | 공수 |
|---|---|---|
| **B1 해소 — 권한 모델 재설계** | 프로젝트 생성을 `USER`에게 개방. `MANAGER+` 제약은 "타인 프로젝트 관리" 같은 조직 기능으로 옮긴다. RLS `projects_insert`의 role 조건 제거 + `/api/projects`의 `MANAGER_ROLES` 게이트 제거 | S |
| **B4 해소 — 온보딩 3스텝** | 가입 직후: ① 첫 프로젝트 만들기 → ② 첫 일지 쓰기 → ③ 대시보드 도착. 빈 상태에 CTA 배치 | S |
| **S1 해소 — 검색어 이스케이프** | PostgREST 필터 특수문자(`,` `.` `(` `)` `:`) 이스케이프 유틸 + 두 훅에 적용 | S |
| **T2 해소 — duration 분 단위 전환** | `duration`을 `numeric(5,2)`로 마이그레이션하거나 분 단위 정수로 저장, 표시만 시간 | S |
| **T1 해소 — RPC 연결** | `lib/dashboard.ts`의 JS 집계를 기존 RPC 호출로 교체 | S |
| **T6 착수 — Sentry + 이벤트 트래킹** | 가입/첫 프로젝트/첫 일지/이탈 지점 계측 | S |

**완료 기준:** 신규 가입 → 첫 일지 작성까지 이탈 없이 도달. 퍼널 계측 가동.

### Phase 1 — "다시 찾게 만들기" (4~6주, 개인 가치 · Free)

> 목표: **리텐션 검증.** 결제 도입 전 사용자 확보.

- **업무일지 태그/카테고리** + 태그별 분석 차트 (P4) — §4.1
- **목표(주간 시간/일지 수) + 진행 링** (P1) — §4.2
- **기여 히트맵 + 스트릭** (P1) — 기존 `worklog_daily_stats` RPC 재활용
- **인사이트 카드** (가장 생산적인 시간대/요일)
- **알림 서버화** (S2) — 읽음 상태 테이블 + 알림 전용 뷰
- 설정 페이지 가짜 토글 실연결 (S3)

**완료 기준(KPI):** D7 리텐션 측정 가능, 주간 활성 사용자가 평균 3회 이상 기록.

### Phase 2 — "팀으로 켜기" (6~8주, 협업 = 유료화)

> 목표: **Team tier 출시 + 첫 매출.**

- **B2 해소 — 워크스페이스 + 이메일 초대** — §4.3. 초대 토큰 기반이라 `users` 조회 없이 동작(프라이버시 유지)
- 팀 대시보드(팀원별 공수·진척)
- **주간 리포트 자동 생성·공유** — §4.4 (핵심 차별점)
- worklog 댓글/반응
- 이메일/Slack 알림 (Resend / Slack webhook)
- **B3 해소 — Stripe 구독 + seat 과금 + 플랜 한도**

**완료 기준:** 첫 유료 워크스페이스 전환, 초대 → 리포트 발송 루프 완성.

### Phase 3 — "구조·확장·운영" (6주+)

- **Task 도메인** → 프로젝트 KPI를 "작업 진척" 기준으로 심화 — §4.5
- AI 주간 회고·요약 (일지 content 활용)
- 관리자 콘솔 **실데이터로 신규 구축** (목업 재생성 금지, `audit_logs` 활용)
- 캘린더 양방향 동기화, SSO, 감사로그(엔터프라이즈)
- 기술부채 정리: T3 폼 검증 통일, T5 테스트 보강, T7 컴포넌트 층 정리

*공수: S≈1~3일, M≈1주, L≈2주+*

---

## 4. 상위 기능 상세 스펙

> 전제: Supabase(PostgreSQL + RLS) · Next.js 15 Route Handler · `@worklog-plus/types` · TanStack Query. 마이그레이션은 SQL, 권한은 RLS.

### 4.1 업무일지 태그 & 분석 (Phase 1)

**화면**: 작성/수정 모달에 태그 멀티 선택(자동완성 + 신규 생성, 색상 칩) · 목록 카드에 태그 칩 + 상단 필터바 · 대시보드에 "태그별 시간 분포" 도넛

```sql
create table tags (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  name text not null,
  color text not null default '#888888',
  created_at timestamptz not null default now(),
  unique(owner_id, name)
);
create table worklog_tags (
  worklog_id uuid not null references worklogs(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (worklog_id, tag_id)
);
-- RLS: 본인 태그만 CRUD / worklog_tags는 has_project_access 기준
```

신규 RPC `worklog_tag_distribution(p_from date, p_to date)`.
**API**: `GET/POST /api/tags`, `PATCH/DELETE /api/tags/:id`, `GET /api/dashboard/tag-distribution`. worklog 생성/수정 시 `tagIds: string[]`를 RPC 한 번으로 원자 처리.
**타입**: `packages/types/src/worklog.ts`에 `Tag`, `WorklogWithTags`.

### 4.2 목표 + 기여 히트맵·스트릭 (Phase 1)

**화면**: 대시보드 상단에 "이번 주 목표" 진행 링(20h 중 12h) + 스트릭 배지(🔥 N일) · 연간 기여 히트맵 · 목표 설정 모달

```sql
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  period text not null default 'WEEKLY',   -- WEEKLY | MONTHLY
  metric text not null default 'HOURS',    -- HOURS | COUNT
  target numeric not null,
  created_at timestamptz not null default now()
);
-- RLS: 본인만 CRUD
```

히트맵/스트릭은 **신규 테이블 불필요** — `worklog_daily_stats` 재활용 + `user_streak()` RPC 추가.
**API**: `GET/PUT /api/goals`, `GET /api/dashboard/contribution?year=`, `GET /api/dashboard/streak`.

### 4.3 워크스페이스 + 멤버 초대 (Phase 2 · B2 해소)

> 초대는 **토큰 기반**으로 설계한다. `users` 테이블을 검색하지 않으므로 "이메일로 남의 계정 존재를 확인"하는 프라이버시 누수 없이 동작한다.

**화면**: 워크스페이스 스위처 · 멤버 목록/역할 관리 · 이메일 초대(대기/수락 상태) · 프로젝트를 워크스페이스에 귀속

```sql
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references users(id) on delete cascade,
  plan text not null default 'FREE',       -- FREE | PRO | TEAM
  created_at timestamptz not null default now()
);
create table workspace_members (
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null default 'MEMBER',     -- OWNER | ADMIN | MEMBER
  status text not null default 'ACTIVE',   -- INVITED | ACTIVE
  joined_at timestamptz default now(),
  primary key (workspace_id, user_id)
);
create table workspace_invites (
  token uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  email text not null,
  role text not null default 'MEMBER',
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz
);
alter table projects add column workspace_id uuid references workspaces(id) on delete cascade;
-- RLS: workspace 멤버만 해당 workspace/projects 접근. has_project_access를 workspace 기준으로 확장
```

**API**: `GET/POST /api/workspaces`, `GET /api/workspaces/:id/members`, `POST /api/workspaces/:id/invites`, `POST /api/invites/:token/accept`.
**타입**: 신규 `packages/types/src/workspace.ts`.

### 4.4 주간 리포트 자동 생성·공유 (Phase 2 · 차별점)

**화면**: 워크스페이스 "리포트" 탭 — 주차별 카드(총 공수, 멤버별 기여, 프로젝트별 분포, 하이라이트) · 개인 "내 주간 요약" + 공유 링크/이메일

```sql
create table weekly_reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,  -- 개인이면 user, 팀이면 null+workspace
  week_start date not null,
  summary jsonb not null,
  created_at timestamptz not null default now()
);
```

생성은 Supabase scheduled function(매주 월요일) 또는 첫 조회 시 lazy 생성. 집계는 기존 RPC 재사용 + 멤버별 그룹.
**API**: `GET /api/workspaces/:id/reports?week=`, `POST /api/reports/:id/share`.

### 4.5 Task 도메인 (Phase 3)

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  status text not null default 'TODO',     -- TODO | IN_PROGRESS | DONE | DELAYED
  assignee_id uuid references users(id) on delete set null,
  due_date date,
  created_at timestamptz not null default now()
);
alter table worklogs add column task_id uuid references tasks(id) on delete set null;
```

현재 진행률은 "예상 공수 대비 누적 시간"이라 **공수를 입력하지 않으면 계산되지 않는다**. Task가 들어오면 "완료 작업 비율"이라는 두 번째 산정 축이 생겨 공수 미설정 프로젝트도 진행률을 갖는다.

---

## 5. 수익화 모델 (Free → Pro → Team)

| | **Free** | **Pro** (개인) | **Team** (조직) | Enterprise |
|---|---|---|---|---|
| 가격(안) | ₩0 | ~₩6,900/월 | ~₩11,000/seat·월 | 문의 |
| 프로젝트 | 3개 | 무제한 | 무제한 | 무제한 |
| 업무일지 | 무제한 | 무제한 | 무제한 | 무제한 |
| 인사이트 기간 | 최근 30일 | 전체 + 히트맵·목표 | 전체 | 전체 |
| 태그/분석 | 기본 | 전체 | 전체 | 전체 |
| AI 주간 회고 | – | ✓ | ✓ | ✓ |
| 데이터 export | – | ✓ | ✓ | ✓ |
| 워크스페이스/멤버 | – | – | ✓ (per seat) | ✓ |
| 팀 대시보드·주간 리포트 | – | – | ✓ | ✓ |
| Slack/이메일 통합 | – | – | ✓ | ✓ |
| 역할 권한·감사로그 | – | – | 기본 | 고급 |
| SSO·SLA·온프렘 | – | – | – | ✓ |

**전환 설계:** 개인 Free로 습관 형성 → 인사이트·히트맵 잠금 해제로 **Pro** 유도 → 팀 초대 시점에 **Team**(per-seat) 자연 전환. 결제는 Stripe(구독 + seat), 한도는 `workspaces.plan` 기준으로 Route Handler와 RLS에서 이중 체크.

> **주의:** Free의 "프로젝트 3개" 한도는 Phase 2(결제 도입) 전까지 적용하지 않는다. B1을 막 푼 시점에 다시 벽을 세우면 리텐션 검증이 오염된다.

---

## 6. 다음 액션

1. **Phase 0을 이번 주 착수** — B1(권한 개방) → S1(검색 이스케이프) → T2(duration) → B4(온보딩) 순. 모두 S 공수라 1~2주에 끝난다.
2. **계측 먼저 붙이기** — Phase 1의 기능 성패를 판단하려면 Phase 0에서 퍼널이 이미 돌고 있어야 한다.
3. Phase 1은 **태그 → 목표·히트맵** 순 (기존 RPC·차트 재활용으로 공수 작고 체감 즉각적).
4. 각 기능은 마이그레이션 → 타입 → Route Handler → 훅 → UI 순, 기능 단위 PR.
5. Phase 1 종료 후 리텐션 지표를 보고 Phase 2(유료화) 시점 확정.
