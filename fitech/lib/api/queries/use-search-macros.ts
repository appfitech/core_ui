import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { FoodItemDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useSearchMacros = (query: string) => {
  const token = useUserStore((s) => s.getToken());
  const q = query.trim();
  const enabled = !!token && q.length > 0;

  return useQuery<FoodItemDto[]>({
    queryKey: ['search-macros', q],
    queryFn: async () => {
      return api.get(`/nutrition/foods/search?q=${encodeURIComponent(q)}`);
    },
    enabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
};
