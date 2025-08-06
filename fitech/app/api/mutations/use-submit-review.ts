import { useMutation } from '@tanstack/react-query';

import { CreateReviewDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useSubmitReview = () => {
  return useMutation<any, Error, CreateReviewDto>({
    mutationFn: async (request) => {
      return api.post('/client/reviews', request);
    },
  });
};

export const useUpdateReview = () => {
  return useMutation<any, Error, CreateReviewDto & { reviewId: number }>({
    mutationFn: async (request) => {
      return api.put(`/client/reviews/${request.reviewId}`, request);
    },
  });
};
