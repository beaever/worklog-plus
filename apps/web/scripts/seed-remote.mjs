// 원격 Supabase 시드 스크립트 (service role + Auth Admin API)
// seed.sql은 로컬(db reset) 전용이므로, 원격에는 이 스크립트로 데모 데이터를 넣는다.
//
// 동작:
//   1. Auth Admin API로 테스트 계정 4개 생성 → on_auth_user_created 트리거가 public.users 프로필 자동 생성
//   2. 역할(role) 보정 (트리거는 항상 USER로 생성하므로 service role로 갱신)
//   3. 데모 프로젝트/멤버/업무일지/활동로그/감사로그 삽입
//
// 멱등성: 여러 번 실행해도 안전. 계정은 이메일로 중복 확인, 데모 프로젝트/감사로그는 고정 UUID로 선삭제 후 재삽입.
//
// 실행:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node apps/web/scripts/seed-remote.mjs
//   (apps/web 기준으로 @supabase/supabase-js를 해석하므로 repo 루트에서 실행 가능)

import { pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';

// Node 20에는 네이티브 WebSocket이 없어 supabase-js realtime 초기화가 실패한다.
// 시드는 realtime을 쓰지 않지만 클라이언트 생성 시 필요하므로 ws로 전역 폴리필한다.
if (typeof globalThis.WebSocket === 'undefined' && process.env.WS_MODULE) {
  const ws = await import(pathToFileURL(process.env.WS_MODULE).href);
  globalThis.WebSocket = ws.WebSocket ?? ws.default;
}

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    '환경변수 누락: SUPABASE_URL(또는 NEXT_PUBLIC_SUPABASE_URL) 과 SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.'
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// YYYY-MM-DD (오늘 기준 offset일)
function dateStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const USERS = [
  { email: 'admin@worklog.com', password: 'admin123!@#', name: '시스템 관리자', role: 'SYSTEM_ADMIN' },
  { email: 'manager@worklog.com', password: 'manager123!@#', name: '프로젝트 매니저', role: 'MANAGER' },
  { email: 'user1@worklog.com', password: 'user123!@#', name: '홍길동', role: 'USER' },
  { email: 'user2@worklog.com', password: 'user123!@#', name: '김철수', role: 'USER' },
];

// 데모 프로젝트는 고정 UUID로 두어 재실행 시 선삭제(cascade) 후 재삽입한다.
const PROJECT_IDS = {
  backend: '10000000-0000-0000-0000-000000000001',
  frontend: '10000000-0000-0000-0000-000000000002',
  mobile: '10000000-0000-0000-0000-000000000003',
};

async function ensureUsers() {
  // 기존 사용자 이메일 → id 맵 (페이지네이션)
  const existing = new Map();
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    for (const u of data.users) existing.set(u.email, u.id);
    if (data.users.length < 1000) break;
  }

  const idByEmail = {};
  for (const u of USERS) {
    let id = existing.get(u.email);
    if (id) {
      console.log(`  · 이미 존재: ${u.email}`);
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { name: u.name },
      });
      if (error) throw new Error(`createUser(${u.email}) 실패: ${error.message}`);
      id = data.user.id;
      console.log(`  ✓ 생성: ${u.email}`);
    }
    idByEmail[u.email] = id;

    // 역할 보정 (트리거가 USER로 만들므로 service role로 갱신 → auth.uid() null이라 권한상승 트리거 통과)
    const { error: roleErr } = await admin
      .from('users')
      .update({ role: u.role, name: u.name })
      .eq('id', id);
    if (roleErr) throw new Error(`role 갱신(${u.email}) 실패: ${roleErr.message}`);
  }
  return idByEmail;
}

async function seedData(idByEmail) {
  const admin_ = idByEmail['admin@worklog.com'];
  const manager = idByEmail['manager@worklog.com'];
  const user1 = idByEmail['user1@worklog.com'];
  const user2 = idByEmail['user2@worklog.com'];

  // 데모 프로젝트 선삭제 (worklogs/members/activity_logs는 FK cascade로 함께 삭제됨)
  await admin.from('projects').delete().in('id', Object.values(PROJECT_IDS));

  // 1. 프로젝트
  const { error: pErr } = await admin.from('projects').insert([
    { id: PROJECT_IDS.backend, name: 'WorkLog+ 백엔드 개발', description: 'Supabase 기반 백엔드(Auth/RLS/RPC) 구축', status: 'ACTIVE', start_date: '2026-01-01', end_date: '2026-06-30', owner_id: manager },
    { id: PROJECT_IDS.frontend, name: 'WorkLog+ 프론트엔드 개발', description: 'Next.js 15 기반 웹 애플리케이션 개발', status: 'ACTIVE', start_date: '2026-01-15', end_date: '2026-07-15', owner_id: manager },
    { id: PROJECT_IDS.mobile, name: '모바일 앱 개발', description: 'React Native + Expo 기반 모바일 애플리케이션', status: 'PLANNED', start_date: '2026-03-01', end_date: null, owner_id: user1 },
  ]);
  if (pErr) throw new Error(`projects 삽입 실패: ${pErr.message}`);

  // 2. 프로젝트 멤버
  const { error: mErr } = await admin.from('project_members').insert([
    { project_id: PROJECT_IDS.backend, user_id: user1, access: 'WRITE' },
    { project_id: PROJECT_IDS.backend, user_id: user2, access: 'READ' },
    { project_id: PROJECT_IDS.frontend, user_id: user1, access: 'WRITE' },
  ]);
  if (mErr) throw new Error(`project_members 삽입 실패: ${mErr.message}`);

  // 3. 업무일지
  const { error: wErr } = await admin.from('worklogs').insert([
    { project_id: PROJECT_IDS.backend, user_id: user1, title: 'Supabase 스키마 설계 및 마이그레이션', content: '7개 테이블을 Supabase로 이관하고 RLS 정책을 설계했습니다.', date: dateStr(0), duration: 4 },
    { project_id: PROJECT_IDS.backend, user_id: user1, title: 'Supabase Auth 연동', content: 'Supabase Auth로 인증을 전환하고 트리거로 프로필을 자동 생성했습니다.', date: dateStr(-1), duration: 5 },
    { project_id: PROJECT_IDS.frontend, user_id: user1, title: 'Next.js 프로젝트 초기 설정', content: 'App Router 기반 초기화, Tailwind/shadcn 설정, 기본 레이아웃 구성.', date: dateStr(-2), duration: 3 },
    { project_id: PROJECT_IDS.backend, user_id: user2, title: 'RLS 정책 문서화', content: 'RLS 정책과 권한 시나리오를 정리했습니다.', date: dateStr(-1), duration: 2 },
  ]);
  if (wErr) throw new Error(`worklogs 삽입 실패: ${wErr.message}`);

  // 4. 활동 로그
  const { error: aErr } = await admin.from('activity_logs').insert([
    { project_id: PROJECT_IDS.backend, user_id: manager, action: 'created_project', description: '프로젝트 "WorkLog+ 백엔드 개발"을 생성했습니다.', metadata: { projectName: 'WorkLog+ 백엔드 개발' } },
    { project_id: PROJECT_IDS.backend, user_id: user1, action: 'created_worklog', description: '업무일지 "Supabase 스키마 설계 및 마이그레이션"을 작성했습니다.', metadata: null },
  ]);
  if (aErr) throw new Error(`activity_logs 삽입 실패: ${aErr.message}`);

  // 5. 감사 로그 (고정 target_id로 선삭제 후 재삽입)
  await admin.from('audit_logs').delete().in('target_id', [user1, PROJECT_IDS.backend]);
  const { error: auErr } = await admin.from('audit_logs').insert([
    { action: 'USER_CREATED', actor_id: admin_, target_type: 'USER', target_id: user1, target_name: '홍길동', metadata: { email: 'user1@worklog.com', role: 'USER' } },
    { action: 'PROJECT_CREATED', actor_id: manager, target_type: 'PROJECT', target_id: PROJECT_IDS.backend, target_name: 'WorkLog+ 백엔드 개발', metadata: null },
  ]);
  if (auErr) throw new Error(`audit_logs 삽입 실패: ${auErr.message}`);
}

async function main() {
  console.log(`원격 시드 시작: ${SUPABASE_URL}`);
  console.log('1) 사용자 생성/보정');
  const idByEmail = await ensureUsers();
  console.log('2) 데모 데이터 삽입');
  await seedData(idByEmail);
  console.log('\n✅ 시드 완료');
  console.log('   계정: admin@worklog.com / manager@worklog.com / user1@worklog.com / user2@worklog.com');
  console.log('   비밀번호: admin123!@# / manager123!@# / user123!@# (user1·user2 공통)');
}

main().catch((e) => {
  console.error('\n❌ 시드 실패:', e.message);
  process.exit(1);
});
