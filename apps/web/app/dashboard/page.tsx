'use client';

import { FolderOpen, FileText, Clock, CheckCircle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { WeeklyActivityChart } from '@/components/dashboard/weekly-activity-chart';
import { ProjectDistributionChart } from '@/components/dashboard/project-distribution-chart';
import { MonthlyTrendChart } from '@/components/dashboard/monthly-trend-chart';
import { RecentWorklogs } from '@/components/dashboard/recent-worklogs';
import { useDashboardStats } from '@/hooks/use-dashboard';

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>대시보드</h1>
          <p className='text-muted-foreground'>업무 현황을 한눈에 확인하세요</p>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='h-32 animate-pulse rounded-lg bg-muted'
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>대시보드</h1>
        <p className='text-muted-foreground'>업무 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='총 프로젝트'
          value={stats?.totalProjects || 0}
          description={`활성 프로젝트 ${stats?.activeProjects || 0}개`}
          icon={FolderOpen}
        />
        <StatCard
          title='이번 주 업무일지'
          value={stats?.weeklyWorklogs || 0}
          description='전주 대비'
          icon={FileText}
          trend={{
            value: stats?.weeklyWorklogsChange || 0,
            isPositive: (stats?.weeklyWorklogsChange || 0) > 0,
          }}
        />
        <StatCard
          title='총 작업 시간'
          value={stats?.totalHours || '0h'}
          description='이번 달 누적'
          icon={Clock}
          trend={{
            value: stats?.totalHoursChange || 0,
            isPositive: (stats?.totalHoursChange || 0) > 0,
          }}
        />
        <StatCard
          title='완료된 프로젝트'
          value={stats?.completedProjects || 0}
          description='이번 분기'
          icon={CheckCircle}
        />
      </div>

      {/* 차트 영역 */}
      <div className='grid gap-4 lg:grid-cols-2'>
        <WeeklyActivityChart />
        <ProjectDistributionChart />
      </div>

      {/* 월별 추이 */}
      <MonthlyTrendChart />

      {/* 최근 업무일지 */}
      <RecentWorklogs />
    </div>
  );
}
