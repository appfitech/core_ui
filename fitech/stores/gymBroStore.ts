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
  reset: () => void; // reset in-memory and persist
  clearAll: () => Promise<void>; // TEST: wipe persisted storage + reset
}

const PERSIST_KEY = 'gymbro-swipes-v1';

export const useGymBroStore = create<GymBroSwipeState>()(
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
