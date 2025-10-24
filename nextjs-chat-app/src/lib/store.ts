import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatStore {
  // Selected model
  selectedModel: string | null;
  setSelectedModel: (model: string) => void;
  isModelSwitching: boolean;
  setModelSwitching: (switching: boolean) => void;

  // Draft message (saved before submit)
  draftMessage: string;
  setDraftMessage: (message: string) => void;
  clearDraft: () => void;

  // UI state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      // Model selection
      selectedModel: null,
      setSelectedModel: (model) => set({ selectedModel: model }),
      isModelSwitching: false,
      setModelSwitching: (switching) => set({ isModelSwitching: switching }),

      // Draft message
      draftMessage: '',
      setDraftMessage: (message) => set({ draftMessage: message }),
      clearDraft: () => set({ draftMessage: '' }),

      // UI state
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        selectedModel: state.selectedModel,
        draftMessage: state.draftMessage,
      }),
    }
  )
);
