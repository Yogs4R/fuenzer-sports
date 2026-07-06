import { create } from 'zustand';

type Page = '/' | '/standings' | '/history' | '/signin' | '/signup' | '/privacy' | '/terms';
type Language = 'en' | 'id';

interface AppState {
  currentPage: Page;
  language: Language;
  showNotifications: boolean;
  setCurrentPage: (page: Page) => void;
  setLanguage: (lang: Language) => void;
  setShowNotifications: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: (window.location.pathname as Page) || '/',
  language: 'en',
  showNotifications: false,
  setCurrentPage: (page) => set({ currentPage: page }),
  setLanguage: (lang) => set({ language: lang }),
  setShowNotifications: (show) => set({ showNotifications: show }),
}));
