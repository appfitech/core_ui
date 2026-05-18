import { useQuery } from '@tanstack/react-query';

import { api } from '../api';

export const useGetAllUserTypes = () => {
  return useQuery({
    queryKey: ['get-all-user-types'],
    queryFn: async () => {
      return api.get('/user-type');
    },
  });
};
