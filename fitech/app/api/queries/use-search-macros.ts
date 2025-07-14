import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { FoodItemDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useSearchMacros = (query: string) => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<FoodItemDto[]>({
    queryKey: ['search-macros'],
    queryFn: async () => {
      return api.get(`/nutrition/foods/search?q=${query}`);
    },
    enabled: !!token,
  });
};
