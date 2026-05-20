// src/stores/user.ts
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import {
  LoginResponseDtoReadable,
  UserResponseDtoReadable,
} from '@/types/api/types.gen';
import { extractAccessToken } from '@/utils/auth-token';

enum UserType {
  CLIENT = 0,
  TRAINER = 1,
}

const SECURE_USER_KEY = 'user';
const SECURE_TOKEN_KEY = 'auth_token';
const SECURE_USER_ID_KEY = 'user_id';

type UserStore = {
  user: LoginResponseDtoReadable | null;
  token: string | null;
  isSessionHydrated: boolean;
  isSessionHydrating: boolean;

  setUser: (data: LoginResponseDtoReadable) => Promise<void>;
  setToken: (token: string | null) => Promise<void>;
  setSessionHydrated: (value: boolean) => void;
  setSessionHydrating: (value: boolean) => void;

  logout: () => Promise<void>;
  loadSession: () => Promise<void>;

  /** Returns userId from SecureStore (so we can hydrate user when blob was lost). */
  getStoredUserId: () => Promise<number | null>;

  updateUserInfo: (data: UserResponseDtoReadable) => Promise<void>;
  updateProfilePhotoId: (photoId: number) => Promise<void>;
  clearProfilePhotoId: () => Promise<void>;

  getUserId: () => number | null;
  getToken: () => string | null;
  getIsTrainer: () => boolean;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  token: null,
  isSessionHydrated: false,
  isSessionHydrating: false,

  setSessionHydrated: (value) => set({ isSessionHydrated: value }),
  setSessionHydrating: (value) => set({ isSessionHydrating: value }),

  setUser: async (data) => {
    const token = extractAccessToken(data) ?? data?.token ?? null;

    // Memory first — navigation guards read token synchronously after login.
    set({ user: data, token, isSessionHydrated: true });

    await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(data));

    if (token) {
      await SecureStore.setItemAsync(SECURE_TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
    }

    const userId = data?.user?.id;
    if (userId != null) {
      await SecureStore.setItemAsync(SECURE_USER_ID_KEY, String(userId));
    }
  },

  setToken: async (token) => {
    if (token) {
      await SecureStore.setItemAsync(SECURE_TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
    }
    set({ token: token ?? null });

    const current = get().user;

    if (current) {
      const updated = { ...current, token: token ?? undefined };

      await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(updated));
      set({ user: updated });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(SECURE_USER_KEY);
    await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
    await SecureStore.deleteItemAsync(SECURE_USER_ID_KEY);

    set({
      user: null,
      token: null,
      isSessionHydrated: true,
      isSessionHydrating: false,
    });
  },

  getStoredUserId: async () => {
    const raw = await SecureStore.getItemAsync(SECURE_USER_ID_KEY);
    if (raw == null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  },

  loadSession: async () => {
    const userJson = await SecureStore.getItemAsync(SECURE_USER_KEY);
    if (userJson) {
      const user = JSON.parse(userJson) as LoginResponseDtoReadable;
      set({ user });
    }

    const token = (await SecureStore.getItemAsync(SECURE_TOKEN_KEY)) ?? null;

    set({ token });
  },

  updateUserInfo: async (newUserInfo: UserResponseDtoReadable) => {
    const current = get().user;
    if (!current) return;

    const updated = {
      ...current,
      user: newUserInfo,
    };

    await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(updated));
    set({ user: updated });
  },

  updateProfilePhotoId: async (photoId: number) => {
    const current = get().user;
    if (!current) return;

    const updated = {
      ...current,
      user: {
        ...current?.user,
        person: {
          ...current?.user?.person,
          profilePhotoId: photoId,
        },
      },
    };

    await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(updated));
    set({ user: updated });
  },

  clearProfilePhotoId: async () => {
    const current = get().user;
    if (!current?.user?.person) return;

    const updated = {
      ...current,
      user: {
        ...current.user,
        person: {
          ...current.user.person,
          profilePhotoId: undefined,
        },
      },
    };

    await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(updated));
    set({ user: updated });
  },

  getUserId: () => get().user?.user?.id ?? null,

  getToken: () => get().token,

  getIsTrainer: () => get().user?.user?.type === UserType.TRAINER,
}));
