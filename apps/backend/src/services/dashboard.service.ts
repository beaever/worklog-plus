import { prisma } from '../lib/prisma';

export const getDashboard = async (userId: string) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [
    activeProjectCount,
    monthlyWorklogs,
    recentActivities,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        status: 'ACTIVE',
        OR: [
          { ownerId: userId },
          { members: { some: { userId, access: { in: ['READ', 'WRITE'] } } } },
        ],
      },
    }),
    prisma.worklog.findMany({
      where: {
        userId,
        date: { gte: monthStart, lte: monthEnd },
      },
      select: { duration: true },
    }),
    prisma.activityLog.findMany({
      where: {
        OR: [
          { userId },
          {
            project: {
              OR: [
                { ownerId: userId },
                { members: { some: { userId } } },
              ],
            },
          },
        ],
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        project: { select: { id: true, name: true } },
      },
    }),
  ]);

  const totalDurationHours = monthlyWorklogs.reduce((sum, w) => sum + w.duration, 0);

  return {
    activeProjectCount,
    monthlyWorklogCount: monthlyWorklogs.length,
    totalDurationHours,
    recentActivities,
  };
};

export const getStats = async (userId: string) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevWeekEnd = new Date(weekStart);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const memberWhere = {
    OR: [
      { ownerId: userId },
      { members: { some: { userId, access: { in: ['READ', 'WRITE'] } } } },
    ],
  };

  const [
    totalProjects, activeProjects, completedProjects,
    weeklyWorklogs, prevWeekWorklogs, monthWorklogs,
  ] = await Promise.all([
    prisma.project.count({ where: memberWhere }),
    prisma.project.count({ where: { ...memberWhere, status: 'ACTIVE' } }),
    prisma.project.count({ where: { ...memberWhere, status: 'DONE' } }),
    prisma.worklog.findMany({
      where: { userId, date: { gte: weekStart } },
      select: { duration: true },
    }),
    prisma.worklog.findMany({
      where: { userId, date: { gte: prevWeekStart, lt: prevWeekEnd } },
      select: { duration: true },
    }),
    prisma.worklog.findMany({
      where: { userId, date: { gte: monthStart, lte: monthEnd } },
      select: { duration: true },
    }),
  ]);

  const totalHours = monthWorklogs.reduce((s, w) => s + w.duration, 0);
  const weeklyChange = weeklyWorklogs.length - prevWeekWorklogs.length;

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    weeklyWorklogs: weeklyWorklogs.length,
    weeklyWorklogsChange: weeklyChange,
    totalHours: `${totalHours}h`,
    totalHoursChange: weeklyWorklogs.reduce((s, w) => s + w.duration, 0) -
      prevWeekWorklogs.reduce((s, w) => s + w.duration, 0),
  };
};

export const getWeeklyActivity = async (userId: string) => {
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  const now = new Date();
  const results = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

    const worklogs = await prisma.worklog.findMany({
      where: { userId, date: { gte: start, lt: end } },
      select: { duration: true },
    });

    results.push({
      day: dayLabels[d.getDay()],
      worklogs: worklogs.length,
      hours: worklogs.reduce((s, w) => s + w.duration, 0),
    });
  }

  return results;
};

export const getProjectDistribution = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId, access: { in: ['READ', 'WRITE'] } } } },
      ],
    },
    select: {
      name: true,
      _count: { select: { worklogs: true } },
    },
    orderBy: { worklogs: { _count: 'desc' } },
    take: 5,
  });

  return projects.map((p) => ({
    name: p.name,
    value: p._count.worklogs,
  }));
};

export const getMonthlyTrend = async (userId: string) => {
  const results = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const worklogs = await prisma.worklog.findMany({
      where: { userId, date: { gte: start, lte: end } },
      select: { duration: true },
    });

    results.push({
      month: `${d.getMonth() + 1}월`,
      worklogs: worklogs.length,
      hours: worklogs.reduce((s, w) => s + w.duration, 0),
    });
  }

  return results;
};

export const getRecentWorklogs = async (userId: string) => {
  const worklogs = await prisma.worklog.findMany({
    where: { userId },
    take: 5,
    orderBy: { date: 'desc' },
    include: { project: { select: { name: true } } },
  });

  return worklogs.map((w) => ({
    id: w.id,
    title: w.title,
    projectName: w.project.name,
    date: w.date.toISOString().slice(0, 10),
    duration: w.duration,
  }));
};

export const getPeriodStats = async (
  userId: string,
  period: 'week' | 'month' | 'year',
) => {
  const now = new Date();
  const entries: Array<{ label: string; start: Date; end: Date }> = [];

  if (period === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      entries.push({
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        start,
        end,
      });
    }
  } else if (period === 'month') {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      entries.push({
        label: `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`,
        start,
        end,
      });
    }
  } else {
    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i;
      entries.push({
        label: `${year}`,
        start: new Date(year, 0, 1),
        end: new Date(year + 1, 0, 0),
      });
    }
  }

  const results = await Promise.all(
    entries.map(async ({ label, start, end }) => {
      const worklogs = await prisma.worklog.findMany({
        where: { userId, date: { gte: start, lte: end } },
        select: { duration: true },
      });
      return {
        label,
        worklogCount: worklogs.length,
        durationHours: worklogs.reduce((s, w) => s + w.duration, 0),
      };
    }),
  );

  return { period, entries: results };
};
