import type { UserRole } from './user';

export interface Role {
  id: string;
  name: UserRole;
  description: string;
  userCount: number;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
}

export type PermissionKey =
  | 'project.create'
  | 'project.edit'
  | 'project.delete'
  | 'user.view'
  | 'user.manage'
  | 'role.view'
  | 'role.manage'
  | 'system.view'
  | 'system.update'
  | 'audit.view';

export interface SystemSettings {
  general: GeneralSettings;
  projectRules: ProjectRulesSettings;
  security: SecuritySettings;
}

export interface GeneralSettings {
  serviceName: string;
  defaultLanguage: 'ko' | 'en';
  timezone: string;
}

export interface ProjectRulesSettings {
  maxProjectsPerUser: number;
  defaultProjectStatus: 'PLANNED' | 'ACTIVE';
}

export interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireSpecialChar: boolean;
  sessionTimeoutMinutes: number;
}

export type AuditAction =
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'USER_ROLE_CHANGED'
  | 'USER_STATUS_CHANGED'
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_DELETED'
  | 'ROLE_UPDATED'
  | 'SYSTEM_SETTINGS_UPDATED';

export interface AuditLog {
  id: string;
  action: AuditAction;
  actor: {
    id: string;
    name: string;
    email: string;
  };
  target?: {
    type: 'USER' | 'PROJECT' | 'ROLE' | 'SYSTEM';
    id: string;
    name: string;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
}
