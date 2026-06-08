import { create } from 'zustand';
import type { User } from '@worklog-plus/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
}

interface UserActions {
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

type UserStore = UserState & UserActions;

// 인증 진실원은 Supabase 세션(httpOnly 쿠키)이다.
// 사용자 상태는 AuthProvider가 세션에서 복원하므로 localStorage에 영속화하지 않는다.
// (기존 localStorage persist 제거 → 토큰/세션 노출 위험 해소)
export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  _hasHydrated: false,

  setUser: (user) => set({ user, isAuthenticated: user !== null }),

  login: (user) => {
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setHasHydrated: (state) => set({ _hasHydrated: state }),
}));
