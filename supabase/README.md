# Supabase (WorkLog+ 백엔드)

WorkLog+의 백엔드는 Supabase(Postgres + Auth + RLS + RPC)로 동작한다. Express 서버는 마이그레이션 완료 후 제거된다.

## 구성

```
supabase/
  config.toml          # 로컬 스택 설정 (Custom Access Token Hook 활성화 포함)
  migrations/
    *_initial_schema   # 테이블/인덱스 (users.id → auth.users FK, refresh_tokens 없음)
    *_functions        # 가입 트리거, 역할 claim Hook, RLS용 SECURITY DEFINER 헬퍼
    *_rls_policies     # 테이블별 RLS 정책 + 권한상승 차단 트리거
    *_stats_rpc        # 대시보드 집계 RPC (루프 → 단일 GROUP BY)
  seed.sql             # 데모 데이터 (로컬 db reset 시 자동 실행)
```

## 로컬 개발

```bash
npx supabase start          # 로컬 스택 기동 (Docker 필요)
npx supabase db reset       # 마이그레이션 + seed 재적용
npx supabase status         # URL/키 확인
npx supabase stop           # 종료
```

스튜디오: http://127.0.0.1:54323

### 테스트 계정 (seed)
| 이메일 | 비밀번호 | 역할 |
|--------|----------|------|
| admin@worklog.com | admin123!@# | SYSTEM_ADMIN |
| manager@worklog.com | manager123!@# | MANAGER |
| user1@worklog.com | user123!@# | USER |
| user2@worklog.com | user123!@# | USER |

## 권한 모델 (RLS)

- 역할 계층: `USER < MANAGER < ADMIN < SYSTEM_ADMIN`. 역할은 로그인 시 발급되는 JWT의 `user_role` claim(Custom Access Token Hook)으로 전달되어 RLS에서 DB 조회 없이 판정한다.
- `projects`/`project_members` 상호참조 RLS의 무한재귀는 `SECURITY DEFINER` 헬퍼(`has_project_access` 등)로 회피한다.
- `users.role`/`status`는 인증된 일반 사용자가 변경할 수 없다(`prevent_privilege_escalation` 트리거). 변경은 service role(관리자용 Route Handler) 전용.
- `activity_logs`/`audit_logs` INSERT는 service role 전용.

검증된 시나리오(psql): 프로젝트 가시성(소유/멤버/타인/관리자), worklog INSERT(WRITE만), 프로젝트 생성(MANAGER+), 작성자 한정 수정, 권한상승 차단, 집계 RPC. Hook의 `user_role` claim 주입은 실제 로그인 토큰으로 확인됨.

## TS 타입 생성

스키마 변경 시 타입을 재생성한다.

```bash
npx supabase gen types typescript --local > packages/types/src/database.types.ts
```

## 원격 프로젝트 적용 (배포 시)

> ⚠️ 현재 원격 Supabase에는 기존 Prisma 테이블(데모 데이터)이 있을 수 있다. 데모 데이터이므로 재생성 전제로 진행한다. 운영 데이터가 있다면 먼저 백업/이관 스크립트가 필요하다.

1. `npx supabase link --project-ref <PROJECT_REF>` (DB 비밀번호 입력)
2. `npx supabase db push` — 마이그레이션 적용
3. **대시보드 → Authentication → Hooks → Custom Access Token**에서 `custom_access_token_hook` 등록 (config.toml은 로컬에만 적용됨)
4. 사용자/데모 데이터는 앱 회원가입 또는 Auth Admin API로 생성 (seed.sql은 로컬 전용). 관리자 역할은 `public.users.role`을 service role로 직접 갱신.
5. `SUPABASE_SERVICE_ROLE_KEY` 등 키는 Vercel 환경변수로만 관리 (커밋 금지)
