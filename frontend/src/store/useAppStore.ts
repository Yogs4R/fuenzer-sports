import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Page = '/' | '/standings' | '/history' | '/signin' | '/signup' | '/privacy' | '/terms';
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
}

interface AppState {
  currentPage: Page;
  language: Language;
  showNotifications: boolean;
  
  // Simulation State
  simulationData: SimulationResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentPage: (page: Page) => void;
  setLanguage: (lang: Language) => void;
  setShowNotifications: (show: boolean) => void;
  
  // Simulation Actions
  runSimulation: (_prompt: string, _model: string, _mode: string) => Promise<void>;
  clearSimulationData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPage: (window.location.pathname as Page) || '/',
      language: 'en',
      showNotifications: false,
      
      simulationData: null,
      isLoading: false,
      error: null,

      setCurrentPage: (page) => set({ currentPage: page }),
      setLanguage: (lang) => set({ language: lang }),
      setShowNotifications: (show) => set({ showNotifications: show }),
      
      clearSimulationData: () => set({ simulationData: null, error: null }),
      
      runSimulation: async (_prompt: string, _model: string, _mode: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // For now, we just trigger a basic simulation without parsing custom weights from the prompt.
          // Eventually, an NLP engine will convert `prompt` -> `custom_weights`.
          const requestBody = {
            iterations: 10000,
            custom_weights: null // To be implemented later with AI routing
          };

          const response = await fetch('http://localhost:8000/api/simulate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
            throw new Error(`Failed to run simulation: ${response.statusText}`);
          }

          const data: SimulationResponse = await response.json();
          set({ simulationData: data, isLoading: false });
          
          // Redirect to standings page implicitly handled by components observing state,
          // but we can update the currentPage explicitly
          set({ currentPage: '/standings' });
          window.history.pushState({}, '', '/standings');

        } catch (error: any) {
          set({ error: error.message || 'An error occurred', isLoading: false });
        }
      }
    }),
    {
      name: 'fuenzer-storage', // Key used in localStorage
      // We only persist some fields, we don't want to persist isLoading state
      partialize: (state) => ({ 
        language: state.language,
        simulationData: state.simulationData
      }),
    }
  )
);
