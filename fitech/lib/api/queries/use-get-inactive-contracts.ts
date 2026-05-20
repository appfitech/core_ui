import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { ReviewableContractDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetInactiveContracts = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<ReviewableContractDto[]>({
    queryKey: ['get-inactive-contracts'],
    queryFn: async () => {
      return api.get(`/client/reviews/reviewable-contracts`);
    },
    enabled: !!token,
  });
};
