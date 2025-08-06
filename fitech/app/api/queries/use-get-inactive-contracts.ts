import { useQuery } from '@tanstack/react-query';

import { ReviewableContractDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetInactiveContracts = () => {
  return useQuery<ReviewableContractDto[]>({
    queryKey: ['get-inactive-contracts'],
    queryFn: async () => {
      return api.get(`/client/reviews/reviewable-contracts`);
    },
  });
};
