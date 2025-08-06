import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { ReviewableContractDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetActiveContracts = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery<ReviewableContractDto[]>({
    queryKey: ['get-active-contracts'],
    queryFn: async () => {
      return api.get(`/contracts/client/${userId}/active`);
    },
  });
};
