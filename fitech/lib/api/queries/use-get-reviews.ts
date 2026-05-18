import { useQuery } from '@tanstack/react-query';

import { ReviewResponseDtoReadable } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetReviews = () => {
  return useQuery<ReviewResponseDtoReadable[]>({
    queryKey: ['get-reviews'],
    queryFn: async () => {
      return api.get(`/client/reviews/my-reviews`);
    },
  });
};
