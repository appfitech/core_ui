import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';

import { api } from '../api';

export const useTrainerGetServices = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery({
    queryKey: ['get-trainer-services-list'],
    queryFn: async () => {
      return api.get(`/trainer-services/trainer/${userId}`);
    },
  });
};

export const useTrainerGetServiceTypes = () => {
  return useQuery({
    queryKey: ['get-trainer-services-types'],
    queryFn: async () => {
      return api.get(`/service-types`);
    },
  });
};
