import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@worklog-plus/types';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface UserState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
}

interface UserActions {
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,
      _hasHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: user !== null }),

      setTokens: (tokens) => set({ tokens }),

      login: (user, tokens) => {
        if (typeof document !== 'undefined') {
          document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'accessToken=; path=/; max-age=0';
        }
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'worklog-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          if (typeof document !== 'undefined' && state.tokens?.accessToken) {
            document.cookie = `accessToken=${state.tokens.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          }
        }
      },
    },
  ),
);
