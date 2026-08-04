export type UserRole = 'USER' | 'MANAGER' | 'ADMIN' | 'SYSTEM_ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends Pick<User, 'id' | 'name' | 'avatarUrl'> {
  email: string;
}
