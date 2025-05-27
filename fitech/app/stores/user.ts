import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { LoginResponse } from "../types/user";

type UserStore = {
  user: LoginResponse | null;
  setUser: (data: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUserInfo: (data: LoginResponse["user"]) => Promise<void>;
  updateProfilePhotoId: (photoId: number) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,

  setUser: async (data) => {
    await SecureStore.setItemAsync("user", JSON.stringify(data));
    set({ user: data });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("user");
    set({ user: null });
  },

  loadUser: async () => {
    const userJson = await SecureStore.getItemAsync("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      set({ user });
    }
  },

  updateUserInfo: async (newUserInfo: LoginResponse["user"]) => {
    const current = get().user;
    if (!current) return;

    const updated = {
      ...current,
      user: newUserInfo
    };

    await SecureStore.setItemAsync("user", JSON.stringify(updated));
    set({ user: updated });
  },

  updateProfilePhotoId: async (photoId: number) => {
    const current = get().user;

    console.log("[K] current", current);

    console.log("[K] photoId", photoId);
    if (!current) return;

    const updated = {
      ...current,
      user: {
        ...current?.user,
        person: {
          ...current?.user?.person,
          profilePhotoId: photoId
        }
      }
    };

    console.log("[K] updated", updated);

    await SecureStore.setItemAsync("user", JSON.stringify(updated));
    set({ user: updated });
  }
}));
