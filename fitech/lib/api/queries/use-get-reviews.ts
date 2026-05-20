import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { ReviewResponseDtoReadable } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetReviews = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<ReviewResponseDtoReadable[]>({
    queryKey: ['get-reviews'],
    queryFn: async () => {
      return api.get(`/client/reviews/my-reviews`);
    },
    enabled: !!token,
  });
};
