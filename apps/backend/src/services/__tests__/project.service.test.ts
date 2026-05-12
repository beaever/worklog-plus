import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    project: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    projectMember: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { prisma } from '../../lib/prisma';
import * as projectService from '../project.service';

const mockProject = {
  id: 'proj-1',
  name: '테스트 프로젝트',
  description: '설명',
  status: 'ACTIVE',
  ownerId: 'user-1',
  startDate: new Date('2024-01-01'),
  endDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('project.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProject', () => {
    it('프로젝트를 생성하고 소유자를 멤버로 추가해야 함', async () => {
      vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => {
        vi.mocked(prisma.project.create).mockResolvedValue(mockProject as any);
        vi.mocked(prisma.projectMember.create).mockResolvedValue({} as any);
        return fn({
          project: { create: vi.fn().mockResolvedValue(mockProject) },
          projectMember: { create: vi.fn().mockResolvedValue({}) },
        });
      });

      await projectService.createProject('user-1', {
        name: '테스트 프로젝트',
        status: 'ACTIVE',
        startDate: '2024-01-01',
      });

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('getProjects', () => {
    it('사용자가 접근 가능한 프로젝트 목록을 반환해야 함', async () => {
      vi.mocked(prisma.project.findMany).mockResolvedValue([mockProject] as any);
      vi.mocked(prisma.project.count).mockResolvedValue(1);

      const result = await projectService.getProjects('user-1', { page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('status 필터가 where 조건에 반영되어야 함', async () => {
      vi.mocked(prisma.project.findMany).mockResolvedValue([] as any);
      vi.mocked(prisma.project.count).mockResolvedValue(0);

      await projectService.getProjects('user-1', { page: 1, limit: 10, status: 'DONE' });

      const findManyCall = vi.mocked(prisma.project.findMany).mock.calls[0]?.[0];
      expect(findManyCall?.where).toMatchObject({ status: 'DONE' });
    });
  });

  describe('getProjectById', () => {
    it('멤버인 사용자는 프로젝트를 조회할 수 있어야 함', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        ...mockProject,
        owner: { id: 'user-1', name: '소유자', avatarUrl: null },
        members: [{ userId: 'user-1' }],
        _count: { worklogs: 0 },
      } as any);

      const result = await projectService.getProjectById('proj-1', 'user-1');

      expect(result.id).toBe('proj-1');
    });

    it('존재하지 않는 프로젝트는 404 에러를 던져야 함', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(projectService.getProjectById('no-proj', 'user-1')).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('멤버가 아닌 사용자는 403 에러를 던져야 함', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        ...mockProject,
        ownerId: 'user-2',
        owner: { id: 'user-2', name: '소유자', avatarUrl: null },
        members: [],
        _count: { worklogs: 0 },
      } as any);

      await expect(projectService.getProjectById('proj-1', 'user-1')).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });

  describe('updateProject', () => {
    it('소유자는 프로젝트를 수정할 수 있어야 함', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);
      vi.mocked(prisma.project.update).mockResolvedValue({
        ...mockProject,
        name: '수정된 이름',
      } as any);

      const result = await projectService.updateProject('proj-1', 'user-1', 'USER', {
        name: '수정된 이름',
      });

      expect(result.name).toBe('수정된 이름');
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'proj-1' },
        data: { name: '수정된 이름' },
      });
    });

    it('소유자가 아닌 일반 사용자는 403 에러를 던져야 함', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);

      await expect(
        projectService.updateProject('proj-1', 'user-2', 'USER', { name: '수정' }),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('ADMIN은 소유자가 아니어도 수정할 수 있어야 함', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);
      vi.mocked(prisma.project.update).mockResolvedValue(mockProject as any);

      await expect(
        projectService.updateProject('proj-1', 'admin-1', 'ADMIN', { name: '수정' }),
      ).resolves.not.toThrow();
    });

    it('존재하지 않는 프로젝트 수정 시 404 에러를 던져야 함', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(
        projectService.updateProject('no-proj', 'user-1', 'USER', { name: '수정' }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('deleteProject', () => {
    it('소유자는 프로젝트를 삭제할 수 있어야 함', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);
      vi.mocked(prisma.project.delete).mockResolvedValue(mockProject as any);

      await expect(
        projectService.deleteProject('proj-1', 'user-1', 'USER'),
      ).resolves.not.toThrow();

      expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 'proj-1' } });
    });

    it('소유자가 아닌 일반 사용자는 403 에러를 던져야 함', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);

      await expect(
        projectService.deleteProject('proj-1', 'user-2', 'USER'),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('존재하지 않는 프로젝트 삭제 시 404 에러를 던져야 함', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(
        projectService.deleteProject('no-proj', 'user-1', 'USER'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
