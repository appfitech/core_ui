import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateReviewQueries } from '@/lib/api/mutation-cache';
import { CreateReviewDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateReviewDto>({
    mutationFn: async (request) => {
      return api.post('/client/reviews', request);
    },
    onSuccess: async () => {
      await invalidateReviewQueries(queryClient);
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateReviewDto & { reviewId: number }>({
    mutationFn: async (request) => {
      return api.put(`/client/reviews/${request.reviewId}`, request);
    },
    onSuccess: async () => {
      await invalidateReviewQueries(queryClient);
    },
  });
};
