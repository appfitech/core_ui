import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useUserStore } from '../stores/user';

export const useAuthRedirect = (redirectPath: string = '/home') => {
  const router = useRouter();
  const { loadUser } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      await loadUser();

      const currentUser = useUserStore.getState().user;

      if (currentUser) {
        router.replace(redirectPath);
      }
    };

    checkAuth();
  }, [redirectPath, router]);
};
