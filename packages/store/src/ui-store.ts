import { create } from "zustand";

interface UIState {
  selectedProjectId: string | null;
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalType: string | null;
}

interface UIActions {
  setSelectedProjectId: (id: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (type: string) => void;
  closeModal: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  selectedProjectId: null,
  isSidebarOpen: true,
  isModalOpen: false,
  modalType: null,

  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openModal: (type) => set({ isModalOpen: true, modalType: type }),
  closeModal: () => set({ isModalOpen: false, modalType: null }),
}));
