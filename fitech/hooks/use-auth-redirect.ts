import { type Href, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { ROUTES } from '@/constants/routes';
import { bootstrapAuthSession } from '@/services/auth-session';
import { useUserStore } from '@/stores/user';
import { hasPendingPushHref } from '@/utils/navigate-from-push-notification';

export const useAuthRedirect = (redirectPath: Href = ROUTES.home) => {
  const router = useRouter();
  const isSessionHydrated = useUserStore((s) => s.isSessionHydrated);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isSessionHydrated) {
        await bootstrapAuthSession();
      }

      const token = useUserStore.getState().getToken();

      if (token && !hasPendingPushHref()) {
        router.replace(redirectPath);
      }
    };

    void checkAuth();
  }, [isSessionHydrated, redirectPath, router]);
};
