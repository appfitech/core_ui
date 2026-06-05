import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { ReviewableContractDto } from '@/types/api/types.gen';

import { api } from '../api';
import { useSessionQueryEnabled } from './use-session-query-enabled';

export const useGetActiveContracts = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);
  const enabled = useSessionQueryEnabled(!!userId);

  return useQuery<ReviewableContractDto[]>({
    queryKey: ['get-active-contracts', userId],
    queryFn: async () => {
      return api.get(`/contracts/client/${userId}/active`);
    },
    enabled,
  });
};
