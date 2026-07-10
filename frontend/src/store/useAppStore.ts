import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MatchNode } from '../utils/bracketGenerator';

type Page = '/' | '/playground' | '/standings' | '/history' | '/signin' | '/signup' | '/privacy' | '/terms';
type Language = 'en' | 'id';

export interface TeamStats {
  id: number;
  tla: string;
  name: string;
  crest: string;
  power_rating?: number;
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
  title?: string;
  ai_narrative?: string;
  is_general_chat?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  isStreaming?: boolean;
}

export interface HistorySession {
  id: string;
  title: string;
  date: string;
  simulationData: SimulationResponse | null;
  chatHistory: ChatMessage[];
  bracketMatches: MatchNode[];
  competition: string;
  model: string;
  mode: string;
}

interface AppState {
  currentPage: Page;
  language: Language;
  showNotifications: boolean;
  
  // Simulation State
  currentSessionId: string | null;
  savedSessions: HistorySession[];
  simulationData: SimulationResponse | null;
  simulationTitle: string;
  chatHistory: ChatMessage[];
  mockStep: number;
  isLoading: boolean;
  error: string | null;

  // Knockout State
  bracketMatches: MatchNode[];
  setBracketMatches: (matches: MatchNode[]) => void;

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
  isSimulatingKnockout: boolean;
  
  // Actions
  setCurrentPage: (page: Page) => void;
  setLanguage: (lang: Language) => void;
  setShowNotifications: (show: boolean) => void;
  
  setSelectedCompetition: (comp: string) => void;
  setSelectedModel: (model: string) => void;
  setSelectedMode: (mode: string) => void;
  setSelectedStyle: (style: string) => void;
  setIsSimulatingKnockout: (val: boolean) => void;
  
  // Simulation Actions
  startNewSession: () => void;
  updateCurrentSession: () => void;
  loadSession: (id: string) => void;
  deleteSession: (id: string) => void;
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
      
      currentSessionId: null,
      savedSessions: [],
      simulationData: null,
      simulationTitle: 'World Cup Simulation',
      chatHistory: [],
      mockStep: 0,
      isLoading: false,
      isSimulatingKnockout: false,
      bracketMatches: [],
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
      setIsSimulatingKnockout: (val) => set({ isSimulatingKnockout: val }),
      setBracketMatches: (matches) => {
        set({ bracketMatches: matches });
        get().updateCurrentSession();
      },
      
      startNewSession: () => {
        const newId = `SIM-${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
        set({
          currentSessionId: newId,
          simulationData: null,
          simulationTitle: 'World Cup Simulation',
          chatHistory: [],
          mockStep: 0,
          error: null,
          bracketMatches: []
        });
      },
      
      updateCurrentSession: () => {
        const state = get();
        if (!state.currentSessionId || state.chatHistory.length === 0) return;
        
        const newSession: HistorySession = {
          id: state.currentSessionId,
          title: state.simulationTitle,
          date: new Date().toISOString(),
          simulationData: state.simulationData,
          chatHistory: state.chatHistory,
          bracketMatches: state.bracketMatches,
          competition: state.selectedCompetition,
          model: state.selectedModel,
          mode: state.selectedMode
        };
        
        set((prev) => {
          const exists = prev.savedSessions.some(s => s.id === state.currentSessionId);
          if (exists) {
            return { savedSessions: prev.savedSessions.map(s => s.id === state.currentSessionId ? newSession : s) };
          } else {
            return { savedSessions: [newSession, ...prev.savedSessions] };
          }
        });
      },

      loadSession: (id: string) => {
        const session = get().savedSessions.find(s => s.id === id);
        if (session) {
          set({
            currentSessionId: session.id,
            simulationTitle: session.title,
            simulationData: session.simulationData,
            chatHistory: session.chatHistory,
            bracketMatches: session.bracketMatches,
            selectedCompetition: session.competition,
            selectedModel: session.model,
            selectedMode: session.mode,
            error: null
          });
        }
      },

      deleteSession: (id: string) => {
        set((state) => ({
          savedSessions: state.savedSessions.filter(s => s.id !== id),
          ...(state.currentSessionId === id ? {
            currentSessionId: null,
            simulationData: null,
            simulationTitle: 'World Cup Simulation',
            chatHistory: [],
            bracketMatches: []
          } : {})
        }));
      },

      clearSimulationData: () => set({ 
        simulationData: null, 
        simulationTitle: 'World Cup Simulation',
        chatHistory: [],
        mockStep: 0,
        error: null,
        bracketMatches: []
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
        const currentState = get();
        const cachedProbabilities = currentState.simulationData?.probabilities || {};
        
        set((state) => ({ 
          isLoading: true, 
          error: null,
          totalSimulations: state.totalSimulations + 1,
          chatHistory: prompt.trim() ? [...state.chatHistory, { role: 'user', content: prompt }] : state.chatHistory,
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
            chat_history: state.chatHistory.slice(-5),
            generate_title: state.chatHistory.length === 1 // length is 1 because prompt is already appended
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
          
          if (mode === 'Live Standings') {
            data.sample_standings = get().liveStandings || []; // Retain original group standings
            data.probabilities = cachedProbabilities; // Retain existing or empty probabilities
          }
          
          if (data.is_general_chat) {
             set((state) => ({
                isLoading: false,
                chatHistory: prompt.trim() ? [...state.chatHistory, { role: 'ai', content: data.ai_narrative || "Done.", isStreaming: false }] : state.chatHistory,
                simulationData: currentState.simulationData, // Restore it
                simulationTitle: currentState.simulationTitle
             }));
             get().updateCurrentSession();
             return;
          }
          
          // Remove loading screen immediately so animation can be seen
          set({ isLoading: false }); 
          
          // Progressive Matchday Animation
          const nextMock = data;
          
          if (mode === 'From Scratch') {
            for (let md = 1; md <= 3; md++) {
                const intermediateMock = {
                   ...nextMock,
                   sample_standings: nextMock.sample_standings.map(group => {
                      const updatedTeams = group.teams.map(team => ({
                         ...team,
                         matches_played: md,
                         points: Math.round((team.points / 3) * md),
                         won: Math.round((team.won / 3) * md),
                         draw: Math.round((team.draw / 3) * md),
                         lost: Math.round((team.lost / 3) * md),
                         goals_for: Math.round((team.goals_for / 3) * md),
                         goals_against: Math.round((team.goals_against / 3) * md),
                         goal_difference: Math.round((team.goal_difference / 3) * md),
                      }));
                      updatedTeams.sort((a, b) => {
                         if (b.points !== a.points) return b.points - a.points;
                         if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
                         return b.goals_for - a.goals_for;
                      });
                      return {
                         ...group,
                         teams: updatedTeams
                      };
                   })
                };
                set({ simulationData: intermediateMock as any });
               await new Promise(r => setTimeout(r, 1666)); 
            }
          }
          
          set((state) => ({
            chatHistory: prompt.trim() ? [...state.chatHistory, { role: 'ai', content: data.ai_narrative || "Done.", isStreaming: false }] : state.chatHistory,
            simulationTitle: data.title || state.simulationTitle,
            simulationData: data,
            bracketMatches: [],
          }));
          get().updateCurrentSession();
          
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
        savedSessions: state.savedSessions,
        currentSessionId: state.currentSessionId,
        simulationData: state.simulationData,
        simulationTitle: state.simulationTitle,
        chatHistory: state.chatHistory,
        bracketMatches: state.bracketMatches,
        mockStep: state.mockStep
      }),
    }
  )
);
