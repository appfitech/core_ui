// src/stores/user.ts
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import {
  LoginResponseDtoReadable,
  UserResponseDtoReadable,
} from '@/types/api/types.gen';

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

  setUser: (data: LoginResponseDtoReadable) => Promise<void>;
  setToken: (token: string | null) => Promise<void>;

  logout: () => Promise<void>;
  loadSession: () => Promise<void>;

  /** Returns userId from SecureStore (so we can hydrate user when blob was lost). */
  getStoredUserId: () => Promise<number | null>;

  updateUserInfo: (data: UserResponseDtoReadable) => Promise<void>;
  updateProfilePhotoId: (photoId: number) => Promise<void>;

  getUserId: () => number | null;
  getToken: () => string | null;
  getIsTrainer: () => boolean;

  refreshToken: () => Promise<string | null>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  token: null,

  setUser: async (data) => {
    await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(data));

    set({ user: data });

    const token = data?.token ?? null;
    if (token) {
      await SecureStore.setItemAsync(SECURE_TOKEN_KEY, token);
      set({ token });
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

    set({ user: null, token: null });
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

  getUserId: () => get().user?.user?.id ?? null,

  getToken: () => get().token,

  getIsTrainer: () => get().user?.user?.type === UserType.TRAINER,

  refreshToken: async () => {
    const currentToken = get().token;

    if (!currentToken) return null;

    try {
      const res = await fetch(
        `https://appfitech.com/v1/app/user/refresh-token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: currentToken }), // RefreshTokenRequestDto
        },
      );

      if (!res.ok) {
        await get().logout();
        return null;
      }

      const data = await res.json();
      const newToken: string | undefined =
        data?.token ?? data?.result?.token ?? data?.data?.token;

      if (!newToken) {
        await get().logout();
        return null;
      }

      await get().setToken(newToken);
      return newToken;
    } catch {
      await get().logout();
      return null;
    }
  },
}));
