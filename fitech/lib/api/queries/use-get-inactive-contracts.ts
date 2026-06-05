import { useQuery } from '@tanstack/react-query';

import { ReviewableContractDto } from '@/types/api/types.gen';

import { api } from '../api';
import { useSessionQueryEnabled } from './use-session-query-enabled';

export const useGetInactiveContracts = () => {
  const enabled = useSessionQueryEnabled();

  return useQuery<ReviewableContractDto[]>({
    queryKey: ['get-inactive-contracts'],
    queryFn: async () => {
      return api.get(`/client/reviews/reviewable-contracts`);
    },
    enabled,
  });
};
