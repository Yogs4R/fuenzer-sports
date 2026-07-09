import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  // Global Settings
  selectedCompetition: string;
  selectedModel: string;
  selectedMode: string;
  selectedStyle: string;
  
  // Actions
  setCurrentPage: (page: Page) => void;
  setLanguage: (lang: Language) => void;
  setShowNotifications: (show: boolean) => void;
  
  setSelectedCompetition: (comp: string) => void;
  setSelectedModel: (model: string) => void;
  setSelectedMode: (mode: string) => void;
  setSelectedStyle: (style: string) => void;
  
  // Simulation Actions
  runSimulation: (prompt: string, model: string, mode: string) => Promise<void>;
  reRunSimulation: () => Promise<void>;
  clearSimulationData: () => void;
  setChatStreamingComplete: (index: number) => void;
  clearError: () => void;
  
  // Live Data Actions
  fetchLiveStandings: () => Promise<void>;
  fetchSimulationCount: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
      
      selectedCompetition: 'World Cup',
      selectedModel: 'Auto',
      selectedMode: 'Live Standings',
      selectedStyle: 'Commentator Style',

      setCurrentPage: (page) => set({ currentPage: page }),
      setLanguage: (lang) => set({ language: lang }),
      setShowNotifications: (show) => set({ showNotifications: show }),
      
      setSelectedCompetition: (comp) => set({ selectedCompetition: comp }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      setSelectedMode: (mode) => set({ selectedMode: mode }),
      setSelectedStyle: (style) => set({ selectedStyle: style }),
      
      clearSimulationData: () => set({ 
        simulationData: null, 
        chatHistory: [],
        mockStep: 0,
        error: null 
      }),
      clearError: () => set({ error: null }),

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
      
      runSimulation: async (prompt: string, model: string, mode: string) => {
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

        const state = get();
        try {
          const payload = {
            iterations: 10000,
            prompt: prompt,
            model: model,
            competition: state.selectedCompetition,
            mode: mode,
            style: state.selectedStyle,
            chat_history: state.chatHistory.slice(-5)
          };
          
          const response = await fetch('http://localhost:8000/api/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
            throw new Error(`Simulation failed: ${response.statusText}`);
          }
          
          const data: SimulationResponse = await response.json();
          
          // Progressive Matchday Animation
          const nextMock = data;
          for (let md = 1; md <= 3; md++) {
             const intermediateMock = {
                ...nextMock,
                sample_standings: nextMock.sample_standings.map(group => ({
                   ...group,
                   teams: group.teams.map(team => ({
                      ...team,
                      matches_played: md,
                      points: Math.round((team.points / 3) * md),
                      won: Math.round((team.won / 3) * md),
                      draw: Math.round((team.draw / 3) * md),
                      lost: Math.round((team.lost / 3) * md),
                      goals_for: Math.round((team.goals_for / 3) * md),
                      goals_against: Math.round((team.goals_against / 3) * md),
                      goal_difference: Math.round((team.goal_difference / 3) * md),
                   }))
                }))
             };
             
             set({ simulationData: intermediateMock });
             
             if (md < 3) {
               await new Promise(r => setTimeout(r, 1000));
             }
          }
          
          set((state) => ({
            chatHistory: [...state.chatHistory, { role: 'ai', content: data.ai_narrative || "Done.", isStreaming: true }],
            isLoading: false
          }));
          
        } catch (error: any) {
           console.error("Simulation error:", error);
           set({ 
             error: error.message || "Failed to connect to simulation server.",
             isLoading: false
           });
        }
      },

      reRunSimulation: async () => {
        const state = get();
        if (state.chatHistory.length > 0) {
            const lastPrompt = state.chatHistory.filter(c => c.role === 'user').pop();
            if (lastPrompt) {
                await get().runSimulation(lastPrompt.content, state.selectedModel, state.selectedMode);
            }
        }
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
