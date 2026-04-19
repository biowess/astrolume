import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Planet, fallbackPlanets, fetchPlanetsApi } from '../data/planets';

interface Settings {
  showStars: boolean;
  reducedMotion: boolean;
  units: 'metric' | 'imperial';
}

interface AppState {
  planets: Planet[];
  isLoading: boolean;
  activePlanetId: string;
  bookmarks: string[];
  settings: Settings;
  
  // Actions
  fetchPlanets: () => Promise<void>;
  setActivePlanet: (id: string) => void;
  toggleBookmark: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      planets: fallbackPlanets,
      isLoading: false,
      activePlanetId: 'earth', // default
      bookmarks: [],
      settings: {
        showStars: true,
        reducedMotion: false,
        units: 'metric',
      },

      fetchPlanets: async () => {
        set({ isLoading: true });
        const data = await fetchPlanetsApi();
        set({ planets: data, isLoading: false });
      },

      setActivePlanet: (id) => set({ activePlanetId: id }),

      toggleBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.includes(id)
          ? state.bookmarks.filter(b => b !== id)
          : [...state.bookmarks, id]
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'planet-explorer-storage',
      partialize: (state) => ({ 
        bookmarks: state.bookmarks, 
        settings: state.settings 
      }),
    }
  )
);
