/**
 * Prisma 시드 데이터 생성 스크립트
 * 
 * @description
 * - 개발 및 테스트를 위한 초기 데이터를 생성합니다
 * - 관리자 계정, 샘플 사용자, 프로젝트, 업무일지를 생성합니다
 * 
 * @usage
 * pnpm prisma:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * 메인 시드 함수
 */
async function main() {
  console.log('🌱 시드 데이터 생성 시작...\n');

  // ============================================
  // 1. 사용자 생성
  // ============================================
  console.log('👤 사용자 생성 중...');

  // 시스템 관리자 계정
  const adminPassword = await bcrypt.hash('admin123!@#', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@worklog.com' },
    update: {},
    create: {
      email: 'admin@worklog.com',
      passwordHash: adminPassword,
      name: '시스템 관리자',
      role: 'SYSTEM_ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log(`  ✅ 시스템 관리자: ${admin.email}`);

  // 일반 관리자 계정
  const managerPassword = await bcrypt.hash('manager123!@#', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@worklog.com' },
    update: {},
    create: {
      email: 'manager@worklog.com',
      passwordHash: managerPassword,
      name: '프로젝트 매니저',
      role: 'MANAGER',
      status: 'ACTIVE',
    },
  });
  console.log(`  ✅ 프로젝트 매니저: ${manager.email}`);

  // 일반 사용자 계정 1
  const user1Password = await bcrypt.hash('user123!@#', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@worklog.com' },
    update: {},
    create: {
      email: 'user1@worklog.com',
      passwordHash: user1Password,
      name: '홍길동',
      role: 'USER',
      status: 'ACTIVE',
    },
  });
  console.log(`  ✅ 일반 사용자 1: ${user1.email}`);

  // 일반 사용자 계정 2
  const user2Password = await bcrypt.hash('user123!@#', 10);
  const user2 = await prisma.user.upsert({
    where: { email: 'user2@worklog.com' },
    update: {},
    create: {
      email: 'user2@worklog.com',
      passwordHash: user2Password,
      name: '김철수',
      role: 'USER',
      status: 'ACTIVE',
    },
  });
  console.log(`  ✅ 일반 사용자 2: ${user2.email}\n`);

  // ============================================
  // 2. 프로젝트 생성
  // ============================================
  console.log('📁 프로젝트 생성 중...');

  const project1 = await prisma.project.create({
    data: {
      name: 'WorkLog+ 백엔드 개발',
      description: 'Express + Prisma + PostgreSQL 기반 RESTful API 서버 개발',
      status: 'ACTIVE',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-30'),
      ownerId: manager.id,
    },
  });
  console.log(`  ✅ 프로젝트 1: ${project1.name}`);

  const project2 = await prisma.project.create({
    data: {
      name: 'WorkLog+ 프론트엔드 개발',
      description: 'Next.js 15 기반 웹 애플리케이션 개발',
      status: 'ACTIVE',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-07-15'),
      ownerId: manager.id,
    },
  });
  console.log(`  ✅ 프로젝트 2: ${project2.name}`);

  const project3 = await prisma.project.create({
    data: {
      name: '모바일 앱 개발',
      description: 'React Native + Expo 기반 모바일 애플리케이션',
      status: 'PLANNED',
      startDate: new Date('2026-03-01'),
      ownerId: user1.id,
    },
  });
  console.log(`  ✅ 프로젝트 3: ${project3.name}\n`);

  // ============================================
  // 3. 프로젝트 멤버 추가
  // ============================================
  console.log('👥 프로젝트 멤버 추가 중...');

  await prisma.projectMember.create({
    data: {
      projectId: project1.id,
      userId: user1.id,
      access: 'WRITE',
    },
  });
  console.log(`  ✅ ${user1.name} → ${project1.name} (WRITE)`);

  await prisma.projectMember.create({
    data: {
      projectId: project1.id,
      userId: user2.id,
      access: 'READ',
    },
  });
  console.log(`  ✅ ${user2.name} → ${project1.name} (READ)`);

  await prisma.projectMember.create({
    data: {
      projectId: project2.id,
      userId: user1.id,
      access: 'WRITE',
    },
  });
  console.log(`  ✅ ${user1.name} → ${project2.name} (WRITE)\n`);

  // ============================================
  // 4. 업무일지 생성
  // ============================================
  console.log('📝 업무일지 생성 중...');

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  await prisma.worklog.create({
    data: {
      projectId: project1.id,
      userId: user1.id,
      title: 'Prisma 스키마 설계 및 마이그레이션',
      content: '데이터베이스 스키마를 설계하고 Prisma 마이그레이션을 실행했습니다. 7개의 테이블(users, projects, worklogs, project_members, refresh_tokens, activity_logs, audit_logs)을 생성했습니다.',
      date: today,
      duration: 4,
    },
  });
  console.log('  ✅ 업무일지 1: Prisma 스키마 설계');

  await prisma.worklog.create({
    data: {
      projectId: project1.id,
      userId: user1.id,
      title: 'JWT 인증 시스템 구현',
      content: 'Access Token과 Refresh Token을 사용한 JWT 기반 인증 시스템을 구현했습니다. bcrypt로 비밀번호를 해싱하고, 토큰 갱신 로직을 추가했습니다.',
      date: yesterday,
      duration: 5,
    },
  });
  console.log('  ✅ 업무일지 2: JWT 인증 시스템');

  await prisma.worklog.create({
    data: {
      projectId: project2.id,
      userId: user1.id,
      title: 'Next.js 프로젝트 초기 설정',
      content: 'Next.js 15 App Router 기반으로 프로젝트를 초기화했습니다. Tailwind CSS와 shadcn/ui를 설정하고, 기본 레이아웃을 구성했습니다.',
      date: twoDaysAgo,
      duration: 3,
    },
  });
  console.log('  ✅ 업무일지 3: Next.js 프로젝트 설정');

  await prisma.worklog.create({
    data: {
      projectId: project1.id,
      userId: user2.id,
      title: 'API 문서 작성',
      content: 'RESTful API 엔드포인트 명세서를 작성했습니다. 각 API의 요청/응답 형식과 에러 코드를 정리했습니다.',
      date: yesterday,
      duration: 2,
    },
  });
  console.log('  ✅ 업무일지 4: API 문서 작성\n');

  // ============================================
  // 5. 활동 로그 생성
  // ============================================
  console.log('📊 활동 로그 생성 중...');

  await prisma.activityLog.create({
    data: {
      projectId: project1.id,
      userId: manager.id,
      action: 'created_project',
      description: '프로젝트 "WorkLog+ 백엔드 개발"을 생성했습니다.',
      metadata: { projectName: project1.name },
    },
  });
  console.log('  ✅ 활동 로그 1: 프로젝트 생성');

  await prisma.activityLog.create({
    data: {
      projectId: project1.id,
      userId: user1.id,
      action: 'created_worklog',
      description: '업무일지 "Prisma 스키마 설계 및 마이그레이션"을 작성했습니다.',
    },
  });
  console.log('  ✅ 활동 로그 2: 업무일지 작성\n');

  // ============================================
  // 6. 감사 로그 생성
  // ============================================
  console.log('🔍 감사 로그 생성 중...');

  await prisma.auditLog.create({
    data: {
      action: 'USER_CREATED',
      actorId: admin.id,
      targetType: 'USER',
      targetId: user1.id,
      targetName: user1.name,
      metadata: { email: user1.email, role: user1.role },
    },
  });
  console.log('  ✅ 감사 로그 1: 사용자 생성');

  await prisma.auditLog.create({
    data: {
      action: 'PROJECT_CREATED',
      actorId: manager.id,
      targetType: 'PROJECT',
      targetId: project1.id,
      targetName: project1.name,
    },
  });
  console.log('  ✅ 감사 로그 2: 프로젝트 생성\n');

  // ============================================
  // 완료
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 시드 데이터 생성 완료!\n');
  console.log('📋 생성된 데이터 요약:');
  console.log(`  - 사용자: 4명 (시스템 관리자 1, 매니저 1, 일반 사용자 2)`);
  console.log(`  - 프로젝트: 3개`);
  console.log(`  - 프로젝트 멤버: 3개`);
  console.log(`  - 업무일지: 4개`);
  console.log(`  - 활동 로그: 2개`);
  console.log(`  - 감사 로그: 2개\n`);
  console.log('🔐 테스트 계정:');
  console.log(`  - 시스템 관리자: admin@worklog.com / admin123!@#`);
  console.log(`  - 프로젝트 매니저: manager@worklog.com / manager123!@#`);
  console.log(`  - 일반 사용자 1: user1@worklog.com / user123!@#`);
  console.log(`  - 일반 사용자 2: user2@worklog.com / user123!@#`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * 스크립트 실행
 */
main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
