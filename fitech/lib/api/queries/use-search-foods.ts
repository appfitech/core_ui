import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import { useUserStore } from '@/stores/user';
import { FoodItemDto, FoodSearchResponseDto } from '@/types/api/types.gen';

import { api } from '../api';

function normalizeFoodList(result: unknown): FoodItemDto[] {
  if (Array.isArray(result)) return result;
  if (result && typeof result === 'object') {
    const payload = result as FoodSearchResponseDto & { data?: unknown };
    if (Array.isArray(payload.foods)) return payload.foods;
    if (Array.isArray(payload.data)) return payload.data as FoodItemDto[];
    if (
      payload.data &&
      typeof payload.data === 'object' &&
      Array.isArray((payload.data as FoodSearchResponseDto).foods)
    ) {
      return (payload.data as FoodSearchResponseDto).foods ?? [];
    }
  }
  return [];
}

export type FoodSearchParams = {
  query: string;
  categoryId: number | null;
};

/**
 * - No category + empty query → all foods (`/nutrition/foods`)
 * - No category + query → global search (`/nutrition/foods/search`)
 * - Category + query (or empty) → category search (`/nutrition/foods/category/{id}/search`)
 */
export const useSearchFoods = ({ query, categoryId }: FoodSearchParams) => {
  const token = useUserStore((s) => s.getToken());
  const q = query.trim();
  const enabled = !!token;

  return useQuery<FoodItemDto[]>({
    queryKey: queryKeys.macros.search(categoryId ?? 'all', q),
    queryFn: async () => {
      if (categoryId != null) {
        const result = await api.get(
          `/nutrition/foods/category/${categoryId}/search?q=${encodeURIComponent(q)}`,
        );
        return normalizeFoodList(result);
      }

      if (q.length > 0) {
        const result = await api.get(
          `/nutrition/foods/search?q=${encodeURIComponent(q)}`,
        );
        return normalizeFoodList(result);
      }

      const result = await api.get('/nutrition/foods');
      return normalizeFoodList(result);
    },
    enabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    placeholderData: [],
  });
};

/** @deprecated Use `useSearchFoods`. */
export const useSearchMacros = (query: string) =>
  useSearchFoods({ query, categoryId: null });
