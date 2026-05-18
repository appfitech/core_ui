import { useQuery } from '@tanstack/react-query';

import { LocationDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetLocations = () => {
  return useQuery<LocationDto[]>({
    queryKey: ['get-locations'],
    queryFn: async () => {
      return api.get(`/locations`);
    },
  });
};
