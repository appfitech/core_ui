import { useUserStore } from '@/stores/user';

/**
 * Gate React Query until SecureStore hydration + JWT refresh finish.
 * Avoids firing requests with a stale token right after loadSession().
 */
export function useSessionQueryEnabled(extraCondition = true): boolean {
  const token = useUserStore((s) => s.token);
  const isSessionHydrated = useUserStore((s) => s.isSessionHydrated);
  const isSessionHydrating = useUserStore((s) => s.isSessionHydrating);

  return (
    !!token && isSessionHydrated && !isSessionHydrating && extraCondition
  );
}
