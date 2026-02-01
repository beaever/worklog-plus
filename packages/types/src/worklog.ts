export interface Worklog {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorklogCreateInput {
  projectId: string;
  title: string;
  content: string;
  date: string;
  duration: number;
}

export interface WorklogUpdateInput extends Partial<WorklogCreateInput> {
  id: string;
}
