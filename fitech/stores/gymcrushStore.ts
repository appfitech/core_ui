// stores/gymcrushStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CoachProfile = {
  id: string;
  name: string;
  age?: number;
  distanceKm?: number;
  goals: string[]; // specialties the coach is strong at (kept same field name to reuse UI)
  level: 'Beginner' | 'Intermediate' | 'Advanced'; // target clientele level focus
  photo: string;
  bio?: string;
  // Optional coach bits you might surface later:
  // ratePerSessionUsd?: number;
  // certifications?: string[];
};

export interface GymCrushSwipeState {
  saved: Record<string, CoachProfile>;
  discarded: Record<string, CoachProfile>;
  markSaved: (p: CoachProfile) => void;
  markDiscarded: (p: CoachProfile) => void;
  reset: () => void; // reset in-memory + persist
  clearAll: () => Promise<void>; // TEST: wipe storage key and reset
}

const PERSIST_KEY = 'gymcrush-swipes-v1';

export const useGymCrushStore = create<GymCrushSwipeState>()(
  persist(
    (set) => ({
      saved: {},
      discarded: {},

      markSaved: (p) => set((s) => ({ saved: { ...s.saved, [p.id]: p } })),

      markDiscarded: (p) =>
        set((s) => ({ discarded: { ...s.discarded, [p.id]: p } })),

      // resets both in-memory state and persisted snapshot
      reset: () => set({ saved: {}, discarded: {} }),

      // Hard clear for testing: remove the persisted key and blank state
      clearAll: async () => {
        try {
          await AsyncStorage.removeItem(PERSIST_KEY); // wipe disk
        } finally {
          set({ saved: {}, discarded: {} }); // wipe memory
        }
      },
    }),
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({
        saved: state.saved,
        discarded: state.discarded,
      }),
    },
  ),
);
