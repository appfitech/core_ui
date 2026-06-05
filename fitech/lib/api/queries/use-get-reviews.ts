import { useQuery } from '@tanstack/react-query';

import { ReviewResponseDtoReadable } from '@/types/api/types.gen';

import { api } from '../api';
import { useSessionQueryEnabled } from './use-session-query-enabled';

export const useGetReviews = () => {
  const enabled = useSessionQueryEnabled();

  return useQuery<ReviewResponseDtoReadable[]>({
    queryKey: ['get-reviews'],
    queryFn: async () => {
      return api.get(`/client/reviews/my-reviews`);
    },
    enabled,
  });
};
