import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

import { useGetDiets } from './use-get-diets';

export const useGetDietById = (
  dietId: number,
): ClientResourceResponseDtoReadable | null => {
  const { data: diets } = useGetDiets();

  return (diets ?? [])?.find((item) => item.id === dietId) ?? null;
};
