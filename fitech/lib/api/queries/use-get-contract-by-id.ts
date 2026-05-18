import { ReviewableContractDto } from '@/types/api/types.gen';

export const useGetContractById = (
  resourceId: number,
): ReviewableContractDto | null => {
  const { data: routines } = useGetCo();

  return (routines ?? [])?.find((item) => item.id === resourceId) ?? null;
};
