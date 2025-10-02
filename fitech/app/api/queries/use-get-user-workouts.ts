import { useQuery } from '@tanstack/react-query';

import { WorkoutSessionDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetMonthlyWorkouts = (start: string, end: string) => {
  return useQuery<any, Error, WorkoutSessionDto[]>({
    queryKey: [
      `/workouts/exercises/user/date-range?startDate=${start}&endDate=${end}`,
    ],
    queryFn: async () => {
      return api.get(
        `/workouts/exercises/user/date-range?startDate=${start}&endDate=${end}`,
      );
    },
  });
};

export const useGetDailyWorkouts = (date: string) => {
  return useQuery<any, Error, WorkoutSessionDto[]>({
    queryKey: [`/workouts/exercises/user/date/${date}`],
    queryFn: async () => {
      return api.get(`/workouts/exercises/user/date/${date}`);
    },
  });
};
