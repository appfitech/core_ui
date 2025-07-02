import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { Contract } from '@/types/contracts';

import { api } from '../api';

export const useGetInactiveContracts = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery<Contract[]>({
    queryKey: ['get-inactive-contracts'],
    queryFn: async () => {
      return api.get(`/contracts/client/${userId}/inactive`);
    },
  });
};
