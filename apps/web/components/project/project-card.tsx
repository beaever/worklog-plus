'use client';

import Link from 'next/link';
import { ProjectCard as ProjectCardCompound } from '@worklog-plus/components';
import type { ProjectSummary } from '@worklog-plus/types';

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <ProjectCardCompound>
        <ProjectCardCompound.Header>
          <div className='flex items-center gap-2'>
            <ProjectCardCompound.Icon />
            <ProjectCardCompound.Title>{project.name}</ProjectCardCompound.Title>
          </div>
          <ProjectCardCompound.Status status={project.status} />
        </ProjectCardCompound.Header>
        <ProjectCardCompound.Progress value={project.progress} />
        <ProjectCardCompound.Footer>
          <ProjectCardCompound.Count count={project.worklogCount} />
          <ProjectCardCompound.UpdatedAt date={project.updatedAt} />
        </ProjectCardCompound.Footer>
      </ProjectCardCompound>
    </Link>
  );
}
