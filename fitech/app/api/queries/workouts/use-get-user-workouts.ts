import { useQuery } from '@tanstack/react-query';

import { ExerciseSetDto, WorkoutSessionDto } from '@/types/api/types.gen';

import { api } from '../../api';

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

export const useGetWorkoutSeries = (workoutId?: number) => {
  return useQuery<any, Error, ExerciseSetDto[]>({
    queryKey: [`/workouts/exercises/${workoutId}/sets`],
    queryFn: async () => {
      return api.get(`/workouts/exercises/${workoutId}/sets`);
    },
    enabled: !!workoutId,
  });
};

export const useGetWorkoutsFiltered = ({
  start,
  end,
  muscleGroups,
}: {
  start: string;
  end: string;
  muscleGroups: string[];
}) => {
  return useQuery<any, Error, WorkoutSessionDto[]>({
    queryKey: [
      `/workouts/exercises/user/filter/${start}/${end}/${muscleGroups.join(',')}`,
    ],
    queryFn: async () => {
      return api.post(`/workouts/exercises/user/filter`, {
        endDate: end,
        muscleGroups,
        startDate: start,
      });
    },
  });
};
