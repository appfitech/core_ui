// stores/gymbroStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ---------------------------
// Types shared with screens
// ---------------------------
export type Profile = {
  id: string;
  name: string;
  age?: number;
  distanceKm?: number;
  goals: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  photo: string;
  bio?: string;
};

export interface GymBroSwipeState {
  saved: Record<string, Profile>; // liked / contact intent
  discarded: Record<string, Profile>;
  markSaved: (p: Profile) => void;
  markDiscarded: (p: Profile) => void;
  reset: () => void;
}

export const useGymBroStore = create<GymBroSwipeState>()(
  persist(
    (set) => ({
      saved: {},
      discarded: {},
      markSaved: (p) => set((s) => ({ saved: { ...s.saved, [p.id]: p } })),
      markDiscarded: (p) =>
        set((s) => ({ discarded: { ...s.discarded, [p.id]: p } })),
      reset: () => set({ saved: {}, discarded: {} }),
    }),
    {
      name: 'gymbro-swipes-v1',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({
        saved: state.saved,
        discarded: state.discarded,
      }),
    },
  ),
);
