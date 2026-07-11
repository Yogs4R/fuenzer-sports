import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Backend API base URL — configurable per environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
import type { MatchNode } from '../utils/bracketGenerator';
import { signInWithPopup, signOut, deleteUser } from 'firebase/auth';
import { doc, getDocs, collection, writeBatch, deleteDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

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



  // Global Settings
  selectedCompetition: string;
  selectedModel: string;
  selectedMode: string;
  selectedStyle: string;
  isSimulatingKnockout: boolean;
  
  // Cookie Consent
  cookieConsent: boolean | null;
  setCookieConsent: (consent: boolean) => void;

  // Auth State
  user: AppUser | null;
  isAuthLoading: boolean;
  setUser: (user: AppUser | null) => void;
  setSavedSessions: (sessions: HistorySession[]) => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  syncSessionsToFirestore: () => Promise<void>;
  
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
  
  updateTeamName: (teamId: number, newName: string) => void;

}

const getFriendlyAuthErrorMessage = (error: any, lang: Language): string => {
  const code = error?.code || '';
  const isId = lang === 'id';
  
  switch (code) {
    case 'auth/popup-closed-by-user':
      return isId 
        ? 'Popup masuk ditutup sebelum selesai. Silakan coba lagi.' 
        : 'The sign-in popup was closed before completion. Please try again.';
    case 'auth/cancelled-popup-request':
      return isId 
        ? 'Permintaan masuk dibatalkan. Silakan coba lagi.' 
        : 'The sign-in request was cancelled. Please try again.';
    case 'auth/network-request-failed':
      return isId 
        ? 'Terjadi kesalahan jaringan. Silakan periksa koneksi internet Anda dan coba lagi.' 
        : 'A network error occurred. Please check your internet connection and try again.';
    case 'auth/internal-error':
      return isId 
        ? 'Terjadi kesalahan sistem internal. Silakan coba beberapa saat lagi.' 
        : 'An internal system error occurred. Please try again later.';
    case 'auth/operation-not-allowed':
      return isId 
        ? 'Metode masuk Google saat ini dinonaktifkan. Silakan hubungi layanan bantuan.' 
        : 'Google sign-in is currently disabled. Please contact support.';
    case 'auth/popup-blocked':
      return isId 
        ? 'Popup masuk diblokir oleh browser Anda. Silakan izinkan popup untuk situs ini.' 
        : 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
    default:
      return isId 
        ? 'Terjadi kesalahan yang tidak terduga saat masuk. Silakan coba lagi.' 
        : 'An unexpected error occurred during authentication. Please try again.';
  }
};

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

      
      cookieConsent: null,
      
      user: null,
      isAuthLoading: true,

      setCookieConsent: (consent) => set({ cookieConsent: consent }),
      setUser: (user) => set({ user }),
      setSavedSessions: (sessions) => set({ savedSessions: sessions }),

      signInWithGoogle: async () => {
        set({ isAuthLoading: true, error: null });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const appUser: AppUser = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          };
          set({ user: appUser });
          await get().syncSessionsToFirestore();
        } catch (err: any) {
          set({ error: getFriendlyAuthErrorMessage(err, get().language) });
        } finally {
          set({ isAuthLoading: false });
        }
      },

      signOutUser: async () => {
        try {
          await signOut(auth);
          set({ user: null });
        } catch (err: any) {
          set({ error: getFriendlyAuthErrorMessage(err, get().language) });
        }
      },

      deleteUserAccount: async () => {
        const state = get();
        if (!state.user) return;
        set({ isAuthLoading: true, error: null });
        try {
          const sessionsRef = collection(db, 'users', state.user.uid, 'sessions');
          const snapshot = await getDocs(sessionsRef);
          const batch = writeBatch(db);
          snapshot.docs.forEach((d) => batch.delete(d.ref));
          await batch.commit();
          
          if (auth.currentUser) await deleteUser(auth.currentUser);
          set({ user: null, savedSessions: [] });
        } catch (err: any) {
          set({ error: getFriendlyAuthErrorMessage(err, get().language) });
        } finally {
          set({ isAuthLoading: false });
        }
      },

      syncSessionsToFirestore: async () => {
        const state = get();
        if (!state.user) return;
        try {
          const sessionsRef = collection(db, 'users', state.user.uid, 'sessions');
          const snapshot = await getDocs(sessionsRef);
          const firestoreSessions: HistorySession[] = [];
          snapshot.forEach(doc => firestoreSessions.push(doc.data() as HistorySession));
          
          const localSessions = state.savedSessions;
          const merged = [...firestoreSessions];
          const firestoreIds = new Set(firestoreSessions.map(s => s.id));
          const batch = writeBatch(db);
          let hasLocalToUpload = false;
          
          localSessions.forEach(ls => {
            if (!firestoreIds.has(ls.id)) {
              merged.push(ls);
              const docRef = doc(db, 'users', state.user!.uid, 'sessions', ls.id);
              batch.set(docRef, ls);
              hasLocalToUpload = true;
            }
          });
          
          merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          if (hasLocalToUpload) await batch.commit();
          set({ savedSessions: merged });
        } catch (err: any) {
          console.error("Failed to sync sessions:", err);
        }
      },
      
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
        const getRandomInt = (min: number, max: number) => {
          const range = max - min + 1;
          const array = new Uint32Array(1);
          window.crypto.getRandomValues(array);
          return min + (array[0] % range);
        };
        const newId = `SIM-${getRandomInt(1000, 9999)}${String.fromCharCode(getRandomInt(65, 90))}`;
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
          let newSaved = [];
          if (exists) {
            newSaved = prev.savedSessions.map(s => s.id === state.currentSessionId ? newSession : s);
          } else {
            newSaved = [newSession, ...prev.savedSessions];
          }
          
          if (state.user) {
             const docRef = doc(db, 'users', state.user.uid, 'sessions', newSession.id);
             setDoc(docRef, newSession).catch(console.error);
          }
          
          return { savedSessions: newSaved };
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
        const state = get();
        if (state.user) {
          const docRef = doc(db, 'users', state.user.uid, 'sessions', id);
          deleteDoc(docRef).catch(console.error);
        }
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
          const response = await fetch(`${API_BASE_URL}/api/standings/live`);
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

      
      runSimulation: async (prompt: string, model: string, mode: string) => {
        const currentState = get();
        const cachedProbabilities = currentState.simulationData?.probabilities || {};
        let customTeams;
        if (currentState.selectedCompetition === 'Custom' && currentState.simulationData) {
          customTeams = currentState.simulationData.sample_standings.flatMap(group => group.teams.map(t => ({
            ...t,
            power_rating: t.power_rating || 60,
            points: 0, goals_for: 0, goals_against: 0, goal_difference: 0, matches_played: 0, won: 0, draw: 0, lost: 0,
            group: group.group_name
          })));
        } else if (mode === 'Live Standings' && currentState.liveStandings) {
          customTeams = currentState.liveStandings.flatMap(group => group.teams.map(t => ({
            ...t,
            power_rating: t.power_rating || 60,
            group: group.group_name
          })));
        }

        set((state) => ({ 
          isLoading: true, 
          error: null,
          chatHistory: prompt.trim() ? [...state.chatHistory, { role: 'user', content: prompt }] : state.chatHistory,
          currentPage: '/playground',
          simulationData: null
        }));
        
        // Ensure URL updates without reload immediately
        if (window.location.pathname !== '/playground') {
          window.history.pushState({}, '', '/playground');
        }

        try {
          const state = get();

          const payload = {
            iterations: 10000,
            prompt: prompt,
            model: model,
            competition: state.selectedCompetition,
            mode: mode,
            style: state.selectedStyle,
            chat_history: state.chatHistory.slice(-5),
            generate_title: state.chatHistory.length === 1, // length is 1 because prompt is already appended
            custom_teams: customTeams
          };
          
          const response = await fetch(`${API_BASE_URL}/api/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
            throw new Error(`Simulation failed: ${response.statusText}`);
          }
          
          const data: SimulationResponse = await response.json();
          
          const actualMode = state.selectedCompetition === 'Custom' ? 'From Scratch' : mode;
          if (actualMode === 'Live Standings') {
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
          
          if (actualMode === 'From Scratch') {
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
      },
      
      updateTeamName: (teamId: number, newName: string) => {
        set((state) => {
            const updateGroupStandings = (standings: GroupStandings[]) => {
                return standings.map(group => ({
                    ...group,
                    teams: group.teams.map(team => 
                        team.id === teamId ? { ...team, name: newName } : team
                    )
                }));
            };

            return {
                simulationData: state.simulationData ? {
                    ...state.simulationData,
                    sample_standings: updateGroupStandings(state.simulationData.sample_standings)
                } : null,
                liveStandings: state.liveStandings ? updateGroupStandings(state.liveStandings) : null
            };
        });
        get().updateCurrentSession();
      }
    }),
    {
      name: 'fuenzer-storage', // Key used in localStorage
      partialize: (state) => ({ 
        language: state.language,
        cookieConsent: state.cookieConsent,
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
