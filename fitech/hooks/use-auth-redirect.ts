import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { ROUTES } from '@/constants/routes';
import { bootstrapAuthSession } from '@/services/auth-session';
import { useUserStore } from '@/stores/user';

export const useAuthRedirect = (redirectPath: string = ROUTES.home) => {
  const router = useRouter();
  const isSessionHydrated = useUserStore((s) => s.isSessionHydrated);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isSessionHydrated) {
        await bootstrapAuthSession();
      }

      const token = useUserStore.getState().getToken();

      if (token) {
        router.replace(redirectPath);
      }
    };

    void checkAuth();
  }, [isSessionHydrated, redirectPath, router]);
};
