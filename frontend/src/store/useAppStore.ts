import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockSimulations } from '../data/mockSimulationData';

type Page = '/' | '/playground' | '/standings' | '/history' | '/signin' | '/signup' | '/privacy' | '/terms';
type Language = 'en' | 'id';

export interface TeamStats {
  id: number;
  tla: string;
  name: string;
  crest: string;
  points: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  matches_played: number;
  won: number;
  draw: number;
  lost: number;
}

export interface GroupStandings {
  group_name: string;
  teams: TeamStats[];
}

export interface SimulationResponse {
  iterations: number;
  execution_time_ms: number;
  probabilities: Record<string, Record<string, number>>;
  sample_standings: GroupStandings[];
  ai_narrative?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  isStreaming?: boolean;
}

interface AppState {
  currentPage: Page;
  language: Language;
  showNotifications: boolean;
  
  // Simulation State
  simulationData: SimulationResponse | null;
  chatHistory: ChatMessage[];
  mockStep: number;
  isLoading: boolean;
  error: string | null;

  // Live Standings State
  liveStandings: GroupStandings[] | null;
  isLiveLoading: boolean;
  hasFetchedLive: boolean;

  // Counter
  totalSimulations: number;

  // Actions
  setCurrentPage: (page: Page) => void;
  setLanguage: (lang: Language) => void;
  setShowNotifications: (show: boolean) => void;
  
  // Simulation Actions
  runSimulation: (prompt: string, _model: string, _mode: string) => Promise<void>;
  reRunSimulation: () => Promise<void>;
  clearSimulationData: () => void;
  setChatStreamingComplete: (index: number) => void;
  
  // Live Data Actions
  fetchLiveStandings: () => Promise<void>;
  fetchSimulationCount: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPage: (window.location.pathname as Page) || '/',
      language: 'en',
      showNotifications: false,
      
      simulationData: null,
      chatHistory: [],
      mockStep: 0,
      isLoading: false,
      error: null,
      
      liveStandings: null,
      isLiveLoading: false,
      hasFetchedLive: false,
      totalSimulations: 12450,

      setCurrentPage: (page) => set({ currentPage: page }),
      setLanguage: (lang) => set({ language: lang }),
      setShowNotifications: (show) => set({ showNotifications: show }),
      
      clearSimulationData: () => set({ 
        simulationData: null, 
        chatHistory: [],
        mockStep: 0,
        error: null 
      }),

      setChatStreamingComplete: (index: number) => {
        set((state) => {
          const newHistory = [...state.chatHistory];
          if (newHistory[index]) {
            newHistory[index].isStreaming = false;
          }
          return { chatHistory: newHistory };
        });
      },
      
      fetchLiveStandings: async () => {
        set({ isLiveLoading: true, hasFetchedLive: true });
        try {
          const response = await fetch('http://localhost:8000/api/standings/live');
          if (response.ok) {
            const data: GroupStandings[] = await response.json();
            set({ liveStandings: data, isLiveLoading: false });
          } else {
            set({ isLiveLoading: false });
          }
        } catch (error) {
          set({ isLiveLoading: false });
        }
      },

      fetchSimulationCount: async () => {
        try {
          const response = await fetch('http://localhost:8000/api/simulate/count');
          if (response.ok) {
            const data = await response.json();
            set({ totalSimulations: data.count });
          }
        } catch (error) {
          // Fallback to locally tracked state
        }
      },
      
      runSimulation: async (prompt: string, _model: string, _mode: string) => {
        set((state) => ({ 
          isLoading: true, 
          error: null,
          totalSimulations: state.totalSimulations + 1,
          chatHistory: [...state.chatHistory, { role: 'user', content: prompt }],
          currentPage: '/playground',
          simulationData: null
        }));
        
        // Ensure URL updates without reload immediately
        if (window.location.pathname !== '/playground') {
          window.history.pushState({}, '', '/playground');
        }

        // Wait 2.5 seconds to simulate network request and "processing" time for the animation
        await new Promise((resolve) => setTimeout(resolve, 2500));
        
        set((state) => {
          const nextMock = mockSimulations[state.mockStep % mockSimulations.length];
          const narrative = nextMock.ai_narrative || "Simulation complete.";
          
          return {
            simulationData: nextMock,
            chatHistory: [...state.chatHistory, { role: 'ai', content: narrative, isStreaming: true }],
            mockStep: state.mockStep + 1,
            isLoading: false
          };
        });
      },

      reRunSimulation: async () => {
        // Reset to initial state without adding to chat history or showing processing
        set({ simulationData: null });
        
        // Short delay before showing the new state to trigger animation
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => {
          // Just re-apply the last mock simulation (or advance if we want)
          // For now, let's just show the last one again to trigger the F1 animation
          const mockIndex = state.mockStep > 0 ? (state.mockStep - 1) : 0;
          const nextMock = mockSimulations[mockIndex % mockSimulations.length];
          return {
            simulationData: nextMock
          };
        });
      }
    }),
    {
      name: 'fuenzer-storage', // Key used in localStorage
      partialize: (state) => ({ 
        language: state.language,
        simulationData: state.simulationData,
        chatHistory: state.chatHistory,
        mockStep: state.mockStep
      }),
    }
  )
);
