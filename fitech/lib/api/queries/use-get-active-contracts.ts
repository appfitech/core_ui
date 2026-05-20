import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { ReviewableContractDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetActiveContracts = () => {
  const token = useUserStore((s) => s.getToken());
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery<ReviewableContractDto[]>({
    queryKey: ['get-active-contracts', userId],
    queryFn: async () => {
      return api.get(`/contracts/client/${userId}/active`);
    },
    enabled: !!token && !!userId,
  });
};
