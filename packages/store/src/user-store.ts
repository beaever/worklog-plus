import { create } from "zustand";
import type { User } from "@worklog/types";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

interface UserActions {
  setUser: (user: User | null) => void;
  logout: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
