import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

import { useGetRoutines } from './use-get-routines';

export const useGetRoutineById = (
  routineId: number,
): ClientResourceResponseDtoReadable | null => {
  const { data: diets } = useGetRoutines();

  return (diets ?? [])?.find((item) => item.id === routineId) ?? null;
};
