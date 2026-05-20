import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { FoodItemDto } from '@/types/api/types.gen';

import { api } from '../api';

function normalizeFoodSearchResults(result: unknown): FoodItemDto[] {
  if (Array.isArray(result)) return result;
  if (
    result &&
    typeof result === 'object' &&
    'data' in result &&
    Array.isArray((result as { data: unknown }).data)
  ) {
    return (result as { data: FoodItemDto[] }).data;
  }
  return [];
}

export const useSearchMacros = (query: string) => {
  const token = useUserStore((s) => s.getToken());
  const q = query.trim();
  const enabled = !!token && q.length > 0;

  return useQuery<FoodItemDto[]>({
    queryKey: ['search-macros', q],
    queryFn: async () => {
      const result = await api.get(
        `/nutrition/foods/search?q=${encodeURIComponent(q)}`,
      );
      return normalizeFoodSearchResults(result);
    },
    enabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    placeholderData: [],
  });
};
