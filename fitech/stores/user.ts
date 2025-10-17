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

type UserStore = {
  user: LoginResponseDtoReadable | null;
  token: string | null;

  setUser: (data: LoginResponseDtoReadable) => Promise<void>;
  setToken: (token: string | null) => Promise<void>;

  logout: () => Promise<void>;
  loadSession: () => Promise<void>;

  updateUserInfo: (data: UserResponseDtoReadable) => Promise<void>;
  updateProfilePhotoId: (photoId: number) => Promise<void>;

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

    set({ user: null, token: null });
  },

  loadSession: async () => {
    console.log('[K] loadSession');
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
