import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatStore {
  // Selected model
  selectedModel: string | null;
  setSelectedModel: (model: string) => void;
  isModelSwitching: boolean;
  setModelSwitching: (switching: boolean) => void;

  // Chat session management (per model)
  chatSessions: Record<string, string>; // modelTag -> sessionId
  setCurrentChatSession: (sessionId: string | null) => void;
  getCurrentChatSession: (modelTag?: string | null) => string | null;

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
    (set, get) => ({
      // Model selection
      selectedModel: null,
      setSelectedModel: (model) => set({ selectedModel: model }),
      isModelSwitching: false,
      setModelSwitching: (switching) => set({ isModelSwitching: switching }),

      // Chat session management (per model)
      chatSessions: {},
      setCurrentChatSession: (sessionId) => 
        set((state) => {
          const { selectedModel } = state;
          if (!selectedModel) return state;
          
          const newChatSessions = { ...state.chatSessions };
          if (sessionId) {
            newChatSessions[selectedModel] = sessionId;
          } else {
            delete newChatSessions[selectedModel];
          }
          
          return { chatSessions: newChatSessions };
        }),
      getCurrentChatSession: (modelTag) => {
        const { chatSessions, selectedModel } = get();
        const tagToUse = modelTag || selectedModel;
        return tagToUse ? chatSessions[tagToUse] || null : null;
      },

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
        chatSessions: state.chatSessions,
        draftMessage: state.draftMessage,
      }),
    }
  )
);
