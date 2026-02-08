'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@worklog-plus/ui';
import { Users, Shield, Settings, FileText, ArrowRight } from 'lucide-react';
import { useUserStore } from '@worklog-plus/store';

const adminCards = [
  {
    href: '/admin/users',
    title: '사용자 관리',
    description: '사용자 계정을 관리하고 권한을 설정합니다.',
    icon: Users,
    stats: '64명의 사용자',
    roles: ['SYSTEM_ADMIN', 'ADMIN'],
  },
  {
    href: '/admin/roles',
    title: '권한 & 역할',
    description: '시스템 역할과 권한을 관리합니다.',
    icon: Shield,
    stats: '4개의 역할',
    roles: ['SYSTEM_ADMIN'],
  },
  {
    href: '/admin/settings',
    title: '시스템 설정',
    description: '시스템 전반의 설정을 관리합니다.',
    icon: Settings,
    stats: '3개의 설정 그룹',
    roles: ['SYSTEM_ADMIN'],
  },
  {
    href: '/admin/audit-logs',
    title: '활동 로그',
    description: '시스템 활동 로그를 조회합니다.',
    icon: FileText,
    stats: '최근 7일간 128건',
    roles: ['SYSTEM_ADMIN', 'ADMIN'],
  },
];

export default function AdminPage() {
  const { user } = useUserStore();

  const filteredCards = adminCards.filter((card) =>
    user?.role ? card.roles.includes(user.role) : false,
  );

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>관리자 대시보드</h1>
        <p className='text-muted-foreground'>시스템 관리 기능에 접근합니다.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {filteredCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className='h-full transition-shadow hover:shadow-md'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className='rounded-lg bg-primary/10 p-2'>
                    <card.icon className='h-5 w-5 text-primary' />
                  </div>
                  <ArrowRight className='h-4 w-4 text-muted-foreground' />
                </div>
                <CardTitle className='mt-4'>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>{card.stats}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
