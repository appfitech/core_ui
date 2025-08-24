import { useQuery } from '@tanstack/react-query';

import { Trainer } from '@/types/trainer';

import { api } from '../api';

export const useTrainerGetReviewsStats = () => {
  return useQuery<Trainer>({
    queryKey: ['get-trainer-reviews-stats'],
    queryFn: async () => {
      return api.get(`/trainer/my-reviews/stats`);
    },
  });
};

export const useTrainerGetReviewsBreakdown = () => {
  return useQuery<Trainer>({
    queryKey: ['get-trainer-reviews-breakdown'],
    queryFn: async () => {
      return api.get(`/trainer/my-reviews/breakdown`);
    },
  });
};

export const useTrainerGetReviews = (enabled = true) => {
  return useQuery<Trainer>({
    queryKey: ['get-trainer-reviews'],
    queryFn: async () => {
      return api.get(`/trainer/my-reviews`);
    },
    enabled,
  });
};
