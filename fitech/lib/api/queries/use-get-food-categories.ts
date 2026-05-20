import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import { useUserStore } from '@/stores/user';
import { FoodCategoryDto } from '@/types/api/types.gen';

import { api } from '../api';

function normalizeFoodCategories(result: unknown): FoodCategoryDto[] {
  if (Array.isArray(result)) {
    return result.filter((item) => item?.isActive !== false);
  }
  if (
    result &&
    typeof result === 'object' &&
    'categories' in result &&
    Array.isArray((result as { categories: unknown }).categories)
  ) {
    return (result as { categories: FoodCategoryDto[] }).categories.filter(
      (item) => item?.isActive !== false,
    );
  }
  if (
    result &&
    typeof result === 'object' &&
    'data' in result &&
    Array.isArray((result as { data: unknown }).data)
  ) {
    return (result as { data: FoodCategoryDto[] }).data.filter(
      (item) => item?.isActive !== false,
    );
  }
  return [];
}

/** Lists active food categories from `/nutrition/foods/categories`. */
export const useGetFoodCategories = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<FoodCategoryDto[]>({
    queryKey: queryKeys.macros.categories,
    queryFn: async () => {
      const result = await api.get('/nutrition/foods/categories');
      return normalizeFoodCategories(result);
    },
    enabled: !!token,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });
};
