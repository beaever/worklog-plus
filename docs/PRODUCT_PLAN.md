# WorkLog+ 상용화 기획서

> 방향: **하이브리드 (개인 → 팀 단계적)** · 수익모델: **Free → Pro(개인) → Team(조직) 3-tier**
> 작성: 2026-06-10 · 상태: 초안(v1)

---

## 0. 한 줄 요약

> **"개인의 업무일지가 그대로 팀의 진척 리포트가 되는, 가볍지만 인사이트가 쌓이는 업무 기록 도구."**

현재 WorkLog+는 "혼자 쓰는 입력 폼 + 정적 대시보드"에 머물러 단조롭다. 이 기획의 핵심은 **(1) 기록을 다시 찾게 만드는 피드백 루프(개인 가치)** 와 **(2) 개인 기록이 팀 협업·리포트로 자동 연결되는 구조(팀 가치)** 를 더해 상용 SaaS로 전환하는 것이다.

---

## 1. 문제 정의 — 왜 단조로운가

조사 결과(완성도 ~70%) 드러난 단조로움의 4대 원인:

| # | 원인 | 근거 (현재 상태) |
|---|------|------------------|
| P1 | **피드백 루프 부재** | 기록해도 보상·변화가 없음. 목표/스트릭/인사이트 없음 → 매일 열 이유가 없다 |
| P2 | **협업 레이어 미실현** | `project_members`·RLS·role은 DB에 있으나 **초대/팀 UI가 전혀 없음** → 사실상 1인 도구 |
| P3 | **구조 빈약 (Task 부재)** | 프로젝트 상세의 KPI·진행률·타임라인이 전부 빈 값 (`use-projects.ts`에서 null/[] 반환) |
| P4 | **기록의 단조로운 표현** | worklog = 제목/내용/시간/날짜뿐. 태그·카테고리·분류 없음 → 분석도 단조 |

추가로 상용화 차단 요소: 알림 스켈레톤만 존재, 관리자 기능 목업, 결제·온보딩·과금한도·에러 모니터링 부재.

---

## 2. 페르소나 & 가치 제안

### 페르소나
| | Alex — 개인 프로 | Mina — 팀 리드 | Jun — 팀원 |
|---|---|---|---|
| 역할 | 프리랜서/직장인 | 매니저/PM (`MANAGER`+) | 실무자 (`USER`) |
| 목표 | 내 업무를 증명·회고 | 마이크로매니징 없이 진척 파악 | 최소 마찰로 기록·인정받기 |
| 페인 | 뭘 했는지 기억 안 남, 회고 귀찮음 | 주간 보고 취합이 수작업 | 입력이 번거롭고 보람 없음 |
| WorkLog+ 가치 | 자동 인사이트·회고·스트릭 | 개인 일지 → 팀 리포트 자동 집계 | 가벼운 기록 + 반응/인정 |

### 차별화 (경쟁 대비)
- **Jira/Asana**: 너무 무겁다 → WorkLog+는 "일지" 단위의 가벼움 유지
- **Notion/Docs**: 비구조적이라 집계 불가 → WorkLog+는 구조화된 기록 + 자동 집계
- **Toggl/Clockify**: 시간만 → WorkLog+는 시간 + 내용 + 인사이트 + 팀 리포트
- **핵심 차별점**: *개인용으로 가볍게 시작 → 팀 초대 한 번으로 협업·리포트가 켜지는 양방향 연속성*

---

## 3. 기능 백로그 (임팩트 / 공수 매트릭스)

임팩트(상용화·리텐션 기여) × 공수(개발 난이도) 기준. ★ = 우선.

### 🟢 High Impact / Low~Mid Effort — 먼저
| 기능 | 해소 | 공수 | 비고 |
|------|------|------|------|
| ★ 업무일지 **태그/카테고리** + 태그별 분석 | P4 | S | worklog에 컬럼/조인 테이블 추가, 차트 재활용 |
| ★ **목표(주간 시간/일지 수)** + 진행 링 | P1 | M | 신규 goals 테이블, 대시보드 위젯 |
| ★ **기여 히트맵 + 스트릭**(GitHub식) | P1 | S | 기존 `worklog_daily_stats` RPC 재활용 |
| **인사이트 카드**(가장 생산적 시간대/요일) | P1 | S | 집계 RPC 추가, 카드 UI |
| **인앱 알림 실연결**(현 스켈레톤 완성) | P1/P2 | S | `activity_logs` → 알림, 읽음 상태 서버화 |

### 🟡 High Impact / High Effort — 핵심 투자
| 기능 | 해소 | 공수 | 비고 |
|------|------|------|------|
| ★ **팀 워크스페이스 + 멤버 초대**(project_members UI 연결) | P2 | L | 협업의 토대, Team tier 핵심 |
| ★ **주간 리포트 자동 생성·공유** | P2 | M | 개인 일지 → 팀 리포트 (차별점) |
| **Stripe 결제 + 플랜 한도** | 수익 | L | Free/Pro/Team 과금 |
| worklog **댓글/반응** | P2 | M | 협업 인정 루프 |
| 이메일/Slack 알림 | P2 | M | Resend / Slack webhook |

### 🔵 Mid Impact — 이후
| 기능 | 해소 | 공수 |
|------|------|------|
| **Task 도메인** + 프로젝트 KPI/진행률/타임라인 채우기 | P3 | L |
| AI 주간 회고·요약(일지 content 활용) | P1/P3 | M |
| 관리자 기능 실데이터 연결(users/roles/audit/settings) | 운영 | M |
| 캘린더 양방향 동기화, SSO, 감사로그(엔터프라이즈) | 확장 | L |
| 온보딩 플로우 / 에러 모니터링(Sentry) / 사용량 분석 | 운영 | S~M |

*공수: S≈1~3일, M≈1주, L≈2주+*

---

## 4. 로드맵 (Phase 1~3)

### Phase 1 — "다시 찾게 만들기" (개인 가치 · 약 4~6주)
> 목표: **단조로움 해소 + 리텐션 검증** (결제 도입 전, Free로 사용자 확보)
- 업무일지 태그/카테고리 + 태그별 분석 차트
- 목표(주간) + 진행 링 위젯
- 기여 히트맵 + 스트릭
- 인사이트 카드
- 인앱 알림 실연결 + 읽음 상태 서버화
- (운영) Sentry, 기본 온보딩, 제품 분석 이벤트

**완료 기준(KPI):** D7 리텐션 측정 가능, 주간 활성 사용자가 평균 3+회 기록.

### Phase 2 — "팀으로 켜기" (협업 = 유료화 · 약 6~8주)
> 목표: **Team tier 출시 + 수익화 시작**
- 팀 워크스페이스 + 멤버 초대(project_members UI 연결, RLS 활용)
- 팀 대시보드(팀원별 공수·진척)
- 주간 리포트 자동 생성·공유
- worklog 댓글/반응
- 이메일/Slack 알림
- **Stripe 결제 + 플랜 한도(Free/Pro/Team)** + 빌링 포털

**완료 기준:** 첫 유료 워크스페이스 전환, 팀 초대→리포트 발송 루프 완성.

### Phase 3 — "구조·확장·운영" (약 6주+)
> 목표: **제품 깊이 + 엔터프라이즈 준비**
- Task 도메인 추가 → 프로젝트 상세 KPI/진행률/타임라인 실데이터
- AI 주간 회고/요약
- 관리자 기능 실데이터 연결
- 통합(캘린더/Slack 심화), SSO·감사로그(엔터프라이즈)

---

## 5. 상위 기능 상세 스펙 (화면 / 스키마 / API)

> 스택 전제: Supabase(PostgreSQL + RLS) · Next.js 15 Route Handler · `@worklog-plus/types` · TanStack Query. 마이그레이션은 SQL, 권한은 RLS.

### 5.1 업무일지 태그 & 분석 ★ (Phase 1)

**화면**
- 작성/수정 모달: 태그 멀티 선택(자동완성 + 신규 생성), 색상 칩
- 목록: 카드에 태그 칩, 상단 태그 필터바
- 대시보드: "태그별 시간 분포" 도넛 + "태그별 추이" 추가

**스키마 (신규 마이그레이션)**
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
-- RLS: 본인 태그만 CRUD / worklog_tags는 해당 worklog 접근권(has_project_access) 기준
```
신규 RPC: `worklog_tag_distribution(p_from date, p_to date)` → 태그별 일지수/시간.

**API (Route Handler)**
- `GET/POST /api/tags`, `PATCH/DELETE /api/tags/:id`
- worklog 생성/수정 시 `tagIds: string[]` 함께 트랜잭션 처리(`$transaction` 대응 = RPC 또는 단일 호출 묶음)
- `GET /api/dashboard/tag-distribution`

**타입** `packages/types/src/worklog.ts` 에 `Tag`, `WorklogWithTags` 추가.

---

### 5.2 목표 + 기여 히트맵·스트릭 ★ (Phase 1)

**화면**
- 대시보드 상단: "이번 주 목표" 진행 링(예: 20h 중 12h), 스트릭 배지(🔥 N일)
- 연간 기여 히트맵(GitHub식, 일별 농도 = 기록량)
- 목표 설정 모달(주간 시간/일지 수 타깃)

**스키마**
```sql
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  period text not null default 'WEEKLY',        -- WEEKLY | MONTHLY
  metric text not null default 'HOURS',          -- HOURS | COUNT
  target numeric not null,
  created_at timestamptz not null default now()
);
-- RLS: 본인만 CRUD
```
스트릭/히트맵은 **신규 테이블 불필요** — 기존 `worklog_daily_stats` RPC 재활용. 스트릭 계산 RPC `user_streak(p_user uuid)` 추가.

**API**
- `GET/PUT /api/goals` (현재 사용자 목표)
- `GET /api/dashboard/contribution?year=2026` → 일별 집계
- `GET /api/dashboard/streak`

**타입** `packages/types/src/dashboard.ts` 에 `Goal`, `ContributionDay`, `StreakInfo`.

---

### 5.3 팀 워크스페이스 + 멤버 초대 ★ (Phase 2 · 협업 토대)

> 현재 `project_members(access)`·RLS·`has_project_access()` 가 이미 존재. **워크스페이스 상위 개념**을 더해 "개인→팀" 전환을 자연스럽게 만든다.

**화면**
- 워크스페이스 스위처(상단), 멤버 목록·역할 관리, 이메일 초대(대기/수락 상태)
- 프로젝트를 워크스페이스에 귀속 → 멤버 자동 접근

**스키마**
```sql
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references users(id) on delete cascade,
  plan text not null default 'FREE',             -- FREE | PRO | TEAM
  created_at timestamptz not null default now()
);
create table workspace_members (
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null default 'MEMBER',           -- OWNER | ADMIN | MEMBER
  invited_email text,
  status text not null default 'ACTIVE',          -- INVITED | ACTIVE
  joined_at timestamptz default now(),
  primary key (workspace_id, user_id)
);
alter table projects add column workspace_id uuid references workspaces(id) on delete cascade;
-- RLS: workspace 멤버만 해당 workspace/projects 접근. has_project_access를 workspace 기준으로 확장.
```
초대 수락 흐름: 초대 토큰 메일 → 가입/로그인 → `workspace_members.status = ACTIVE`.

**API**
- `GET/POST /api/workspaces`, `GET /api/workspaces/:id/members`
- `POST /api/workspaces/:id/invites`(이메일), `POST /api/invites/:token/accept`
- 기존 프로젝트/일지 쿼리에 `workspace_id` 스코프 추가

**타입** 신규 `packages/types/src/workspace.ts`.

---

### 5.4 주간 리포트 자동 생성·공유 ★ (Phase 2 · 차별점)

**화면**
- 워크스페이스 "리포트" 탭: 주차별 카드(총 공수, 멤버별 기여, 프로젝트별 분포, 하이라이트)
- 개인용 "내 주간 요약" + 공유 링크/이메일 발송

**스키마**
```sql
create table weekly_reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,  -- 개인 리포트면 user, 팀이면 null+workspace
  week_start date not null,
  summary jsonb not null,                                -- 집계 스냅샷
  created_at timestamptz not null default now()
);
```
생성: Supabase **scheduled function**(매주 월요일) 또는 첫 조회 시 lazy 생성. 집계는 기존 RPC 재사용 + 멤버별 그룹.

**API**
- `GET /api/workspaces/:id/reports?week=...`
- `POST /api/reports/:id/share`(이메일/링크)
- (배치) Supabase cron → `generate_weekly_reports()`

---

### 5.5 (Phase 3) Task 도메인 → 프로젝트 KPI 채우기

> 현재 빈 KPI/진행률/타임라인을 실데이터로. worklog를 task에 연결해 "작업 진척"을 만든다.

**스키마**
```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  status text not null default 'TODO',           -- TODO | IN_PROGRESS | DONE | DELAYED
  assignee_id uuid references users(id) on delete set null,
  due_date date,
  created_at timestamptz not null default now()
);
alter table worklogs add column task_id uuid references tasks(id) on delete set null;
```
→ `ProjectKPI`(totalTasks/completed/inProgress/delayed) · 진행률 · 타임라인이 실제 값으로 채워짐.

---

## 6. 수익화 모델 (Free → Pro → Team)

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

**전환 설계:** 개인 Free로 습관 형성 → 인사이트·히트맵 잠금 해제로 **Pro** 유도 → 팀 초대 시점에 **Team**(per-seat) 자연 전환. 결제는 Stripe(구독 + seat 기반), 사용량 한도는 미들웨어/RLS에서 `workspaces.plan` 기준 체크.

---

## 7. 다음 액션 제안

1. **Phase 1 착수**: `5.1 태그` → `5.2 목표·히트맵` 순으로 구현(둘 다 기존 RPC·차트 재활용으로 공수 작음, 단조로움 즉시 해소).
2. 각 기능은 마이그레이션 → 타입 → Route Handler → 훅 → UI 순, 기능 단위 PR.
3. Phase 1 종료 후 리텐션 지표 보고 Phase 2(유료화) 시점 결정.

> 원하시면 **Phase 1의 첫 기능(태그 시스템)을 바로 구현 스펙→코드로 착수**하겠습니다.
