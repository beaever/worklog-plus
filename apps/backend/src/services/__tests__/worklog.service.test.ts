import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../../middleware/error';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    projectMember: {
      findUnique: vi.fn(),
    },
    worklog: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from '../../lib/prisma';
import * as worklogService from '../worklog.service';

const mockMember = { projectId: 'proj-1', userId: 'user-1', access: 'WRITE' };
const mockWorklog = {
  id: 'wl-1',
  title: '테스트 업무일지',
  content: '내용',
  duration: 4,
  date: new Date('2024-01-15'),
  projectId: 'proj-1',
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  project: { id: 'proj-1', name: '테스트 프로젝트' },
  user: { id: 'user-1', name: '작성자', avatarUrl: null },
};

describe('worklog.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createWorklog', () => {
    it('WRITE 권한이 있는 멤버는 업무일지를 생성할 수 있어야 함', async () => {
      vi.mocked(prisma.projectMember.findUnique).mockResolvedValue(mockMember as any);
      vi.mocked(prisma.worklog.create).mockResolvedValue(mockWorklog as any);

      const result = await worklogService.createWorklog('user-1', {
        title: '테스트 업무일지',
        content: '내용',
        duration: 4,
        date: '2024-01-15',
        projectId: 'proj-1',
      });

      expect(result.title).toBe('테스트 업무일지');
      expect(prisma.worklog.create).toHaveBeenCalled();
    });

    it('프로젝트 멤버가 아닌 경우 403 에러를 던져야 함', async () => {
      vi.mocked(prisma.projectMember.findUnique).mockResolvedValue(null);

      await expect(
        worklogService.createWorklog('user-2', {
          title: '업무일지',
          content: '내용',
          duration: 2,
          date: '2024-01-15',
          projectId: 'proj-1',
        }),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('READ 권한만 있는 멤버는 업무일지를 생성할 수 없어야 함', async () => {
      vi.mocked(prisma.projectMember.findUnique).mockResolvedValue({
        ...mockMember,
        access: 'READ',
      } as any);

      await expect(
        worklogService.createWorklog('user-1', {
          title: '업무일지',
          content: '내용',
          duration: 2,
          date: '2024-01-15',
          projectId: 'proj-1',
        }),
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('getWorklogs', () => {
    it('일반 사용자는 접근 가능한 프로젝트의 업무일지만 조회해야 함', async () => {
      vi.mocked(prisma.worklog.findMany).mockResolvedValue([mockWorklog] as any);
      vi.mocked(prisma.worklog.count).mockResolvedValue(1);

      const result = await worklogService.getWorklogs('user-1', 'USER', { page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);

      const findManyCall = vi.mocked(prisma.worklog.findMany).mock.calls[0]?.[0];
      expect(findManyCall?.where).toHaveProperty('project');
    });

    it('ADMIN은 모든 프로젝트의 업무일지를 조회할 수 있어야 함', async () => {
      vi.mocked(prisma.worklog.findMany).mockResolvedValue([mockWorklog] as any);
      vi.mocked(prisma.worklog.count).mockResolvedValue(1);

      await worklogService.getWorklogs('admin-1', 'ADMIN', { page: 1, limit: 10 });

      const findManyCall = vi.mocked(prisma.worklog.findMany).mock.calls[0]?.[0];
      expect(findManyCall?.where).not.toHaveProperty('project');
    });
  });

  describe('getWorklogById', () => {
    it('멤버인 사용자는 업무일지를 조회할 수 있어야 함', async () => {
      vi.mocked(prisma.worklog.findUnique).mockResolvedValue(mockWorklog as any);
      vi.mocked(prisma.projectMember.findUnique).mockResolvedValue(mockMember as any);

      const result = await worklogService.getWorklogById('wl-1', 'user-1', 'USER');

      expect(result.id).toBe('wl-1');
    });

    it('존재하지 않는 업무일지는 404 에러를 던져야 함', async () => {
      vi.mocked(prisma.worklog.findUnique).mockResolvedValue(null);

      await expect(
        worklogService.getWorklogById('no-wl', 'user-1', 'USER'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('프로젝트 멤버가 아닌 사용자는 403 에러를 받아야 함', async () => {
      vi.mocked(prisma.worklog.findUnique).mockResolvedValue(mockWorklog as any);
      vi.mocked(prisma.projectMember.findUnique).mockResolvedValue(null);

      await expect(
        worklogService.getWorklogById('wl-1', 'other-user', 'USER'),
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('updateWorklog', () => {
    it('작성자는 자신의 업무일지를 수정할 수 있어야 함', async () => {
      vi.mocked(prisma.worklog.findUnique).mockResolvedValue(mockWorklog as any);
      vi.mocked(prisma.worklog.update).mockResolvedValue({
        ...mockWorklog,
        title: '수정된 제목',
      } as any);

      const result = await worklogService.updateWorklog('wl-1', 'user-1', 'USER', {
        title: '수정된 제목',
      });

      expect(result.title).toBe('수정된 제목');
      expect(prisma.worklog.update).toHaveBeenCalledWith({
        where: { id: 'wl-1' },
        data: { title: '수정된 제목' },
        include: expect.any(Object),
      });
    });

    it('다른 사용자의 업무일지를 수정하면 403 에러를 던져야 함', async () => {
      vi.mocked(prisma.worklog.findUnique).mockResolvedValue(mockWorklog as any);

      await expect(
        worklogService.updateWorklog('wl-1', 'user-2', 'USER', { title: '수정' }),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('ADMIN은 타인의 업무일지도 수정할 수 있어야 함', async () => {
      vi.mocked(prisma.worklog.findUnique).mockResolvedValue(mockWorklog as any);
      vi.mocked(prisma.worklog.update).mockResolvedValue(mockWorklog as any);

      await expect(
        worklogService.updateWorklog('wl-1', 'admin-1', 'ADMIN', { title: '수정' }),
      ).resolves.not.toThrow();
    });

    it('존재하지 않는 업무일지 수정 시 404 에러를 던져야 함', async () => {
      vi.mocked(prisma.worklog.findUnique).mockResolvedValue(null);

      await expect(
        worklogService.updateWorklog('no-wl', 'user-1', 'USER', { title: '수정' }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('deleteWorklog', () => {
    it('작성자는 자신의 업무일지를 삭제할 수 있어야 함', async () => {
      vi.mocked(prisma.worklog.findUnique).mockResolvedValue(mockWorklog as any);
      vi.mocked(prisma.worklog.delete).mockResolvedValue(mockWorklog as any);

      await expect(
        worklogService.deleteWorklog('wl-1', 'user-1', 'USER'),
      ).resolves.not.toThrow();

      expect(prisma.worklog.delete).toHaveBeenCalledWith({ where: { id: 'wl-1' } });
    });

    it('다른 사용자의 업무일지를 삭제하면 403 에러를 던져야 함', async () => {
      vi.mocked(prisma.worklog.findUnique).mockResolvedValue(mockWorklog as any);

      await expect(
        worklogService.deleteWorklog('wl-1', 'user-2', 'USER'),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('존재하지 않는 업무일지 삭제 시 404 에러를 던져야 함', async () => {
      vi.mocked(prisma.worklog.findUnique).mockResolvedValue(null);

      await expect(
        worklogService.deleteWorklog('no-wl', 'user-1', 'USER'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
